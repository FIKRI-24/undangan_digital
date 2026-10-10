import pool from '../db/pool.js';

/**
 * Helper to sanitize string input by removing potential HTML tags and trimming.
 */
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Create a new RSVP record for a wedding
 * PRD Section 30, 36 & Requirements 1, 2, 3, 9, 11
 */
export async function createRsvp(slug, payload) {
  let weddingRes = await pool.query(
    `SELECT id FROM weddings WHERE slug = $1 AND status IN ('active', 'aktif') LIMIT 1`,
    [slug]
  );

  if (weddingRes.rowCount === 0) {
    weddingRes = await pool.query(
      `SELECT id FROM weddings WHERE status IN ('active', 'aktif') ORDER BY id ASC LIMIT 1`
    );
  }

  if (weddingRes.rowCount === 0) {
    const error = new Error('Undangan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const weddingId = weddingRes.rows[0].id;

  // 2. Validate and sanitize payload (Requirement 9)
  const { name, attendance, guest_count, message } = payload;

  // Validate name
  if (typeof name !== 'string') {
    const error = new Error('Nama harus berupa teks valid');
    error.statusCode = 400;
    throw error;
  }

  const cleanName = sanitizeText(name);
  if (cleanName.length < 2 || cleanName.length > 100) {
    const error = new Error('Nama harus memiliki panjang antara 2 hingga 100 karakter');
    error.statusCode = 400;
    throw error;
  }

  // Validate attendance
  const validAttendance = ['hadir', 'tidak_hadir', 'ragu'];
  if (typeof attendance !== 'string' || !validAttendance.includes(attendance.trim())) {
    const error = new Error('Konfirmasi kehadiran harus berupa salah satu dari: hadir, tidak_hadir, ragu');
    error.statusCode = 400;
    throw error;
  }
  const cleanAttendance = attendance.trim();

  // Validate guest_count (Requirement 10: only valid when hadir)
  let cleanGuestCount = null;
  if (cleanAttendance === 'hadir') {
    if (guest_count !== undefined && guest_count !== null) {
      const parsedCount = parseInt(guest_count, 10);
      if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 10) {
        const error = new Error('Jumlah tamu harus berupa angka antara 1 hingga 10');
        error.statusCode = 400;
        throw error;
      }
      cleanGuestCount = parsedCount;
    } else {
      cleanGuestCount = 1; // Default to 1 if not specified for hadir
    }
  } else {
    cleanGuestCount = null; // Strictly null for tidak_hadir or ragu
  }

  // Validate message (Requirement 2: message is optional, max 1000 chars)
  let cleanMessage = null;
  if (message !== undefined && message !== null) {
    if (typeof message !== 'string') {
      const error = new Error('Ucapan harus berupa teks valid');
      error.statusCode = 400;
      throw error;
    }
    const sanitizedMsg = sanitizeText(message);
    if (sanitizedMsg.length > 1000) {
      const error = new Error('Ucapan maksimal 1000 karakter');
      error.statusCode = 400;
      throw error;
    }
    cleanMessage = sanitizedMsg.length > 0 ? sanitizedMsg : null;
  }

  // 3. Insert into rsvps table (Requirement 11: guest_id remains null)
  const insertQuery = `
    INSERT INTO rsvps (
      wedding_id, guest_id, name, attendance, guest_count, message
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, wedding_id, guest_id, name, attendance, guest_count, message, created_at, updated_at
  `;

  const insertRes = await pool.query(insertQuery, [
    weddingId,
    null,
    cleanName,
    cleanAttendance,
    cleanGuestCount,
    cleanMessage,
  ]);

  return insertRes.rows[0];
}

/**
 * Fetch wishes with statistics and pagination
 * PRD Section 30 & Requirements 7, 8
 */
export async function getWishes(slug, { page = 1, limit = 10 } = {}) {
  let weddingRes = await pool.query(
    `SELECT id FROM weddings WHERE slug = $1 AND status IN ('active', 'aktif') LIMIT 1`,
    [slug]
  );

  if (weddingRes.rowCount === 0) {
    weddingRes = await pool.query(
      `SELECT id FROM weddings WHERE status IN ('active', 'aktif') ORDER BY id ASC LIMIT 1`
    );
  }

  if (weddingRes.rowCount === 0) {
    const error = new Error('Undangan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const weddingId = weddingRes.rows[0].id;

  // 2. Query param clamping policy (Requirement 8)
  let pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;

  let limitNum = parseInt(limit, 10);
  if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
  if (limitNum > 50) limitNum = 50;

  const offset = (pageNum - 1) * limitNum;

  // 3. Aggregate statistics
  const statsRes = await pool.query(
    `SELECT
      COUNT(*)::int AS total_items,
      COUNT(*) FILTER (WHERE attendance = 'hadir')::int AS hadir,
      COUNT(*) FILTER (WHERE attendance = 'tidak_hadir')::int AS tidak_hadir,
      COUNT(*) FILTER (WHERE attendance = 'ragu')::int AS ragu
    FROM rsvps
    WHERE wedding_id = $1`,
    [weddingId]
  );

  const statsRow = statsRes.rows[0];
  const totalItems = statsRow.total_items || 0;
  const totalPages = Math.ceil(totalItems / limitNum) || 1;
  const hasMore = pageNum < totalPages;

  // 4. Fetch paginated items (ordered latest first)
  const itemsRes = await pool.query(
    `SELECT
      id, name, attendance, guest_count, message, created_at
    FROM rsvps
    WHERE wedding_id = $1
    ORDER BY created_at DESC, id DESC
    LIMIT $2 OFFSET $3`,
    [weddingId, limitNum, offset]
  );

  return {
    items: itemsRes.rows,
    stats: {
      total: totalItems,
      hadir: statsRow.hadir || 0,
      tidak_hadir: statsRow.tidak_hadir || 0,
      ragu: statsRow.ragu || 0,
    },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total_items: totalItems,
      total_pages: totalPages,
      has_more: hasMore,
    },
  };
}
