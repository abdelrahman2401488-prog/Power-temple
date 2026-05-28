const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  monthlyPrice: { type: Number, required: true },
  features: [String],
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
