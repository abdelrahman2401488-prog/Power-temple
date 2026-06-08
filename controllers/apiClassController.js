// REST CRUD API controller for Gym Classes (MVC: Controller layer)
// Same conventions as apiProductController: HTTP verbs map to CRUD,
// JSON responses, and proper status codes.
const GymClass = require('../models/GymClass');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// GET /api/classes  -> Retrieve all classes (Read)
// Supports optional filtering: ?category=Cardio & ?level=Beginner & ?search=yoga
exports.getAllClasses = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.level) filter.level = req.query.level;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const classes = await GymClass.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: classes.length,
    data: classes,
  });
});

// GET /api/classes/:id  -> Retrieve a single class (Read)
exports.getClass = catchAsync(async (req, res, next) => {
  const gymClass = await GymClass.findById(req.params.id);
  if (!gymClass) {
    return next(new AppError('No class found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: gymClass });
});

// POST /api/classes  -> Create a new class (Create)
exports.createClass = catchAsync(async (req, res) => {
  const gymClass = await GymClass.create(req.body);
  res.status(201).json({ status: 'success', data: gymClass });
});

// PUT /api/classes/:id  -> Update an existing class (Update)
exports.updateClass = catchAsync(async (req, res, next) => {
  const gymClass = await GymClass.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!gymClass) {
    return next(new AppError('No class found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: gymClass });
});

// DELETE /api/classes/:id  -> Delete a class (Delete)
exports.deleteClass = catchAsync(async (req, res, next) => {
  const gymClass = await GymClass.findByIdAndDelete(req.params.id);
  if (!gymClass) {
    return next(new AppError('No class found with that ID', 404));
  }
  res.status(200).json({ status: 'success', message: 'Class deleted' });
});
