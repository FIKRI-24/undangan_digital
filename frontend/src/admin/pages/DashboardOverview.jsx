import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquareHeart,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Palette,
} from 'lucide-react';

export default function DashboardOverview() {
  const { wedding } = useAdminAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWedding();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const publicSlug = data?.wedding?.slug || wedding?.slug || 'raka-alya';
  const publicUrl = `${window.location.origin}/${publicSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={24} className="animate-spin-slow" style={{ color: '#7A2025', margin: '0 auto 12px auto' }} />
        <span>Memuat statistik ringkasan...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const rsvp = stats.rsvp || { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 };
  const weddingInfo = data?.wedding || {};

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="admin-card"
        style={{
          background: 'linear-gradient(135deg, #1e1b1b 0%, #2d2424 100%)',
          color: '#fff',
          border: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: '#e1c98e',
                textTransform: 'uppercase',
              }}
            >
              PANEL ADMIN UNDANGAN
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0 4px 0', color: '#fff' }}>
              {weddingInfo.title || 'The Wedding of Raka & Alya'}
            </h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
              Status:{' '}
              <span
                style={{
                  color: weddingInfo.status === 'active' ? '#4ade80' : '#f87171',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {weddingInfo.status || 'Active'}
              </span>{' '}
              • Timezone: {weddingInfo.timezone || 'Asia/Jakarta'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleCopyLink}
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              {copied ? <Check size={14} style={{ color: '#4ade80' }} /> : <Copy size={14} />}
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-primary"
              style={{ background: '#7A2025', borderColor: '#c7a15a' }}
            >
              <ExternalLink size={14} />
              <span>Buka Undangan</span>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{stats.guestsCount || 0}</div>
            <div className="admin-stat-label">Total Tamu Terdaftar</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{rsvp.hadir}</div>
            <div className="admin-stat-label">Konfirmasi Hadir</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{rsvp.tidak_hadir}</div>
            <div className="admin-stat-label">Tidak Dapat Hadir</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <div className="admin-stat-value">{rsvp.ragu}</div>
            <div className="admin-stat-label">Masih Ragu</div>
          </div>
        </div>
      </div>

      {/* Quick Access Navigation */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Akses Cepat Pengelolaan</h3>
            <p className="admin-card-desc">Navigasi langsung ke modul utama undangan pernikahan</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Link
            to="/admin/clients"
            style={{
              padding: '18px',
              border: '1.5px solid #cbd5e1',
              background: '#f8fafc',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <Layers size={18} />
              <span>Daftar Klien (Multi-Undangan)</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Buat undangan untuk klien baru, duplikat undangan & pindah klien yang dikelola
            </span>
          </Link>

          <Link
            to="/admin/appearance"
            style={{
              padding: '18px',
              border: '1.5px solid #fecdd3',
              background: '#fffafb',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <Palette size={18} />
              <span>Tampilan & Tema (Custom)</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Pilih preset tema adat/modern, custom warna bebas, font, ornamen & visibilitas section
            </span>
          </Link>

          <Link
            to="/admin/couple"
            style={{
              padding: '18px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'border-color 0.15s, transform 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <Users size={18} />
              <span>Data Mempelai</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Edit profil pengantin pria, wanita, orang tua & Instagram
            </span>
          </Link>

          <Link
            to="/admin/events"
            style={{
              padding: '18px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <Calendar size={18} />
              <span>Jadwal Acara & Peta</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Kelola waktu akad, resepsi, alamat venue & URL Maps ({stats.eventsCount || 0} Acara)
            </span>
          </Link>

          <Link
            to="/admin/gallery"
            style={{
              padding: '18px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <ImageIcon size={18} />
              <span>Foto & Galeri</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Ganti foto cover, hero & upload galeri ({stats.galleryCount || 0} Foto)
            </span>
          </Link>

          <Link
            to="/admin/rsvps"
            style={{
              padding: '18px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: '#7A2025' }}>
              <MessageSquareHeart size={18} />
              <span>RSVP & Doa Ucapan</span>
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Lihat ucapan masuk ({rsvp.total} Total ucapan) & hapus spam
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}