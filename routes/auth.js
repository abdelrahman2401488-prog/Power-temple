const express = require('express');
const router = express.Router();
const c = require('../controllers/authController');
const { validateAuth } = require('../middleware/validateInput');

router.get('/login', c.getLogin);
router.post('/login', validateAuth, c.postLogin);
router.post('/register', validateAuth, c.postRegister);
router.get('/logout', c.logout);

// /auth/register opens login page with register tab active
router.get('/register', (req, res) => res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: null }));

module.exports = router;
