const express = require('express');
const router = express.Router();
const c = require('../controllers/managerController');
const { requireRole } = require('../middleware/auth');

router.use(requireRole('manager'));

router.get('/', (req, res) => res.redirect('/manager/dashboard'));
router.get('/dashboard', c.getDashboard);
router.get('/members', c.getMembers);
router.get('/classes', c.getClasses);
router.post('/classes', c.postClass);
router.post('/trainer/update/:id', c.updateTrainer);
router.get('/payments', c.getPayments);
router.get('/reports', c.getReports);

module.exports = router;
