import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WeddingPage from './pages/WeddingPage';

// Admin System
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminLayout from './admin/components/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardOverview from './admin/pages/DashboardOverview';
import CoupleManagement from './admin/pages/CoupleManagement';
import EventManagement from './admin/pages/EventManagement';
import GalleryManagement from './admin/pages/GalleryManagement';
import StoryManagement from './admin/pages/StoryManagement';
import GiftManagement from './admin/pages/GiftManagement';
import MusicManagement from './admin/pages/MusicManagement';
import QuoteManagement from './admin/pages/QuoteManagement';
import GuestManagement from './admin/pages/GuestManagement';
import RsvpManagement from './admin/pages/RsvpManagement';
import BasicSettings from './admin/pages/BasicSettings';
import ClientManagement from './admin/pages/ClientManagement';
import AppearanceManagement from './admin/pages/AppearanceManagement';

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* ============================================================= */}
          {/* ADMIN MANAGEMENT ROUTES                                       */}
          {/* Registered BEFORE /:slug so /admin is never captured as a slug */}
          {/* ============================================================= */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="appearance" element={<AppearanceManagement />} />
            <Route path="couple" element={<CoupleManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="stories" element={<StoryManagement />} />
            <Route path="gifts" element={<GiftManagement />} />
            <Route path="music" element={<MusicManagement />} />
            <Route path="quote" element={<QuoteManagement />} />
            <Route path="guests" element={<GuestManagement />} />
            <Route path="rsvps" element={<RsvpManagement />} />
            <Route path="settings" element={<BasicSettings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* ============================================================= */}
          {/* PUBLIC GUEST ROUTES                                           */}
          {/* Strictly 100% unauthenticated. Tamu tidak boleh login.       */}
          {/* ============================================================= */}
          <Route path="/:slug" element={<WeddingPage />} />
          <Route path="/" element={<WeddingPage />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;