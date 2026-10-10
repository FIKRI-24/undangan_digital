import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import { THEME_PRESETS, normalizeThemeConfig } from '../../utils/themePresets';
import {
  Plus,
  Users,
  CheckCircle2,
  ExternalLink,
  Palette,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Copy,
  Sparkles,
  Calendar,
  MessageSquareHeart,
  Layers,
} from 'lucide-react';

export default function ClientManagement() {
  const { wedding: activeWedding, switchWedding, refreshAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [weddings, setWeddings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    groom_short_name: '',
    groom_full_name: '',
    bride_short_name: '',
    bride_full_name: '',
    slug: '',
    title: '',
    timezone: 'Asia/Jakarta',
    preset: 'minang_burgundy',
    clone_from_id: '',
  });

  const loadWeddings = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWeddings();
      if (res.success && res.data?.weddings) {
        setWeddings(res.data.weddings);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal memuat daftar klien.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeddings();
  }, []);

  const handleNameChange = (field, value) => {
    const next = { ...formData, [field]: value };
    const groom = (field === 'groom_short_name' ? value : next.groom_short_name).trim();
    const bride = (field === 'bride_short_name' ? value : next.bride_short_name).trim();

    if (groom && bride) {
      const autoSlug = `${groom}-${bride}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      next.slug = autoSlug;
      next.title = `The Wedding of ${groom} & ${bride}`;
    }
    setFormData(next);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!formData.groom_short_name.trim() || !formData.bride_short_name.trim() || !formData.slug.trim()) {
      setStatusMsg({
        type: 'error',
        text: 'Nama panggilan kedua mempelai dan slug URL wajib diisi.',
      });
      return;
    }

    setIsCreating(true);
    try {
      const presetConfig = normalizeThemeConfig({ preset: formData.preset });
      const payload = {
        groom_short_name: formData.groom_short_name.trim(),
        groom_full_name: (formData.groom_full_name || formData.groom_short_name).trim(),
        bride_short_name: formData.bride_short_name.trim(),
        bride_full_name: (formData.bride_full_name || formData.bride_short_name).trim(),
        slug: formData.slug.trim().toLowerCase(),
        title:
          formData.title.trim() ||
          `The Wedding of ${formData.groom_short_name.trim()} & ${formData.bride_short_name.trim()}`,
        timezone: formData.timezone,
        theme_config: presetConfig,
        clone_from_id: formData.clone_from_id ? parseInt(formData.clone_from_id, 10) : null,
      };

      const res = await adminApi.createWedding(payload);
      if (res.success && res.data) {
        await switchWedding(res.data.id);
        await loadWeddings();
        setShowCreateForm(false);
        setFormData({
          groom_short_name: '',
          groom_full_name: '',
          bride_short_name: '',
          bride_full_name: '',
          slug: '',
          title: '',
          timezone: 'Asia/Jakarta',
          preset: 'minang_burgundy',
          clone_from_id: '',
        });
        setStatusMsg({
          type: 'success',
          text: `Undangan klien "${res.data.title}" berhasil dibuat dan langsung diaktifkan!`,
        });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal membuat undangan klien baru.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectClient = async (item) => {
    try {
      await switchWedding(item.id);
      setStatusMsg({
        type: 'success',
        text: `Klien aktif berhasil diubah ke "${item.title}" (/${item.slug}). Seluruh menu di samping kini mengelola klien ini.`,
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal memilih klien.' });
    }
  };

  const handleCustomizeClient = async (item) => {
    try {
      if (activeWedding?.id !== item.id) {
        await switchWedding(item.id);
      }
      navigate('/admin/appearance');
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal membuka kustomisasi tampilan.' });
    }
  };

  const handleDeleteClient = async (item) => {
    if (weddings.length <= 1) {
      setStatusMsg({
        type: 'error',
        text: 'Tidak dapat menghapus satu-satunya undangan klien yang tersisa.',
      });
      return;
    }

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus undangan "${item.title}" (/${item.slug}) beserta seluruh data acara, galeri, dan RSVP-nya?`
    );
    if (!confirmed) return;

    try {
      const res = await adminApi.deleteWedding(item.id);
      if (res.success) {
        await refreshAdmin();
        await loadWeddings();
        setStatusMsg({
          type: 'success',
          text: `Undangan "${item.title}" berhasil dihapus.`,
        });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Gagal menghapus undangan klien.' });
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat daftar klien undangan...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Manajemen Klien & Multi-Undangan
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola banyak pasangan klien sekaligus. Setiap klien memiliki tautan URL, konten, tamu, dan tema tampilan masing-masing.
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus size={15} />
          <span>{showCreateForm ? 'Tutup Form' : 'Tambah Klien Baru'}</span>
        </button>
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

      {/* Create New Client Form */}
      {showCreateForm && (
        <div className="admin-card" style={{ marginBottom: '24px', border: '1.5px solid #cbd5e1' }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: '#7A2025' }} />
                <span>Buat Undangan Klien Baru</span>
              </h3>
              <p className="admin-card-desc">
                Isi data dasar pasangan dan pilih selera tema awal klien. Seluruh detail dan warna dapat di-custom lebih lanjut.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit}>
            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Nama Panggilan Mempelai Pria *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Dimas"
                  value={formData.groom_short_name}
                  onChange={(e) => handleNameChange('groom_short_name', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nama Panggilan Mempelai Wanita *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Kirana"
                  value={formData.bride_short_name}
                  onChange={(e) => handleNameChange('bride_short_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Nama Lengkap Mempelai Pria</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Dimas Anggara, S.T."
                  value={formData.groom_full_name}
                  onChange={(e) => setFormData({ ...formData, groom_full_name: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nama Lengkap Mempelai Wanita</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Kirana Larasati, S.E."
                  value={formData.bride_full_name}
                  onChange={(e) => setFormData({ ...formData, bride_full_name: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Slug URL Undangan Klien *</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRight: 'none',
                      padding: '9px 12px',
                      fontSize: '13px',
                      color: '#64748b',
                      borderRadius: '8px 0 0 8px',
                    }}
                  >
                    domain.com/
                  </span>
                  <input
                    type="text"
                    className="admin-input"
                    style={{ borderRadius: '0 8px 8px 0' }}
                    placeholder="dimas-kirana"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })
                    }
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Judul Undangan</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="The Wedding of Dimas & Kirana"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Pilih Selera Tema Awal (Preset Tampilan)</label>
                <select
                  className="admin-select"
                  value={formData.preset}
                  onChange={(e) => setFormData({ ...formData, preset: e.target.value })}
                >
                  {Object.values(THEME_PRESETS).map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} — ({preset.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Template Konten Awal</label>
                <select
                  className="admin-select"
                  value={formData.clone_from_id}
                  onChange={(e) => setFormData({ ...formData, clone_from_id: e.target.value })}
                >
                  <option value="">Data Standar Baru (Default Acara & Love Story)</option>
                  {weddings.map((w) => (
                    <option key={w.id} value={w.id}>
                      Duplikat struktur dari: {w.title} (/{w.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Batal
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={isCreating}>
                <Plus size={14} />
                <span>{isCreating ? 'Membuat Undangan...' : 'Buat & Aktifkan Klien'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '18px',
        }}
      >
        {weddings.map((item) => {
          const isCurrent = activeWedding?.id === item.id;
          const theme = normalizeThemeConfig(item.theme_config);
          const presetInfo = THEME_PRESETS[theme.preset] || THEME_PRESETS.minang_burgundy;

          return (
            <div
              key={item.id}
              className="admin-card"
              style={{
                margin: 0,
                border: isCurrent ? '2px solid #7A2025' : '1px solid #e2e8f0',
                boxShadow: isCurrent
                  ? '0 10px 25px rgba(122, 32, 37, 0.12)'
                  : '0 2px 6px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Top Strip: Status & Active Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      background: isCurrent ? '#7A2025' : '#f1f5f9',
                      color: isCurrent ? '#fff' : '#475569',
                    }}
                  >
                    {isCurrent ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>SEDANG DIKELOLA</span>
                      </>
                    ) : (
                      <span>KLIEN #{item.id}</span>
                    )}
                  </span>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: item.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: item.status === 'active' ? '#15803d' : '#b91c1c',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                {/* Couple Title & Slug */}
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {item.groom_short_name} &amp; {item.bride_short_name}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 12px 0' }}>
                  {item.title}
                </p>

                {/* URL Box */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '14px',
                    fontSize: '12.5px',
                  }}
                >
                  <code style={{ color: '#0f172a', fontWeight: 600 }}>/{item.slug}</code>
                  <a
                    href={`/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#7A2025',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Buka</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Theme Swatch Preview */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      TEMA TAMPILAN
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                      {presetInfo.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Ornamen: <strong>{theme.visual?.ornamentStyle || 'minang'}</strong> • Frame:{' '}
                      <strong>{theme.visual?.frameStyle || 'arch'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      title={`Primary: ${theme.colors.primary}`}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: theme.colors.primary,
                        border: '2px solid #fff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                    <span
                      title={`Accent: ${theme.colors.accent}`}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: theme.colors.accent,
                        border: '2px solid #fff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                    <span
                      title={`Background: ${theme.colors.bgCream}`}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: theme.colors.bgCream,
                        border: '1px solid #cbd5e1',
                      }}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#475569',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.events_count || 0}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Acara</div>
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.guests_count || 0}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Tamu</div>
                  </div>
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.rsvps_count || 0}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>RSVP</div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                {!isCurrent ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleSelectClient(item)}
                  >
                    <Layers size={13} />
                    <span>Kelola Klien Ini</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ flex: 1, justifyContent: 'center', background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}
                    disabled
                  >
                    <CheckCircle2 size={13} />
                    <span>Aktif Dikelola</span>
                  </button>
                )}

                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => handleCustomizeClient(item)}
                  title="Kustomisasi warna, font, ornamen & tampilan klien ini"
                >
                  <Palette size={13} />
                  <span>Tema</span>
                </button>

                {weddings.length > 1 && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    onClick={() => handleDeleteClient(item)}
                    title="Hapus undangan klien ini"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
