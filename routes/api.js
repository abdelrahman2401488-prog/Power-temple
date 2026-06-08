// REST API routes (MVC: Routes layer)
// Mounted at /api — see app.js. Maps HTTP verbs to CRUD operations
// exactly as described in the SWE230 "Creating a CRUD API" lecture.
const express = require('express');
const router = express.Router();
const products = require('../controllers/apiProductController');
const classes = require('../controllers/apiClassController');
const { requireRole } = require('../middleware/auth');

// --- Products resource ---------------------------------------------------
// Read operations are public.
router.get('/products', products.getAllProducts);
router.get('/products/:id', products.getProduct);

// Write operations require an authenticated admin or manager (REST API security).
router.post('/products', requireRole('admin', 'manager'), products.createProduct);
router.put('/products/:id', requireRole('admin', 'manager'), products.updateProduct);
router.delete('/products/:id', requireRole('admin', 'manager'), products.deleteProduct);

// --- Classes resource ----------------------------------------------------
router.get('/classes', classes.getAllClasses);
router.get('/classes/:id', classes.getClass);

router.post('/classes', requireRole('admin', 'manager'), classes.createClass);
router.put('/classes/:id', requireRole('admin', 'manager'), classes.updateClass);
router.delete('/classes/:id', requireRole('admin', 'manager'), classes.deleteClass);

module.exports = router;
