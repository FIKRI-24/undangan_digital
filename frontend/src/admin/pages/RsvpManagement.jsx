import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';
import {
  MessageSquareHeart,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Filter,
} from 'lucide-react';

export default function RsvpManagement() {
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 });
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRsvps = async (currentFilter = filter) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getRsvps(currentFilter);
      if (res.success && res.data) {
        setRsvps(res.data.rsvps || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat data ucapan.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRsvps(filter);
  }, [filter]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteRsvp(deleteTarget.id);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Ucapan spam berhasil dihapus.' });
        setDeleteTarget(null);
        await loadRsvps();
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghapus ucapan.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getAttendanceBadge = (attendance) => {
    switch (attendance) {
      case 'hadir':
        return <span className="admin-badge admin-badge-success">Hadir</span>;
      case 'tidak_hadir':
        return <span className="admin-badge admin-badge-danger">Tidak Hadir</span>;
      case 'ragu':
        return <span className="admin-badge admin-badge-warning">Masih Ragu</span>;
      default:
        return <span className="admin-badge admin-badge-neutral">{attendance}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            RSVP & Doa Ucapan
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Pantau kehadiran para tamu dan bersihkan ucapan yang tidak pantas atau spam
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          onClick={() => loadRsvps(filter)}
        >
          <RefreshCw size={14} />
          <span>Segarkan</span>
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

      {/* Filter Tabs & Summary Chips */}
      <div className="admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} />
              <span>Filter Kehadiran:</span>
            </span>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filter === '' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilter('')}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filter === 'hadir' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilter('hadir')}
            >
              Hadir ({stats.hadir})
            </button>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filter === 'tidak_hadir' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilter('tidak_hadir')}
            >
              Tidak Hadir ({stats.tidak_hadir})
            </button>
            <button
              type="button"
              className={`admin-btn admin-btn-sm ${filter === 'ragu' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              onClick={() => setFilter('ragu')}
            >
              Masih Ragu ({stats.ragu})
            </button>
          </div>
        </div>
      </div>

      {/* RSVPs Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
            <span>Memuat data ucapan...</span>
          </div>
        ) : rsvps.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
            <MessageSquareHeart size={36} style={{ margin: '0 auto 12px auto', color: '#cbd5e1' }} />
            <p style={{ fontSize: '14.5px', fontWeight: 600 }}>Belum ada ucapan untuk filter ini</p>
          </div>
        ) : (
          <div className="admin-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Pengirim</th>
                  <th>Status</th>
                  <th>Jumlah Hadir</th>
                  <th style={{ width: '40%' }}>Pesan Doa & Ucapan</th>
                  <th>Waktu Kirim</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ color: '#94a3b8', width: '40px' }}>{idx + 1}</td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                    </td>
                    <td>{getAttendanceBadge(item.attendance)}</td>
                    <td>
                      {item.attendance === 'hadir' ? (
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>
                          {item.guest_count || 1} orang
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#334155',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {item.message || <em style={{ color: '#94a3b8' }}>(Tanpa pesan teks)</em>}
                      </p>
                    </td>
                    <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : '-'}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        style={{ color: '#dc2626', borderColor: '#fecaca' }}
                        onClick={() => setDeleteTarget(item)}
                        title="Hapus pesan ini (spam)"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Ucapan / RSVP"
        message={`Apakah Anda yakin ingin menghapus pesan dari "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Ucapan"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}