import pool from '../db/pool.js';
import { deleteFileIfLocal } from '../services/storageService.js';

const RESERVED_SLUGS = [
  'admin',
  'api',
  'login',
  'logout',
  'uploads',
  'assets',
  'images',
  'ornaments',
  'audio',
  'favicon',
  'dashboard',
  'settings',
];

export async function getAdminWedding(req, res) {
  try {
    const weddingId = req.wedding.id;

    // Fetch full wedding row
    const weddingRes = await pool.query(
      'SELECT * FROM weddings WHERE id = $1',
      [weddingId]
    );

    if (weddingRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data wedding tidak ditemukan.',
      });
    }

    const row = weddingRes.rows[0];

    // Fetch counts for dashboard stats
    const [eventsRes, storiesRes, galleryRes, giftsRes, guestsRes, rsvpsRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM events WHERE wedding_id = $1', [weddingId]),
      pool.query('SELECT COUNT(*) FROM stories WHERE wedding_id = $1', [weddingId]),
      pool.query('SELECT COUNT(*) FROM gallery WHERE wedding_id = $1', [weddingId]),
      pool.query('SELECT COUNT(*) FROM gifts WHERE wedding_id = $1', [weddingId]),
      pool.query('SELECT COUNT(*) FROM guests WHERE wedding_id = $1', [weddingId]),
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
        wedding: row,
        stats: {
          eventsCount: parseInt(eventsRes.rows[0].count, 10),
          storiesCount: parseInt(storiesRes.rows[0].count, 10),
          galleryCount: parseInt(galleryRes.rows[0].count, 10),
          giftsCount: parseInt(giftsRes.rows[0].count, 10),
          guestsCount: parseInt(guestsRes.rows[0].count, 10),
          rsvp: {
            total: parseInt(rsvpsRes.rows[0].total, 10),
            hadir: parseInt(rsvpsRes.rows[0].hadir, 10),
            tidak_hadir: parseInt(rsvpsRes.rows[0].tidak_hadir, 10),
            ragu: parseInt(rsvpsRes.rows[0].ragu, 10),
          },
        },
      },
    });
  } catch (err) {
    console.error('[Get Admin Wedding Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data wedding.',
    });
  }
}

