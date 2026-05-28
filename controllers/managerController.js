const User = require('../models/User');
const GymClass = require('../models/GymClass');

exports.getDashboard = (req, res) => res.render('manager/dashboard', { title: 'Manager Dashboard | Power Temple' });
exports.getMembers = (req, res) => res.render('manager/members', { title: 'Member Management | Power Temple' });

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
