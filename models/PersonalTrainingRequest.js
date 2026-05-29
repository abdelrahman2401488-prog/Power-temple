const mongoose = require('mongoose');

const ptRequestSchema = new mongoose.Schema({
  memberId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName:  { type: String },
  trainerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerName: { type: String },
  sessionType: { type: String, required: true },
  date:        { type: String, required: true },
  time:        { type: String, required: true },
  notes:       { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('PersonalTrainingRequest', ptRequestSchema);
