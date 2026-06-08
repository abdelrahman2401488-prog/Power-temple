const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
require('dotenv').config();

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, images, videos)
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session — stored in whichever database the app actually connects to
// (Atlas, or the local MongoDB fallback). See config/db.js.
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: require('./config/db').clientPromise,
    touchAfter: 24 * 3600,
  }).on('error', () => {}),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
}));

// Make session user and flash messages available in all views
app.use((req, res, next) => {
  res.locals.sessionUser = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/manager', require('./routes/manager'));
app.use('/member', require('./routes/member'));
app.use('/trainer', require('./routes/trainer'));

// REST API (JSON CRUD)
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res, next) => {
  next(new AppError('Page not found', 404));
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
