/**
 * Dynamic Theme Engine & Presets for Multi-Client Digital Wedding Invitations
 * Allows each client wedding to customize colors, fonts, ornaments, frames,
 * section visibility, and custom copywriting.
 */

export const THEME_PRESETS = {
  minang_burgundy: {
    id: 'minang_burgundy',
    name: 'Luxury Minang Burgundy',
    badge: 'Adat Minang / Tradisional Mewah',
    description: 'Nuansa merah maroon tua (burgundy), aksen emas kerajaan, dan ornamen Gonjong Minangkabau.',
    colors: {
      primary: '#7A2025',
      primaryDark: '#4D1115',
      accent: '#C7A15A',
      accentLight: '#E1C98E',
      bgCream: '#F8F2EA',
      bgIvory: '#FFFDF8',
      bgPaper: '#FBF7F1',
      textCharcoal: '#25201E',
      textMuted: '#756B66',
      coverDark: '#160708',
    },
    typography: {
      pairing: 'classic_romantic',
    },
    visual: {
      ornamentStyle: 'minang',
      frameStyle: 'arch',
      showParticles: true,
    },
  },

  javanese_royal: {
    id: 'javanese_royal',
    name: 'Javanese Royal Sogan',
    badge: 'Adat Jawa / Klasik Keraton',
    description: 'Perpaduan coklat sogan keraton, emas klasik, dan latar krem hangat yang anggun dan sakral.',
    colors: {
      primary: '#522E1A',
      primaryDark: '#30190C',
      accent: '#C99E4C',
      accentLight: '#E5C687',
      bgCream: '#F7F1E8',
      bgIvory: '#FFFDF9',
      bgPaper: '#FAF6F0',
      textCharcoal: '#261D18',
      textMuted: '#73655D',
      coverDark: '#170D07',
    },
    typography: {
      pairing: 'royal_editorial',
    },
    visual: {
      ornamentStyle: 'floral',
      frameStyle: 'arch',
      showParticles: true,
    },
  },

  sage_botanical: {
    id: 'sage_botanical',
    name: 'Botanical Sage & Champagne',
    badge: 'Garden / Outdoor / Islami Modern',
    description: 'Warna hijau sage alami dengan sentuhan champagne gold dan bingkai oval yang lembut.',
    colors: {
      primary: '#355640',
      primaryDark: '#1E3526',
      accent: '#B89E68',
      accentLight: '#DEC99A',
      bgCream: '#F1F5F2',
      bgIvory: '#FAFCFA',
      bgPaper: '#F6F9F6',
      textCharcoal: '#1D2820',
      textMuted: '#5E6E63',
      coverDark: '#0E1A12',
    },
    typography: {
      pairing: 'soft_botanical',
    },
    visual: {
      ornamentStyle: 'floral',
      frameStyle: 'oval',
      showParticles: true,
    },
  },

  dusty_blue: {
    id: 'dusty_blue',
    name: 'Romantic Dusty Blue',
    badge: 'European / Fairytale Romantic',
    description: 'Biru navy & dusty slate dengan aksen champagne gold yang tenang, romantis, dan elegan.',
    colors: {
      primary: '#264360',
      primaryDark: '#15273A',
      accent: '#C2A574',
      accentLight: '#E2CBA2',
      bgCream: '#F0F4F8',
      bgIvory: '#FAFBFD',
      bgPaper: '#F5F8FB',
      textCharcoal: '#1B2530',
      textMuted: '#606F80',
      coverDark: '#0B1520',
    },
    typography: {
      pairing: 'royal_editorial',
    },
    visual: {
      ornamentStyle: 'floral',
      frameStyle: 'arch',
      showParticles: true,
    },
  },

  blush_terracotta: {
    id: 'blush_terracotta',
    name: 'Blush Rose & Terracotta',
    badge: 'Warm Romantic / Boho Chic',
    description: 'Sentuhan rose terracotta hangat dengan latar soft blush dan tipografi romantis.',
    colors: {
      primary: '#8C423B',
      primaryDark: '#57231E',
      accent: '#CE9B6B',
      accentLight: '#E8C39E',
      bgCream: '#FAF1EF',
      bgIvory: '#FFFDFC',
      bgPaper: '#FDF7F6',
      textCharcoal: '#2A1E1D',
      textMuted: '#7A6664',
      coverDark: '#1F0C0A',
    },
    typography: {
      pairing: 'classic_romantic',
    },
    visual: {
      ornamentStyle: 'floral',
      frameStyle: 'oval',
      showParticles: true,
    },
  },

  modern_monochrome: {
    id: 'modern_monochrome',
    name: 'Editorial Monochrome',
    badge: 'Minimalis / Modern International',
    description: 'Gaya majalah editorial hitam-putih bersih tanpa ornamen ramai, fokus pada tipografi & foto.',
    colors: {
      primary: '#242424',
      primaryDark: '#121212',
      accent: '#B09B71',
      accentLight: '#D8C7A4',
      bgCream: '#F4F4F2',
      bgIvory: '#FFFFFF',
      bgPaper: '#F9F9F8',
      textCharcoal: '#171717',
      textMuted: '#6B6B6B',
      coverDark: '#0D0D0D',
    },
    typography: {
      pairing: 'clean_minimal',
    },
    visual: {
      ornamentStyle: 'minimal',
      frameStyle: 'rounded',
      showParticles: false,
    },
  },
};

