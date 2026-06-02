const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: null });
};

exports.postLogin = async (req, res, next) => {
  const { username, password, role } = req.body;
  
  try {
    // Validate inputs
    if (!username || !password) {
      throw new AppError('Username and password are required', 400);
    }

    // Query database
    const query = { username: username.toLowerCase() };
    if (role) query.role = role;
    
    const user = await User.findOne(query);
    
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Set session
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      username: user.username, 
      role: user.role, 
      email: user.email 
    };

    const redirects = { 
      admin: '/admin/dashboard', 
      manager: '/manager/dashboard', 
      trainer: '/trainer/my-schedule', 
      member: '/member/membership' 
    };
    
    res.redirect(redirects[user.role] || '/');
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Login failed';
    res.status(statusCode).render('auth/login', { 
      title: 'Sign In or Sign Up | Power Temple', 
      error: message 
    });
  }
};

exports.postRegister = async (req, res, next) => {
  const { name, email, username, password, confirmPassword } = req.body;
  
  try {
    // Validate inputs
    if (!name || !email || !username || !password) {
      throw new AppError('All fields are required', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      throw new AppError('Username or email already exists', 400);
    }

    // Create user
    const user = await User.create({ 
      name: name.trim(),
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password,
      role: 'member' 
    });

    // Set session
    req.session.user = { 
      id: user._id, 
      name: user.name, 
      username: user.username, 
      role: 'member', 
      email: user.email 
    };

    res.redirect('/member/membership');
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Registration failed';
    res.status(statusCode).render('auth/login', { 
      title: 'Sign In or Sign Up | Power Temple', 
      error: message 
    });
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/');
  });
};
