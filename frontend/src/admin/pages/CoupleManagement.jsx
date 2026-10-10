import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ImageUploader from '../components/ImageUploader';
import { Heart, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function CoupleManagement() {
  const [formData, setFormData] = useState({
    groom_short_name: '',
    groom_full_name: '',
    groom_father: '',
    groom_mother: '',
    groom_family_label: '',
    groom_instagram: '',
    groom_photo: '',
    bride_short_name: '',
    bride_full_name: '',
    bride_father: '',
    bride_mother: '',
    bride_family_label: '',
    bride_instagram: '',
    bride_photo: '',
    invitation_intro: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data?.wedding) {
        const w = res.data.wedding;
        setFormData({
          groom_short_name: w.groom_short_name || '',
          groom_full_name: w.groom_full_name || '',
          groom_father: w.groom_father || '',
          groom_mother: w.groom_mother || '',
          groom_family_label: w.groom_family_label || 'Putra pertama dari',
          groom_instagram: w.groom_instagram || '',
          groom_photo: w.groom_photo || '',
          bride_short_name: w.bride_short_name || '',
          bride_full_name: w.bride_full_name || '',
          bride_father: w.bride_father || '',
          bride_mother: w.bride_mother || '',
          bride_family_label: w.bride_family_label || 'Putri kedua dari',
          bride_instagram: w.bride_instagram || '',
          bride_photo: w.bride_photo || '',
          invitation_intro: w.invitation_intro || '',
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat data mempelai.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (file, photoType) => {
    if (!file) return;
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await adminApi.uploadMainPhoto(file, photoType);
      if (res.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          [`${photoType}_photo`]: res.data.url,
        }));
        setStatusMessage({
          type: 'success',
          text: `Foto ${photoType === 'groom' ? 'mempelai pria' : 'mempelai wanita'} berhasil diunggah!`,
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal mengunggah foto.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await adminApi.updateCouple(formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Data kedua mempelai berhasil disimpan!' });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan data mempelai.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat data mempelai...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Data Pengantin (Groom & Bride)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola identitas lengkap calon pengantin pria dan wanita yang tampil pada undangan
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          <Save size={16} />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
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

      <form onSubmit={handleSubmit}>
        <div className="admin-grid-2">
          {/* Groom Profile */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title" style={{ color: '#7A2025' }}>
                  Mempelai Pria (Groom)
                </h3>
                <p className="admin-card-desc">Informasi profil calon mempelai pria</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Foto Mempelai Pria</label>
              <ImageUploader
                currentImageUrl={formData.groom_photo}
                onFileSelect={(file) => handlePhotoUpload(file, 'groom')}
                label="Pilih Foto Groom"
                maxHeight="180px"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Panggilan / Singkat *</label>
              <input
                type="text"
                name="groom_short_name"
                className="admin-input"
                placeholder="Contoh: Raka"
                value={formData.groom_short_name}
                onChange={handleChange}
                required
              />
              <span className="admin-form-hint">Digunakan pada cover, hero, dan judul script</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                name="groom_full_name"
                className="admin-input"
                placeholder="Contoh: Raka Pratama, S.T."
                value={formData.groom_full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Label Urutan Keluarga</label>
              <input
                type="text"
                name="groom_family_label"
                className="admin-input"
                placeholder="Contoh: Putra pertama dari"
                value={formData.groom_family_label}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Ayah</label>
              <input
                type="text"
                name="groom_father"
                className="admin-input"
                placeholder="Contoh: Bapak H. Bambang Sudiro"
                value={formData.groom_father}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Ibu</label>
              <input
                type="text"
                name="groom_mother"
                className="admin-input"
                placeholder="Contoh: Ibu Hj. Sri Wahyuni"
                value={formData.groom_mother}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Username Instagram</label>
              <input
                type="text"
                name="groom_instagram"
                className="admin-input"
                placeholder="Contoh: rakapratama (tanpa @)"
                value={formData.groom_instagram}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bride Profile */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title" style={{ color: '#7A2025' }}>
                  Mempelai Wanita (Bride)
                </h3>
                <p className="admin-card-desc">Informasi profil calon mempelai wanita</p>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Foto Mempelai Wanita</label>
              <ImageUploader
                currentImageUrl={formData.bride_photo}
                onFileSelect={(file) => handlePhotoUpload(file, 'bride')}
                label="Pilih Foto Bride"
                maxHeight="180px"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Panggilan / Singkat *</label>
              <input
                type="text"
                name="bride_short_name"
                className="admin-input"
                placeholder="Contoh: Alya"
                value={formData.bride_short_name}
                onChange={handleChange}
                required
              />
              <span className="admin-form-hint">Digunakan pada cover, hero, dan judul script</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                name="bride_full_name"
                className="admin-input"
                placeholder="Contoh: dr. Alya Putri Anandita"
                value={formData.bride_full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Label Urutan Keluarga</label>
              <input
                type="text"
                name="bride_family_label"
                className="admin-input"
                placeholder="Contoh: Putri kedua dari"
                value={formData.bride_family_label}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Ayah</label>
              <input
                type="text"
                name="bride_father"
                className="admin-input"
                placeholder="Contoh: Bapak Drs. H. Suryo Pranoto"
                value={formData.bride_father}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Ibu</label>
              <input
                type="text"
                name="bride_mother"
                className="admin-input"
                placeholder="Contoh: Ibu Hj. Endang Rahayu"
                value={formData.bride_mother}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Username Instagram</label>
              <input
                type="text"
                name="bride_instagram"
                className="admin-input"
                placeholder="Contoh: alyaputri (tanpa @)"
                value={formData.bride_instagram}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Invitation Intro */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Teks Pengantar Undangan</h3>
              <p className="admin-card-desc">Paragraf pembuka yang tampil sebelum profil kedua mempelai</p>
            </div>
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <textarea
              name="invitation_intro"
              className="admin-textarea"
              rows={4}
              value={formData.invitation_intro}
              onChange={handleChange}
              placeholder="Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}