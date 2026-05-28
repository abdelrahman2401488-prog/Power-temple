const express = require('express');
const router = express.Router();
const c = require('../controllers/trainerController');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('trainer'));

router.get('/', (req, res) => res.redirect('/trainer/my-schedule'));
router.get('/my-schedule', c.getSchedule);
router.get('/attendance', c.getAttendance);
router.get('/members', c.getMembers);

module.exports = router;
