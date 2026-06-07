// Listens directly on MongoDB (via Change Streams) and broadcasts any
// insert/update/delete to all connected clients in real time — so a change
// made on one device shows up live on every other connected device.
const mongoose = require('mongoose');

let io = null;

function mapOperation(operationType) {
  if (operationType === 'insert') return 'created';
  if (operationType === 'delete') return 'deleted';
  return 'updated'; // update / replace
}

function watchCollection(name, onChange) {
  const stream = mongoose.connection.collection(name).watch([], { fullDocument: 'updateLookup' });
  stream.on('change', onChange);
  stream.on('error', (err) => console.error(`Live sync watcher error on "${name}":`, err.message));
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

function init(server) {
  io = require('socket.io')(server);
  return io;
}

// Call once the MongoDB connection is open — change streams require a live connection
function start() {
  watchClasses();
  watchUsers();
  watchBookings();
}

module.exports = { init, start };
