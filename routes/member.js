const express = require('express');
const router = express.Router();
const c = require('../controllers/memberController');
const { requireRole, requireLogin } = require('../middleware/auth');
const { validateMemberInput, validateClassInput } = require('../middleware/validateInput');

// Browse classes is public — no login required
router.get('/browse-classes', c.getBrowseClasses);
router.post('/book/:classId', c.bookClass);

// All routes below require member login
router.use(requireRole('member'));

router.get('/membership', c.getMembership);
router.post('/membership/subscribe', validateMemberInput, c.subscribePlan);
router.get('/my-bookings', c.getMyBookings);
router.post('/cancel/:bookingId', c.cancelBooking);
router.get('/personal-training', c.getPersonalTraining);
router.post('/personal-training/request', validateClassInput, c.requestPersonalTraining);
router.get('/profile', c.getProfile);

module.exports = router;
