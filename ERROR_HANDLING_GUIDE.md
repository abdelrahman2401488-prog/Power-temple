# Error Handling Guide - Power Temple Gym App

This document explains the comprehensive error handling system implemented in your application.

---

## Overview

The error handling system covers:
1. **Database Errors** - Connection, validation, cast errors
2. **Authentication/Authorization** - Missing sessions, invalid roles
3. **Input Validation** - Empty fields, invalid formats, constraints
4. **Resource Errors** - 404 Not Found, 409 Conflicts
5. **Server Errors** - 500 Internal Server Error
6. **Async Errors** - Uncaught promise rejections

---

## File Structure

### Core Error Utilities

**`utils/AppError.js`** - Custom error class
- Extends Error with HTTP status codes
- All application errors should use this class
- Example: `throw new AppError('User not found', 404);`

**`utils/catchAsync.js`** - Async error wrapper
- Wraps async route handlers to catch errors
- Automatically passes errors to next middleware
- Use with route handlers that have async operations

### Middleware

**`middleware/errorHandler.js`** - Global error handler
- Processes all errors in the application
- Handles MongoDB validation/cast errors
- Returns JSON for API requests, renders error page for web
- Logs error details with timestamp and stack trace

**`middleware/validateInput.js`** - Input validation
- `validateAuth()` - Login/register field validation
- `validateMemberInput()` - Membership and booking validation
- `validateClassInput()` - Class creation/update validation

**`middleware/auth.js`** - Authentication/Authorization
- `requireLogin()` - Checks if user is logged in
- `requireRole()` - Checks if user has required role
- Returns 403 Forbidden for unauthorized access
- Returns 401 Unauthorized for unauthenticated access

---

## Error Scenarios Handled

### 1. Database Connection Errors

**When**: MongoDB is not running
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Handler**: server.js catch block
**User sees**: "DB connection failed, starting without MongoDB"

**Fix**:
```powershell
mongod --dbpath "C:\data\db"
```

---

### 2. Validation Errors

**When**: Trying to subscribe to non-existent membership plan
```
Error: "Plan ID is required"
Error: "Invalid plan ID"
```
**Handler**: `validateMemberInput` middleware + try/catch in controller
**User sees**: Flash message with error description

**Prevented by**:
- Required field checks
- MongoDB ObjectId validation
- Input trim and type checking

---

### 3. Authentication Errors

#### a) Missing Session/Not Logged In
**When**: User tries to access protected route without login
```
Error: "Please log in to access this resource" (401)
```
**Handler**: `requireLogin()` middleware
**User sees**: Redirected to /auth/login

#### b) Invalid Credentials
**When**: Wrong username or password
```
Error: "Invalid credentials" (401)
```
**Handler**: authController.postLogin
**User sees**: Login page with error message

#### c) User Not Found
**When**: Username doesn't exist in database
```
Error: "User not found" (401)
```
**Handler**: authController.postLogin
**User sees**: Login page with error message

---

### 4. Authorization Errors

**When**: User tries to access admin page as member
```
Error: "You do not have permission to access this resource" (403)
```
**Handler**: `requireRole('admin')` middleware
**User sees**: Error page with 403 status

---

### 5. Duplicate Entry Errors

**When**: Email or username already exists
```
Error: "Username or email already exists" (400)
```
**Handler**: MongoDB duplicate key error handler
**User sees**: Registration page with error message

**MongoDB Error Code**: 11000 (Duplicate Key)

---

### 6. Resource Not Found (404)

**When**: 
- Class not found
- User not found
- Booking not found
- Invalid URL

```
Error: "Class not found" (404)
Error: "Booking not found" (404)
Error: "Page not found" (404)
```
**Handler**: errorHandler middleware
**User sees**: Custom 404 error page

---

### 7. Conflict Errors (409)

**When**: User tries to book same class twice
```
Error: "You have already booked this class" (409)
```
**Handler**: memberController.bookClass
**User sees**: Flash message, redirected to browse classes

---

### 8. Validation Errors

**When**: Form data doesn't meet requirements
```
Error: "Password must be at least 6 characters" (400)
Error: "Username must be at least 3 characters" (400)
Error: "All fields are required" (400)
```
**Handler**: `validateAuth` middleware
**User sees**: Login/register page with error message

---

### 9. MongoDB Cast Errors

**When**: Invalid MongoDB ObjectId in URL
```
Error: "Invalid ID format" (400)
```
**Handler**: errorHandler middleware catches CastError
**User sees**: Error page or flash message

---

### 10. Server Errors (500)

