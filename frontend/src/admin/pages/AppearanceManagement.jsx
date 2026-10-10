import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  THEME_PRESETS,
  FONT_PAIRINGS,
  normalizeThemeConfig,
  ensureThemeFontLoaded,
} from '../../utils/themePresets';
import {
  Palette,
  Sparkles,
  Type,
  Layout,
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  FileText,
  Check,
} from 'lucide-react';

const SALAM_PRESETS = [
  {
    label: 'Islami (Assalamu’alaikum)',
    value: 'Assalamu’alaikum Warahmatullahi Wabarakatuh',
  },
  {
    label: 'Nasional / Umum (Salam Sejahtera)',
    value: 'Salam Sejahtera Bagi Kita Semua',
  },
  {
    label: 'Kristiani (Shalom / Kasih Tuhan)',
    value: 'Shalom, Salam Damai Sejahtera di Dalam Kasih Tuhan',
  },
  {
    label: 'Hindu (Om Swastiastu)',
    value: 'Om Swastiastu',
  },
  {
    label: 'Romantis Kasual (Tanpa Salam Formal)',
    value: 'The Joyful Beginning of Our Forever',
  },
];

const SECTION_TOGGLES = [
  { key: 'showQuote', label: 'Section Quote / Ayat Suci', desc: 'Menampilkan kutipan ayat atau kata mutiara cinta' },
  { key: 'showCouple', label: 'Section Profil Mempelai', desc: 'Foto & nama lengkap pengantin beserta nama orang tua' },
  { key: 'showCountdown', label: 'Section Countdown (Hitung Mundur)', desc: 'Timer hitung mundur realtime menuju hari H' },
  { key: 'showEvents', label: 'Section Rangkaian Acara & Peta', desc: 'Jadwal Akad/Pemberkatan, Resepsi & Google Maps' },
  { key: 'showStory', label: 'Section Love Story (Kisah Cinta)', desc: 'Timeline perjalanan cinta pasangan' },
  { key: 'showGallery', label: 'Section Galeri Foto Prewedding', desc: 'Grid foto kebahagiaan dengan fitur Lightbox' },
  { key: 'showGift', label: 'Section Wedding Gift (Amplop Digital & Kado)', desc: 'Rekening bank, e-wallet & alamat kirim kado' },
  { key: 'showRsvp', label: 'Section RSVP & Ucapan Doa', desc: 'Form konfirmasi kehadiran dan daftar ucapan tamu' },
  { key: 'showClosing', label: 'Section Penutup (Closing)', desc: 'Ucapan terima kasih dan foto penutup' },
];