export const FONT_PAIRINGS = {
  classic_romantic: {
    id: 'classic_romantic',
    label: 'Classic Romantic (Great Vibes + Cormorant Garamond + Montserrat)',
    fontScript: "'Great Vibes', cursive",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Montserrat', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap',
  },
  royal_editorial: {
    id: 'royal_editorial',
    label: 'Royal Editorial (Alex Brush + Playfair Display + Plus Jakarta Sans)',
    fontScript: "'Alex Brush', cursive",
    fontHeading: "'Playfair Display', Georgia, serif",
    fontBody: "'Plus Jakarta Sans', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
  modern_luxury: {
    id: 'modern_luxury',
    label: 'Modern Luxury (Pinyon Script + Cinzel + Lato)',
    fontScript: "'Pinyon Script', cursive",
    fontHeading: "'Cinzel', Georgia, serif",
    fontBody: "'Lato', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@400;700&family=Pinyon+Script&display=swap',
  },
  soft_botanical: {
    id: 'soft_botanical',
    label: 'Soft Botanical (Allura + Lora + Nunito Sans)',
    fontScript: "'Allura', cursive",
    fontHeading: "'Lora', Georgia, serif",
    fontBody: "'Nunito Sans', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Allura&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@400;600;700&display=swap',
  },
  clean_minimal: {
    id: 'clean_minimal',
    label: 'Clean Minimalist (Italianno + Bodoni Moda + Inter)',
    fontScript: "'Italianno', cursive",
    fontHeading: "'Bodoni Moda', Georgia, serif",
    fontBody: "'Inter', sans-serif",
    googleFontUrl:
      'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=Italianno&display=swap',
  },
};

export const DEFAULT_SECTIONS = {
  showQuote: true,
  showCouple: true,
  showCountdown: true,
  showEvents: true,
  showStory: true,
  showGallery: true,
  showGift: true,
  showRsvp: true,
  showClosing: true,
};

export const DEFAULT_CUSTOM_TEXTS = {
  coverTitle: 'THE WEDDING OF',
  coverButton: 'BUKA UNDANGAN',
  coverSentence:
    'Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.',
  heroSubtitle:
    'Dengan penuh rasa syukur dan sukacita, kami mengundang Anda untuk merayakan hari istimewa kami.',
  coupleGreeting: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
  closingMessage:
    'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
  closingGratitude: 'Kami yang berbahagia,',
  footerBrand: 'Undangan Digital Eksklusif',
};

function hexToRgbString(hex, fallback = '94, 23, 27') {
  if (!hex || typeof hex !== 'string') return fallback;
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length !== 6) return fallback;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return fallback;
  return `${r}, ${g}, ${b}`;
}

export function normalizeThemeConfig(raw = {}) {
  const presetId = raw?.preset && THEME_PRESETS[raw.preset] ? raw.preset : 'minang_burgundy';
  const basePreset = THEME_PRESETS[presetId];

  const colors = {
    ...basePreset.colors,
    ...(raw?.colors || {}),
  };

  const pairingId =
    raw?.typography?.pairing && FONT_PAIRINGS[raw.typography.pairing]
      ? raw.typography.pairing
      : basePreset.typography.pairing;
  const fontSpec = FONT_PAIRINGS[pairingId];

  const typography = {
    pairing: pairingId,
    fontScript: raw?.typography?.fontScript || fontSpec.fontScript,
    fontHeading: raw?.typography?.fontHeading || fontSpec.fontHeading,
    fontBody: raw?.typography?.fontBody || fontSpec.fontBody,
    googleFontUrl: fontSpec.googleFontUrl,
  };

  const visual = {
    ...basePreset.visual,
    ...(raw?.visual || {}),
  };

  const sections = {
    ...DEFAULT_SECTIONS,
    ...(raw?.sections || {}),
  };

  const customTexts = {
    ...DEFAULT_CUSTOM_TEXTS,
    ...(raw?.customTexts || {}),
  };

  return {
    preset: presetId,
    colors,
    typography,
    visual,
    sections,
    customTexts,
  };
}

export function buildThemeCssVariables(rawThemeConfig = {}) {
  const theme = normalizeThemeConfig(rawThemeConfig);
  const { colors, typography } = theme;

  const primaryRgb = hexToRgbString(colors.primary, '122, 32, 37');
  const darkRgb = hexToRgbString(colors.primaryDark, '77, 17, 21');
  const coverDarkRgb = hexToRgbString(colors.coverDark, '22, 7, 8');
  const accentRgb = hexToRgbString(colors.accent, '199, 161, 90');

  return {
    '--wine-900': colors.primaryDark,
    '--wine-800': colors.primaryDark,
    '--wine-700': colors.primary,
    '--burgundy-600': colors.primary,
    '--gold-600': colors.accent,
    '--gold-500': colors.accent,
    '--gold-400': colors.accentLight,
    '--gold-300': colors.accentLight,
    '--dusty-rose-300': colors.accentLight,
    '--rose-soft-200': colors.bgCream,
    '--cream-100': colors.bgCream,
    '--ivory-50': colors.bgIvory,
    '--paper': colors.bgPaper,
    '--charcoal-900': colors.textCharcoal,
    '--muted': colors.textMuted,
    '--black-soft': colors.coverDark,
    '--font-script': typography.fontScript,
    '--font-heading': typography.fontHeading,
    '--font-body': typography.fontBody,
    '--theme-primary-rgb': primaryRgb,
    '--theme-dark-rgb': darkRgb,
    '--theme-cover-rgb': coverDarkRgb,
    '--theme-accent-rgb': accentRgb,
  };
}

export function ensureThemeFontLoaded(rawThemeConfig = {}) {
  if (typeof document === 'undefined') return;
  const theme = normalizeThemeConfig(rawThemeConfig);
  const url = theme.typography?.googleFontUrl;
  if (!url) return;

  const linkId = 'dynamic-wedding-theme-fonts';
  let linkEl = document.getElementById(linkId);
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = linkId;
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }
  if (linkEl.href !== url) {
    linkEl.href = url;
  }
}
