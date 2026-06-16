const { sendError } = require('./responses');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const isOperationalError = statusCode >= 400 && statusCode < 500;

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token', null, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired', null, 'TOKEN_EXPIRED');
  }

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return sendError(res, 409, 'A record with this unique value already exists', null, 'UNIQUE_CONSTRAINT');
  }

  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return sendError(res, 400, 'Referenced record does not exist', null, 'FOREIGN_KEY_CONSTRAINT');
  }

  if (!isOperationalError) {
    console.error(err);
  }

  return sendError(
    res,
    statusCode,
    err.message || 'Something went wrong',
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack },
    isOperationalError ? 'REQUEST_ERROR' : 'SERVER_ERROR'
  );
}

module.exports = errorHandler;
