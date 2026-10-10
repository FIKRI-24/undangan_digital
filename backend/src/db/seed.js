import pool from './pool.js';
import { seedAdmin } from './seedAdmin.js';

/**
 * Seed script for dummy wedding: raka-alya
 * Matches the neutral dummy identity configured in frontend/src/data/weddingConfig.js
 * Safe and idempotent: preserves existing real RSVPs and avoids duplicate seeds.
 */
async function seedWedding() {
  const client = await pool.connect();

  try {
    console.log('[Seed] Starting database seeding for wedding "raka-alya"...');
    await client.query('BEGIN');

    // 1. Check if wedding "raka-alya" already exists
    const existingWedding = await client.query(
      'SELECT id FROM weddings WHERE slug = $1',
      ['raka-alya']
    );

    let weddingId;

    const weddingData = [
      'raka-alya',
      'The Wedding of Raka & Alya',
      'Raka',
      'Raka Pratama, S.T.',
      'Bapak H. Bambang Sudiro',
      'Ibu Hj. Sri Wahyuni',
      'Putra pertama dari',
      'rakapratama',
      '/images/groom.svg',
      'Alya',
      'dr. Alya Putri Anandita',
      'Bapak Drs. H. Suryo Pranoto',
      'Ibu Hj. Endang Rahayu',
      'Putri kedua dari',
      'alyaputri',
      '/images/bride.svg',
      '/images/cover.svg',
      '/images/hero.svg',
      '/images/closing.svg',
      'We Found Love',
      'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
      'QS Ar-Rum : 21',
      'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta\'ala, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:',
      '/audio/wedding.mp3',
      'Asia/Jakarta',
      'active',
    ];

    if (existingWedding.rowCount > 0) {
      weddingId = existingWedding.rows[0].id;
      console.log(`[Seed] Updating existing wedding ID: ${weddingId}`);
      await client.query(
        `UPDATE weddings SET
          title = $2,
          groom_short_name = $3, groom_full_name = $4, groom_father = $5, groom_mother = $6, groom_family_label = $7, groom_instagram = $8, groom_photo = $9,
          bride_short_name = $10, bride_full_name = $11, bride_father = $12, bride_mother = $13, bride_family_label = $14, bride_instagram = $15, bride_photo = $16,
          cover_photo = $17, hero_photo = $18, closing_photo = $19,
          quote_title = $20, quote_text = $21, quote_source = $22,
          invitation_intro = $23, music_url = $24, timezone = $25, status = $26,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
        [weddingId, ...weddingData.slice(1)]
      );

      // Clean old child records for events, stories, gallery, gifts, gift_shipping
      await client.query('DELETE FROM events WHERE wedding_id = $1', [weddingId]);
      await client.query('DELETE FROM stories WHERE wedding_id = $1', [weddingId]);
      await client.query('DELETE FROM gallery WHERE wedding_id = $1', [weddingId]);
      await client.query('DELETE FROM gifts WHERE wedding_id = $1', [weddingId]);
      await client.query('DELETE FROM gift_shipping WHERE wedding_id = $1', [weddingId]);
    } else {
      const insertWeddingQuery = `
        INSERT INTO weddings (
          slug, title,
          groom_short_name, groom_full_name, groom_father, groom_mother, groom_family_label, groom_instagram, groom_photo,
          bride_short_name, bride_full_name, bride_father, bride_mother, bride_family_label, bride_instagram, bride_photo,
          cover_photo, hero_photo, closing_photo,
          quote_title, quote_text, quote_source,
          invitation_intro, music_url, timezone, status
        ) VALUES (
          $1, $2,
          $3, $4, $5, $6, $7, $8, $9,
          $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19,
          $20, $21, $22,
          $23, $24, $25, $26
        ) RETURNING id;
      `;
      const weddingRes = await client.query(insertWeddingQuery, weddingData);
      weddingId = weddingRes.rows[0].id;
      console.log(`[Seed] Created new wedding with ID: ${weddingId}`);
    }

    // 2. Insert events (Akad & Resepsi)
    const events = [
      {
        type: 'Akad Nikah',
        date: '2027-06-20',
        date_label: 'Minggu, 20 Juni 2027',
        start_time: '08.00',
        end_time: '10.00',
        end_time_label: '10.00 WIB',
        venue: 'Masjid Raya Baiturrahman',
        address: 'Jl. Khatib Sulaiman No. 88, Padang Utara, Kota Padang, Sumatera Barat',
        maps_url: 'https://maps.google.com/?q=Padang+Sumatera+Barat',
        sort_order: 1,
      },
      {
        type: 'Resepsi Pernikahan',
        date: '2027-06-20',
        date_label: 'Minggu, 20 Juni 2027',
        start_time: '11.00',
        end_time: '16.00',
        end_time_label: '16.00 WIB',
        venue: 'Grand Ballroom Balai Gadang',
        address: 'Jl. Jenderal Sudirman No. 45, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat',
        maps_url: 'https://maps.google.com/?q=Padang+Sumatera+Barat',
        sort_order: 2,
      },
    ];

    for (const evt of events) {
      await client.query(
        `INSERT INTO events (
          wedding_id, type, date, date_label, start_time, end_time, end_time_label,
          venue, address, maps_url, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          weddingId,
          evt.type,
          evt.date,
          evt.date_label,
          evt.start_time,
          evt.end_time,
          evt.end_time_label,
          evt.venue,
          evt.address,
          evt.maps_url,
          evt.sort_order,
        ]
      );
    }
    console.log(`[Seed] Inserted ${events.length} events.`);

    // 3. Insert stories
    const stories = [
      {
        title: 'Awal Bertemu',
        date_label: '14 Februari 2021',
        body: 'Pertama kali kami saling mengenal di bangku perkuliahan. Dari perbincangan sederhana mengenai tugas dan kesamaan hobi, ikatan persahabatan kami perlahan mulai bertumbuh menjadi kedekatan yang istimewa.',
        image_url: '/images/story-1.svg',
        sort_order: 1,
      },
      {
        title: 'Lamaran',
        date_label: '18 Oktober 2026',
        body: 'Setelah bertahun-tahun saling mengenal dan saling mendukung dalam suka maupun duka, dengan niat suci serta restu kedua keluarga tercinta, kami memutuskan untuk mengikat komitmen dalam prosesi lamaran yang khidmat.',
        image_url: '/images/story-2.svg',
        sort_order: 2,
      },
      {
        title: 'Menuju Halal',
        date_label: '20 Juni 2027',
        body: 'Hari yang penuh doa dan harapan, saat kami mengikrarkan janji suci di hadapan Allah SWT dan disaksikan orang-orang tercinta untuk bersama mengarungi samudera rumah tangga yang sakinah, mawaddah, warahmah.',
        image_url: '/images/story-3.svg',
        sort_order: 3,
      },
    ];

    for (const st of stories) {
      await client.query(
        `INSERT INTO stories (wedding_id, title, date_label, body, image_url, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [weddingId, st.title, st.date_label, st.body, st.image_url, st.sort_order]
      );
    }
    console.log(`[Seed] Inserted ${stories.length} stories.`);

    // 4. Insert gallery
    const gallery = [
      {
        image_url: '/images/gallery-1.svg',
        alt_text: 'Foto Prewedding Raka & Alya 1',
        width: 1200,
        height: 1600,
        object_position: '50% 50%',
        sort_order: 1,
      },
      {
        image_url: '/images/gallery-2.svg',
        alt_text: 'Foto Prewedding Raka & Alya 2',
        width: 1200,
        height: 1600,
        object_position: '50% 50%',
        sort_order: 2,
      },
      {
        image_url: '/images/gallery-3.svg',
        alt_text: 'Foto Prewedding Raka & Alya 3',
        width: 1600,
        height: 1066,
        object_position: '50% 50%',
        sort_order: 3,
      },
      {
        image_url: '/images/gallery-4.svg',
        alt_text: 'Foto Prewedding Raka & Alya 4',
        width: 1200,
        height: 1600,
        object_position: '50% 50%',
        sort_order: 4,
      },
    ];

    for (const g of gallery) {
      await client.query(
        `INSERT INTO gallery (wedding_id, image_url, alt_text, width, height, object_position, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [weddingId, g.image_url, g.alt_text, g.width, g.height, g.object_position, g.sort_order]
      );
    }
    console.log(`[Seed] Inserted ${gallery.length} gallery items.`);

    // 5. Insert gifts
    const gifts = [
      {
        type: 'bank',
        provider: 'MANDIRI',
        account_holder: 'Raka Pratama',
        account_number: '1110012345678',
        logo_url: '/images/bank-mandiri.svg',
        sort_order: 1,
      },
      {
        type: 'bank',
        provider: 'BCA',
        account_holder: 'dr. Alya Putri Anandita',
        account_number: '8720192831',
        logo_url: '/images/bank-bca.svg',
        sort_order: 2,
      },
      {
        type: 'ewallet',
        provider: 'DANA',
        account_holder: 'Alya Putri',
        account_number: '081234567890',
        logo_url: '/images/dana.svg',
        sort_order: 3,
      },
    ];

    for (const gf of gifts) {
      await client.query(
        `INSERT INTO gifts (wedding_id, type, provider, account_holder, account_number, logo_url, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [weddingId, gf.type, gf.provider, gf.account_holder, gf.account_number, gf.logo_url, gf.sort_order]
      );
    }
    console.log(`[Seed] Inserted ${gifts.length} gift options.`);

    // 6. Insert gift shipping
    await client.query(
      `INSERT INTO gift_shipping (wedding_id, recipient, phone, address)
       VALUES ($1, $2, $3, $4)`,
      [
        weddingId,
        'Raka Pratama & Alya Putri',
        '0812-3456-7890',
        'Jl. Mawar Indah No. 45, RT 02 / RW 05, Kel. Flamboyan Baru, Kec. Padang Barat, Kota Padang, Sumatera Barat 25114',
      ]
    );
    console.log('[Seed] Inserted gift shipping details.');

    // 7. Idempotent Sample RSVPs (Requirement 5)
    // Only insert initial sample wishes if no RSVPs exist yet for this wedding
    const rsvpCountRes = await client.query(
      'SELECT COUNT(*)::int AS count FROM rsvps WHERE wedding_id = $1',
      [weddingId]
    );

    if (rsvpCountRes.rows[0].count === 0) {
      console.log('[Seed] No existing RSVPs found. Inserting initial sample wishes...');
      const sampleRsvps = [
        {
          name: 'Dimas & Sarah',
          attendance: 'hadir',
          guest_count: 2,
          message: 'Selamat untuk Raka & Alya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
          time_offset_hours: 2,
        },
        {
          name: 'Farhan K.',
          attendance: 'hadir',
          guest_count: 1,
          message: 'Barakallahu lakuma wa baraka alaikuma wa jama\'a bainakuma fii khair. Lancar sampai hari H ya Raka & Alya!',
          time_offset_hours: 5,
        },
        {
          name: 'Rina Amelia',
          attendance: 'tidak_hadir',
          guest_count: null,
          message: 'Selamat menempuh hidup baru Alya & Mas Raka. Maaf sekali belum bisa hadir langsung, doa terbaik dari jauh untuk kebahagiaan kalian!',
          time_offset_hours: 24,
        },
        {
          name: 'Aditya Pratama',
          attendance: 'ragu',
          guest_count: null,
          message: 'Selamat ya bro Raka! Insya Allah diusahakan hadir jika jadwal dinas memungkinkan.',
          time_offset_hours: 48,
        },
      ];

      for (const item of sampleRsvps) {
        await client.query(
          `INSERT INTO rsvps (
            wedding_id, name, attendance, guest_count, message, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            CURRENT_TIMESTAMP - ($6 * INTERVAL '1 hour'),
            CURRENT_TIMESTAMP - ($6 * INTERVAL '1 hour')
          )`,
          [weddingId, item.name, item.attendance, item.guest_count, item.message, item.time_offset_hours]
        );
      }
      console.log(`[Seed] Inserted ${sampleRsvps.length} sample RSVPs.`);
    } else {
      console.log(`[Seed] Wedding already has ${rsvpCountRes.rows[0].count} RSVPs. Skipping sample RSVP creation to preserve user data.`);
    }

    await client.query('COMMIT');
    console.log('[Seed] Database seeding completed successfully!');

    // Seed default admin account if not exists
    await seedAdmin();
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Seed Error]: Seeding transaction rolled back:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedWedding();
