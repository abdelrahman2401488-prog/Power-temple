const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: null });
};

exports.postLogin = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const query = { username: username.toLowerCase() };
    if (role) query.role = role;
    const user = await User.findOne(query);
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: 'Invalid credentials' });
    }
    req.session.user = { id: user._id, name: user.name, username: user.username, role: user.role, email: user.email };
    const redirects = { admin: '/admin/dashboard', manager: '/manager/dashboard', trainer: '/trainer/my-schedule', member: '/member/membership' };
    res.redirect(redirects[user.role] || '/');
  } catch {
    res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: 'Login failed' });
  }
};

exports.postRegister = async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const user = await User.create({ name, email, username, password, role: 'member' });
    req.session.user = { id: user._id, name: user.name, username: user.username, role: 'member', email: user.email };
    res.redirect('/member/membership');
  } catch (err) {
    res.render('auth/login', { title: 'Sign In or Sign Up | Power Temple', error: 'Registration failed. Username or email may already exist.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
