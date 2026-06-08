require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { seedClasses, seedProducts } = require('./config/seeder');
const liveSync = require('./utils/liveSync');

const PORT = process.env.PORT || 3000;

// Keep the server alive if a background async error (e.g. a MongoDB SRV DNS
// retry) rejects outside our connect handler.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason && reason.message ? reason.message : reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.message ? err.message : err);
});

const server = http.createServer(app);

// Real-time live-sync attaches to the main server.
liveSync.init(server);

function startServer(dbReady) {
  const suffix = dbReady ? '' : ' (no DB)';
  server.listen(PORT, () => {
    console.log(`Power Temple running at http://localhost:${PORT}${suffix}`);
  });
}

connectDB().then(async () => {
  await seedClasses();
  await seedProducts();
  liveSync.start();
  startServer(true);
}).catch((err) => {
  console.error('DB connection failed, starting without MongoDB:', err.message);
  startServer(false);
});
