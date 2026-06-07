const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  memberName: { type: String },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  method: { type: String, enum: ['visa', 'mastercard', 'wallet', 'cash'], default: 'cash' },
  status: { type: String, enum: ['paid', 'shipped', 'delivered', 'cancelled'], default: 'paid' },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
