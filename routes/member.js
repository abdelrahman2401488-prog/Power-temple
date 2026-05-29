const express = require('express');
const router = express.Router();
const c = require('../controllers/memberController');
const { requireRole } = require('../middleware/auth');

// Browse classes is public — no login required
router.get('/browse-classes', c.getBrowseClasses);
router.post('/book/:classId', c.bookClass);

router.use(requireRole('member'));

router.get('/membership', c.getMembership);
router.get('/my-bookings', c.getMyBookings);
router.post('/cancel/:bookingId', c.cancelBooking);
router.get('/personal-training', c.getPersonalTraining);
router.get('/profile', c.getProfile);

module.exports = router;
