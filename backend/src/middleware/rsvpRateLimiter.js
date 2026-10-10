import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for RSVP submissions
 * PRD Section 36 & Requirement 14: 10 POST requests per 15 minutes per IP.
 */
export const rsvpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan RSVP. Silakan coba beberapa saat lagi.',
  },
  statusCode: 429,
});
