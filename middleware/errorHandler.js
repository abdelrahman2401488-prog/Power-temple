// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Database validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    err.statusCode = 400;
    err.message = `Validation Error: ${message}`;
  }

  // MongoDB cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 400;
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token expired';
  }

  // Log error details
  console.error(`[ERROR] ${err.statusCode} - ${err.message}`, {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Distinguish between API and view requests
  if (req.accepts('json') || req.path.startsWith('/api/')) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Render error page for web requests
  const errorCode = err.statusCode || 500;
  const errorMessages = {
    400: 'Bad Request - Please check your input',
    401: 'Unauthorized - Please log in',
    403: 'Forbidden - You do not have access',
    404: 'Page not found',
    409: 'Conflict - Resource already exists',
    500: 'Server error - Please try again later',
  };

  res.status(errorCode).render('error', {
    title: `Error ${errorCode}`,
    errorCode,
    message: err.message,
    details: errorMessages[errorCode] || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
