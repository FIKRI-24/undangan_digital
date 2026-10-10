import pool from '../db/pool.js';

/**
 * Wedding Service
 * Handles data fetching with parameterized queries according to PRD Section 8, 9, 30.
 */
export async function getWeddingBySlug(slug) {
  // 1. Fetch wedding base record
  let weddingRes = await pool.query(
    `SELECT
      id, slug, title,
      groom_short_name, groom_full_name, groom_father, groom_mother, groom_family_label, groom_instagram, groom_photo,
      bride_short_name, bride_full_name, bride_father, bride_mother, bride_family_label, bride_instagram, bride_photo,
      cover_photo, hero_photo, closing_photo,
      quote_title, quote_text, quote_source,
      invitation_intro, music_url, timezone, status, theme_config
    FROM weddings
    WHERE slug = $1 AND status = 'active'
    LIMIT 1`,
    [slug]
  );

  // Fallback to active wedding if specific slug not found (e.g. root URL or default slug)
  if (weddingRes.rowCount === 0) {
    weddingRes = await pool.query(
      `SELECT
        id, slug, title,
        groom_short_name, groom_full_name, groom_father, groom_mother, groom_family_label, groom_instagram, groom_photo,
        bride_short_name, bride_full_name, bride_father, bride_mother, bride_family_label, bride_instagram, bride_photo,
        cover_photo, hero_photo, closing_photo,
        quote_title, quote_text, quote_source,
        invitation_intro, music_url, timezone, status, theme_config
      FROM weddings
      WHERE status = 'active'
      ORDER BY id ASC
      LIMIT 1`
    );
  }

  if (weddingRes.rowCount === 0) {
    return null;
  }

  const w = weddingRes.rows[0];
  const weddingId = w.id;

  // 2. Fetch events ordered by sort_order ASC, id ASC
  // Format date as YYYY-MM-DD to avoid UTC conversion shifts (PRD Section 24)
  const eventsRes = await pool.query(
    `SELECT
      id, type,
      TO_CHAR(date, 'YYYY-MM-DD') AS date,
      date_label, start_time, end_time, end_time_label,
      venue, address, maps_url, sort_order
    FROM events
    WHERE wedding_id = $1
    ORDER BY sort_order ASC, id ASC`,
    [weddingId]
  );

  // 3. Fetch stories ordered by sort_order ASC, id ASC
  const storiesRes = await pool.query(
    `SELECT id, title, date_label, body, image_url, sort_order
    FROM stories
    WHERE wedding_id = $1
    ORDER BY sort_order ASC, id ASC`,
    [weddingId]
  );

  // 4. Fetch gallery ordered by sort_order ASC, id ASC
  const galleryRes = await pool.query(
    `SELECT id, image_url, alt_text, width, height, object_position, sort_order
    FROM gallery
    WHERE wedding_id = $1
    ORDER BY sort_order ASC, id ASC`,
    [weddingId]
  );

  // 5. Fetch gifts ordered by sort_order ASC, id ASC
  const giftsRes = await pool.query(
    `SELECT id, type, provider, account_holder, account_number, logo_url, sort_order
    FROM gifts
    WHERE wedding_id = $1
    ORDER BY sort_order ASC, id ASC`,
    [weddingId]
  );

  // 6. Fetch shipping gift address
  const shippingRes = await pool.query(
    `SELECT id, recipient, phone, address
    FROM gift_shipping
    WHERE wedding_id = $1
    LIMIT 1`,
    [weddingId]
  );

  const shipping = shippingRes.rowCount > 0 ? shippingRes.rows[0] : null;

  // Assemble clean, structured payload according to PRD contract
  return {
    wedding: {
      id: w.id,
      slug: w.slug,
      title: w.title,
      timezone: w.timezone,
      cover_photo: w.cover_photo,
      hero_photo: w.hero_photo,
      closing_photo: w.closing_photo,
      music_url: w.music_url,
      invitation_intro: w.invitation_intro,
      theme_config: w.theme_config || {},
    },
    theme_config: w.theme_config || {},
    couple: {
      groom: {
        short_name: w.groom_short_name,
        full_name: w.groom_full_name,
        family_label: w.groom_family_label,
        father: w.groom_father,
        mother: w.groom_mother,
        instagram: w.groom_instagram,
        photo: w.groom_photo,
      },
      bride: {
        short_name: w.bride_short_name,
        full_name: w.bride_full_name,
        family_label: w.bride_family_label,
        father: w.bride_father,
        mother: w.bride_mother,
        instagram: w.bride_instagram,
        photo: w.bride_photo,
      },
    },
    quote: {
      title: w.quote_title,
      text: w.quote_text,
      source: w.quote_source,
    },
    events: eventsRes.rows,
    stories: storiesRes.rows,
    gallery: galleryRes.rows,
    gifts: giftsRes.rows,
    gift_shipping: shipping,
  };
}