export async function updateBasicSettings(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { title, slug, timezone, status } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Judul dan slug wedding wajib diisi.',
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase();

    // 1. Slug format validation: lowercase, numbers, hyphens
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: 'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-), contoh: ryan-widya.',
      });
    }

    // 2. Reserved slug validation
    if (RESERVED_SLUGS.includes(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: `Slug "${cleanSlug}" adalah kata yang dicadangkan sistem. Silakan gunakan slug lain.`,
      });
    }

    // 3. Uniqueness check
    const existing = await pool.query(
      'SELECT id FROM weddings WHERE slug = $1 AND id != $2',
      [cleanSlug, weddingId]
    );

    if (existing.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Slug "${cleanSlug}" telah digunakan oleh data lain.`,
      });
    }

    const updateRes = await pool.query(
      `UPDATE weddings
       SET title = $1, slug = $2, timezone = $3, status = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, title, slug, timezone, status, updated_at`,
      [title.trim(), cleanSlug, timezone || 'Asia/Jakarta', status || 'active', weddingId]
    );

    return res.status(200).json({
      success: true,
      message: 'Pengaturan dasar wedding berhasil diperbarui.',
      data: updateRes.rows[0],
    });
  } catch (err) {
    console.error('[Update Basic Settings Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui pengaturan dasar wedding.',
    });
  }
}

export async function updateCouple(req, res) {
  try {
    const weddingId = req.wedding.id;
    const {
      groom_short_name,
      groom_full_name,
      groom_father,
      groom_mother,
      groom_family_label,
      groom_instagram,
      bride_short_name,
      bride_full_name,
      bride_father,
      bride_mother,
      bride_family_label,
      bride_instagram,
      invitation_intro,
    } = req.body;

    if (!groom_short_name || !groom_full_name || !bride_short_name || !bride_full_name) {
      return res.status(400).json({
        success: false,
        message: 'Nama pendek dan nama lengkap kedua mempelai wajib diisi.',
      });
    }

    const updateRes = await pool.query(
      `UPDATE weddings
       SET groom_short_name = $1,
           groom_full_name = $2,
           groom_father = $3,
           groom_mother = $4,
           groom_family_label = $5,
           groom_instagram = $6,
           bride_short_name = $7,
           bride_full_name = $8,
           bride_father = $9,
           bride_mother = $10,
           bride_family_label = $11,
           bride_instagram = $12,
           invitation_intro = $13,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $14
       RETURNING id, groom_short_name, groom_full_name, bride_short_name, bride_full_name, updated_at`,
      [
        groom_short_name.trim(),
        groom_full_name.trim(),
        groom_father ? groom_father.trim() : null,
        groom_mother ? groom_mother.trim() : null,
        groom_family_label ? groom_family_label.trim() : null,
        groom_instagram ? groom_instagram.trim().replace(/^@/, '') : null,
        bride_short_name.trim(),
        bride_full_name.trim(),
        bride_father ? bride_father.trim() : null,
        bride_mother ? bride_mother.trim() : null,
        bride_family_label ? bride_family_label.trim() : null,
        bride_instagram ? bride_instagram.trim().replace(/^@/, '') : null,
        invitation_intro ? invitation_intro.trim() : null,
        weddingId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Data mempelai berhasil diperbarui.',
      data: updateRes.rows[0],
    });
  } catch (err) {
    console.error('[Update Couple Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data mempelai.',
    });
  }
}

export async function updateQuote(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { quote_title, quote_text, quote_source } = req.body;

    const updateRes = await pool.query(
      `UPDATE weddings
       SET quote_title = $1, quote_text = $2, quote_source = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, quote_title, quote_text, quote_source, updated_at`,
      [
        quote_title ? quote_title.trim() : 'We Found Love',
        quote_text ? quote_text.trim() : '',
        quote_source ? quote_source.trim() : '',
        weddingId,
      ]
    );

    return res.status(200).json({
      success: true,
      message: 'Quote / ayat pernikahan berhasil diperbarui.',
      data: updateRes.rows[0],
    });
  } catch (err) {
    console.error('[Update Quote Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui quote pernikahan.',
    });
  }
}

export async function uploadMainPhoto(req, res) {
  const photoType = req.body.photo_type || req.query.photo_type;
  const ALLOWED_PHOTO_TYPES = ['cover', 'hero', 'groom', 'bride', 'closing'];

  if (!ALLOWED_PHOTO_TYPES.includes(photoType)) {
    // Delete newly uploaded file since request is invalid
    deleteFileIfLocal(req.fileUrl);
    return res.status(400).json({
      success: false,
      message: `Tipe foto "${photoType}" tidak valid. Pilihan: ${ALLOWED_PHOTO_TYPES.join(', ')}.`,
    });
  }

  const columnMap = {
    cover: 'cover_photo',
    hero: 'hero_photo',
    groom: 'groom_photo',
    bride: 'bride_photo',
    closing: 'closing_photo',
  };
  const targetColumn = columnMap[photoType];

  try {
    const weddingId = req.wedding.id;

    // 1. Fetch current file URL to clean up old file afterwards
    const currentRes = await pool.query(
      `SELECT ${targetColumn} FROM weddings WHERE id = $1`,
      [weddingId]
    );
    const oldUrl = currentRes.rows[0]?.[targetColumn];

    // 2. Update database with new file URL
    await pool.query(
      `UPDATE weddings SET ${targetColumn} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [req.fileUrl, weddingId]
    );

    // 3. Database update succeeded! Now safely clean up old file if it was a managed upload
    if (oldUrl && oldUrl !== req.fileUrl) {
      deleteFileIfLocal(oldUrl);
    }

    return res.status(200).json({
      success: true,
      message: `Foto ${photoType} berhasil diperbarui.`,
      data: {
        photoType,
        url: req.fileUrl,
      },
    });
  } catch (err) {
    // If DB update failed, delete the newly uploaded file to avoid orphan files
    deleteFileIfLocal(req.fileUrl);
    console.error('[Upload Main Photo Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui foto di database.',
    });
  }
}

