function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    // Ensure auth middleware ran first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.'
        }
      });
    }

    // Check if user's role is in the allowed roles list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        }
      });
    }

    next();
  };
}

module.exports = { roleMiddleware };
