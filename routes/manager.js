const express = require('express');
const router = express.Router();
const c = require('../controllers/managerController');
const { requireRole } = require('../middleware/auth');
const upload = require('../config/upload');

router.use(requireRole('manager'));

router.get('/', (req, res) => res.redirect('/manager/dashboard'));
router.get('/dashboard', c.getDashboard);
router.get('/members', c.getMembers);
router.post('/members/register', c.registerMember);
router.post('/members/renew/:id', c.renewMember);
router.post('/members/suspend/:id', c.suspendMember);
router.post('/members/activate/:id', c.activateMember);
router.get('/classes', c.getClasses);
router.post('/classes', upload.single('image'), c.postClass);
router.post('/classes/edit/:id', upload.single('image'), c.editClass);
router.post('/classes/request-delete/:id', c.requestDeleteClass);
router.post('/trainer/update/:id', c.updateTrainer);
router.get('/payments', c.getPayments);
router.post('/payments', c.postPayment);
router.get('/reports', c.getReports);

module.exports = router;
