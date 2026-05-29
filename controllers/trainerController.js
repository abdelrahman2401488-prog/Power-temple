const PTRequest = require('../models/PersonalTrainingRequest');
const Booking   = require('../models/Booking');
const GymClass  = require('../models/GymClass');

exports.getSchedule   = (req, res) => res.render('trainer/my-schedule',  { title: 'My Schedule | Power Temple' });
exports.getAttendance = (req, res) => res.render('trainer/attendance',    { title: 'Attendance & Performance | Power Temple' });

exports.getMembers = async (req, res) => {
  const trainerName = req.session.user.name;
  const requests = await PTRequest.find({ trainerName }).sort({ createdAt: -1 });
  const classes   = await GymClass.find({ trainer: trainerName });
  const classIds  = classes.map((c) => c._id);
  const bookings  = await Booking.find({ classId: { $in: classIds }, status: 'confirmed' });

  res.render('trainer/members', {
    title: 'My Members | Power Temple',
    requests,
    classes,
    bookings,
  });
};

exports.confirmPTRequest = async (req, res) => {
  await PTRequest.findByIdAndUpdate(req.params.id, { status: 'confirmed' });
  res.redirect('/trainer/members');
};

exports.cancelPTRequest = async (req, res) => {
  await PTRequest.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
  res.redirect('/trainer/members');
};
