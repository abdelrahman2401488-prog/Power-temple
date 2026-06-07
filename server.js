require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const seedClasses = require('./config/seeder');
const liveSync = require('./utils/liveSync');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
liveSync.init(server);

connectDB().then(async () => {
  await seedClasses();
  liveSync.start();
  server.listen(PORT, () => {
    console.log(`Power Temple running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed, starting without MongoDB:', err.message);
  server.listen(PORT, () => {
    console.log(`Power Temple running at http://localhost:${PORT} (no DB)`);
  });
});
