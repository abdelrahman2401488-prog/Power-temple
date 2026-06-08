const AppError = require('../utils/AppError');

// Treat XHR and REST API (/api/*) requests as JSON clients rather than
// browser navigations, so they receive JSON errors instead of redirects.
const wantsJson = (req) => req.xhr || req.originalUrl.startsWith('/api');

function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    // For API requests, return JSON error
    if (wantsJson(req)) {
      return res.status(401).json({
        status: 'error',
        message: 'Please log in to access this resource'
      });
    }
    return res.redirect('/auth/login');
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      if (wantsJson(req)) {
        return res.status(401).json({
          status: 'error',
          message: 'Please log in to access this resource'
        });
      }
      return res.redirect('/auth/login');
    }

    if (!roles.includes(req.session.user.role)) {
      if (wantsJson(req)) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to access this resource'
        });
      }
      return res.status(403).render('error', {
        title: 'Error 403',
        errorCode: 403,
        message: 'Access denied',
        details: 'You do not have permission to access this page'
      });
    }

    next();
  };
}

module.exports = { requireLogin, requireRole };
