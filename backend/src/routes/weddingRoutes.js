import { Router } from 'express';
import { getWedding } from '../controllers/weddingController.js';

const router = Router();

// GET /api/weddings/:slug
router.get('/:slug', getWedding);

export default router;
