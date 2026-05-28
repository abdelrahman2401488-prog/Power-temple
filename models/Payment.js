const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'card', 'wallet'], default: 'cash' },
  status: { type: String, enum: ['paid', 'refunded', 'pending'], default: 'paid' },
  description: { type: String },
  last4: { type: String, default: '0000' },
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
