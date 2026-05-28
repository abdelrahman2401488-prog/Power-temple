const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'GymClass', required: true },
  className: { type: String },
  trainer: { type: String },
  date: { type: String },
  time: { type: String },
  room: { type: String },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  attendanceStatus: { type: String, enum: ['attended', 'no-show', 'cancelled'], default: null },
  fee: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
