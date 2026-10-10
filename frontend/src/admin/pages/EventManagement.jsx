import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Navigation,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
} from 'lucide-react';

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Resepsi',
    date: '',
    date_label: '',
    start_time: '11:00',
    end_time: '',
    end_time_label: 'Selesai',
    venue: '',
    address: '',
    maps_url: '',
    sort_order: 0,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat daftar acara.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      type: 'Akad Nikah',
      date: new Date().toISOString().split('T')[0],
      date_label: 'Sabtu, 20 Juni 2026',
      start_time: '08:00',
      end_time: '10:00',
      end_time_label: 'Selesai',
      venue: '',
      address: '',
      maps_url: '',
      sort_order: events.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      type: evt.type || '',
      date: evt.date ? evt.date.split('T')[0] : '',
      date_label: evt.date_label || '',
      start_time: evt.start_time || '',
      end_time: evt.end_time || '',
      end_time_label: evt.end_time_label || 'Selesai',
      venue: evt.venue || '',
      address: evt.address || '',
      maps_url: evt.maps_url || '',
      sort_order: evt.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    try {
      if (editingEvent) {
        const res = await adminApi.updateEvent(editingEvent.id, formData);
        if (res.success) {
          setStatusMessage({ type: 'success', text: 'Acara berhasil diperbarui!' });
        }
      } else {
        const res = await adminApi.createEvent(formData);
        if (res.success) {
          setStatusMessage({ type: 'success', text: 'Acara baru berhasil ditambahkan!' });
        }
      }
      setIsModalOpen(false);
      await loadEvents();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan acara.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteEvent(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Acara berhasil dihapus.' });
        setDeleteTarget(null);
        await loadEvents();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus acara.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[targetIndex];
    newEvents[targetIndex] = temp;

    // Build payload
    const items = newEvents.map((evt, idx) => ({
      id: evt.id,
      sort_order: idx + 1,
    }));

    setEvents(newEvents);
    try {
      await adminApi.reorderEvents(items);
    } catch (err) {
      console.error(err);
      await loadEvents(); // Revert on failure
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat jadwal acara...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Informasi Acara (Events)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola rincian Akad Nikah, Resepsi, atau acara syukuran lainnya
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Tambah Acara</span>
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

      {events.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
          <Calendar size={36} style={{ margin: '0 auto 12px auto', color: '#cbd5e1' }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>Belum ada acara pernikahan yang ditambahkan</p>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ marginTop: '12px' }}
            onClick={openAddModal}
          >
            <Plus size={14} />
            <span>Tambah Acara Pertama</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className="admin-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                margin: 0,
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                    disabled={idx === events.length - 1}
                    onClick={() => handleMove(idx, 1)}
                    style={{
                      background: 'none',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      cursor: idx === events.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: idx === events.length - 1 ? 0.3 : 1,
                    }}
                    title="Pindah ke bawah"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#7A2025',
                        textTransform: 'uppercase',
                      }}
                    >
                      {evt.type}
                    </span>
                    <span className="admin-badge admin-badge-neutral">
                      Urutan: {evt.sort_order || idx + 1}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '13px',
                      color: '#475569',
                      marginTop: '6px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: '#7A2025' }} />
                      <span>{evt.date_label || evt.date?.split('T')[0]}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: '#7A2025' }} />
                      <span>
                        {evt.start_time} s/d {evt.end_time || evt.end_time_label || 'Selesai'}
                      </span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} style={{ color: '#7A2025' }} />
                      <span>{evt.venue || 'Venue belum diisi'}</span>
                    </span>
                  </div>

                  {evt.address && (
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
                      {evt.address}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {evt.maps_url && (
                  <a
                    href={evt.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title="Buka Google Maps"
                  >
                    <Navigation size={13} />
                    <span>Peta</span>
                  </a>
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => openEditModal(evt)}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ color: '#dc2626', borderColor: '#fecaca' }}
                  onClick={() => setDeleteTarget(evt)}
                >
                  <Trash2 size={13} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title">
                {editingEvent ? 'Edit Rincian Acara' : 'Tambah Acara Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveEvent}>
              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Jenis Acara *</label>
                  <input
                    type="text"
                    name="type"
                    className="admin-input"
                    placeholder="Akad Nikah / Resepsi"
                    value={formData.type}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tanggal Acara *</label>
                  <input
                    type="date"
                    name="date"
                    className="admin-input"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Label Tanggal (Teks Tampilan)</label>
                <input
                  type="text"
                  name="date_label"
                  className="admin-input"
                  placeholder="Contoh: Sabtu, 20 Juni 2026"
                  value={formData.date_label}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Jam Mulai</label>
                  <input
                    type="text"
                    name="start_time"
                    className="admin-input"
                    placeholder="Contoh: 11:00 WIB"
                    value={formData.start_time}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Jam Selesai / Label Selesai</label>
                  <input
                    type="text"
                    name="end_time_label"
                    className="admin-input"
                    placeholder="Contoh: Selesai / 14:00 WIB"
                    value={formData.end_time_label}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nama Tempat / Venue</label>
                <input
                  type="text"
                  name="venue"
                  className="admin-input"
                  placeholder="Contoh: Gedung Pernikahan Harmoni"
                  value={formData.venue}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Alamat Lengkap</label>
                <textarea
                  name="address"
                  className="admin-textarea"
                  rows={2}
                  placeholder="Alamat jalan, nomor, kota..."
                  value={formData.address}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">URL Google Maps</label>
                <input
                  type="url"
                  name="maps_url"
                  className="admin-input"
                  placeholder="https://maps.google.com/..."
                  value={formData.maps_url}
                  onChange={handleFormChange}
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
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingEvent ? 'Simpan Perubahan' : 'Tambah Acara'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Acara"
        message={`Apakah Anda yakin ingin menghapus acara "${deleteTarget?.type}"?`}
        confirmText="Hapus Acara"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}