import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';
import {
  Gift,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save,
} from 'lucide-react';

export default function GiftManagement() {
  const [gifts, setGifts] = useState([]);
  const [shipping, setShipping] = useState({ recipient: '', phone: '', address: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSavingShipping, setIsSavingShipping] = useState(false);

  // Add / Edit Account Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [formData, setFormData] = useState({
    type: 'bank',
    provider: 'BCA',
    account_holder: '',
    account_number: '',
    sort_order: 0,
  });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getGifts();
      if (res.success && res.data) {
        setGifts(res.data.gifts || []);
        if (res.data.shipping) {
          setShipping({
            recipient: res.data.shipping.recipient || '',
            phone: res.data.shipping.phone || '',
            address: res.data.shipping.address || '',
          });
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat data rekening dan kado.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingGift(null);
    setFormData({
      type: 'bank',
      provider: 'MANDIRI',
      account_holder: '',
      account_number: '',
      sort_order: gifts.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (gift) => {
    setEditingGift(gift);
    setFormData({
      type: gift.type || 'bank',
      provider: gift.provider || '',
      account_holder: gift.account_holder || '',
      account_number: gift.account_number || '',
      sort_order: gift.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveGift = async (e) => {
    e.preventDefault();
    if (!formData.provider || !formData.account_holder || !formData.account_number) {
      setStatusMessage({ type: 'error', text: 'Provider, nama pemilik, dan nomor rekening wajib diisi.' });
      return;
    }

    try {
      if (editingGift) {
        await adminApi.updateGift(editingGift.id, formData);
        setStatusMessage({ type: 'success', text: 'Rekening berhasil diperbarui!' });
      } else {
        await adminApi.createGift(formData);
        setStatusMessage({ type: 'success', text: 'Rekening baru berhasil ditambahkan!' });
      }
      setIsModalOpen(false);
      await loadData();
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan rekening.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteGift(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Rekening berhasil dihapus.' });
        setDeleteTarget(null);
        await loadData();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus rekening.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveShipping = async (e) => {
    e.preventDefault();
    if (!shipping.recipient || !shipping.address) {
      setStatusMessage({ type: 'error', text: 'Nama penerima dan alamat pengiriman wajib diisi.' });
      return;
    }

    setIsSavingShipping(true);
    setStatusMessage({ type: '', text: '' });
    try {
      await adminApi.updateShipping(shipping);
      setStatusMessage({ type: 'success', text: 'Alamat pengiriman kado fisik berhasil disimpan!' });
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan alamat pengiriman.' });
    } finally {
      setIsSavingShipping(false);
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gifts.length) return;

    const newGifts = [...gifts];
    const temp = newGifts[index];
    newGifts[index] = newGifts[targetIndex];
    newGifts[targetIndex] = temp;

    const items = newGifts.map((item, idx) => ({
      id: item.id,
      sort_order: idx + 1,
    }));

    setGifts(newGifts);
    try {
      await adminApi.reorderGifts(items);
    } catch (err) {
      console.error(err);
      await loadData();
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat data rekening & kado...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Hadiah Pernikahan (Wedding Gift)
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Kelola nomor rekening bank, dompet digital, dan alamat penerimaan kado fisik
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Tambah Rekening</span>
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

      {/* Accounts List */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Daftar Rekening & Dompet Digital</h3>
            <p className="admin-card-desc">Tampil pada kartu cashless transfer undangan</p>
          </div>
        </div>

        {gifts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
            <CreditCard size={36} style={{ margin: '0 auto 8px auto', color: '#cbd5e1' }} />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>Belum ada rekening yang ditambahkan</p>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              style={{ marginTop: '8px' }}
              onClick={openAddModal}
            >
              <Plus size={14} />
              <span>Tambah Rekening Pertama</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gifts.map((gift, idx) => (
              <div
                key={gift.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  background: '#fff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === gifts.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      style={{
                        background: 'none',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        cursor: idx === gifts.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: idx === gifts.length - 1 ? 0.3 : 1,
                      }}
                      title="Pindah ke bawah"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: '#7A2025',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {gift.provider}
                      </span>
                      <span className="admin-badge admin-badge-neutral">
                        {gift.type === 'ewallet' ? 'E-Wallet' : 'Bank'}
                      </span>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                      {gift.account_number}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      a.n. {gift.account_holder}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => openEditModal(gift)}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    onClick={() => setDeleteTarget(gift)}
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shipping Address Section */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Alamat Pengiriman Kado Fisik</h3>
            <p className="admin-card-desc">Alamat rumah/tempat penerimaan paket hadiah dari tamu</p>
          </div>
        </div>

        <form onSubmit={handleSaveShipping}>
          <div className="admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Nama Penerima Paket *</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Contoh: Raka Pratama & Alya Putri"
                value={shipping.recipient}
                onChange={(e) => setShipping({ ...shipping, recipient: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                className="admin-input"
                placeholder="Contoh: 0812-3456-7890"
                value={shipping.phone}
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Alamat Lengkap Pengiriman *</label>
            <textarea
              className="admin-textarea"
              rows={3}
              placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, kode pos..."
              value={shipping.address}
              onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isSavingShipping}
            >
              <Save size={14} />
              <span>{isSavingShipping ? 'Menyimpan...' : 'Simpan Alamat Kado'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Add / Edit Gift Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-card-header" style={{ marginBottom: '16px' }}>
              <h3 className="admin-card-title">
                {editingGift ? 'Edit Rekening' : 'Tambah Rekening Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveGift}>
              <div className="admin-form-group">
                <label className="admin-label">Jenis Pembayaran</label>
                <select
                  className="admin-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="bank">Transfer Bank</option>
                  <option value="ewallet">Dompet Digital (E-Wallet)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nama Bank / Provider *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: BCA, MANDIRI, BRI, BNI, DANA, OVO"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nomor Rekening / Nomor E-Wallet *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: 1234567890"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nama Pemilik Rekening (Atas Nama) *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Raka Pratama"
                  value={formData.account_holder}
                  onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
                  required
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
                  {editingGift ? 'Simpan Perubahan' : 'Tambah Rekening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Rekening"
        message={`Apakah Anda yakin ingin menghapus rekening ${deleteTarget?.provider} (${deleteTarget?.account_number})?`}
        confirmText="Hapus Rekening"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}