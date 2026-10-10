import pool from '../db/pool.js';
import { deleteFileIfLocal } from '../services/storageService.js';

export async function getGallery(req, res) {
  try {
    const weddingId = req.wedding.id;
    const result = await pool.query(
      'SELECT * FROM gallery WHERE wedding_id = $1 ORDER BY sort_order ASC, id ASC',
      [weddingId]
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[Get Gallery Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memuat galeri foto.' });
  }
}

export async function createGallery(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { alt_text, object_position, sort_order, image_url } = req.body;

    const finalImageUrl = req.fileUrl || (image_url ? image_url.trim() : null);

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'File gambar wajib diunggah atau berikan URL gambar.',
      });
    }

    const result = await pool.query(
      `INSERT INTO gallery (wedding_id, image_url, alt_text, object_position, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        weddingId,
        finalImageUrl,
        alt_text ? alt_text.trim() : 'Foto Galeri Pernikahan',
        object_position ? object_position.trim() : '50% 50%',
        parseInt(sort_order, 10) || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Foto berhasil ditambahkan ke galeri.',
      data: result.rows[0],
    });
  } catch (err) {
    if (req.fileUrl) deleteFileIfLocal(req.fileUrl);
    console.error('[Create Gallery Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan foto ke galeri.' });
  }
}

export async function updateGallery(req, res) {
  try {
    const weddingId = req.wedding.id;
    const galleryId = parseInt(req.params.id, 10);
    const { alt_text, object_position, sort_order } = req.body;

    const result = await pool.query(
      `UPDATE gallery
       SET alt_text = COALESCE($1, alt_text),
           object_position = COALESCE($2, object_position),
           sort_order = COALESCE($3, sort_order)
       WHERE id = $4 AND wedding_id = $5
       RETURNING *`,
      [
        alt_text !== undefined ? alt_text.trim() : null,
        object_position !== undefined ? object_position.trim() : null,
        sort_order !== undefined ? parseInt(sort_order, 10) : null,
        galleryId,
        weddingId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Foto galeri tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Data foto galeri berhasil diperbarui.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('[Update Gallery Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui data galeri.' });
  }
}

export async function deleteGallery(req, res) {
  try {
    const weddingId = req.wedding.id;
    const galleryId = parseInt(req.params.id, 10);

    const result = await pool.query(
      'DELETE FROM gallery WHERE id = $1 AND wedding_id = $2 RETURNING image_url',
      [galleryId, weddingId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Foto galeri tidak ditemukan.' });
    }

    const deletedImage = result.rows[0]?.image_url;
    if (deletedImage) {
      deleteFileIfLocal(deletedImage);
    }

    return res.status(200).json({ success: true, message: 'Foto galeri berhasil dihapus.' });
  } catch (err) {
    console.error('[Delete Gallery Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus foto galeri.' });
  }
}

export async function reorderGallery(req, res) {
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
          'UPDATE gallery SET sort_order = $1 WHERE id = $2 AND wedding_id = $3',
          [item.sort_order, item.id, weddingId]
        );
      }
    }
    await client.query('COMMIT');

    return res.status(200).json({ success: true, message: 'Urutan galeri berhasil diperbarui.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reorder Gallery Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengurutkan galeri.' });
  } finally {
    client.release();
  }
}