**When**: Unexpected error occurs
```
Error: Any unhandled error
```
**Handler**: Global error handler
**User sees**: Generic error page

**In Development**: Stack trace is shown
**In Production**: Generic message is shown

---

## How to Use Error Handling

### In Controllers

```javascript
// Example 1: With try/catch
exports.someAction = async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);
    if (!resource) {
      throw new AppError('Resource not found', 404);
    }
    // ... rest of logic
  } catch (err) {
    next(err); // Pass to error handler
  }
};

// Example 2: For view rendering (catch internally)
exports.anotherAction = async (req, res, next) => {
  try {
    // ... logic
  } catch (err) {
    req.session.flash = err.message;
    res.redirect('/previous-page');
  }
};
```

### In Routes

```javascript
// With validation middleware
router.post('/path', validateInput, controller.action);

// With role check
router.post('/admin-path', requireRole('admin'), controller.action);

// Combined
router.post(
  '/admin/classes',
  requireRole('admin'),
  validateClassInput,
  upload.single('image'),
  controller.postClass
);
```

### Custom Error Creation

```javascript
const AppError = require('../utils/AppError');

// Throw errors with status codes
throw new AppError('Item not found', 404);
throw new AppError('Invalid input', 400);
throw new AppError('Unauthorized', 401);
throw new AppError('Forbidden', 403);
throw new AppError('Conflict', 409);
```

---

## Error Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Not logged in, invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry, already booked |
| 500 | Server Error | Unexpected error |

---

## Testing Error Scenarios

### Test 1: MongoDB Not Running
```bash
npm start
# Should show: "DB connection failed"
```

### Test 2: Invalid Login
```
Username: invalid
Password: 123
# Should show: "User not found"
```

### Test 3: Duplicate Registration
```
Username: admin
Email: admin@powertemple.com
# Should show: "Username or email already exists"
```

### Test 4: Access Without Role
```
1. Login as member
2. Go to /admin/dashboard
# Should show: 403 Forbidden
```

### Test 5: Book Same Class Twice
```
1. Login as member
2. Browse classes
3. Click book on a class
4. Try to book same class again
# Should show: "You have already booked this class"
```

---

## Logging

All errors are logged with:
- Timestamp
- HTTP status code
- Error message
- Request path and method
- Stack trace

**Log format**:
```
[ERROR] 404 - Page not found {
  timestamp: "2024-06-02T10:30:00.000Z",
  path: "/invalid-page",
  method: "GET",
  stack: "..."
}
```

---

## Adding New Error Handling

### To Add Validation for a New Route

1. Update `middleware/validateInput.js`:
```javascript
const validateNewResource = (req, res, next) => {
  const { field1, field2 } = req.body;
  if (!field1) {
    return next(new AppError('Field1 is required', 400));
  }
  next();
};

module.exports = {
  // ... existing exports
  validateNewResource
};
```

2. Use in route:
```javascript
router.post('/path', validateNewResource, controller.action);
```

### To Add Error Handling in Controller

```javascript
exports.action = async (req, res, next) => {
  try {
    // Your logic
    throw new AppError('Custom error', 400);
  } catch (err) {
    // For API routes
    return res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message
    });
    
    // For web routes
    req.session.flash = err.message;
    res.redirect('/previous-page');
  }
};
```

---

## Best Practices

1. **Always use AppError** for intentional errors
2. **Use try/catch in all async operations**
3. **Pass errors to next()** in middleware
4. **Validate input early** before database operations
5. **Log errors with context** (user, path, method)
6. **Use meaningful error messages** for users
7. **Never expose sensitive information** in errors
8. **Check for null/undefined** before using objects

---

## Troubleshooting

### Error: "Cannot read property 'user' of undefined"
**Cause**: Session not loaded
**Fix**: Check that session middleware is loaded before routes

### Error: "Cast to ObjectId failed"
**Cause**: Invalid MongoDB ObjectId in URL
**Fix**: Validate ObjectId format before querying

### Error: "Duplicate key error"
**Cause**: Unique field already exists
**Fix**: Check for existing record before create

### Error Not Being Caught
**Cause**: Missing try/catch or error not passed to next()
**Fix**: Wrap async logic in try/catch and call next(err)

---

## Summary

Your app now has:
- ✅ Custom error class with status codes
- ✅ Global error handler middleware
- ✅ Input validation middleware
- ✅ Authentication/authorization checks
- ✅ Proper error logging
- ✅ User-friendly error pages
- ✅ Database error handling
- ✅ Async error wrapping

This ensures all error scenarios are caught, logged, and handled appropriately!
