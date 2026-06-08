const mongoose = require('mongoose');
const dns = require('dns');
const { ensureLocalDb } = require('./localDb');

// Plain standalone fallback (no replica set) if the managed local replica set
// can't be started for some reason. Live-sync is disabled in that case, but the
// rest of the app still works.
const STANDALONE_URI = process.env.MONGODB_URI_LOCAL || 'mongodb://127.0.0.1:27017/power-temple';

// A promise that resolves with the active MongoClient once a connection is
// established. The session store (connect-mongo) reuses it so sessions live in
// whichever database the app actually connected to.
let resolveClient;
let rejectClient;
const clientPromise = new Promise((resolve, reject) => {
  resolveClient = resolve;
  rejectClient = reject;
});

function tuneResolverForSrv(uri) {
  // Node's bundled DNS resolver (c-ares) can't query a link-local IPv6 DNS
  // server (fe80::...), so a mongodb+srv:// SRV lookup fails with ECONNREFUSED
  // even though the OS resolver works. Remove any broken resolver entirely.
  if (uri.startsWith('mongodb+srv://')) {
    const isLinkLocal = (s) => /^fe80:/i.test(s) || s.startsWith('169.254.');
    const usable = dns.getServers().filter((s) => !isLinkLocal(s));
    dns.setServers([...new Set(['8.8.8.8', '1.1.1.1', ...usable])]);
  }
}

async function tryConnect(uri, label) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log(`MongoDB connected (${label})`);
  resolveClient(mongoose.connection.getClient());
}

async function connectDB() {
  // Fail fast instead of buffering/retrying forever when a cluster is unreachable.
  mongoose.set('bufferCommands', false);
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  // 1) Atlas — only when explicitly enabled (set USE_ATLAS=true in .env once
  //    your cluster is reachable / IP whitelisted). Off by default so startup
  //    is instant and never blocks on an unreachable cluster.
  const atlas = process.env.MONGODB_URI;
  if (process.env.USE_ATLAS === 'true' && atlas) {
    tuneResolverForSrv(atlas);
    try {
      await tryConnect(atlas, 'Atlas');
      return;
    } catch (err) {
      console.warn(`Atlas unreachable: ${err.message}`);
      console.warn('Falling back to local MongoDB...');
      await mongoose.disconnect().catch(() => {});
    }
  }

  // 2) Local replica-set MongoDB (default) — works offline and supports
  //    live-sync (change streams).
  try {
    const uri = await ensureLocalDb();
    await tryConnect(uri, 'local replica set');
    return;
  } catch (err) {
    console.warn(`Local replica set unavailable: ${err.message}`);
    console.warn('Falling back to standalone MongoDB (live-sync off)...');
    await mongoose.disconnect().catch(() => {});
  }

  // 3) Last resort: a plain standalone MongoDB.
  try {
    await tryConnect(STANDALONE_URI, 'standalone');
  } catch (err) {
    rejectClient(err);
    throw err;
  }
}

module.exports = connectDB;
module.exports.clientPromise = clientPromise;
