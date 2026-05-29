const GymClass = require('../models/GymClass');
const Booking = require('../models/Booking');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');
const PTRequest = require('../models/PersonalTrainingRequest');

exports.getMembership = async (req, res) => {
  const plans = await MembershipPlan.find().sort({ monthlyPrice: 1 });
  const user = await User.findById(req.session.user.id);
  res.render('member/membership', { title: 'My Membership | Power Temple', plans, currentUser: user });
};

exports.subscribePlan = async (req, res) => {
  const { planId } = req.body;
  const plan = await MembershipPlan.findById(planId);
  if (!plan) { req.session.flash = 'Plan not found.'; return res.redirect('/member/membership'); }
  await User.findByIdAndUpdate(req.session.user.id, {
    membershipTier: plan.name,
    membershipStatus: 'active',
    joiningDate: Date.now(),
  });
  req.session.flash = `Successfully subscribed to ${plan.name}!`;
  res.redirect('/member/membership');
};

exports.getBrowseClasses = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: -1 });
  res.render('member/browse-classes', { title: 'Browse Classes | Power Temple', classes });
};

exports.bookClass = async (req, res) => {
  if (!req.session.user) {
    req.session.flash = 'You need to sign in to book a class.';
    return res.redirect('/auth/login');
  }
  const cls = await GymClass.findById(req.params.classId);
  if (!cls) return res.redirect('/member/browse-classes');

  const alreadyBooked = await Booking.findOne({ memberId: req.session.user.id, classId: cls._id, status: 'confirmed' });
  if (!alreadyBooked) {
    await Booking.create({
      memberId: req.session.user.id,
      classId: cls._id,
      className: cls.name,
      trainer: cls.trainer,
      time: cls.time,
      room: cls.room || '',
      status: 'confirmed',
    });
    await GymClass.findByIdAndUpdate(cls._id, { $inc: { booked: 1 } });
  }
  res.redirect('/member/my-bookings');
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ memberId: req.session.user.id }).sort({ createdAt: -1 });
  res.render('member/my-bookings', { title: 'My Bookings | Power Temple', bookings });
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, memberId: req.session.user.id });
  if (booking) {
    await Booking.findByIdAndUpdate(booking._id, { status: 'cancelled' });
    await GymClass.findByIdAndUpdate(booking.classId, { $inc: { booked: -1 } });
  }
  res.redirect('/member/my-bookings');
};

exports.getPersonalTraining = async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }, 'name specialty rating').sort({ name: 1 });
  const sessions = await PTRequest.find({ memberId: req.session.user.id }).sort({ createdAt: -1 });
  res.render('member/personal-training', { title: 'Personal Training | Power Temple', trainers, sessions });
};

exports.requestPersonalTraining = async (req, res) => {
  const { trainerName, sessionType, date, time, notes } = req.body;
  await PTRequest.create({
    memberId:    req.session.user.id,
    memberName:  req.session.user.name,
    trainerId:   req.session.user.id,
    trainerName,
    sessionType,
    date,
    time,
    notes: notes || '',
  });
  req.session.flash = 'Session requested! Your trainer will confirm shortly.';
  res.redirect('/member/personal-training');
};
exports.getProfile = (req, res) => res.render('member/profile', { title: 'My Profile | Power Temple' });
