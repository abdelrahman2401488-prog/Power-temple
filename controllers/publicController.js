exports.getIndex = (req, res) => res.render('index', { title: 'Power Temple | Elite Fitness Platform' });
exports.getServices = (req, res) => res.render('services', { title: 'Power Temple | Services' });
exports.getMemberships = (req, res) => res.render('memberships', { title: 'Memberships & Offers | Power Temple' });
exports.getShop = (req, res) => res.render('shop', { title: 'Shop | Power Temple' });
