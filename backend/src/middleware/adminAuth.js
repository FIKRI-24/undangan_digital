import { verifyAdminToken } from '../utils/jwt.js';
import pool from '../db/pool.js';

export async function requireAdmin(req, res, next) {
  try {
    // 1. Check HttpOnly cookie first, fallback to Authorization header
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Sesi admin tidak ditemukan atau telah berakhir.',
      });
    }

    // 2. Verify token
    const decoded = verifyAdminToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Token otentikasi admin tidak valid atau telah kadaluarsa.',
      });
    }

    // 3. Verify admin exists in database (exclude password_hash)
    const adminRes = await pool.query(
      'SELECT id, username, email, managed_wedding_id, created_at FROM admins WHERE id = $1',
      [decoded.id]
    );

    if (adminRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Akun admin tidak ditemukan.',
      });
    }

    const adminRow = adminRes.rows[0];
    req.admin = adminRow;

    // 4. Resolve managed wedding (Multi-Client support: X-Wedding-Id header -> managed_wedding_id -> default slug -> first wedding)
    let weddingRes = { rowCount: 0, rows: [] };
    const headerWeddingId = parseInt(req.headers['x-wedding-id'], 10);
    const preferredWeddingId = !isNaN(headerWeddingId) && headerWeddingId > 0
      ? headerWeddingId
      : adminRow.managed_wedding_id;

    if (preferredWeddingId) {
      weddingRes = await pool.query(
        'SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config FROM weddings WHERE id = $1 LIMIT 1',
        [preferredWeddingId]
      );
    }

    if (weddingRes.rowCount === 0) {
      const targetSlug = process.env.ADMIN_WEDDING_SLUG || 'raka-alya';
      weddingRes = await pool.query(
        'SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config FROM weddings WHERE slug = $1 LIMIT 1',
        [targetSlug]
      );
    }

    if (weddingRes.rowCount === 0) {
      // Fallback: get the primary wedding record by earliest ID
      weddingRes = await pool.query(
        'SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config FROM weddings ORDER BY id ASC LIMIT 1'
      );
    }

    if (weddingRes.rowCount === 0) {
      return res.status(500).json({
        success: false,
        message: 'Data wedding yang dikelola belum tersedia di database.',
      });
    }

    req.wedding = weddingRes.rows[0];
    next();
  } catch (err) {
    console.error('[Admin Auth Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan sistem saat memverifikasi sesi admin.',
    });
  }
}