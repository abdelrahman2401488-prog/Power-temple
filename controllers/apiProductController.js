// REST CRUD API controller for Products (MVC: Controller layer)
// Follows the SWE230 lecture conventions: HTTP verbs map to CRUD,
// responses are JSON, and proper status codes are returned.
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/products  -> Retrieve all products (Read)
// Supports optional filtering: ?category=Supplements & ?search=whey
exports.getAllProducts = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products,
  });
});

// GET /api/products/:id  -> Retrieve a single product (Read)
exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: product });
});

// POST /api/products  -> Create a new product (Create)
exports.createProduct = catchAsync(async (req, res) => {
  const { name, category, price, unit, badge, image, description, stock } = req.body;
  const product = await Product.create({
    name, category, price, unit, badge, image, description, stock,
  });
  res.status(201).json({ status: 'success', data: product });
});

// PUT /api/products/:id  -> Update an existing product (Update)
exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,          // return the updated document
    runValidators: true, // enforce schema validation on update
  });
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: product });
});

// DELETE /api/products/:id  -> Delete a product (Delete)
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(200).json({ status: 'success', message: 'Product deleted' });
});
