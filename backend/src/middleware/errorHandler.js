/**
 * Global Error Handler Middleware
 * Based on PRD Section 11 (ERROR HANDLER)
 */
export function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[Error] [${req.method}] ${req.originalUrl}:`, err.message);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 && !isDev
    ? 'Terjadi kesalahan pada server'
    : err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
}
