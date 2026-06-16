const { sendError } = require('./responses');

function notFoundHandler(req, res) {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`, null, 'NOT_FOUND');
}

module.exports = notFoundHandler;
