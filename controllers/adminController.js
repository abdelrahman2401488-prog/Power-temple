const GymClass = require('../models/GymClass');
const User = require('../models/User');

exports.getDashboard = (req, res) => res.render('admin/dashboard', { title: 'Admin Dashboard | Power Temple' });
exports.getTrainers = async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }).sort({ createdAt: -1 });
  res.render('admin/trainers', { title: 'Manage Trainers | Power Temple', trainers });
};

exports.postTrainer = async (req, res) => {
  const { name, username, password, specialty } = req.body;
  try {
    await User.create({ name, username, password, email: username + '@powertemple.com', role: 'trainer' });
    // also store specialty — extend the user doc inline
    await User.findOneAndUpdate({ username }, { $set: { specialty } });
    req.session.flash = 'Trainer added successfully!';
  } catch (err) {
    req.session.flash = 'Error: username may already exist.';
  }
  res.redirect('/admin/trainers');
};

exports.deleteTrainer = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin/trainers');
};

exports.getClasses = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: -1 });
  const trainers = await User.find({ role: 'trainer' }, 'name username');
  res.render('admin/classes', { title: 'Manage Classes | Power Temple', classes, trainers });
};

exports.postClass = async (req, res) => {
  const { name, trainer, category, level, capacity, description, time, duration } = req.body;
  const image = req.file ? '/images/classes/' + req.file.filename : '';
  try {
    await GymClass.create({ name, trainer, category, level, capacity: Number(capacity), description, image, time, duration: Number(duration) || 60 });
    req.session.flash = 'Class published successfully!';
  } catch (err) {
    req.session.flash = 'Error creating class: ' + err.message;
  }
  res.redirect('/admin/classes');
};

exports.deleteClass = async (req, res) => {
  await GymClass.findByIdAndDelete(req.params.id);
  res.redirect('/admin/classes');
};

const MembershipPlan = require('../models/MembershipPlan');

const DEFAULT_PLANS = [
  { name: 'Starter', monthlyPrice: 600 },
  { name: 'Elite',   monthlyPrice: 900 },
  { name: 'Pro',     monthlyPrice: 1200 },
  { name: 'Champion',monthlyPrice: 1500 },
];

exports.getMemberships = async (req, res) => {
  let plans = await MembershipPlan.find().sort({ monthlyPrice: 1 });
  if (plans.length === 0) {
    await MembershipPlan.insertMany(DEFAULT_PLANS);
    plans = await MembershipPlan.find().sort({ monthlyPrice: 1 });
  }
  res.render('admin/memberships', { title: 'Membership Management | Power Temple', plans });
};

exports.postPlan = async (req, res) => {
  const { name, monthlyPrice } = req.body;
  await MembershipPlan.create({ name, monthlyPrice: Number(monthlyPrice) });
  res.redirect('/admin/memberships');
};

exports.updatePlan = async (req, res) => {
  await MembershipPlan.findByIdAndUpdate(req.params.id, { monthlyPrice: Number(req.body.monthlyPrice) });
  res.redirect('/admin/memberships');
};

exports.deletePlan = async (req, res) => {
  await MembershipPlan.findByIdAndDelete(req.params.id);
  res.redirect('/admin/memberships');
};
exports.getShop = (req, res) => res.render('admin/shop', { title: 'Shop Management | Power Temple' });
exports.getFinancials = (req, res) => res.render('admin/financials', { title: 'Financial Management | Power Temple' });
exports.getRoles = async (req, res) => {
  const users = await User.find({}, 'name email username role specialty createdAt').sort({ createdAt: -1 });
  res.render('admin/roles', { title: 'Roles & Permissions | Power Temple', users });
};

exports.updateUserRole = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
  res.redirect('/admin/roles');
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin/roles');
};