export async function uploadMusic(req, res) {
  try {
    const weddingId = req.wedding.id;

    // 1. Fetch old music URL
    const currentRes = await pool.query(
      'SELECT music_url FROM weddings WHERE id = $1',
      [weddingId]
    );
    const oldUrl = currentRes.rows[0]?.music_url;

    // 2. Update database with new music URL
    await pool.query(
      'UPDATE weddings SET music_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [req.fileUrl, weddingId]
    );

    // 3. Delete old file if managed upload
    if (oldUrl && oldUrl !== req.fileUrl) {
      deleteFileIfLocal(oldUrl);
    }

    return res.status(200).json({
      success: true,
      message: 'File musik latar berhasil diperbarui.',
      data: {
        url: req.fileUrl,
      },
    });
  } catch (err) {
    deleteFileIfLocal(req.fileUrl);
    console.error('[Upload Music Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui musik di database.',
    });
  }
}

export async function updateThemeConfig(req, res) {
  try {
    const weddingId = req.wedding.id;
    const { theme_config } = req.body;

    if (!theme_config || typeof theme_config !== 'object' || Array.isArray(theme_config)) {
      return res.status(400).json({
        success: false,
        message: 'Format konfigurasi tema (theme_config) tidak valid.',
      });
    }

    const updateRes = await pool.query(
      `UPDATE weddings
       SET theme_config = $1::jsonb, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, slug, title, theme_config, updated_at`,
      [JSON.stringify(theme_config), weddingId]
    );

    return res.status(200).json({
      success: true,
      message: 'Tampilan & tema undangan berhasil disimpan.',
      data: updateRes.rows[0],
    });
  } catch (err) {
    console.error('[Update Theme Config Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan konfigurasi tampilan undangan.',
    });
  }
}

export async function listWeddings(req, res) {
  try {
    const weddingsRes = await pool.query(
      `SELECT
         w.id,
         w.slug,
         w.title,
         w.groom_short_name,
         w.groom_full_name,
         w.bride_short_name,
         w.bride_full_name,
         w.cover_photo,
         w.hero_photo,
         w.timezone,
         w.status,
         w.theme_config,
         w.created_at,
         w.updated_at,
         (SELECT COUNT(*)::int FROM guests g WHERE g.wedding_id = w.id) AS guests_count,
         (SELECT COUNT(*)::int FROM rsvps r WHERE r.wedding_id = w.id) AS rsvps_count,
         (SELECT COUNT(*)::int FROM events e WHERE e.wedding_id = w.id) AS events_count,
         (SELECT TO_CHAR(e.date, 'YYYY-MM-DD') FROM events e WHERE e.wedding_id = w.id ORDER BY e.sort_order ASC, e.id ASC LIMIT 1) AS primary_date
       FROM weddings w
       ORDER BY w.id ASC`
    );

    return res.status(200).json({
      success: true,
      data: {
        weddings: weddingsRes.rows,
        activeWeddingId: req.wedding?.id || null,
      },
    });
  } catch (err) {
    console.error('[List Weddings Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memuat daftar undangan klien.',
    });
  }
}

