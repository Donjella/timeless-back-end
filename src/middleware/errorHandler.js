// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      message = err.message || 'Validation Error';
      break;

    case 'CastError':
      statusCode = 400;
      message = `Invalid ${err.path}`;
      break;

    case 'JsonWebTokenError':
    case 'TokenExpiredError':
      statusCode = 401;
      message = 'Invalid or expired token, please log in again';
      break;

    case 'MongoServerError':
      if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate value error';
      }
      break;

    default:
      break;
  }

  // Log the error clearly for debugging
  console.error('ERROR:', err);

  // Send response clearly
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { errorHandler };