const GymClass = require('../models/GymClass');
const Product = require('../models/Product');

exports.getIndex = async (req, res) => {
  const classes = await GymClass.find().sort({ createdAt: 1 }).limit(5);
  res.render('index', { title: 'Power Temple | Elite Fitness Platform', classes });
};

exports.getServices = (req, res) => res.render('services', { title: 'Power Temple | Services' });
exports.getMemberships = (req, res) => res.render('memberships', { title: 'Memberships & Offers | Power Temple' });
exports.getShop = async (req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.render('shop', { title: 'Shop | Power Temple', products });
};