export default function AppearanceManagement() {
  const { wedding: authWedding, refreshAdmin } = useAdminAuth();
  const [weddingData, setWeddingData] = useState(null);
  const [theme, setTheme] = useState(() => normalizeThemeConfig({}));
  const [activeTab, setActiveTab] = useState('presets');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const loadThemeData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data?.wedding) {
        const w = res.data.wedding;
        setWeddingData(w);
        const normalized = normalizeThemeConfig(w.theme_config || {});
        setTheme(normalized);
        ensureThemeFontLoaded(normalized);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal memuat konfigurasi tampilan.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThemeData();
  }, [authWedding?.id]);

  useEffect(() => {
    ensureThemeFontLoaded(theme);
  }, [theme.typography?.pairing]);

  const handleApplyPreset = (presetId) => {
    const presetSpec = THEME_PRESETS[presetId];
    if (!presetSpec) return;

    setTheme((prev) =>
      normalizeThemeConfig({
        ...prev,
        preset: presetId,
        colors: { ...presetSpec.colors },
        typography: { pairing: presetSpec.typography.pairing },
        visual: { ...presetSpec.visual },
      })
    );
    setStatusMsg({
      type: 'success',
      text: `Preset "${presetSpec.name}" diterapkan ke pratinjau! Klik "Simpan Tampilan" untuk menyimpan ke undangan klien.`,
    });
  };

  const handleColorChange = (colorKey, value) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handleFontPairingChange = (pairingId) => {
    const spec = FONT_PAIRINGS[pairingId];
    if (!spec) return;
    setTheme((prev) => ({
      ...prev,
      typography: {
        pairing: pairingId,
        fontScript: spec.fontScript,
        fontHeading: spec.fontHeading,
        fontBody: spec.fontBody,
        googleFontUrl: spec.googleFontUrl,
      },
    }));
  };

  const handleVisualChange = (key, value) => {
    setTheme((prev) => ({
      ...prev,
      visual: {
        ...prev.visual,
        [key]: value,
      },
    }));
  };

  const handleSectionToggle = (key) => {
    setTheme((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: !prev.sections[key],
      },
    }));
  };

  const handleCustomTextChange = (key, value) => {
    setTheme((prev) => ({
      ...prev,
      customTexts: {
        ...prev.customTexts,
        [key]: value,
      },
    }));
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await adminApi.updateTheme(theme);
      if (res.success) {
        await refreshAdmin();
        setStatusMsg({
          type: 'success',
          text: 'Tampilan & kustomisasi tema klien berhasil disimpan dan langsung aktif di halaman publik!',
        });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
      }
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Gagal menyimpan kustomisasi tampilan.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat studio tampilan & tema...</span>
      </div>
    );
  }

  const publicSlug = weddingData?.slug || authWedding?.slug || 'raka-alya';
  const groomShort = weddingData?.groom_short_name || 'Raka';
  const brideShort = weddingData?.bride_short_name || 'Alya';

  const frameBorderRadius =
    theme.visual?.frameStyle === 'oval'
      ? '999px'
      : theme.visual?.frameStyle === 'rounded'
      ? '16px'
      : '64px 64px 12px 12px';

  return (
    <div>
      {/* Page Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Kustomisasi Tampilan & Tema (Visual Studio)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Sesuaikan palet warna, adat/ornamen, tipografi, bentuk frame foto, hingga visibilitas section sesuai selera klien{' '}
            <strong style={{ color: '#0f172a' }}>
              ({groomShort} &amp; {brideShort})
            </strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href={`/${publicSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
          >
            <ExternalLink size={14} />
            <span>Lihat Hasil Live</span>
          </a>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleSaveTheme}
            disabled={isSaving}
          >
            <Save size={14} />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Tampilan'}</span>
          </button>
        </div>
      </div>

      {statusMsg.text && (
        <div
          className={`admin-alert ${
            statusMsg.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'
          }`}
          style={{ marginBottom: '20px' }}
        >
          {statusMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
        }}
      >
        {[
          { id: 'presets', label: '1. Preset Tema Siap Pakai', icon: Sparkles },
          { id: 'colors', label: '2. Warna Kustom (Color Picker)', icon: Palette },
          { id: 'typography', label: '3. Font & Tipografi', icon: Type },
          { id: 'visual', label: '4. Ornamen & Gaya Frame', icon: Eye },
          { id: 'sections', label: '5. Section & Teks Kustom', icon: Layout },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '9px 15px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 600,
                background: isActive ? '#7A2025' : '#fff',
                color: isActive ? '#fff' : '#475569',
                border: isActive ? '1px solid #7A2025' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout: Editor Left + Live Preview Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(300px, 0.95fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: ACTIVE TAB CONTROLS */}
        <div>
          {/* TAB 1: THEME PRESETS */}
          {activeTab === 'presets' && (
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Pilih Preset Tema (1-Klik Terapkan)</h3>
                  <p className="admin-card-desc">
                    Pilih tema dasar sesuai adat atau selera warna klien. Anda tetap bisa mengubah warna & ornamen secara detail di tab berikutnya.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '14px',
                }}
              >
                {Object.values(THEME_PRESETS).map((preset) => {
                  const isSelected = theme.preset === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleApplyPreset(preset.id);
                      }}
                      style={{
                        border: isSelected ? '2px solid #7A2025' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        cursor: 'pointer',
                        background: isSelected ? '#fffafb' : '#fff',
                        transition: 'all 0.15s',
                        position: 'relative',
                      }}
                    >
                      {/* Swatch Bar */}
                      <div
                        style={{
                          display: 'flex',
                          height: '34px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          marginBottom: '12px',
                          border: '1px solid rgba(0,0,0,0.08)',
                        }}
                      >
                        <div style={{ flex: 1.2, background: preset.colors.coverDark }} />
                        <div style={{ flex: 1.5, background: preset.colors.primary }} />
                        <div style={{ flex: 1.2, background: preset.colors.accent }} />
                        <div style={{ flex: 1.5, background: preset.colors.bgCream }} />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            color: '#7A2025',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {preset.badge}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#15803d',
                            }}
                          >
                            <Check size={13} /> Aktif
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                        {preset.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
                        {preset.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM COLORS */}
          {activeTab === 'colors' && (
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Kustomisasi Palet Warna Bebas</h3>
                  <p className="admin-card-desc">
                    Klik kotak warna untuk memilih warna spesifik sesuai request klien atau masukkan kode HEX.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => handleApplyPreset(theme.preset)}
                >
                  <RotateCcw size={13} />
                  <span>Reset ke Preset</span>
                </button>
              </div>

              <div className="admin-grid-2">
                {[
                  {
                    key: 'primary',
                    label: 'Warna Utama (Primary / Tombol & Judul)',
                    hint: 'Digunakan pada tombol utama, judul section, dan aksen kartu',
                  },
                  {
                    key: 'primaryDark',
                    label: 'Warna Gelap (Hero & Closing Overlay)',
                    hint: 'Gradasi latar gelap pada Hero, Monogram & Penutup',
                  },
                  {
                    key: 'accent',
                    label: 'Warna Aksen / Emas (Border & Ikon)',
                    hint: 'Bingkai foto, garis pembatas, badge & ikon',
                  },
                  {
                    key: 'accentLight',
                    label: 'Warna Aksen Terang (Teks Emas di Latar Gelap)',
                    hint: 'Warna tanggal, inisial & subjudul di atas background gelap',
                  },
                  {
                    key: 'bgCream',
                    label: 'Warna Latar Utama (Cream / Background)',
                    hint: 'Warna dasar halaman undangan (Event, Gift, RSVP)',
                  },
                  {
                    key: 'bgIvory',
                    label: 'Warna Latar Section Terang (Ivory)',
                    hint: 'Warna selang-seling section (Mempelai & Love Story)',
                  },
                  {
                    key: 'textCharcoal',
                    label: 'Warna Teks Paragraf Utama',
                    hint: 'Warna teks isi undangan agar kontras dan nyaman dibaca',
                  },
                  {
                    key: 'coverDark',
                    label: 'Warna Latar Sampul & Footer',
                    hint: 'Latar belakang gelap pada Cover Pembuka & Footer',
                  },
                ].map((item) => (
                  <div key={item.key} className="admin-form-group" style={{ marginBottom: '16px' }}>
                    <label className="admin-label">{item.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={theme.colors[item.key] || '#000000'}
                        onChange={(e) => handleColorChange(item.key, e.target.value)}
                        style={{
                          width: '42px',
                          height: '38px',
                          padding: '2px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          background: '#fff',
                        }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={theme.colors[item.key] || ''}
                        onChange={(e) => handleColorChange(item.key, e.target.value)}
                        placeholder="#7A2025"
                      />
                    </div>
                    <span className="admin-form-hint">{item.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Kombinasi Font & Tipografi</h3>
                  <p className="admin-card-desc">
                    Pilih pasangan huruf untuk Nama Pengantin (Script), Judul Section (Serif), dan Teks Isi (Sans-serif).
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.values(FONT_PAIRINGS).map((pair) => {
                  const isSelected = theme.typography?.pairing === pair.id;
                  return (
                    <div
                      key={pair.id}
                      onClick={() => handleFontPairingChange(pair.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleFontPairingChange(pair.id);
                      }}
                      style={{
                        border: isSelected ? '2px solid #7A2025' : '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        background: isSelected ? '#fffafb' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                          {pair.label}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Script: <code>{pair.fontScript.split(',')[0]}</code> • Heading:{' '}
                          <code>{pair.fontHeading.split(',')[0]}</code> • Body:{' '}
                          <code>{pair.fontBody.split(',')[0]}</code>
                        </div>
                      </div>

                      <div
                        style={{
                          textAlign: 'right',
                          fontFamily: pair.fontScript,
                          fontSize: '26px',
                          color: theme.colors.primary,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {groomShort} &amp; {brideShort}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL ORNAMENTS & FRAMES */}
          {activeTab === 'visual' && (
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Ornamen Adat/Dekorasi, Bentuk Frame & Efek</h3>
                  <p className="admin-card-desc">
                    Sesuaikan elemen dekoratif apakah menggunakan ornamen adat Minang, Floral umum, atau Minimalis bersih tanpa ornamen.
                  </p>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">1. Gaya Ornamen & Dekorasi Sudut</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
                  {[
                    {
                      id: 'minang',
                      title: 'Adat Minang & Floral',
                      desc: 'Menampilkan Rumah Gadang Gonjong, divider gonjong & bunga sudut.',
                    },
                    {
                      id: 'floral',
                      title: 'Floral Klasik / Nasional',
                      desc: 'Tanpa Gonjong Minang. Hanya bunga sudut elegan & garis emas berlian.',
                    },
                    {
                      id: 'minimal',
                      title: 'Minimalis Modern (Clean)',
                      desc: 'Tanpa bunga sudut & tanpa gonjong. Fokus penuh pada foto & tipografi.',
                    },
                  ].map((opt) => {
                    const active = (theme.visual?.ornamentStyle || 'minang') === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleVisualChange('ornamentStyle', opt.id)}
                        style={{
                          border: active ? '2px solid #7A2025' : '1px solid #e2e8f0',
                          background: active ? '#fffafb' : '#fff',
                          borderRadius: '10px',
                          padding: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', marginBottom: '4px' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{opt.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '20px' }}>
                <label className="admin-label">2. Gaya Bingkai Foto Mempelai (Cover & Couple)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '6px' }}>
                  {[
                    { id: 'arch', title: 'Arch (Kubah Lengkung)', desc: 'Lengkung klasik di bagian atas' },
                    { id: 'oval', title: 'Oval / Kapsul Penuh', desc: 'Melengkung lembut di atas & bawah' },
                    { id: 'rounded', title: 'Editorial Rounded Box', desc: 'Persegi panjang dengan sudut halus' },
                  ].map((opt) => {
                    const active = (theme.visual?.frameStyle || 'arch') === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleVisualChange('frameStyle', opt.id)}
                        style={{
                          border: active ? '2px solid #7A2025' : '1px solid #e2e8f0',
                          background: active ? '#fffafb' : '#fff',
                          borderRadius: '10px',
                          padding: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a', marginBottom: '4px' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{opt.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '20px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '12px 14px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={theme.visual?.showParticles !== false}
                    onChange={(e) => handleVisualChange('showParticles', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                      Aktifkan Efek Partikel Cahaya (Ambient Gold Shimmer)
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Menampilkan partikel cahaya berkilau lembut pada Cover dan Hero section
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: SECTIONS & CUSTOM COPYWRITING */}
          {activeTab === 'sections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-card" style={{ margin: 0 }}>
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Kontrol Visibilitas Section (Aktif / Sembunyikan)</h3>
                    <p className="admin-card-desc">
                      Jika klien tidak membutuhkan section tertentu (misalnya tanpa Love Story atau tanpa Amplop Digital), matikan centang di bawah ini.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                  {SECTION_TOGGLES.map((sec) => {
                    const isChecked = theme.sections?.[sec.key] !== false;
                    return (
                      <label
                        key={sec.key}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isChecked ? '1px solid #cbd5e1' : '1px solid #f1f5f9',
                          background: isChecked ? '#fff' : '#f8fafc',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSectionToggle(sec.key)}
                          style={{ marginTop: '3px', width: '15px', height: '15px' }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: isChecked ? '#0f172a' : '#94a3b8' }}>
                            {sec.label}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748b' }}>{sec.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="admin-card" style={{ margin: 0 }}>
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Kustomisasi Teks Salam, Sampul & Penutup</h3>
                    <p className="admin-card-desc">
                      Sesuaikan gaya bahasa dan salam pembuka sesuai agama/adat klien.
                    </p>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Preset Cepat Salam Pembuka</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {SALAM_PRESETS.map((sp) => (
                      <button
                        key={sp.label}
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => handleCustomTextChange('coupleGreeting', sp.value)}
                      >
                        {sp.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={theme.customTexts?.coupleGreeting || ''}
                    onChange={(e) => handleCustomTextChange('coupleGreeting', e.target.value)}
                    placeholder="Assalamu’alaikum Warahmatullahi Wabarakatuh"
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Judul Kecil Sampul & Hero</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={theme.customTexts?.coverTitle || ''}
                      onChange={(e) => handleCustomTextChange('coverTitle', e.target.value)}
                      placeholder="THE WEDDING OF"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Teks Tombol Buka Undangan</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={theme.customTexts?.coverButton || ''}
                      onChange={(e) => handleCustomTextChange('coverButton', e.target.value)}
                      placeholder="BUKA UNDANGAN"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Kalimat Subjudul di Hero</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={theme.customTexts?.heroSubtitle || ''}
                    onChange={(e) => handleCustomTextChange('heroSubtitle', e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Pesan Penutup (Closing Message)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={theme.customTexts?.closingMessage || ''}
                    onChange={(e) => handleCustomTextChange('closingMessage', e.target.value)}
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Salam Hormat Penutup</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={theme.customTexts?.closingGratitude || ''}
                      onChange={(e) => handleCustomTextChange('closingGratitude', e.target.value)}
                      placeholder="Kami yang berbahagia,"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Teks Brand di Footer</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={theme.customTexts?.footerBrand || ''}
                      onChange={(e) => handleCustomTextChange('footerBrand', e.target.value)}
                      placeholder="Undangan Digital Eksklusif"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE MOBILE PREVIEW CARD */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div className="admin-card" style={{ margin: 0, padding: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Live Preview Tampilan Klien
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 600,
                }}
              >
                {THEME_PRESETS[theme.preset]?.name || 'Custom'}
              </span>
            </div>

            {/* Simulated Mobile Phone Screen */}
            <div
              style={{
                borderRadius: '22px',
                overflow: 'hidden',
                border: '6px solid #1e293b',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.18)',
                background: theme.colors.bgCream,
              }}
            >
              {/* 1. Mini Cover/Hero Preview */}
              <div
                style={{
                  background: `radial-gradient(circle at center 35%, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 65%, ${theme.colors.coverDark} 100%)`,
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: theme.colors.bgIvory,
                  position: 'relative',
                }}
              >
                {theme.visual?.ornamentStyle === 'minang' && (
                  <img
                    src="/ornaments/minang/gonjong-main.svg"
                    alt=""
                    style={{
                      width: '130px',
                      height: 'auto',
                      margin: '0 auto 6px auto',
                      opacity: 0.9,
                    }}
                  />
                )}

                <div
                  style={{
                    fontFamily: theme.typography.fontHeading,
                    fontSize: '10px',
                    letterSpacing: '0.24em',
                    color: theme.colors.accentLight,
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  {theme.customTexts?.coverTitle || 'THE WEDDING OF'}
                </div>

                <div
                  style={{
                    fontFamily: theme.typography.fontScript,
                    fontSize: '34px',
                    lineHeight: 1.15,
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}
                >
                  {groomShort} <span style={{ color: theme.colors.accentLight }}>&amp;</span> {brideShort}
                </div>

                {/* Mini Frame Photo */}
                <div
                  style={{
                    width: '86px',
                    height: '108px',
                    margin: '0 auto 14px auto',
                    borderRadius: frameBorderRadius,
                    border: `2px solid ${theme.colors.accent}`,
                    overflow: 'hidden',
                    background: theme.colors.primaryDark,
                  }}
                >
                  <img
                    src={weddingData?.cover_photo || '/images/cover.svg'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div
                  style={{
                    display: 'inline-block',
                    padding: '8px 20px',
                    borderRadius: '999px',
                    background: theme.colors.primary,
                    border: `1.5px solid ${theme.colors.accent}`,
                    color: '#ffffff',
                    fontFamily: theme.typography.fontBody,
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                >
                  {theme.customTexts?.coverButton || 'BUKA UNDANGAN'}
                </div>
              </div>

              {/* 2. Mini Content Section Preview */}
              <div
                style={{
                  background: theme.colors.bgIvory,
                  padding: '20px 16px',
                  textAlign: 'center',
                  color: theme.colors.textCharcoal,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.typography.fontHeading,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: theme.colors.primary,
                    marginBottom: '6px',
                  }}
                >
                  {theme.customTexts?.coupleGreeting || 'Assalamu’alaikum Wr. Wb.'}
                </div>

                {/* Ornament / Divider preview */}
                {theme.visual?.ornamentStyle === 'minang' ? (
                  <img
                    src="/ornaments/minang/gonjong-divider.svg"
                    alt=""
                    style={{ width: '100px', margin: '6px auto 10px auto', opacity: 0.45 }}
                  />
                ) : (
                  <div
                    style={{
                      width: '90px',
                      height: '1px',
                      background: theme.colors.accent,
                      margin: '8px auto 10px auto',
                    }}
                  />
                )}

                <p
                  style={{
                    fontFamily: theme.typography.fontBody,
                    fontSize: '11px',
                    color: theme.colors.textMuted,
                    lineHeight: 1.5,
                    margin: '0 0 12px 0',
                  }}
                >
                  {theme.customTexts?.heroSubtitle}
                </p>

                <div
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${theme.colors.accent}`,
                    borderRadius: '12px',
                    padding: '10px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme.typography.fontHeading,
                      fontSize: '14px',
                      fontWeight: 700,
                      color: theme.colors.primary,
                    }}
                  >
                    RESEPSI PERNIKAHAN
                  </div>
                  <div
                    style={{
                      fontFamily: theme.typography.fontBody,
                      fontSize: '10.5px',
                      color: theme.colors.textCharcoal,
                      marginTop: '2px',
                    }}
                  >
                    Sabtu, 20 Juni 2026 • 11.00 WIB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
