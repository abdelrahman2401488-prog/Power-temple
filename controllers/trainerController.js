exports.getSchedule = (req, res) => res.render('trainer/my-schedule', { title: 'My Schedule | Power Temple' });
exports.getAttendance = (req, res) => res.render('trainer/attendance', { title: 'Attendance & Performance | Power Temple' });
exports.getMembers = (req, res) => res.render('trainer/members', { title: 'My Members | Power Temple' });
