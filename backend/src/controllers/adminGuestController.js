import pool from '../db/pool.js';

export async function getGuests(req, res) {
  try {
    const weddingId = req.wedding.id;
    const result = await pool.query(
      'SELECT id, wedding_id, name, phone, invitation_code, created_at, updated_at FROM guests WHERE wedding_id = $1 ORDER BY id DESC',
      [weddingId]
    );

    return res.status(200).json({
      success: true,
      data: {
        weddingSlug: req.wedding.slug,
        guests: result.rows,
      },
    });
  } catch (err) {
    console.error('[Get Guests Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat daftar tamu.' });
  }
}

export async function createGuest(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { name, phone, invitation_code } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Nama tamu minimal 2 karakter.',
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Nama tamu maksimal 100 karakter.',
      });
    }

    const result = await pool.query(
      `INSERT INTO guests (wedding_id, name, phone, invitation_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, wedding_id, name, phone, invitation_code, created_at`,
      [
        weddingId,
        name.trim(),
        phone ? phone.trim() : null,
        invitation_code ? invitation_code.trim() : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Tamu berhasil ditambahkan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Create Guest Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan tamu.' });
  }
}

export async function updateGuest(req, res) {
  try {
    const weddingId = req.wedding.id;
    const guestId = parseInt(req.params.id, 10);
    const { name, phone, invitation_code } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Nama tamu minimal 2 karakter.',
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Nama tamu maksimal 100 karakter.',
      });
    }

    const result = await pool.query(
      `UPDATE guests
       SET name = $1, phone = $2, invitation_code = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND wedding_id = $5
       RETURNING id, wedding_id, name, phone, invitation_code, updated_at`,
      [
        name.trim(),
        phone ? phone.trim() : null,
        invitation_code ? invitation_code.trim() : null,
        guestId,
        weddingId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Tamu tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data tamu berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Update Guest Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data tamu.' });
  }
}

export async function deleteGuest(req, res) {
  try {
    const weddingId = req.wedding.id;
    const guestId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM guests WHERE id = $1 AND wedding_id = $2 RETURNING id',
      [guestId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Tamu tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, message: 'Tamu berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete Guest Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus tamu.' });
  }
}