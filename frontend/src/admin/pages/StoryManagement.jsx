import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ImageUploader from '../components/ImageUploader';
import ConfirmModal from '../components/ConfirmModal';
import { resolveAssetUrl } from '../../utils/assetUrl';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
} from 'lucide-react';

export default function StoryManagement() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date_label: '',
    body: '',
    image_url: '',
    sort_order: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getStories();
      if (res.success && res.data) {
        setStories(res.data);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat daftar cerita.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const openAddModal = () => {
    setEditingStory(null);
    setSelectedFile(null);
    setFormData({
      title: '',
      date_label: '',
      body: '',
      image_url: '',
      sort_order: stories.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (story) => {
    setEditingStory(story);
    setSelectedFile(null);
    setFormData({
      title: story.title || '',
      date_label: story.date_label || '',
      body: story.body || '',
      image_url: story.image_url || '',
      sort_order: story.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      setStatusMessage({ type: 'error', text: 'Judul dan isi cerita wajib diisi.' });
      return;
    }

    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title.trim());
      dataPayload.append('date_label', formData.date_label.trim());
      dataPayload.append('body', formData.body.trim());
      dataPayload.append('sort_order', formData.sort_order);

      if (selectedFile) {
        dataPayload.append('file', selectedFile);
      } else if (formData.image_url) {
        dataPayload.append('image_url', formData.image_url);
      }

      if (editingStory) {
        await adminApi.updateStory(editingStory.id, dataPayload);
        setStatusMessage({ type: 'success', text: 'Cerita berhasil diperbarui!' });
      } else {
        await adminApi.createStory(dataPayload);
        setStatusMessage({ type: 'success', text: 'Cerita baru berhasil ditambahkan!' });
      }

      setIsModalOpen(false);
      await loadStories();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan cerita.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteStory(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Cerita berhasil dihapus.' });
        setDeleteTarget(null);
        await loadStories();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus cerita.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stories.length) return;

    const newStories = [...stories];
    const temp = newStories[index];
    newStories[index] = newStories[targetIndex];
    newStories[targetIndex] = temp;

    const items = newStories.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    setStories(newStories);
    try {
      await adminApi.reorderStories(items);
    } catch (err) {
      console.error(err);
      await loadStories();
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat cerita...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Cerita Cinta (Our Story)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola linimasa perjalanan cinta (Awal Bertemu, Lamaran, Menikah)
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Tambah Cerita</span>
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

      {stories.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
          <BookOpen size={36} style={{ margin: '0 auto 12px auto', color: '#cbd5e1' }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>Belum ada cerita perjalanan cinta</p>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ marginTop: '12px' }}
            onClick={openAddModal}
          >
            <Plus size={14} />
            <span>Tambah Cerita Pertama</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {stories.map((story, idx) => (
            <div
              key={story.id}
              className="admin-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '20px 24px',
                margin: 0,
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, -1)}
                    style={{
                      background: 'none',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      opacity: idx === 0 ? 0.3 : 1,
                    }}
                    title="Pindah ke atas"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === stories.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    style={{
                      background: 'none',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      cursor: idx === stories.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: idx === stories.length - 1 ? 0.3 : 1,
                    }}
                    title="Pindah ke bawah"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {story.image_url && (
                  <img
                    src={resolveAssetUrl(story.image_url)}
                    alt={story.title}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#7A2025' }}>
                      {story.title}
                    </span>
                    <span className="admin-badge admin-badge-neutral">
                      #{story.sort_order || idx + 1}
                    </span>
                  </div>

                  {story.date_label && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12.5px',
                        color: '#64748b',
                        marginTop: '4px',
                      }}
                    >
                      <Calendar size={13} />
                      <span>{story.date_label}</span>
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#334155',
                      lineHeight: 1.6,
                      marginTop: '8px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {story.body}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => openEditModal(story)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ color: '#dc2626', borderColor: '#fecaca' }}
                  onClick={() => setDeleteTarget(story)}
                >
                  <Trash2 size={13} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title">
                {editingStory ? 'Edit Cerita' : 'Tambah Cerita Baru'}
              </h3>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-label">Judul Tahap Cerita *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Awal Bertemu / Lamaran / Menikah"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Periode / Tanggal</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Januari 2023 / 15 Mei 2025"
                  value={formData.date_label}
                  onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Isi Cerita *</label>
                <textarea
                  className="admin-textarea"
                  rows={5}
                  placeholder="Tuliskan kisah perjalanan cinta di sini..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Foto Kenangan (Opsional)</label>
                <ImageUploader
                  currentImageUrl={formData.image_url}
                  onFileSelect={(file) => setSelectedFile(file)}
                  label="Pilih Foto Cerita"
                  maxHeight="160px"
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Menyimpan...' : (editingStory ? 'Simpan Perubahan' : 'Tambah Cerita')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Cerita"
        message={`Apakah Anda yakin ingin menghapus cerita "${deleteTarget?.title}"?`}
        confirmText="Hapus Cerita"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}