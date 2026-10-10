import { Router } from 'express';
import pool from '../db/pool.js';

const router = Router();

// GET /api/health
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT 1 AS alive');
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        database: 'connected',
      });
    }
    throw new Error('Database ping yielded 0 rows');
  } catch (err) {
    return res.status(503).json({
      success: false,
      database: 'disconnected',
      error: err.message,
    });
  }
});

export default router;
