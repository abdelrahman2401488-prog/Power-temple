const express = require('express');
const router = express.Router();
const c = require('../controllers/adminController');
const { requireRole } = require('../middleware/auth');
const upload = require('../config/upload');

router.use(requireRole('admin'));

router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', c.getDashboard);
router.get('/trainers', c.getTrainers);
router.post('/trainers', c.postTrainer);
router.post('/trainers/delete/:id', c.deleteTrainer);
router.get('/classes', c.getClasses);
router.post('/classes', upload.single('image'), c.postClass);
router.post('/classes/edit/:id', upload.single('image'), c.editClass);
router.post('/classes/delete/:id', c.deleteClass);
router.get('/memberships', c.getMemberships);
router.post('/memberships/plan/create', c.postPlan);
router.post('/memberships/plan/update/:id', c.updatePlan);
router.post('/memberships/plan/delete/:id', c.deletePlan);
router.get('/shop', c.getShop);
router.get('/products', c.getProducts);
router.post('/products', c.createProduct);
router.post('/products/:id', c.updateProduct);
router.post('/products/:id/delete', c.deleteProduct);
router.get('/financials', c.getFinancials);
router.get('/roles', c.getRoles);
router.post('/roles/update/:id', c.updateUserRole);
router.post('/roles/delete/:id', c.deleteUser);

module.exports = router;
