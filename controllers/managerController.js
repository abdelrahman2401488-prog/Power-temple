const User = require('../models/User');
const GymClass = require('../models/GymClass');

exports.getDashboard = (req, res) => res.render('manager/dashboard', { title: 'Manager Dashboard | Power Temple' });

exports.getMembers = async (req, res) => {
  const q = req.query.q || '';
  const filter = { role: 'member' };
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { username: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  const members = await User.find(filter).sort({ createdAt: -1 });
  res.render('manager/members', { title: 'Member Management | Power Temple', members, q });
};

exports.registerMember = async (req, res) => {
  const { name, email, username, password, tier, branch } = req.body;
  try {
    await User.create({ name, email, username, password, role: 'member', membershipTier: tier, membershipStatus: 'active' });
    req.session.flash = 'Member registered successfully!';
  } catch (err) {
    req.session.flash = 'Error: ' + err.message;
  }
  res.redirect('/manager/members');
};

exports.renewMember = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { membershipStatus: 'active' });
  req.session.flash = 'Membership renewed.';
  res.redirect('/manager/members');
};

exports.suspendMember = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { membershipStatus: 'suspended' });
  req.session.flash = 'Member suspended.';
  res.redirect('/manager/members');
};

exports.activateMember = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { membershipStatus: 'active' });
  req.session.flash = 'Member reactivated.';
  res.redirect('/manager/members');
};

exports.getClasses = async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }, 'name username specialty').sort({ name: 1 });
  const classes = await GymClass.find().sort({ createdAt: -1 });
  res.render('manager/classes', { title: 'Class Management | Power Temple', trainers, classes });
};

exports.postClass = async (req, res) => {
  const { name, trainerId, room, time, capacity, category, level, description } = req.body;
  const trainer = await User.findById(trainerId);
  await GymClass.create({
    name,
    trainer: trainer ? trainer.name : '',
    trainerId,
    room,
    time,
    capacity: Number(capacity),
    category,
    level,
    description,
  });
  res.redirect('/manager/classes');
};

exports.updateTrainer = async (req, res) => {
  const { specialty, bio } = req.body;
  await User.findByIdAndUpdate(req.params.id, { specialty, bio });
  res.redirect('/manager/classes');
};

exports.getPayments = (req, res) => res.render('manager/payments', { title: 'Payments | Power Temple' });
exports.getReports = (req, res) => res.render('manager/reports', { title: 'Reports | Power Temple' });
