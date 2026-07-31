function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'A record with this value already exists.', fields: err.errors?.map(e => e.path) });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validation failed', details: err.errors?.map(e => e.message) });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
