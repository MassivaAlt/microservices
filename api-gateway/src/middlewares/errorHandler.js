// api-gateway/src/middlewares/errorHandler.js
// Middleware global de gestion des erreurs

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  const status = err.status || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;