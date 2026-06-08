const mongoose = require('mongoose');

const gymClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Cardio', 'Strength', 'Recovery', 'Combat'], required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  trainer: { type: String, required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  time: { type: String, required: true },
  duration: { type: Number, default: 60 },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
  room: { type: String, default: 'Studio A' },
  description: { type: String },
  image: { type: String },
  // Uploaded photo bytes live in MongoDB (Atlas) so every device/deployment
  // sees the same picture — local disk storage doesn't travel with the DB.
  imageData: { type: Buffer },
  imageType: { type: String },
  badges: [String],
}, { timestamps: true });

module.exports = mongoose.model('GymClass', gymClassSchema);
