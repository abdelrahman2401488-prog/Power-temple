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

// Streams an uploaded class photo straight from MongoDB (Atlas) so it's
// visible from any device/deployment, not just the machine that received the upload.
exports.getClassImage = async (req, res) => {
  const gymClass = await GymClass.findById(req.params.id).select('imageData imageType');
  if (!gymClass || !gymClass.imageData) return res.status(404).end();
  res.set('Content-Type', gymClass.imageType || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(gymClass.imageData);
};
