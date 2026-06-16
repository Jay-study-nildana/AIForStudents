function sendSuccess(res, statusCode, message, data = null, meta = {}) {
  const payload = {
    success: true,
    message,
    data
  };

  if (Object.keys(meta).length > 0) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

function sendError(res, statusCode, message, details = null, code = 'ERROR') {
  const payload = {
    success: false,
    message,
    code
  };

  if (details !== null) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendError
};
