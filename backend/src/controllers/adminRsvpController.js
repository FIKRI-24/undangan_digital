import pool from '../db/pool.js';

export async function getRsvps(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { attendance } = req.query;

    let query = 'SELECT id, wedding_id, guest_id, name, attendance, guest_count, message, created_at FROM rsvps WHERE wedding_id = $1';
    const params = [weddingId];

    if (attendance && ['hadir', 'tidak_hadir', 'ragu'].includes(attendance)) {
      query += ' AND attendance = $2';
      params.push(attendance);
    }

    query += ' ORDER BY created_at DESC';

    const [listRes, statsRes] = await Promise.all([
      pool.query(query, params),
      pool.query(
        `SELECT
           COUNT(*) as total,
           COUNT(*) FILTER (WHERE attendance = 'hadir') as hadir,
           COUNT(*) FILTER (WHERE attendance = 'tidak_hadir') as tidak_hadir,
           COUNT(*) FILTER (WHERE attendance = 'ragu') as ragu
         FROM rsvps WHERE wedding_id = $1`,
        [weddingId]
      ),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        rsvps: listRes.rows,
        stats: {
          total: parseInt(statsRes.rows[0].total, 10),
          hadir: parseInt(statsRes.rows[0].hadir, 10),
          tidak_hadir: parseInt(statsRes.rows[0].tidak_hadir, 10),
          ragu: parseInt(statsRes.rows[0].ragu, 10),
        },
      },
    });
  } catch (err) {
    console.error('[Get RSVPs Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat data ucapan dan RSVP.' });
  }
}

export async function deleteRsvp(req, res) {
  try {
    const weddingId = req.wedding.id;
    const rsvpId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM rsvps WHERE id = $1 AND wedding_id = $2 RETURNING id',
      [rsvpId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Ucapan/RSVP tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, message: 'Ucapan berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete RSVP Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus ucapan.' });
  }
}