const express = require('express');
const router = express.Router();
const c = require('../controllers/publicController');

router.get('/', c.getIndex);
router.get('/services', c.getServices);
router.get('/memberships', c.getMemberships);
router.get('/shop', c.getShop);
router.get('/uploads/class/:id', c.getClassImage);

// Catch old .html paths from mock JS redirects
router.get('/index.html', (req, res) => res.redirect('/'));
router.get('/auth/login.html', (req, res) => res.redirect('/auth/login'));
router.get('/admin/dashboard.html', (req, res) => res.redirect('/admin/dashboard'));
router.get('/manager/dashboard.html', (req, res) => res.redirect('/manager/dashboard'));
router.get('/trainer/my-schedule.html', (req, res) => res.redirect('/trainer/my-schedule'));
router.get('/member/membership.html', (req, res) => res.redirect('/member/membership'));

module.exports = router;