export async function createWedding(req, res) {
  const client = await pool.connect();
  try {
    const {
      slug,
      title,
      groom_short_name,
      groom_full_name,
      bride_short_name,
      bride_full_name,
      timezone = 'Asia/Jakarta',
      theme_config = {},
      clone_from_id = null,
    } = req.body;

    if (!slug || !groom_short_name || !bride_short_name) {
      return res.status(400).json({
        success: false,
        message: 'Slug, nama panggilan mempelai pria, dan nama panggilan mempelai wanita wajib diisi.',
      });
    }

    const cleanSlug = String(slug).trim().toLowerCase();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: 'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-).',
      });
    }

    if (RESERVED_SLUGS.includes(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: `Slug "${cleanSlug}" dicadangkan oleh sistem. Gunakan nama lain.`,
      });
    }

    const existing = await client.query('SELECT id FROM weddings WHERE slug = $1', [cleanSlug]);
    if (existing.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Slug "${cleanSlug}" sudah digunakan oleh klien lain.`,
      });
    }

    const cleanGroomShort = groom_short_name.trim();
    const cleanBrideShort = bride_short_name.trim();
    const cleanGroomFull = (groom_full_name || cleanGroomShort).trim();
    const cleanBrideFull = (bride_full_name || cleanBrideShort).trim();
    const cleanTitle = (title || `The Wedding of ${cleanGroomShort} & ${cleanBrideShort}`).trim();

    await client.query('BEGIN');

    let sourceWedding = null;
    if (clone_from_id) {
      const srcRes = await client.query('SELECT * FROM weddings WHERE id = $1', [clone_from_id]);
      if (srcRes.rowCount > 0) {
        sourceWedding = srcRes.rows[0];
      }
    }

    const finalThemeConfig =
      theme_config && Object.keys(theme_config).length > 0
        ? theme_config
        : sourceWedding?.theme_config || { preset: 'minang_burgundy' };

    const insertWeddingRes = await client.query(
      `INSERT INTO weddings (
        slug, title,
        groom_short_name, groom_full_name, groom_father, groom_mother, groom_family_label, groom_instagram, groom_photo,
        bride_short_name, bride_full_name, bride_father, bride_mother, bride_family_label, bride_instagram, bride_photo,
        cover_photo, hero_photo, closing_photo,
        quote_title, quote_text, quote_source,
        invitation_intro, music_url, timezone, status, theme_config
      ) VALUES (
        $1, $2,
        $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19,
        $20, $21, $22,
        $23, $24, $25, 'active', $26::jsonb
      )
      RETURNING *`,
      [
        cleanSlug,
        cleanTitle,
        cleanGroomShort,
        cleanGroomFull,
        sourceWedding?.groom_father || 'Bapak Mempelai Pria',
        sourceWedding?.groom_mother || 'Ibu Mempelai Pria',
        sourceWedding?.groom_family_label || 'Putra pertama dari',
        '',
        sourceWedding?.groom_photo || '/images/groom.svg',
        cleanBrideShort,
        cleanBrideFull,
        sourceWedding?.bride_father || 'Bapak Mempelai Wanita',
        sourceWedding?.bride_mother || 'Ibu Mempelai Wanita',
        sourceWedding?.bride_family_label || 'Putri pertama dari',
        '',
        sourceWedding?.bride_photo || '/images/bride.svg',
        sourceWedding?.cover_photo || '/images/cover.svg',
        sourceWedding?.hero_photo || '/images/hero.svg',
        sourceWedding?.closing_photo || '/images/closing.svg',
        sourceWedding?.quote_title || 'We Found Love',
        sourceWedding?.quote_text ||
          'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        sourceWedding?.quote_source || 'QS Ar-Rum : 21',
        sourceWedding?.invitation_intro ||
          'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami:',
        sourceWedding?.music_url || '/audio/wedding.mp3',
        timezone || 'Asia/Jakarta',
        JSON.stringify(finalThemeConfig),
      ]
    );

    const newWedding = insertWeddingRes.rows[0];

    if (sourceWedding) {
      // Clone events
      await client.query(
        `INSERT INTO events (wedding_id, type, date, date_label, start_time, end_time, end_time_label, venue, address, maps_url, sort_order)
         SELECT $1, type, date, date_label, start_time, end_time, end_time_label, venue, address, maps_url, sort_order
         FROM events WHERE wedding_id = $2`,
        [newWedding.id, sourceWedding.id]
      );
      // Clone stories
      await client.query(
        `INSERT INTO stories (wedding_id, title, date_label, body, image_url, sort_order)
         SELECT $1, title, date_label, body, image_url, sort_order
         FROM stories WHERE wedding_id = $2`,
        [newWedding.id, sourceWedding.id]
      );
      // Clone gallery
      await client.query(
        `INSERT INTO gallery (wedding_id, image_url, alt_text, width, height, object_position, sort_order)
         SELECT $1, image_url, alt_text, width, height, object_position, sort_order
         FROM gallery WHERE wedding_id = $2`,
        [newWedding.id, sourceWedding.id]
      );
    } else {
      // Seed default starter events & stories for new client
      await client.query(
        `INSERT INTO events (wedding_id, type, date, date_label, start_time, end_time_label, venue, address, maps_url, sort_order)
         VALUES
           ($1, 'Akad Nikah', '2026-12-12', 'Sabtu, 12 Desember 2026', '08.00 WIB', '10.00 WIB', 'Masjid Agung / Ballroom Utama', 'Jl. Jend. Sudirman No. 1, Jakarta', 'https://maps.google.com', 1),
           ($1, 'Resepsi Pernikahan', '2026-12-12', 'Sabtu, 12 Desember 2026', '11.00 WIB', 'Selesai', 'Grand Ballroom Hotel', 'Jl. Jend. Sudirman No. 1, Jakarta', 'https://maps.google.com', 2)`,
        [newWedding.id]
      );

      await client.query(
        `INSERT INTO stories (wedding_id, title, date_label, body, image_url, sort_order)
         VALUES
           ($1, 'Awal Bertemu', '2023', 'Pertemuan pertama yang membawa kesan mendalam dan menjadi awal perjalanan kisah kami.', '/images/story-1.svg', 1),
           ($1, 'Lamaran', '2025', 'Dengan restu kedua keluarga besar, kami mengikat janji untuk melangkah ke jenjang pernikahan.', '/images/story-2.svg', 2),
           ($1, 'Menikah', '2026', 'Hari bahagia di mana kami menyatukan janji suci dalam ikatan pernikahan.', '/images/story-3.svg', 3)`,
        [newWedding.id]
      );
    }

    // Automatically switch admin's managed wedding to the newly created client
    await client.query(
      'UPDATE admins SET managed_wedding_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newWedding.id, req.admin.id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: `Undangan klien "${cleanTitle}" (/${cleanSlug}) berhasil dibuat!`,
      data: newWedding,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Create Wedding Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat undangan klien baru.',
    });
  } finally {
    client.release();
  }
}

export async function selectWedding(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID undangan tidak valid.',
      });
    }

    const weddingRes = await pool.query(
      'SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config FROM weddings WHERE id = $1 LIMIT 1',
      [targetId]
    );

    if (weddingRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data undangan klien tidak ditemukan.',
      });
    }

    await pool.query(
      'UPDATE admins SET managed_wedding_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [targetId, req.admin.id]
    );

    return res.status(200).json({
      success: true,
      message: `Beralih ke pengelolaan undangan "${weddingRes.rows[0].title}".`,
      data: weddingRes.rows[0],
    });
  } catch (err) {
    console.error('[Select Wedding Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal memilih undangan klien.',
    });
  }
}

export async function deleteWedding(req, res) {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID undangan tidak valid.',
      });
    }

    const countRes = await pool.query('SELECT COUNT(*)::int AS total FROM weddings');
    if (countRes.rows[0].total <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus satu-satunya data undangan yang tersisa di sistem.',
      });
    }

    const delRes = await pool.query(
      'DELETE FROM weddings WHERE id = $1 RETURNING id, slug, title',
      [targetId]
    );

    if (delRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data undangan tidak ditemukan.',
      });
    }

    // Fallback to another wedding if the deleted wedding was currently selected
    const remainingRes = await pool.query(
      'SELECT id, slug, title, groom_short_name, bride_short_name, status, theme_config FROM weddings ORDER BY id ASC LIMIT 1'
    );
    const nextWedding = remainingRes.rows[0] || null;

    if (nextWedding) {
      await pool.query(
        'UPDATE admins SET managed_wedding_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [nextWedding.id, req.admin.id]
      );
    }

    return res.status(200).json({
      success: true,
      message: `Undangan "${delRes.rows[0].title}" berhasil dihapus.`,
      data: {
        deleted: delRes.rows[0],
        activeWedding: nextWedding,
      },
    });
  } catch (err) {
    console.error('[Delete Wedding Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus undangan klien.',
    });
  }
}