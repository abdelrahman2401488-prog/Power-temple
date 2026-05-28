const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  monthlyPrice: { type: Number, required: true },
  branch: { type: String, default: 'Fifth Settlement' },
  status: { type: String, enum: ['active', 'frozen', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
