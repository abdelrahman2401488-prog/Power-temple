const mongoose = require('mongoose');


let resolveClient;
let rejectClient;
const clientPromise = new Promise((resolve, reject) => {
  resolveClient = resolve;
  rejectClient = reject;
});

async function connectDB() {
  // Fail fast instead of buffering/retrying forever when the cluster is unreachable.
  mongoose.set('bufferCommands', false);
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected (Atlas)');
    resolveClient(mongoose.connection.getClient());
  } catch (err) {
    rejectClient(err);
    throw err;
  }
}

module.exports = connectDB;
module.exports.clientPromise = clientPromise;
