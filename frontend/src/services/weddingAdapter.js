import { resolveAssetUrl } from '../utils/assetUrl.js';
import { normalizeThemeConfig } from '../utils/themePresets.js';

export { resolveAssetUrl };

const EDITORIAL_PHOTO_FALLBACKS = {
  '/images/cover.svg': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  '/images/hero.svg': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  '/images/closing.svg': 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
  '/images/groom.svg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85',
  '/images/bride.svg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  '/images/story-1.svg': 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85',
  '/images/story-2.svg': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85',
  '/images/story-3.svg': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
  '/images/gallery-1.svg': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
  '/images/gallery-2.svg': 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
  '/images/gallery-3.svg': 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
  '/images/gallery-4.svg': 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=85',
};

function resolveEditorialPhoto(rawPath, defaultKey) {
  const path = rawPath || defaultKey;
  if (EDITORIAL_PHOTO_FALLBACKS[path]) {
    return EDITORIAL_PHOTO_FALLBACKS[path];
  }
  return resolveAssetUrl(path);
}

/**
 * Wedding Data Adapter
 * Based on PRD Section 16 (DATA ADAPTER)
 *
 * Normalizes backend API response (snake_case/PostgreSQL schema)
 * into the camelCase UI structure expected by Phase 1-3 components.
 */
export function adaptWeddingApi(apiData) {
  if (!apiData) return null;

  const { wedding, couple, quote, events = [], stories = [], gallery = [], gifts = [], gift_shipping, theme_config } = apiData;
  const rawTheme = theme_config || wedding?.theme_config || {};
  const themeConfig = normalizeThemeConfig(rawTheme);

  const groom = couple?.groom || {};
  const bride = couple?.bride || {};

  // Extract earliest event date & time for countdown calculation
  const primaryEvent = events[0] || {};
  let targetDateTime = '2027-06-20T08:00:00+07:00';
  let dateDisplay = '20 . 06 . 2027';
  let dateFull = 'Minggu, 20 Juni 2027';

  if (primaryEvent.date) {
    const [year, month, day] = primaryEvent.date.split('-');
    dateDisplay = `${day} . ${month} . ${year}`;
    dateFull = primaryEvent.date_label || dateFull;
    const timeFormatted = (primaryEvent.start_time || '08.00').replace('.', ':');
    targetDateTime = `${primaryEvent.date}T${timeFormatted}:00+07:00`;
  }

  // Derive initials
  const initialsGroom = groom.short_name ? groom.short_name.charAt(0).toUpperCase() : 'R';
  const initialsBride = bride.short_name ? bride.short_name.charAt(0).toUpperCase() : 'A';

  return {
    id: wedding?.id,
    slug: wedding?.slug || 'raka-alya',
    title: wedding?.title || `${groom.short_name} & ${bride.short_name}`,
    dateDisplay,
    dateFull,
    initialsGroom,
    initialsBride,
    themeConfig,

    // Photos
    heroPhoto: resolveEditorialPhoto(wedding?.hero_photo, '/images/hero.svg'),
    coverPhoto: resolveEditorialPhoto(wedding?.cover_photo, '/images/cover.svg'),
    closingPhoto: resolveEditorialPhoto(wedding?.closing_photo, '/images/closing.svg'),

    // Audio config
    music: {
      title: 'Instrumental Romantic Wedding',
      url: resolveAssetUrl(wedding?.music_url || '/audio/wedding.mp3'),
    },

    // Groom Details
    groom: {
      shortName: groom.short_name || 'Raka',
      fullName: groom.full_name || '',
      familyLabel: groom.family_label || 'Putra dari',
      father: groom.father || '',
      mother: groom.mother || '',
      instagram: groom.instagram || '',
      instagramUrl: groom.instagram ? `https://instagram.com/${groom.instagram}` : '',
      photo: resolveEditorialPhoto(groom.photo, '/images/groom.svg'),
    },

    // Bride Details
    bride: {
      shortName: bride.short_name || 'Alya',
      fullName: bride.full_name || '',
      familyLabel: bride.family_label || 'Putri dari',
      father: bride.father || '',
      mother: bride.mother || '',
      instagram: bride.instagram || '',
      instagramUrl: bride.instagram ? `https://instagram.com/${bride.instagram}` : '',
      photo: resolveEditorialPhoto(bride.photo, '/images/bride.svg'),
    },

    // Quote
    quote: {
      title: quote?.title || 'We Found Love',
      text: quote?.text || '',
      source: quote?.source || 'QS Ar-Rum : 21',
    },

    // Intro paragraph
    invitationIntro: wedding?.invitation_intro || '',

    // Events mapping
    events: events.map((evt) => ({
      id: evt.id,
      type: evt.type,
      date: evt.date,
      dateLabel: evt.date_label || evt.date,
      startTime: evt.start_time || '',
      endTimeLabel: evt.end_time_label || evt.end_time || 'Selesai',
      timezone: wedding?.timezone || 'Asia/Jakarta',
      venue: evt.venue || '',
      address: evt.address || '',
      mapsUrl: evt.maps_url || '',
      sortOrder: evt.sort_order,
    })),

    // Countdown target
    countdown: {
      targetDateTime,
      timezone: wedding?.timezone || 'Asia/Jakarta',
      completedMessage: 'Alhamdulillah, Acara Telah Berlangsung',
    },

    // Stories mapping
    stories: stories.map((st, idx) => ({
      id: st.id,
      title: st.title,
      dateLabel: st.date_label,
      body: st.body,
      image: resolveEditorialPhoto(st.image_url, `/images/story-${(idx % 3) + 1}.svg`),
      sortOrder: st.sort_order,
    })),

    // Gallery mapping
    gallery: gallery.map((g, idx) => ({
      id: g.id,
      src: resolveEditorialPhoto(g.image_url, `/images/gallery-${(idx % 4) + 1}.svg`),
      alt: g.alt_text,
      width: g.width || 1200,
      height: g.height || 1600,
      objectPosition: g.object_position || '50% 50%',
      sortOrder: g.sort_order,
    })),

    // Gifts mapping
    gifts: gifts.map((gf) => ({
      id: gf.id,
      type: gf.type,
      provider: gf.provider,
      holder: gf.account_holder,
      number: gf.account_number,
      logo: resolveAssetUrl(gf.logo_url),
      sortOrder: gf.sort_order,
    })),

    // Gift shipping mapping
    giftShipping: gift_shipping
      ? {
          recipient: gift_shipping.recipient,
          phone: gift_shipping.phone,
          address: gift_shipping.address,
        }
      : null,

    // Closing
    closing: {
      message:
        themeConfig.customTexts?.closingMessage ||
        'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
      gratitude: themeConfig.customTexts?.closingGratitude || 'Kami yang berbahagia,',
    },

    // Footer
    footer: {
      brand: themeConfig.customTexts?.footerBrand || 'Undangan Digital Eksklusif',
      tagline: `Dibuat dengan penuh cinta untuk ${groom.short_name || 'Raka'} & ${bride.short_name || 'Alya'}`,
      year: new Date().getFullYear(),
    },
  };
}
