export const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};
