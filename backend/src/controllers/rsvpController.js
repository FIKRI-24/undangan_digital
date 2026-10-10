import * as rsvpService from '../services/rsvpService.js';

/**
 * Controller for submitting RSVP & wish
 * PRD Section 30: POST /api/weddings/:slug/rsvp
 */
export async function submitRsvp(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Slug undangan tidak valid',
      });
    }

    const rsvp = await rsvpService.createRsvp(slug.trim(), req.body || {});

    return res.status(201).json({
      success: true,
      message: 'Ucapan berhasil dikirim',
      data: rsvp,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller for retrieving paginated wishes and statistics
 * PRD Section 30: GET /api/weddings/:slug/wishes?page=1&limit=10
 */
export async function getWishes(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Slug undangan tidak valid',
      });
    }

    const { page, limit } = req.query;
    const result = await rsvpService.getWishes(slug.trim(), { page, limit });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
