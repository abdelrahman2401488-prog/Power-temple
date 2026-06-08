const mongoose = require('mongoose');

// A manager's request for the admin to delete a class. Managers can create and
// edit classes but cannot delete them directly — they raise a request that an
// admin approves (deletes the class) or rejects.
const classDeletionRequestSchema = new mongoose.Schema({
  classId:         { type: mongoose.Schema.Types.ObjectId, ref: 'GymClass', required: true },
  className:       { type: String },
  requestedById:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedByName: { type: String },
  reason:          { type: String, default: '' },
  status:          { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('ClassDeletionRequest', classDeletionRequestSchema);
