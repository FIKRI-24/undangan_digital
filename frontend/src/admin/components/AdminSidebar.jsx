import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Gift,
  Music,
  Quote,
  Users,
  MessageSquareHeart,
  Settings,
  ExternalLink,
  Layers,
  Palette,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/clients', label: 'Daftar Klien (Multi)', icon: Layers },
  { path: '/admin/appearance', label: 'Tampilan & Tema', icon: Palette },
  { path: '/admin/couple', label: 'Data Pengantin', icon: Heart },
  { path: '/admin/events', label: 'Informasi Acara', icon: Calendar },
  { path: '/admin/gallery', label: 'Foto & Gallery', icon: ImageIcon },
  { path: '/admin/stories', label: 'Love Story', icon: BookOpen },
  { path: '/admin/gifts', label: 'Wedding Gift', icon: Gift },
  { path: '/admin/music', label: 'Musik', icon: Music },
  { path: '/admin/quote', label: 'Quote / Ayat', icon: Quote },
  { path: '/admin/guests', label: 'Tamu Undangan', icon: Users },
  { path: '/admin/rsvps', label: 'RSVP & Ucapan', icon: MessageSquareHeart },
  { path: '/admin/settings', label: 'Pengaturan Dasar', icon: Settings },
];

export default function AdminSidebar() {
  const { wedding } = useAdminAuth();
  const publicSlug = wedding?.slug || 'raka-alya';

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo-circle">W</div>
        <div>
          <div className="admin-brand-name">Wedding Admin</div>
          <div className="admin-brand-sub">Sistem Manajemen Undangan</div>
        </div>
      </div>

      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <a
          href={`/${publicSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-secondary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '12.5px' }}
        >
          <ExternalLink size={14} />
          <span>Lihat Undangan</span>
        </a>
      </div>
    </aside>
  );
}