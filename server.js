require('dotenv').config();
const http = require('http');
const https = require('https');
const app = require('./app');
const connectDB = require('./config/db');
const { seedClasses, seedProducts } = require('./config/seeder');
const liveSync = require('./utils/liveSync');
const getCert = require('./config/https');

const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const HTTP_PORT = process.env.PORT || 3000;

// Keep the server alive if a background async error (e.g. a MongoDB SRV DNS
// retry) rejects outside our connect handler.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason && reason.message ? reason.message : reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err && err.message ? err.message : err);
});

// Use HTTPS when a self-signed certificate is available; otherwise fall back to
// plain HTTP so the app always runs.
const credentials = getCert();
const useHttps = Boolean(credentials);

let server;
let httpRedirect;

if (useHttps) {
  server = https.createServer(credentials, app);
  // Plain HTTP server that redirects every request to its HTTPS equivalent.
  httpRedirect = http.createServer((req, res) => {
    const host = (req.headers.host || `localhost:${HTTP_PORT}`).replace(/:\d+$/, `:${HTTPS_PORT}`);
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  });
} else {
  server = http.createServer(app);
}

// Real-time live-sync attaches to whichever main server we created.
liveSync.init(server);

function startServers(dbReady) {
  const suffix = dbReady ? '' : ' (no DB)';
  if (useHttps) {
    server.listen(HTTPS_PORT, () => {
      console.log(`Power Temple running at https://localhost:${HTTPS_PORT}${suffix}`);
    });
    httpRedirect.listen(HTTP_PORT, () => {
      console.log(`HTTP -> HTTPS redirect listening on http://localhost:${HTTP_PORT}`);
    });
  } else {
    server.listen(HTTP_PORT, () => {
      console.log(`Power Temple running at http://localhost:${HTTP_PORT}${suffix}`);
    });
  }
}

connectDB().then(async () => {
  await seedClasses();
  await seedProducts();
  liveSync.start();
  startServers(true);
}).catch((err) => {
  console.error('DB connection failed, starting without MongoDB:', err.message);
  startServers(false);
});
