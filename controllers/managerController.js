const User = require('../models/User');
const GymClass = require('../models/GymClass');
const ClassDeletionRequest = require('../models/ClassDeletionRequest');
const Payment = require('../models/Payment');

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
  // Which classes already have a pending deletion request (so the UI can show it).
  const pending = await ClassDeletionRequest.find({ status: 'pending' }, 'classId');
  const pendingDeletions = pending.map((r) => String(r.classId));
  res.render('manager/classes', { title: 'Class Management | Power Temple', trainers, classes, pendingDeletions });
};

exports.postClass = async (req, res) => {
  const { name, trainerId, room, time, capacity, category, level, description } = req.body;
  const trainer = await User.findById(trainerId);
  const image = req.file ? '/images/classes/' + req.file.filename : '';
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
    image,
  });
  res.redirect('/manager/classes');
};

exports.editClass = async (req, res) => {
  const { name, trainerId, room, time, capacity, category, level, description } = req.body;
  const trainer = await User.findById(trainerId);
  const update = {
    name,
    trainer: trainer ? trainer.name : '',
    trainerId,
    room,
    time,
    capacity: Number(capacity),
    category,
    level,
    description,
  };
  if (req.file) update.image = '/images/classes/' + req.file.filename;
  await GymClass.findByIdAndUpdate(req.params.id, update);
  res.redirect('/manager/classes');
};

// Managers can't delete classes directly — they raise a request for the admin.
exports.requestDeleteClass = async (req, res) => {
  const gymClass = await GymClass.findById(req.params.id);
  if (gymClass) {
    const existing = await ClassDeletionRequest.findOne({ classId: gymClass._id, status: 'pending' });
    if (!existing) {
      await ClassDeletionRequest.create({
        classId: gymClass._id,
        className: gymClass.name,
        requestedById: req.session.user.id,
        requestedByName: req.session.user.name,
        reason: req.body.reason || '',
      });
    }
  }
  res.redirect('/manager/classes');
};

exports.updateTrainer = async (req, res) => {
  const { specialty, bio } = req.body;
  await User.findByIdAndUpdate(req.params.id, { specialty, bio });
  res.redirect('/manager/classes');
};

exports.getPayments = async (req, res) => {
  const members = await User.find({ role: 'member' }, 'name email').sort({ name: 1 });
  const payments = await Payment.find().sort({ paidAt: -1 }).limit(50);

  // Stats
  const allPaid = await Payment.find({ status: 'paid' });
  const cashCount = allPaid.filter((p) => p.method === 'cash').length;
  const cardCount = allPaid.filter((p) => p.method !== 'cash').length; // card + wallet
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const totalToday = allPaid
    .filter((p) => new Date(p.paidAt) >= startOfDay)
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalCollected = allPaid.reduce((sum, p) => sum + Number(p.amount), 0);

  res.render('manager/payments', {
    title: 'Payments | Power Temple',
    members,
    payments,
    stats: { cashCount, cardCount, totalToday, totalCollected },
  });
};

exports.postPayment = async (req, res) => {
  const { memberId, amount, description, method } = req.body;
  const member = await User.findById(memberId);
  if (member && amount) {
    await Payment.create({
      memberId,
      memberName: member.name,
      amount: Number(amount),
      method: method === 'card' ? 'card' : 'cash',
      description: description || '',
      status: 'paid',
    });
  }
  res.redirect('/manager/payments');
};
exports.getReports = (req, res) => res.render('manager/reports', { title: 'Reports | Power Temple' });
