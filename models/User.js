const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'trainer', 'member'], default: 'member' },
  avatar: { type: String, default: '👤' },
  membershipTier: { type: String, default: null },
  membershipStatus: { type: String, enum: ['active', 'frozen', 'suspended', 'cancelled'], default: 'active' },
  joiningDate: { type: Date, default: Date.now },
  totalBookings: { type: Number, default: 0 },
  memberCode: { type: String, unique: true, sparse: true }, // unique ID encoded in the member's QR code

  specialty: { type: String, default: null },
  bio: { type: String, default: null },
  rating: { type: Number, default: 5.0 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
