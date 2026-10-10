import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import ConfirmModal from '../components/ConfirmModal';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function GuestManagement() {
  const { wedding } = useAdminAuth();
  const [guests, setGuests] = useState([]);
  const [weddingSlug, setWeddingSlug] = useState('raka-alya');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    invitation_code: '',
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadGuests = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getGuests();
      if (res.success && res.data) {
        setGuests(res.data.guests || []);
        if (res.data.weddingSlug) {
          setWeddingSlug(res.data.weddingSlug);
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat daftar tamu.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, []);

  // Update slug if context changed
  useEffect(() => {
    if (wedding?.slug) {
      setWeddingSlug(wedding.slug);
    }
  }, [wedding]);

  const openAddModal = () => {
    setEditingGuest(null);
    setFormData({ name: '', phone: '', invitation_code: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name || '',
      phone: guest.phone || '',
      invitation_code: guest.invitation_code || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setStatusMessage({ type: 'error', text: 'Nama tamu minimal 2 karakter.' });
      return;
    }

    try {
      if (editingGuest) {
        await adminApi.updateGuest(editingGuest.id, formData);
        setStatusMessage({ type: 'success', text: 'Data tamu berhasil diperbarui!' });
      } else {
        await adminApi.createGuest(formData);
        setStatusMessage({ type: 'success', text: 'Tamu baru berhasil ditambahkan!' });
      }
      setIsModalOpen(false);
      await loadGuests();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan tamu.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteGuest(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Tamu berhasil dihapus.' });
        setDeleteTarget(null);
        await loadGuests();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus tamu.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Generate personalized URL with dynamic wedding slug and encodeURIComponent (Rule #16, #17)
  const getPersonalizedUrl = (guestName) => {
    const origin = window.location.origin;
    const currentSlug = weddingSlug || wedding?.slug || 'raka-alya';
    return `${origin}/${currentSlug}?to=${encodeURIComponent(guestName.trim())}`;
  };

  const handleCopyLink = (guest) => {
    const url = getPersonalizedUrl(guest.name);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.phone && g.phone.includes(searchQuery))
  );

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat daftar tamu...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Daftar Tamu Undangan ({guests.length})
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Generate dan salin tautan undangan yang telah dipersonalisasi untuk masing-masing tamu
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Tambah Tamu Baru</span>
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

      {/* Search Bar */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            className="admin-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Cari nama atau nomor telepon tamu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Guest Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredGuests.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
            <Users size={36} style={{ margin: '0 auto 12px auto', color: '#cbd5e1' }} />
            <p style={{ fontSize: '14.5px', fontWeight: 600 }}>
              {searchQuery ? 'Tidak ditemukan tamu yang cocok' : 'Belum ada tamu undangan yang ditambahkan'}
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Tamu</th>
                  <th>No. WhatsApp / Telepon</th>
                  <th>Kode Undangan</th>
                  <th>Tautan Khusus Tamu</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, idx) => {
                  const guestUrl = getPersonalizedUrl(guest.name);
                  const isCopied = copiedId === guest.id;

                  return (
                    <tr key={guest.id}>
                      <td style={{ color: '#94a3b8', width: '40px' }}>{idx + 1}</td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{guest.name}</strong>
                      </td>
                      <td style={{ color: '#64748b' }}>{guest.phone || '-'}</td>
                      <td>
                        {guest.invitation_code ? (
                          <span className="admin-badge admin-badge-neutral">{guest.invitation_code}</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#64748b',
                              maxWidth: '220px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              background: '#f8fafc',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                            }}
                            title={guestUrl}
                          >
                            {guestUrl}
                          </span>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => handleCopyLink(guest)}
                            title="Salin tautan tamu"
                          >
                            {isCopied ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
                            <span>{isCopied ? 'Disalin' : 'Salin'}</span>
                          </button>
                          <a
                            href={guestUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="Buka undangan tamu di tab baru"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => openEditModal(guest)}
                            title="Edit tamu"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ color: '#dc2626', borderColor: '#fecaca' }}
                            onClick={() => setDeleteTarget(guest)}
                            title="Hapus tamu"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title">
                {editingGuest ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}
              </h3>
            </div>

            <form onSubmit={handleSave}>
              <div className="admin-form-group">
                <label className="admin-label">Nama Tamu Undangan *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Budi Santoso & Keluarga"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <span className="admin-form-hint">Nama ini akan tampil di bagian "Kepada Yth:"</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nomor WhatsApp / Telepon (Opsional)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: 0812-3456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Kode Undangan Khusus (Opsional)</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: VIP-01 / REG-024"
                  value={formData.invitation_code}
                  onChange={(e) => setFormData({ ...formData, invitation_code: e.target.value })}
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
                  {editingGuest ? 'Simpan Perubahan' : 'Tambah Tamu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Tamu"
        message={`Apakah Anda yakin ingin menghapus tamu "${deleteTarget?.name}"?`}
        confirmText="Hapus Tamu"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}