import pool from '../db/pool.js';

export async function getEvents(req, res) {
  try {
    const weddingId = req.wedding.id;
    const result = await pool.query(
      'SELECT * FROM events WHERE wedding_id = $1 ORDER BY sort_order ASC, date ASC, id ASC',
      [weddingId]
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[Get Events Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar acara.' });
  }
}

export async function createEvent(req, res) {
  try {
    const weddingId = req.wedding.id;
    const {
      type,
      date,
      date_label,
      start_time,
      end_time,
      end_time_label,
      venue,
      address,
      maps_url,
      sort_order,
    } = req.body;

    if (!type || !date) {
      return res.status(400).json({ success: false, message: 'Jenis acara dan tanggal wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO events (
        wedding_id, type, date, date_label, start_time, end_time, end_time_label, venue, address, maps_url, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        weddingId,
        type.trim(),
        date,
        date_label ? date_label.trim() : null,
        start_time ? start_time.trim() : null,
        end_time ? end_time.trim() : null,
        end_time_label ? end_time_label.trim() : null,
        venue ? venue.trim() : null,
        address ? address.trim() : null,
        maps_url ? maps_url.trim() : null,
        parseInt(sort_order, 10) || 0,
      ]
    );

    return res.status(201).json({ success: true, message: 'Acara berhasil ditambahkan.', data: result.rows[0] });
  } catch (err) {
    console.error('[Create Event Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan acara.' });
  }
}

export async function updateEvent(req, res) {
  try {
    const weddingId = req.wedding.id;
    const eventId = parseInt(req.params.id, 10);

    const {
      type,
      date,
      date_label,
      start_time,
      end_time,
      end_time_label,
      venue,
      address,
      maps_url,
      sort_order,
    } = req.body;

    if (!type || !date) {
      return res.status(400).json({ success: false, message: 'Jenis acara dan tanggal wajib diisi.' });
    }

    const result = await pool.query(
      `UPDATE events
       SET type = $1, date = $2, date_label = $3, start_time = $4, end_time = $5,
           end_time_label = $6, venue = $7, address = $8, maps_url = $9, sort_order = $10
       WHERE id = $11 AND wedding_id = $12
       RETURNING *`,
      [
        type.trim(),
        date,
        date_label ? date_label.trim() : null,
        start_time ? start_time.trim() : null,
        end_time ? end_time.trim() : null,
        end_time_label ? end_time_label.trim() : null,
        venue ? venue.trim() : null,
        address ? address.trim() : null,
        maps_url ? maps_url.trim() : null,
        parseInt(sort_order, 10) || 0,
        eventId,
        weddingId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Acara tidak ditemukan atau bukan milik wedding ini.' });
    }

    return res.status(200).json({ success: true, message: 'Acara berhasil diperbarui.', data: result.rows[0] });
  } catch (err) {
    console.error('[Update Event Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui acara.' });
  }
}

export async function deleteEvent(req, res) {
  try {
    const weddingId = req.wedding.id;
    const eventId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND wedding_id = $2 RETURNING id',
      [eventId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Acara tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, message: 'Acara berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete Event Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus acara.' });
  }
}

export async function reorderEvents(req, res) {
  const client = await pool.connect();
  try {
    const weddingId = req.wedding.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Payload "items" harus berupa array.' });
    }

    await client.query('BEGIN');
    for (const item of items) {
      if (item.id && typeof item.sort_order === 'number') {
        await client.query(
          'UPDATE events SET sort_order = $1 WHERE id = $2 AND wedding_id = $3',
          [item.sort_order, item.id, weddingId]
        );
      }
    }
    await client.query('COMMIT');

    return res.status(200).json({ success: true, message: 'Urutan acara berhasil diperbarui.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reorder Events Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengurutkan acara.' });
  } finally {
    client.release();
  }
}