import React, { useState, useEffect, useCallback } from 'react';
import { weddingApi } from '../services/api';
import { weddingConfig as fallbackConfig } from '../data/weddingConfig';
import { useAudio } from '../hooks/useAudio';
import {
  normalizeThemeConfig,
  buildThemeCssVariables,
  ensureThemeFontLoaded,
} from '../utils/themePresets';

// Phase 2 Components
import InvitationCover from '../components/InvitationCover';
import HeroSection from '../components/HeroSection';
import QuoteSection from '../components/QuoteSection';
import CoupleSection from '../components/CoupleSection';
import Countdown from '../components/Countdown';
import EventSection from '../components/EventSection';

// Phase 3 Components
import StorySection from '../components/StorySection';
import GallerySection from '../components/GallerySection';
import GiftSection from '../components/GiftSection';
import ClosingSection from '../components/ClosingSection';
import MusicPlayer from '../components/MusicPlayer';
import FloatingNav from '../components/FloatingNav';
import Toast from '../components/Toast';
import RsvpSection from '../components/RsvpSection';
import { RefreshCw, AlertCircle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * WeddingPage Component
 * Integrated Phase 1, 2, 3, 4 & Multi-Client Dynamic Theme Engine.
 *
 * Fetches live wedding data from PostgreSQL backend API (GET /api/weddings/:slug)
 * with graceful fallback to local config, elegant monogram loading, and error states.
 */
export default function WeddingPage() {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const [hasOpenedCover, setHasOpenedCover] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Determine slug from URL pathname (e.g. /raka-alya) or default to 'raka-alya'
  const getSlugFromUrl = () => {
    if (typeof window === 'undefined') return 'raka-alya';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    return path && path !== 'index.html' ? path : 'raka-alya';
  };

  const fetchWeddingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const slug = getSlugFromUrl();
      const result = await weddingApi.getWeddingBySlug(slug);

      if (result.success && result.data) {
        setConfig(result.data);
        setIsLiveApi(Boolean(result.isLiveApi));
      } else {
        throw new Error('Data undangan tidak dapat dimuat');
      }
    } catch (err) {
      console.error('[WeddingPage Error]:', err);
      setError(err.message || 'Undangan belum dapat dimuat.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeddingData();
  }, [fetchWeddingData]);

  // Dynamically load selected Google Fonts and update document title per client
  useEffect(() => {
    if (config) {
      ensureThemeFontLoaded(config.themeConfig);
      if (config.title) {
        document.title = config.title;
      }
    }
  }, [config]);

  // Initialize AOS (Animate On Scroll) once globally
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: false,
      offset: 80,
      anchorPlacement: 'top-bottom',
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  // Refresh AOS after live wedding data renders
  useEffect(() => {
    if (config && !isLoading) {
      const timer = setTimeout(() => {
        AOS.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [config, isLoading]);

  // Single shared audio instance (uses music url from API data or fallback)
  const musicUrl = config?.music?.url || '/audio/wedding.mp3';
  const { isPlaying, play: playAudio, toggle: toggleAudio } = useAudio(musicUrl);

  const handleOpenInvitation = useCallback(() => {
    setHasOpenedCover(true);
    playAudio();
    setTimeout(() => {
      AOS.refresh();
    }, 400);
  }, [playAudio]);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  }, []);

  // ===========================================================================
  // 18. LOADING STATE (PRD Section 18)
  // Monogram + subtle gold spinner (no dashboard skeletons)
  // ===========================================================================
  if (isLoading) {
    return (
      <div className="wedding-loading-screen">
        <div className="loading-card">
          <div className="loading-monogram font-heading">
            <span>W</span>
            <span className="monogram-amp font-script">&amp;</span>
            <span>I</span>
          </div>
          <div className="loading-spinner" />
          <p className="loading-text font-body">Memuat Undangan...</p>
        </div>

        <style>{`
          .wedding-loading-screen {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--cream-100);
            padding: 20px;
          }

          .loading-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .loading-monogram {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            border: 1.5px solid var(--gold-500);
            background: linear-gradient(135deg, #3d1014, #200608);
            color: var(--gold-300);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(94, 23, 27, 0.35);
            margin-bottom: 24px;
          }

          .monogram-amp {
            font-size: 20px;
            color: var(--dusty-rose-300);
            margin: 0 2px;
          }

          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(199, 161, 90, 0.25);
            border-top-color: var(--wine-700);
            border-radius: 50%;
            animation: spinSlow 1s linear infinite;
            margin-bottom: 16px;
          }

          .loading-text {
            font-size: var(--text-xs);
            letter-spacing: 0.2em;
            color: var(--wine-700);
            text-transform: uppercase;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  // ===========================================================================
  // 19. ERROR STATE (PRD Section 19)
  // "Undangan belum dapat dimuat. Silakan coba beberapa saat lagi. [ COBA LAGI ]"
  // ===========================================================================
  if (error || !config) {
    return (
      <div className="wedding-error-screen">
        <div className="error-card wedding-card">
          <div className="error-icon-wrap">
            <AlertCircle size={28} className="text-wine-700" />
          </div>

          <h2 className="error-title font-heading text-wine-900">
            {error === 'Undangan tidak ditemukan' ? 'Undangan Tidak Ditemukan' : 'Undangan Belum Dapat Dimuat'}
          </h2>

          <p className="error-message font-body text-muted">
            {error === 'Undangan tidak ditemukan'
              ? 'Tautan undangan yang Anda tuju tidak terdaftar atau telah dinonaktifkan.'
              : 'Silakan periksa koneksi internet Anda atau coba beberapa saat lagi.'}
          </p>

          <button
            type="button"
            className="btn-primary error-retry-btn"
            onClick={fetchWeddingData}
          >
            <RefreshCw size={16} />
            <span>COBA LAGI</span>
          </button>
        </div>

        <style>{`
          .wedding-error-screen {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--paper);
            padding: 24px 20px;
          }

          .error-card {
            max-width: 380px;
            width: 100%;
            text-align: center;
            padding: 36px 24px;
            border: 1.5px solid rgba(199, 161, 90, 0.4);
          }

          .error-icon-wrap {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(122, 32, 37, 0.1);
            border: 1px solid rgba(199, 161, 90, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }

          .error-title {
            font-size: var(--text-xl);
            font-weight: 700;
            margin-bottom: 12px;
          }

          .error-message {
            font-size: var(--text-sm);
            line-height: var(--leading-relaxed);
            margin-bottom: 24px;
          }

          .error-retry-btn {
            width: 100%;
          }
        `}</style>
      </div>
    );
  }

  // Active Wedding Configuration & Normalized Theme
  const activeConfig = config;
  const theme = normalizeThemeConfig(activeConfig.themeConfig);
  const themeCssVars = buildThemeCssVariables(theme);
  const sections = theme.sections || {};

  return (
    <div
      className="wedding-page-wrapper"
      style={themeCssVars}
      data-theme-preset={theme.preset}
      data-ornament-style={theme.visual?.ornamentStyle || 'minang'}
      data-frame-style={theme.visual?.frameStyle || 'arch'}
      data-particles={String(theme.visual?.showParticles !== false)}
    >
      {/* ====================================================================
          1. INVITATION COVER (PRD Section 8)
          Fullscreen fixed overlay. Starts audio safely on open.
          ==================================================================== */}
      <InvitationCover
        config={activeConfig}
        onOpen={handleOpenInvitation}
      />

      {/* ====================================================================
          MAIN CONTAINER: .invitation-shell (PRD Section 6.4)
          Max-width 480px, centered on desktop, 100% full-width on mobile.
          ==================================================================== */}
      <main className="invitation-shell">
        {/* 2. Hero Section */}
        <HeroSection config={activeConfig} />

        {/* 3. Quote Section */}
        {sections.showQuote !== false && (
          <QuoteSection quote={activeConfig.quote} />
        )}

        {/* 4. Groom & Bride Section */}
        {sections.showCouple !== false && (
          <CoupleSection
            groom={activeConfig.groom}
            bride={activeConfig.bride}
            invitationIntro={activeConfig.invitationIntro}
            greetingSalam={theme.customTexts?.coupleGreeting}
          />
        )}

        {/* 5. Save The Date & Countdown */}
        {sections.showCountdown !== false && (
          <Countdown
            countdownConfig={activeConfig.countdown}
            dateDisplay={activeConfig.dateDisplay}
          />
        )}

        {/* 6. Event Information & Google Maps */}
        {sections.showEvents !== false && (
          <EventSection events={activeConfig.events} />
        )}

        {/* 7. Our Story Timeline */}
        {sections.showStory !== false && (
          <StorySection stories={activeConfig.stories} />
        )}

        {/* 8. Our Gallery & Lightbox */}
        {sections.showGallery !== false && (
          <GallerySection gallery={activeConfig.gallery} />
        )}

        {/* 9. Wedding Gift & Physical Shipping */}
        {sections.showGift !== false && (
          <GiftSection
            gifts={activeConfig.gifts}
            giftShipping={activeConfig.giftShipping}
            onNotify={showToast}
          />
        )}

        {/* 10. Best Wish & RSVP (PRD Section 18 & 19) */}
        {sections.showRsvp !== false && (
          <RsvpSection
            slug={activeConfig.wedding?.slug || activeConfig.slug || 'raka-alya'}
            onNotify={showToast}
          />
        )}

        {/* 11. Closing Section */}
        {sections.showClosing !== false && (
          <ClosingSection config={activeConfig} />
        )}

        {/* Footer / Copyright */}
        <footer className="wedding-footer">
          <p className="font-heading footer-brand" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
            {activeConfig.footer.brand}
          </p>
          <p className="text-muted font-body" style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>
            {activeConfig.footer.tagline} © {activeConfig.footer.year}
          </p>
        </footer>
      </main>

      {/* ====================================================================
          11. FLOATING MUSIC PLAYER
          Visible only after cover has been opened. Shares single audio instance.
          ==================================================================== */}
      <MusicPlayer
        isPlaying={isPlaying}
        onToggle={toggleAudio}
        isVisible={hasOpenedCover}
      />

      {/* ====================================================================
          12. FLOATING BOTTOM NAVIGATION PILL
          Visible only after cover has been opened.
          ==================================================================== */}
      <FloatingNav isVisible={hasOpenedCover} sections={sections} />

      {/* ====================================================================
          13. TOAST NOTIFICATION
          ==================================================================== */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
      />

      <style>{`
        .wedding-page-wrapper {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background-color: #171312;
          width: 100%;
        }

        .wedding-footer {
          padding: 36px 20px 54px 20px;
          text-align: center;
          background-color: var(--black-soft);
          color: var(--muted);
          border-top: none;
        }

        .wedding-footer .footer-brand {
          color: var(--gold-400);
        }
      `}</style>
    </div>
  );
}
