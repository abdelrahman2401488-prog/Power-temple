// Listens directly on MongoDB (via Change Streams) and broadcasts any
// insert/update/delete to all connected clients in real time — so a change
// made on one device shows up live on every other connected device.
const mongoose = require('mongoose');

let io = null;
let warnedNoReplicaSet = false;

function mapOperation(operationType) {
  if (operationType === 'insert') return 'created';
  if (operationType === 'delete') return 'deleted';
  return 'updated'; // update / replace
}

function watchCollection(name, onChange) {
  const stream = mongoose.connection.collection(name).watch([], { fullDocument: 'updateLookup' });
  stream.on('change', onChange);
  stream.on('error', (err) => {
    // Change streams require a replica set. A standalone MongoDB (e.g. the
    // local fallback) can't support them — degrade quietly instead of spamming
    // one error per collection. The app keeps working without real-time sync.
    if (/replica set|changeStream/i.test(err.message)) {
      if (!warnedNoReplicaSet) {
        warnedNoReplicaSet = true;
        console.warn('Live sync disabled: connected MongoDB is not a replica set, so real-time updates are off (the app works normally otherwise).');
      }
      stream.close().catch(() => {});
      return;
    }
    console.error(`Live sync watcher error on "${name}":`, err.message);
  });
  return stream;
}

function watchClasses() {
  watchCollection('gymclasses', (change) => {
    const id = change.documentKey._id.toString();
    const doc = change.fullDocument;
    const updatedFields = change.updateDescription && change.updateDescription.updatedFields;

    if (updatedFields && 'booked' in updatedFields && doc) {
      io.emit('class:capacityChanged', { id, booked: doc.booked, capacity: doc.capacity });
    }

    io.emit('class:changed', { action: mapOperation(change.operationType), id });
  });
}

function watchUsers() {
  watchCollection('users', (change) => {
    const id = change.documentKey._id.toString();
    const doc = change.fullDocument;

    io.emit('user:changed', { action: mapOperation(change.operationType), id, role: doc && doc.role });
  });
}

function watchBookings() {
  watchCollection('bookings', (change) => {
    const id = change.documentKey._id.toString();
    const doc = change.fullDocument;

    io.emit('booking:changed', {
      action: mapOperation(change.operationType),
      id,
      memberId: doc && doc.memberId && doc.memberId.toString(),
    });
  });
}

function watchOrders() {
  watchCollection('orders', (change) => {
    const id = change.documentKey._id.toString();
    const doc = change.fullDocument;

    io.emit('order:changed', {
      action: mapOperation(change.operationType),
      id,
      memberId: doc && doc.memberId && doc.memberId.toString(),
    });
  });
}

function watchProducts() {
  watchCollection('products', (change) => {
    const id = change.documentKey._id.toString();
    io.emit('product:changed', { action: mapOperation(change.operationType), id });
  });
}

function init(server) {
  io = require('socket.io')(server);
  return io;
}

// Call once the MongoDB connection is open — change streams require a live connection
function start() {
  watchClasses();
  watchUsers();
  watchBookings();
  watchProducts();
  watchOrders();
}

module.exports = { init, start };
