import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ImageUploader from '../components/ImageUploader';
import ConfirmModal from '../components/ConfirmModal';
import { resolveAssetUrl } from '../../utils/assetUrl';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Upload,
} from 'lucide-react';

export default function GalleryManagement() {
  const [wedding, setWedding] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add gallery modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [altText, setAltText] = useState('Foto Galeri Pernikahan');
  const [objectPosition, setObjectPosition] = useState('50% 50%');
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wRes, gRes] = await Promise.all([
        adminApi.getWedding(),
        adminApi.getGallery(),
      ]);
      if (wRes.success && wRes.data?.wedding) {
        setWedding(wRes.data.wedding);
      }
      if (gRes.success && gRes.data) {
        setGallery(gRes.data);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat data foto dan galeri.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMainPhotoUpload = async (file, photoType) => {
    if (!file) return;
    setStatusMessage({ type: '', text: '' });
    try {
      const res = await adminApi.uploadMainPhoto(file, photoType);
      if (res.success && res.data?.url) {
        setWedding((prev) => ({
          ...prev,
          [`${photoType}_photo`]: res.data.url,
        }));
        setStatusMessage({
          type: 'success',
          text: `Foto ${photoType.toUpperCase()} berhasil diperbarui!`,
        });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal mengunggah foto.' });
    }
  };

  const handleAddGallerySubmit = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
      setStatusMessage({ type: 'error', text: 'Pilih file gambar galeri terlebih dahulu.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', newImageFile);
      formData.append('alt_text', altText);
      formData.append('object_position', objectPosition);
      formData.append('sort_order', gallery.length + 1);

      const res = await adminApi.uploadGallery(formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Foto baru berhasil ditambahkan ke galeri!' });
        setIsAddModalOpen(false);
        setNewImageFile(null);
        await loadData();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal mengunggah foto galeri.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteGallery(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Foto galeri berhasil dihapus.' });
        setDeleteTarget(null);
        await loadData();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus foto galeri.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[targetIndex];
    newGallery[targetIndex] = temp;

    const items = newGallery.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    setGallery(newGallery);
    try {
      await adminApi.reorderGallery(items);
    } catch (err) {
      console.error(err);
      await loadData();
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat galeri dan foto...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Foto Utama & Galeri (Gallery)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola foto cover layar penuh, hero, closing, serta album foto galeri publik
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Tambah Foto Galeri</span>
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

      {/* Main Photos Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Foto Utama Undangan</h3>
            <p className="admin-card-desc">Foto berukuran besar yang tampil pada bagian penting undangan</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Cover Photo */}
          <div>
            <label className="admin-label">Foto Cover (Layar Pertama)</label>
            <ImageUploader
              currentImageUrl={wedding?.cover_photo}
              onFileSelect={(file) => handleMainPhotoUpload(file, 'cover')}
              label="Pilih Foto Cover"
              maxHeight="160px"
            />
            <span className="admin-form-hint">Muncul di balik tombol "OPEN INVITATION"</span>
          </div>

          {/* Hero Photo */}
          <div>
            <label className="admin-label">Foto Hero (Section Judul)</label>
            <ImageUploader
              currentImageUrl={wedding?.hero_photo}
              onFileSelect={(file) => handleMainPhotoUpload(file, 'hero')}
              label="Pilih Foto Hero"
              maxHeight="160px"
            />
            <span className="admin-form-hint">Muncul pada header The Wedding of</span>
          </div>

          {/* Closing Photo */}
          <div>
            <label className="admin-label">Foto Closing (Penutup)</label>
            <ImageUploader
              currentImageUrl={wedding?.closing_photo}
              onFileSelect={(file) => handleMainPhotoUpload(file, 'closing')}
              label="Pilih Foto Closing"
              maxHeight="160px"
            />
            <span className="admin-form-hint">Muncul pada bagian kartu ucapan penutup</span>
          </div>
        </div>
      </div>

      {/* Album Gallery Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Album Foto Galeri ({gallery.length} Foto)</h3>
            <p className="admin-card-desc">Daftar foto yang ditampilkan dalam grid masonry undangan</p>
          </div>
        </div>

        {gallery.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <ImageIcon size={36} style={{ margin: '0 auto 8px auto', color: '#cbd5e1' }} />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>Belum ada foto galeri</p>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              style={{ marginTop: '8px' }}
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={14} />
              <span>Tambah Foto Pertama</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {gallery.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '160px', backgroundColor: '#1e1b1b', position: 'relative' }}>
                  <img
                    src={resolveAssetUrl(item.image_url)}
                    alt={item.alt_text || 'Galeri'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: item.object_position || '50% 50%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                    }}
                  >
                    #{item.sort_order || idx + 1}
                  </div>
                </div>

                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontSize: '12.5px', color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.alt_text || 'Foto Galeri'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, -1)}
                        style={{
                          background: 'none',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          padding: '3px',
                          cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 ? 0.3 : 1,
                        }}
                        title="Pindah ke kiri/atas"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === gallery.length - 1}
                        onClick={() => handleMove(idx, 1)}
                        style={{
                          background: 'none',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          padding: '3px',
                          cursor: idx === gallery.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: idx === gallery.length - 1 ? 0.3 : 1,
                        }}
                        title="Pindah ke kanan/bawah"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      style={{ color: '#dc2626', borderColor: '#fecaca', padding: '4px 8px' }}
                      onClick={() => setDeleteTarget(item)}
                      title="Hapus foto ini"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Gallery Photo Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title">Unggah Foto Galeri Baru</h3>
            </div>

            <form onSubmit={handleAddGallerySubmit}>
              <div className="admin-form-group">
                <label className="admin-label">File Gambar *</label>
                <ImageUploader
                  onFileSelect={(file) => setNewImageFile(file)}
                  label="Pilih File Gambar"
                  maxHeight="180px"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Teks Keterangan (Alt Text)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Foto Prewedding di Pantai"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Fokus Posisi Gambar (Object Position)</label>
                <select
                  className="admin-select"
                  value={objectPosition}
                  onChange={(e) => setObjectPosition(e.target.value)}
                >
                  <option value="50% 50%">Tengah (Center - 50% 50%)</option>
                  <option value="50% 20%">Atas (Top - 50% 20%)</option>
                  <option value="50% 80%">Bawah (Bottom - 50% 80%)</option>
                  <option value="20% 50%">Kiri (Left - 20% 50%)</option>
                  <option value="80% 50%">Kanan (Right - 80% 50%)</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isUploading || !newImageFile}
                >
                  <Upload size={14} />
                  <span>{isUploading ? 'Mengunggah...' : 'Unggah ke Galeri'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Foto Galeri"
        message="Apakah Anda yakin ingin menghapus foto ini dari galeri pernikahan? File akan dihapus permanen dari storage."
        confirmText="Hapus Foto"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}