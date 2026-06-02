const GymClass = require('../models/GymClass');
const Booking = require('../models/Booking');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');
const PTRequest = require('../models/PersonalTrainingRequest');
const AppError = require('../utils/AppError');

exports.getMembership = async (req, res, next) => {
  try {
    const plans = await MembershipPlan.find().sort({ monthlyPrice: 1 });
    const user = await User.findById(req.session.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.render('member/membership', { 
      title: 'My Membership | Power Temple', 
      plans, 
      currentUser: user 
    });
  } catch (err) {
    next(err);
  }
};

exports.subscribePlan = async (req, res, next) => {
  try {
    const { planId } = req.body;
    
    if (!planId) {
      throw new AppError('Plan ID is required', 400);
    }

    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      throw new AppError('Membership plan not found', 404);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      {
        membershipTier: plan.name,
        membershipStatus: 'active',
        joiningDate: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    req.session.flash = `Successfully subscribed to ${plan.name}!`;
    res.redirect('/member/membership');
  } catch (err) {
    req.session.flash = err.message || 'Failed to subscribe to plan';
    res.redirect('/member/membership');
  }
};

exports.getBrowseClasses = async (req, res, next) => {
  try {
    const classes = await GymClass.find().sort({ createdAt: -1 });
    res.render('member/browse-classes', { 
      title: 'Browse Classes | Power Temple', 
      classes 
    });
  } catch (err) {
    next(err);
  }
};

exports.bookClass = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new AppError('You need to sign in to book a class', 401);
    }

    const { classId } = req.params;
    
    if (!classId) {
      throw new AppError('Class ID is required', 400);
    }

    const cls = await GymClass.findById(classId);
    if (!cls) {
      throw new AppError('Class not found', 404);
    }

    // Check if already booked
    const alreadyBooked = await Booking.findOne({ 
      memberId: req.session.user.id, 
      classId: cls._id, 
      status: 'confirmed' 
    });

    if (alreadyBooked) {
      throw new AppError('You have already booked this class', 409);
    }

    // Create booking
    await Booking.create({
      memberId: req.session.user.id,
      classId: cls._id,
      className: cls.name,
      trainer: cls.trainer,
      time: cls.time,
      room: cls.room || '',
      status: 'confirmed',
    });

    // Update class booking count
    await GymClass.findByIdAndUpdate(cls._id, { $inc: { booked: 1 } });

    req.session.flash = 'Class booked successfully!';
    res.redirect('/member/my-bookings');
  } catch (err) {
    req.session.flash = err.message || 'Failed to book class';
    res.redirect('/member/browse-classes');
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ memberId: req.session.user.id }).sort({ createdAt: -1 });
    res.render('member/my-bookings', { 
      title: 'My Bookings | Power Temple', 
      bookings 
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      throw new AppError('Booking ID is required', 400);
    }

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      memberId: req.session.user.id 
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.status === 'cancelled') {
      throw new AppError('Booking is already cancelled', 400);
    }

    await Booking.findByIdAndUpdate(booking._id, { status: 'cancelled' });
    await GymClass.findByIdAndUpdate(booking.classId, { $inc: { booked: -1 } });

    req.session.flash = 'Booking cancelled successfully!';
    res.redirect('/member/my-bookings');
  } catch (err) {
    req.session.flash = err.message || 'Failed to cancel booking';
    res.redirect('/member/my-bookings');
  }
};

exports.getPersonalTraining = async (req, res, next) => {
  try {
    const trainers = await User.find({ role: 'trainer' }, 'name specialty rating').sort({ name: 1 });
    const sessions = await PTRequest.find({ memberId: req.session.user.id }).sort({ createdAt: -1 });
    
    res.render('member/personal-training', { 
      title: 'Personal Training | Power Temple', 
      trainers, 
      sessions 
    });
  } catch (err) {
    next(err);
  }
};

exports.requestPersonalTraining = async (req, res, next) => {
  try {
    const { trainerName, trainerId, sessionType, date, time, notes } = req.body;

    // Validate inputs
    if (!trainerName || !trainerId || !sessionType || !date || !time) {
      throw new AppError('All fields are required', 400);
    }

    // Verify trainer exists
    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      throw new AppError('Invalid trainer selected', 400);
    }

    // Verify user is not booking with themselves
    if (trainerId === req.session.user.id) {
      throw new AppError('You cannot book a session with yourself', 400);
    }

    await PTRequest.create({
      memberId: req.session.user.id,
      memberName: req.session.user.name,
      trainerId,
      trainerName,
      sessionType,
      date,
      time,
      notes: notes || '',
    });

    req.session.flash = 'Session requested! Your trainer will confirm shortly.';
    res.redirect('/member/personal-training');
  } catch (err) {
    req.session.flash = err.message || 'Failed to request session';
    res.redirect('/member/personal-training');
  }
};

exports.getProfile = (req, res) => {
  try {
    res.render('member/profile', { title: 'My Profile | Power Temple' });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error 500',
      errorCode: 500,
      message: 'Failed to load profile',
      details: 'An unexpected error occurred'
    });
  }
};
