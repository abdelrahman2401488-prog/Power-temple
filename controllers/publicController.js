const GymClass = require('../models/GymClass');

exports.getIndex = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: 1 }).limit(5);
  res.render('index', { title: 'Power Temple | Elite Fitness Platform', classes });
};

exports.getServices = (req, res) => res.render('services', { title: 'Power Temple | Services' });
exports.getMemberships = (req, res) => res.render('memberships', { title: 'Memberships & Offers | Power Temple' });
exports.getShop = (req, res) => res.render('shop', { title: 'Shop | Power Temple' });
