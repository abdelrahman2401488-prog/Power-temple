const express = require('express');
const router = express.Router();
const c = require('../controllers/memberController');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('member'));

router.get('/membership', c.getMembership);
router.get('/browse-classes', c.getBrowseClasses);
router.get('/my-bookings', c.getMyBookings);
router.get('/personal-training', c.getPersonalTraining);
router.get('/profile', c.getProfile);

module.exports = router;
