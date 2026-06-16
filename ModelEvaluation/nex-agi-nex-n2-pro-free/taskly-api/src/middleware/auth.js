const jwt = require('jsonwebtoken');

const { sendError } = require('../utils/responses');

function getJwtSecret() {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }

  return process.env.JWT_SECRET || 'dev-secret-change-me';
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return sendError(res, 401, 'Authentication required', null, 'AUTH_REQUIRED');
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired', null, 'TOKEN_EXPIRED');
    }

    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Invalid token', null, 'INVALID_TOKEN');
    }

    return next(error);
  }
}

module.exports = {
  authenticateToken
};
