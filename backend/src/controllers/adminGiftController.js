import pool from '../db/pool.js';

export async function getGifts(req, res) {
  try {
    const weddingId = req.wedding.id;
    const [giftsRes, shippingRes] = await Promise.all([
      pool.query('SELECT * FROM gifts WHERE wedding_id = $1 ORDER BY sort_order ASC, id ASC', [weddingId]),
      pool.query('SELECT * FROM gift_shipping WHERE wedding_id = $1 LIMIT 1', [weddingId]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        gifts: giftsRes.rows,
        shipping: shippingRes.rows[0] || null,
      },
    });
  } catch (err) {
    console.error('[Get Gifts Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat data kado dan rekening.' });
  }
}

export async function createGift(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { type, provider, account_holder, account_number, logo_url, sort_order } = req.body;

    if (!provider || !account_holder || !account_number) {
      return res.status(400).json({
        success: false,
        message: 'Provider, nama pemilik, dan nomor rekening wajib diisi.',
      });
    }

    const result = await pool.query(
      `INSERT INTO gifts (wedding_id, type, provider, account_holder, account_number, logo_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        weddingId,
        type ? type.trim() : 'bank',
        provider.trim().toUpperCase(),
        account_holder.trim(),
        account_number.trim(),
        logo_url ? logo_url.trim() : null,
        parseInt(sort_order, 10) || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Rekening/dompet digital berhasil ditambahkan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Create Gift Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan rekening.' });
  }
}

export async function updateGift(req, res) {
  try {
    const weddingId = req.wedding.id;
    const giftId = parseInt(req.params.id, 10);
    const { type, provider, account_holder, account_number, logo_url, sort_order } = req.body;

    if (!provider || !account_holder || !account_number) {
      return res.status(400).json({
        success: false,
        message: 'Provider, nama pemilik, dan nomor rekening wajib diisi.',
      });
    }

    const result = await pool.query(
      `UPDATE gifts
       SET type = $1, provider = $2, account_holder = $3, account_number = $4,
           logo_url = $5, sort_order = $6
       WHERE id = $7 AND wedding_id = $8
       RETURNING *`,
      [
        type ? type.trim() : 'bank',
        provider.trim().toUpperCase(),
        account_holder.trim(),
        account_number.trim(),
        logo_url ? logo_url.trim() : null,
        parseInt(sort_order, 10) || 0,
        giftId,
        weddingId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Data rekening tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data rekening berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Update Gift Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui rekening.' });
  }
}

export async function deleteGift(req, res) {
  try {
    const weddingId = req.wedding.id;
    const giftId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM gifts WHERE id = $1 AND wedding_id = $2 RETURNING id',
      [giftId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Data rekening tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, message: 'Data rekening berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete Gift Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus rekening.' });
  }
}

export async function reorderGifts(req, res) {
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
          'UPDATE gifts SET sort_order = $1 WHERE id = $2 AND wedding_id = $3',
          [item.sort_order, item.id, weddingId]
        );
      }
    }
    await client.query('COMMIT');

    return res.status(200).json({ success: true, message: 'Urutan rekening berhasil diperbarui.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reorder Gifts Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengurutkan rekening.' });
  } finally {
    client.release();
  }
}

export async function updateShipping(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { recipient, phone, address } = req.body;

    if (!recipient || !address) {
      return res.status(400).json({
        success: false,
        message: 'Nama penerima dan alamat pengiriman wajib diisi.',
      });
    }

    // Check if shipping record exists
    const existing = await pool.query(
      'SELECT id FROM gift_shipping WHERE wedding_id = $1 LIMIT 1',
      [weddingId]
    );

    let result;
    if (existing.rowCount > 0) {
      result = await pool.query(
        `UPDATE gift_shipping
         SET recipient = $1, phone = $2, address = $3, updated_at = CURRENT_TIMESTAMP
         WHERE wedding_id = $4
         RETURNING *`,
        [recipient.trim(), phone ? phone.trim() : null, address.trim(), weddingId]
      );
    } else {
      result = await pool.query(
        `INSERT INTO gift_shipping (wedding_id, recipient, phone, address)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [weddingId, recipient.trim(), phone ? phone.trim() : null, address.trim()]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Alamat pengiriman kado berhasil disimpan.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Update Shipping Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan alamat pengiriman.' });
  }
}