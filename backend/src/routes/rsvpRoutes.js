import { Router } from 'express';
import { submitRsvp, getWishes } from '../controllers/rsvpController.js';
import { rsvpRateLimiter } from '../middleware/rsvpRateLimiter.js';

const router = Router({ mergeParams: true });

// POST /api/weddings/:slug/rsvp (Rate limited to 10 requests / 15 mins per IP)
router.post('/:slug/rsvp', rsvpRateLimiter, submitRsvp);

// GET /api/weddings/:slug/wishes (Public paginated list + stats)
router.get('/:slug/wishes', getWishes);

export default router;
