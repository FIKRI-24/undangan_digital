export function verifyAdminOrigin(req, res, next) {
  // Only protect mutating methods (POST, PUT, DELETE, PATCH)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // If request has Origin header, verify it matches allowed frontend
  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: 'Permintaan ditolak karena ketidaksesuaian Origin (CSRF protection).',
    });
  }

  // If request has Referer header but no Origin, verify referer starts with allowed frontend
  if (!origin && referer && !referer.startsWith(allowedOrigin)) {
    return res.status(403).json({
      success: false,
      message: 'Permintaan ditolak karena ketidaksesuaian Referer (CSRF protection).',
    });
  }

  next();
}