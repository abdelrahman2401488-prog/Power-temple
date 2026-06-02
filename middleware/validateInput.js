const AppError = require('../utils/AppError');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate login/register inputs
const validateAuth = (req, res, next) => {
  const { username, password, email, name } = req.body;

  if (req.path === '/login' || req.path === '/register') {
    if (!username || username.trim().length < 3) {
      return next(new AppError('Username must be at least 3 characters', 400));
    }
    if (!password || password.length < 6) {
      return next(new AppError('Password must be at least 6 characters', 400));
    }
  }

  if (req.path === '/register') {
    if (!email || !emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email', 400));
    }
    if (!name || name.trim().length < 2) {
      return next(new AppError('Name must be at least 2 characters', 400));
    }
  }

  next();
};

// Validate membership/booking inputs
const validateMemberInput = (req, res, next) => {
  if (req.body.planId && !req.body.planId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid plan ID', 400));
  }

  next();
};

// Validate class inputs
const validateClassInput = (req, res, next) => {
  const { name, trainer, room, time, date } = req.body;

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!name || name.trim().length < 2) {
      return next(new AppError('Class name is required', 400));
    }
    if (!trainer || trainer.trim().length < 2) {
      return next(new AppError('Trainer name is required', 400));
    }
    if (!time || !time.match(/^\d{2}:\d{2}$/)) {
      return next(new AppError('Invalid time format (use HH:MM)', 400));
    }
    if (!date || isNaN(new Date(date))) {
      return next(new AppError('Invalid date', 400));
    }
  }

  next();
};

module.exports = {
  validateAuth,
  validateMemberInput,
  validateClassInput,
};
