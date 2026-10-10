import pool from '../db/pool.js';
import { deleteFileIfLocal } from '../services/storageService.js';

export async function getStories(req, res) {
  try {
    const weddingId = req.wedding.id;
    const result = await pool.query(
      'SELECT * FROM stories WHERE wedding_id = $1 ORDER BY sort_order ASC, id ASC',
      [weddingId]
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[Get Stories Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat cerita perjalanan cinta.' });
  }
}

export async function createStory(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { title, date_label, body, image_url, sort_order } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Judul dan isi cerita wajib diisi.' });
    }

    const finalImage = req.fileUrl || (image_url ? image_url.trim() : null);

    const result = await pool.query(
      `INSERT INTO stories (wedding_id, title, date_label, body, image_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        weddingId,
        title.trim(),
        date_label ? date_label.trim() : null,
        body.trim(),
        finalImage,
        parseInt(sort_order, 10) || 0,
      ]
    );

    return res.status(201).json({ success: true, message: 'Cerita berhasil ditambahkan.', data: result.rows[0] });
  } catch (err) {
    if (req.fileUrl) deleteFileIfLocal(req.fileUrl);
    console.error('[Create Story Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan cerita.' });
  }
}

export async function updateStory(req, res) {
  try {
    const weddingId = req.wedding.id;
    const storyId = parseInt(req.params.id, 10);
    const { title, date_label, body, image_url, sort_order } = req.body;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Judul dan isi cerita wajib diisi.' });
    }

    // Fetch existing image to clean up if new file is uploaded
    const currentRes = await pool.query(
      'SELECT image_url FROM stories WHERE id = $1 AND wedding_id = $2',
      [storyId, weddingId]
    );

    if (currentRes.rowCount === 0) {
      if (req.fileUrl) deleteFileIfLocal(req.fileUrl);
      return res.status(404).json({ success: false, message: 'Cerita tidak ditemukan.' });
    }

    const oldImageUrl = currentRes.rows[0].image_url;
    let finalImageUrl = oldImageUrl;

    if (req.fileUrl) {
      finalImageUrl = req.fileUrl;
    } else if (image_url !== undefined) {
      finalImageUrl = image_url ? image_url.trim() : null;
    }

    const result = await pool.query(
      `UPDATE stories
       SET title = $1, date_label = $2, body = $3, image_url = $4, sort_order = $5
       WHERE id = $6 AND wedding_id = $7
       RETURNING *`,
      [
        title.trim(),
        date_label ? date_label.trim() : null,
        body.trim(),
        finalImageUrl,
        parseInt(sort_order, 10) || 0,
        storyId,
        weddingId,
      ]
    );

    if (req.fileUrl && oldImageUrl && oldImageUrl !== req.fileUrl) {
      deleteFileIfLocal(oldImageUrl);
    }

    return res.status(200).json({ success: true, message: 'Cerita berhasil diperbarui.', data: result.rows[0] });
  } catch (err) {
    if (req.fileUrl) deleteFileIfLocal(req.fileUrl);
    console.error('[Update Story Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui cerita.' });
  }
}

export async function deleteStory(req, res) {
  try {
    const weddingId = req.wedding.id;
    const storyId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM stories WHERE id = $1 AND wedding_id = $2 RETURNING image_url',
      [storyId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Cerita tidak ditemukan.' });
    }

    const deletedImage = result.rows[0]?.image_url;
    if (deletedImage) {
      deleteFileIfLocal(deletedImage);
    }

    return res.status(200).json({ success: true, message: 'Cerita berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete Story Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus cerita.' });
  }
}

export async function reorderStories(req, res) {
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
          'UPDATE stories SET sort_order = $1 WHERE id = $2 AND wedding_id = $3',
          [item.sort_order, item.id, weddingId]
        );
      }
    }
    await client.query('COMMIT');

    return res.status(200).json({ success: true, message: 'Urutan cerita berhasil diperbarui.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reorder Stories Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengurutkan cerita.' });
  } finally {
    client.release();
  }
}