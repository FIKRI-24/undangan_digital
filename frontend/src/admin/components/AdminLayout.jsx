import React from 'react';
import { Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LogOut, User, ExternalLink, RefreshCw, Palette, PlusCircle } from 'lucide-react';
import '../admin.css';

export default function AdminLayout() {
  const { admin, wedding, weddings = [], isAuthenticated, isLoading, logout, switchWedding } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#64748b',
          gap: '12px',
        }}
      >
        <RefreshCw size={28} className="animate-spin-slow" style={{ color: '#7A2025' }} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Memuat sesi admin...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleClientSwitch = async (e) => {
    const selectedId = parseInt(e.target.value, 10);
    if (selectedId && selectedId !== wedding?.id) {
      await switchWedding(selectedId);
    }
  };

  const publicSlug = wedding?.slug || 'raka-alya';

  return (
    <div className="admin-app">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>Klien Aktif:</span>

            {weddings.length > 0 ? (
              <select
                value={wedding?.id || ''}
                onChange={handleClientSwitch}
                aria-label="Pilih klien undangan yang dikelola"
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  background: '#fff',
                  color: '#7A2025',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {weddings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} (/{w.slug})
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ color: '#7A2025', fontWeight: 700 }}>
                {wedding?.title || 'The Wedding of Raka & Alya'}
              </span>
            )}

            <a
              href={`/${publicSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#64748b',
                background: '#f1f5f9',
                padding: '4px 8px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              title="Buka halaman undangan publik di tab baru"
            >
              <span>/{publicSlug}</span>
              <ExternalLink size={11} />
            </a>

            <Link
              to="/admin/appearance"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#7A2025',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                padding: '4px 9px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              title="Kustomisasi warna & tema klien ini"
            >
              <Palette size={12} />
              <span>Custom Tampilan</span>
            </Link>

            <Link
              to="/admin/clients"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#334155',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '4px 9px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              title="Tambah atau kelola daftar klien"
            >
              <PlusCircle size={12} />
              <span>Klien Baru</span>
            </Link>
          </div>

          <div className="admin-header-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
              <User size={15} style={{ color: '#7A2025' }} />
              <span style={{ fontWeight: 600 }}>{admin?.username || 'Admin'}</span>
            </div>

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={handleLogout}
              title="Keluar dari sesi admin"
            >
              <LogOut size={14} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet key={wedding?.id || 'default'} />
        </main>
      </div>
    </div>
  );
}