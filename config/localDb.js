// Self-contained local MongoDB used as the app's database.
// Starts a project-owned mongod as a single-node REPLICA SET (port 27018) with
// its data stored inside the project (.db-data, gitignored). A replica set is
// required so MongoDB Change Streams work, which powers real-time live-sync.
//
// No admin rights, no Atlas, no network needed. If a mongod is already running
// on the port (e.g. from a previous run) it is reused.
const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn } = require('child_process');
const { MongoClient } = require('mongodb');

const HOST = '127.0.0.1';
const PORT = Number(process.env.LOCAL_DB_PORT) || 27018;
const REPL = 'rs0';
const DATA_DIR = path.join(__dirname, '..', '.db-data');
const URI = `mongodb://${HOST}:${PORT}/power-temple?replicaSet=${REPL}`;

function findMongod() {
  if (process.env.MONGOD_PATH && fs.existsSync(process.env.MONGOD_PATH)) {
    return process.env.MONGOD_PATH;
  }
  const base = 'C:\\Program Files\\MongoDB\\Server';
  try {
    const versions = fs.readdirSync(base).sort().reverse(); // newest first
    for (const v of versions) {
      const p = path.join(base, v, 'bin', 'mongod.exe');
      if (fs.existsSync(p)) return p;
    }
  } catch (e) { /* not found */ }
  return null;
}

function isPortOpen(port, host) {
  return new Promise((resolve) => {
    const s = net.createConnection({ port, host });
    const done = (ok) => { s.destroy(); resolve(ok); };
    s.on('connect', () => done(true));
    s.on('error', () => done(false));
    setTimeout(() => done(false), 1000);
  });
}

async function waitForPort(port, host, timeoutMs) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    if (await isPortOpen(port, host)) return true;
    await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}

function startMongod(mongod) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  // Detached so the database keeps running independently of this process and
  // can be reused on the next start.
  const child = spawn(mongod, [
    '--replSet', REPL,
    '--port', String(PORT),
    '--dbpath', DATA_DIR,
    '--bind_ip', HOST,
  ], { detached: true, stdio: 'ignore' });
  child.unref();
}

async function ensureReplicaSet() {
  const c = new MongoClient(`mongodb://${HOST}:${PORT}/?directConnection=true`);
  await c.connect();
  try {
    await c.db('admin').command({ replSetGetStatus: 1 });
    // Already initialized.
  } catch (e) {
    const fresh = e.codeName === 'NotYetInitialized' || /no replset config|not yet initialized/i.test(e.message);
    if (!fresh) throw e;
    await c.db('admin').command({
      replSetInitiate: { _id: REPL, members: [{ _id: 0, host: `${HOST}:${PORT}` }] },
    });
    // Wait until this node becomes PRIMARY (myState === 1).
    for (let i = 0; i < 40; i++) {
      try {
        const s = await c.db('admin').command({ replSetGetStatus: 1 });
        if (s.myState === 1) break;
      } catch (err) { /* still electing */ }
      await new Promise((r) => setTimeout(r, 500));
    }
  } finally {
    await c.close();
  }
}

// Ensures the local replica-set MongoDB is running and initialized.
// Returns its connection URI.
async function ensureLocalDb() {
  if (!(await isPortOpen(PORT, HOST))) {
    const mongod = findMongod();
    if (!mongod) {
      throw new Error('mongod.exe not found. Install MongoDB or set MONGOD_PATH in .env');
    }
    console.log('Starting local MongoDB (replica set) on port ' + PORT + '...');
    startMongod(mongod);
    if (!(await waitForPort(PORT, HOST, 20000))) {
      throw new Error('local MongoDB did not start within 20s');
    }
  }
  await ensureReplicaSet();
  return URI;
}

module.exports = { ensureLocalDb, LOCAL_RS_URI: URI };
