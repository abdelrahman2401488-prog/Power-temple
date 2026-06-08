const GymClass = require('../models/GymClass');
const User = require('../models/User');
const Product = require('../models/Product');
const ClassDeletionRequest = require('../models/ClassDeletionRequest');

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
  // Pending class-deletion requests raised by managers, awaiting admin action.
  const deletionRequests = await ClassDeletionRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.render('admin/classes', { title: 'Manage Classes | Power Temple', classes, trainers, deletionRequests });
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

exports.editClass = async (req, res) => {
  const { name, trainer, category, level, capacity, description, time, duration } = req.body;
  const update = { name, trainer, category, level, capacity: Number(capacity), description, time, duration: Number(duration) || 60 };
  if (req.file) update.image = '/images/classes/' + req.file.filename;
  try {
    await GymClass.findByIdAndUpdate(req.params.id, update);
    req.session.flash = 'Class updated successfully!';
  } catch (err) {
    req.session.flash = 'Error updating class: ' + err.message;
  }
  res.redirect('/admin/classes');
};

exports.deleteClass = async (req, res) => {
  try {
    await GymClass.findByIdAndDelete(req.params.id);
    if (req.xhr) {
      return res.json({ status: 'success', message: 'Class deleted successfully!' });
    }
    res.redirect('/admin/classes');
  } catch (err) {
    if (req.xhr) {
      return res.status(500).json({ status: 'error', message: 'Failed to delete class' });
    }
    res.redirect('/admin/classes');
  }
};

// Approve a manager's class-deletion request: delete the class and mark the request approved.
exports.approveClassDeletion = async (req, res) => {
  const request = await ClassDeletionRequest.findById(req.params.id);
  if (request && request.status === 'pending') {
    await GymClass.findByIdAndDelete(request.classId);
    request.status = 'approved';
    await request.save();
  }
  res.redirect('/admin/classes');
};

// Reject a manager's class-deletion request: keep the class, mark request rejected.
exports.rejectClassDeletion = async (req, res) => {
  await ClassDeletionRequest.findByIdAndUpdate(req.params.id, { status: 'rejected' });
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

exports.getProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ status: 'success', products });
};

exports.createProduct = async (req, res) => {
  const { name, category, price, unit, badge, image, description, stock } = req.body;
  const product = await Product.create({
    name, category, price: Number(price), unit, badge, image, description, stock: Number(stock || 0),
  });
  res.json({ status: 'success', product });
};

exports.updateProduct = async (req, res) => {
  const updates = {};
  ['name', 'category', 'unit', 'badge', 'image', 'description'].forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  if (req.body.price !== undefined) updates.price = Number(req.body.price);
  if (req.body.stock !== undefined) updates.stock = Number(req.body.stock);

  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
  res.json({ status: 'success', product });
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
  res.json({ status: 'success' });
};
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
