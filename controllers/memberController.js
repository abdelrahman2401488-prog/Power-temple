exports.getMembership = (req, res) => res.render('member/membership', { title: 'My Membership | Power Temple' });
exports.getBrowseClasses = (req, res) => res.render('member/browse-classes', { title: 'Browse Classes | Power Temple' });
exports.getMyBookings = (req, res) => res.render('member/my-bookings', { title: 'My Bookings | Power Temple' });
exports.getPersonalTraining = (req, res) => res.render('member/personal-training', { title: 'Personal Training | Power Temple' });
exports.getProfile = (req, res) => res.render('member/profile', { title: 'My Profile | Power Temple' });
