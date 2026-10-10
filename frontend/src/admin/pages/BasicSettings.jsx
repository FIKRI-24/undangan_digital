import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Settings,
  Save,
  Key,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
  Lock,
} from 'lucide-react';

export default function BasicSettings() {
  const { updateWeddingSlug } = useAdminAuth();
  const [settingsData, setSettingsData] = useState({
    title: '',
    slug: '',
    timezone: 'Asia/Jakarta',
    status: 'active',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', text: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data?.wedding) {
        const w = res.data.wedding;
        setSettingsData({
          title: w.title || '',
          slug: w.slug || '',
          timezone: w.timezone || 'Asia/Jakarta',
          status: w.status || 'active',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat pengaturan dasar.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!settingsData.title.trim() || !settingsData.slug.trim()) {
      setStatusMessage({ type: 'error', text: 'Judul dan slug wajib diisi.' });
      return;
    }

    // Slug validation regex
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(settingsData.slug.trim())) {
      setStatusMessage({
        type: 'error',
        text: 'Format slug tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-), contoh: ryan-widya.',
      });
      return;
    }

    setIsSavingSettings(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await adminApi.updateBasicSettings(settingsData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Pengaturan dasar wedding berhasil diperbarui!' });
        updateWeddingSlug(settingsData.slug.trim(), settingsData.title.trim());
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan pengaturan.' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', text: '' });

    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordStatus({ type: 'error', text: 'Semua field password wajib diisi.' });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordStatus({ type: 'error', text: 'Password baru minimal harus 8 karakter.' });
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordStatus({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await adminApi.changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      if (res.success) {
        setPasswordStatus({ type: 'success', text: 'Password admin berhasil diperbarui!' });
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setPasswordStatus({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', text: err.message || 'Gagal mengubah password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat pengaturan...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Pengaturan Dasar & Akun (Settings)
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Kelola slug URL publik, status tayang undangan, serta keamanan akun admin
        </p>
      </div>

      <div className="admin-grid-2">
        {/* Wedding Identity & URL Settings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Identitas & Tautan Undangan</h3>
              <p className="admin-card-desc">Pengaturan slug URL publik dan status pernikahan</p>
            </div>
          </div>

          {statusMessage.text && (
            <div
              className={`admin-alert ${
                statusMessage.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'
              }`}
            >
              {statusMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSettingsSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Undangan (Page Title) *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="The Wedding of Raka & Alya"
                value={settingsData.title}
                onChange={(e) => setSettingsData({ ...settingsData, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Slug URL Undangan *</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRight: 'none',
                    padding: '9px 12px',
                    fontSize: '13.5px',
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
                  placeholder="raka-alya"
                  value={settingsData.slug}
                  onChange={(e) => setSettingsData({ ...settingsData, slug: e.target.value.toLowerCase().trim() })}
                  required
                />
              </div>
              <span className="admin-form-hint">
                Hanya huruf kecil, angka, dan tanda hubung (-). Jika slug diubah, seluruh tautan tamu akan otomatis mengikuti.
              </span>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Zona Waktu (Timezone)</label>
                <select
                  className="admin-select"
                  value={settingsData.timezone}
                  onChange={(e) => setSettingsData({ ...settingsData, timezone: e.target.value })}
                >
                  <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                  <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                  <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Status Undangan</label>
                <select
                  className="admin-select"
                  value={settingsData.status}
                  onChange={(e) => setSettingsData({ ...settingsData, status: e.target.value })}
                >
                  <option value="active">Aktif (Dapat Diakses Publik)</option>
                  <option value="inactive">Nonaktif (Diarsipkan)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={isSavingSettings}
              >
                <Save size={14} />
                <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Change Admin Password */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Ganti Password Admin</h3>
              <p className="admin-card-desc">Amankan akses dashboard dengan password kuat</p>
            </div>
          </div>

          {passwordStatus.text && (
            <div
              className={`admin-alert ${
                passwordStatus.type === 'success' ? 'admin-alert-success' : 'admin-alert-danger'
              }`}
            >
              {passwordStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{passwordStatus.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Password Saat Ini *</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Masukkan password saat ini"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Password Baru *</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Minimal 8 karakter"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Konfirmasi Password Baru *</label>
              <input
                type="password"
                className="admin-input"
                placeholder="Ulangi password baru"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-secondary"
                disabled={isChangingPassword}
              >
                <Key size={14} />
                <span>{isChangingPassword ? 'Memperbarui...' : 'Ubah Password'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}