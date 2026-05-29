const GymClass = require('../models/GymClass');
const Booking = require('../models/Booking');

exports.getMembership = (req, res) => res.render('member/membership', { title: 'My Membership | Power Temple' });

exports.getBrowseClasses = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: -1 });
  res.render('member/browse-classes', { title: 'Browse Classes | Power Temple', classes });
};

exports.bookClass = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
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

exports.getPersonalTraining = (req, res) => res.render('member/personal-training', { title: 'Personal Training | Power Temple' });
exports.getProfile = (req, res) => res.render('member/profile', { title: 'My Profile | Power Temple' });
