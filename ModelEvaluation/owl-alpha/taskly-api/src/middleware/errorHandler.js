/**
 * Global error handling middleware
 * Catches any unhandled errors and returns consistent JSON error format
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  // Handle SQLite errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'A database error occurred'
      }
    });
  }

  // Handle JSON parse errors
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON in request body'
      }
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
}

/**
 * 404 handler — catches requests to undefined routes
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
}

module.exports = { errorHandler, notFoundHandler };
