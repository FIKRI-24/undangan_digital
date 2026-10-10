import * as weddingService from '../services/weddingService.js';

/**
 * Wedding Controller
 * Based on PRD Section 8 & 10 (GET /api/weddings/:slug)
 */
export async function getWedding(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Slug undangan tidak valid',
      });
    }

    const data = await weddingService.getWeddingBySlug(slug.trim());

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Undangan tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}
