import React, { useState, useEffect } from 'react';
import { Home, Heart, Calendar, Image, MessageSquareHeart } from 'lucide-react';

/**
 * FloatingNav Component — Architectural Velvet & Gold-Hairline Dock
 *
 * Refined bottom navigation bar with double-hairline gold trim, scroll-spy,
 * and smooth section jumping.
 */
const NAV_ITEMS = [
  { id: 'hero', label: 'Sampul', icon: Home },
  { id: 'couple', label: 'Mempelai', icon: Heart, sectionKey: 'showCouple' },
  { id: 'events', label: 'Acara', icon: Calendar, sectionKey: 'showEvents' },
  { id: 'gallery', label: 'Galeri', icon: Image, sectionKey: 'showGallery' },
  { id: 'rsvp', label: 'Ucapan', icon: MessageSquareHeart, sectionKey: 'showRsvp' },
];

export default function FloatingNav({ isVisible = true, sections = {} }) {
  const [activeSection, setActiveSection] = useState('hero');

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.sectionKey || sections[item.sectionKey] !== false
  );

  useEffect(() => {
    if (!isVisible) return;

    const sectionIds = visibleNavItems.map((item) => item.id);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, visibleNavItems.length]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <nav className="floating-bottom-nav" aria-label="Navigasi Cepat Undangan">
      <div className="floating-nav-dock">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => scrollToSection(item.id)}
              aria-label={`Buka bagian ${item.label}`}
              title={item.label}
            >
              <div className="nav-icon-wrap">
                <Icon size={16} strokeWidth={1.75} className="nav-icon" />
              </div>
              <span className="nav-label font-body">{item.label}</span>
              {isActive && <span className="active-bar" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <style>{`
        .floating-bottom-nav {
          position: fixed;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 370px;
          z-index: 880;
          animation: floatingNavEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: auto;
        }

        @keyframes floatingNavEnter {
          from {
            opacity: 0;
            transform: translate(-50%, 16px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .floating-nav-dock {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: rgba(18, 12, 12, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(225, 201, 142, 0.42);
          border-radius: 4px;
          padding: 6px 8px;
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.55),
            inset 0 0 0 3px rgba(225, 201, 142, 0.1);
        }

        .nav-item-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 6px 8px;
          border-radius: 3px;
          cursor: pointer;
          color: rgba(255, 253, 248, 0.55);
          transition: all var(--transition-fast);
          min-width: 54px;
          text-decoration: none;
        }

        .nav-item-btn:hover {
          color: var(--gold-300);
        }

        .nav-item-btn.is-active {
          color: var(--gold-300);
        }

        .nav-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 20px;
          transition: transform var(--transition-fast);
        }

        .nav-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 2px;
          line-height: 1.2;
        }

        .active-bar {
          position: absolute;
          bottom: 1px;
          width: 14px;
          height: 1px;
          background-color: var(--gold-300);
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-bottom-nav {
            animation: none !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>
    </nav>
  );
}
