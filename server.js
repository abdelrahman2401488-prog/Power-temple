require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedClasses = require('./config/seeder');

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  await seedClasses();
  app.listen(PORT, () => {
    console.log(`Power Temple running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed, starting without MongoDB:', err.message);
  app.listen(PORT, () => {
    console.log(`Power Temple running at http://localhost:${PORT} (no DB)`);
  });
});
