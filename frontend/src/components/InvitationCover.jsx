import React, { useState, useEffect } from 'react';
import { useGuestName } from '../hooks/useGuestName';
import { MailOpen } from 'lucide-react';
import AmbientGoldDust from './AmbientGoldDust';

/**
 * InvitationCover Component — Couture Editorial & Fine Letterpress Edition
 *
 * Designed following the `frontend-design` and `luxury-wedding-editorial` skills:
 * - Full-bleed atmospheric editorial photography with chiaroscuro vignette
 * - Continuous double-hairline gold passe-partout stationery frame
 * - Refined crest & monogram medallion
 * - Sculptural script & display serif typography with generous breathing room
 * - Bespoke letterpress guest invitation plaque ("Kepada Yth.") & couture CTA
 */
export default function InvitationCover({ config, onOpen }) {
  const guestName = useGuestName();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.add('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    if (isOpening || isOpen) return;

    setIsOpening(true);
    if (onOpen) onOpen();

    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => {
      setIsOpen(true);
      document.body.classList.remove('scroll-locked');
    }, 1150);
  };

  if (isOpen) {
    return null;
  }

  const groomShort = config?.groom?.shortName || 'Raka';
  const brideShort = config?.bride?.shortName || 'Alya';
  const groomInitial = (config?.groom?.shortName || config?.groom?.name || 'R')[0].toUpperCase();
  const brideInitial = (config?.bride?.shortName || config?.bride?.name || 'A')[0].toUpperCase();
  const dateFormatted = (config?.dateDisplay || '20 . 06 . 2027').replace(/\s*\.\s*/g, '  ·  ');

  const couplePhoto =
    config?.coverPhoto ||
    config?.heroPhoto ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  return (
    <div
      className={`invitation-cover-overlay ${isOpening ? 'cover-exiting' : ''}`}
      aria-hidden={isOpen}
    >
      {/* Full-Bleed Editorial Portrait Background */}
      <div
        className="cover-bg-image"
        style={{
          backgroundImage: `url(${couplePhoto})`,
        }}
      />
      <div className="cover-dark-gradient" />

      {/* Subtle Ambient Gold Shimmer */}
      <AmbientGoldDust count={9} />

      {/* Passe-Partout Double-Hairline Stationery Frame */}
      <div className="cover-stationery-frame" aria-hidden="true">
        <div className="cover-stationery-frame-inner" />
      </div>

      {/* Fine Botanical / Filigree Corner Ornaments */}
      <div className="cover-ornament top-left" aria-hidden="true">
        <img src="/ornaments/ornament-floral-top-left.svg" alt="" width="110" height="110" />
      </div>
      <div className="cover-ornament top-right" aria-hidden="true">
        <img src="/ornaments/ornament-floral-top-right.svg" alt="" width="110" height="110" />
      </div>

      {/* Main Editorial Cover Canvas */}
      <div className="cover-content">
        {/* TOP CREST: Cultural Roof / Monogram Medallion */}
        <div className="cover-header-group">
          <div className="cover-gonjong-wrapper animate-gonjong-cover" aria-hidden="true">
            <img
              src="/ornaments/minang/gonjong-main.svg"
              alt=""
              className="cover-gonjong-img gonjong-floating"
              width="210"
              height="62"
            />
          </div>

          <div className="cover-monogram-crest" aria-hidden="true">
            <span className="crest-line" />
            <div className="crest-medallion">
              <span className="crest-letter font-heading">{groomInitial}</span>
              <span className="crest-amp font-script">&amp;</span>
              <span className="crest-letter font-heading">{brideInitial}</span>
            </div>
            <span className="crest-line" />
          </div>

          <span className="cover-eyebrow font-heading">
            {config?.themeConfig?.customTexts?.coverTitle || 'THE WEDDING OF'}
          </span>
        </div>

        {/* CENTERPIECE: Editorial Portrait Arch & Couple Typography */}
        <div className="cover-centerpiece">
          <div className="cover-photo-wrapper">
            <div className="cover-photo-arch">
              <img
                src={couplePhoto}
                alt={`Potret ${groomShort} & ${brideShort}`}
                className="cover-photo-img"
                loading="eager"
              />
              <div className="cover-photo-overlay" aria-hidden="true" />
            </div>
            <div className="cover-photo-arch-offset" aria-hidden="true" />
          </div>

          <h1 className="cover-couple-names font-script">
            {groomShort} <span className="cover-ampersand">&amp;</span> {brideShort}
          </h1>

          <p className="cover-date font-heading">{dateFormatted}</p>
        </div>

        {/* BOTTOM STATIONERY PLAQUE: Personalized Guest Envelope & Open Action */}
        <div className="cover-footer-group">
          <div className="cover-guest-plaque">
            <div className="plaque-inner-border" aria-hidden="true" />
            <span className="cover-guest-overline font-body">
              Kepada Yth. Bapak / Ibu / Saudara / i
            </span>
            <div className="cover-guest-name font-heading">{guestName}</div>
            <span className="cover-guest-note font-heading">
              {config?.themeConfig?.customTexts?.coverSentence ||
                'Tanpa mengurangi rasa hormat, kami mengundang Anda hadir di hari bahagia kami.'}
            </span>

            <button
              type="button"
              className="btn-open-invitation"
              onClick={handleOpenInvitation}
              disabled={isOpening}
              aria-label="Buka Undangan Pernikahan"
            >
              <MailOpen size={15} className="btn-icon" />
              <span>
                {isOpening
                  ? 'MEMBUKA UNDANGAN...'
                  : config?.themeConfig?.customTexts?.coverButton || 'BUKA UNDANGAN'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .invitation-cover-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          height: 100svh;
          background-color: var(--black-soft);
          transition:
            opacity 1.15s cubic-bezier(0.22, 1, 0.36, 1),
            transform 1.15s cubic-bezier(0.22, 1, 0.36, 1),
            visibility 1.15s;
          will-change: opacity, transform;
        }

        .invitation-cover-overlay.cover-exiting {
          opacity: 0;
          transform: translateY(-3%) scale(1.035);
          pointer-events: none;
          visibility: hidden;
        }

        .cover-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 28%;
          background-repeat: no-repeat;
          opacity: 0.42;
          transform: scale(1.04);
          transition: transform 8s ease-out;
        }

        .cover-dark-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center 35%,
            rgba(44, 11, 14, 0.58) 0%,
            rgba(22, 6, 7, 0.86) 65%,
            rgba(12, 4, 5, 0.96) 100%
          );
        }

        /* Double-Hairline Passe-Partout Frame */
        .cover-stationery-frame {
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(225, 201, 142, 0.32);
          pointer-events: none;
          z-index: 3;
          max-width: 452px;
          margin-inline: auto;
        }

        .cover-stationery-frame-inner {
          position: absolute;
          inset: 5px;
          border: 0.5px solid rgba(225, 201, 142, 0.18);
        }

        .cover-ornament {
          position: absolute;
          pointer-events: none;
          z-index: 4;
          opacity: 0.7;
        }

        .cover-ornament.top-left {
          top: 8px;
          left: max(8px, calc(50% - 232px));
        }

        .cover-ornament.top-right {
          top: 8px;
          right: max(8px, calc(50% - 232px));
        }

        /* Main Content Layout */
        .cover-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          height: 100%;
          max-height: 100svh;
          padding: clamp(24px, 4.2vh, 42px) 26px clamp(24px, 4vh, 36px) 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          box-sizing: border-box;
        }

        .cover-header-group,
        .cover-centerpiece,
        .cover-footer-group {
          opacity: 0;
          animation: coverEditorialReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cover-header-group {
          animation-delay: 0.1s;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .cover-centerpiece {
          animation-delay: 0.28s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin: auto 0;
        }

        .cover-footer-group {
          animation-delay: 0.45s;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @keyframes coverEditorialReveal {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Top Crest & Monogram */
        .cover-gonjong-wrapper {
          width: 65%;
          max-width: 210px;
          margin: 0 auto 6px auto;
          display: flex;
          justify-content: center;
        }

        .cover-gonjong-img {
          width: 100%;
          height: auto;
          max-height: 52px;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45));
        }

        .cover-monogram-crest {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 10px;
          width: 180px;
        }

        .crest-line {
          flex: 1;
          height: 0.5px;
          background: linear-gradient(to right, transparent, var(--gold-300), transparent);
          opacity: 0.65;
        }

        .crest-medallion {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(225, 201, 142, 0.55);
          background: rgba(20, 6, 8, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          box-shadow: inset 0 0 0 3px rgba(225, 201, 142, 0.12);
        }

        .crest-letter {
          font-size: 14px;
          font-weight: 600;
          color: var(--gold-300);
          letter-spacing: 0.04em;
        }

        .crest-amp {
          font-size: 12px;
          color: var(--ivory-50);
          opacity: 0.85;
        }

        .cover-eyebrow {
          font-size: 11px;
          letter-spacing: 0.34em;
          color: var(--gold-300);
          font-weight: 500;
          text-transform: uppercase;
          opacity: 0.92;
        }

        /* Editorial Arch Portrait & Couple Names */
        .cover-photo-wrapper {
          position: relative;
          margin-bottom: clamp(12px, 2vh, 20px);
        }

        .cover-photo-arch {
          position: relative;
          width: clamp(124px, 30vw, 156px);
          height: clamp(162px, 24vh, 204px);
          border-radius: 90px 90px 6px 6px;
          overflow: hidden;
          border: 1px solid rgba(225, 201, 142, 0.75);
          box-shadow: 0 16px 38px rgba(0, 0, 0, 0.55);
          background-color: var(--wine-900);
          z-index: 2;
        }

        .cover-photo-arch-offset {
          position: absolute;
          inset: -5px;
          border-radius: 95px 95px 8px 8px;
          border: 0.5px solid rgba(225, 201, 142, 0.35);
          pointer-events: none;
          z-index: 1;
        }

        .cover-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          display: block;
        }

        .cover-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(22, 6, 7, 0.05) 0%,
            transparent 45%,
            rgba(22, 6, 7, 0.4) 100%
          );
        }

        .cover-couple-names {
          font-size: clamp(42px, 9.5vw, 58px);
          line-height: 1.08;
          color: var(--ivory-50);
          text-shadow: 0 4px 24px rgba(0, 0, 0, 0.65);
          margin-bottom: 6px;
          padding: 0 6px;
          font-weight: 400;
        }

        .cover-ampersand {
          color: var(--gold-300);
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 0.68em;
          vertical-align: middle;
          margin: 0 4px;
          font-weight: 400;
        }

        .cover-date {
          font-size: 13px;
          letter-spacing: 0.28em;
          color: var(--gold-300);
          font-weight: 500;
          text-transform: uppercase;
        }

        /* Bespoke Guest Invitation Plaque */
        .cover-guest-plaque {
          position: relative;
          width: 100%;
          max-width: 340px;
          background: rgba(18, 6, 8, 0.68);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(225, 201, 142, 0.38);
          border-radius: 4px;
          padding: clamp(14px, 2.2vh, 20px) 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        }

        .plaque-inner-border {
          position: absolute;
          inset: 4px;
          border: 0.5px solid rgba(225, 201, 142, 0.18);
          pointer-events: none;
        }

        .cover-guest-overline {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-300);
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .cover-guest-name {
          font-size: clamp(18px, 4.8vw, 22px);
          color: var(--ivory-50);
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: 0.03em;
          margin-bottom: 6px;
          padding-bottom: 8px;
          border-bottom: 0.5px solid rgba(225, 201, 142, 0.28);
          width: 88%;
          word-break: break-word;
        }

        .cover-guest-note {
          font-size: 12.5px;
          font-style: italic;
          line-height: 1.45;
          color: rgba(255, 253, 248, 0.8);
          max-width: 280px;
          margin-bottom: 14px;
        }

        .btn-open-invitation {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 44px;
          width: 100%;
          max-width: 240px;
          padding: 11px 24px;
          background: linear-gradient(135deg, var(--gold-600) 0%, var(--gold-500) 50%, var(--gold-300) 100%);
          color: var(--black-soft);
          border: 1px solid var(--gold-300);
          border-radius: 3px;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          transition: all var(--transition-normal);
        }

        .btn-open-invitation:hover {
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow: 0 12px 28px rgba(199, 161, 90, 0.35);
        }

        .btn-open-invitation:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .btn-icon {
          color: var(--black-soft);
          flex-shrink: 0;
        }

        /* Compact Mobile Viewport Safeguards */
        @media (max-height: 700px) {
          .cover-content {
            padding: 18px 22px;
          }
          .cover-gonjong-img {
            max-height: 40px;
          }
          .cover-photo-arch {
            width: 110px;
            height: 142px;
          }
          .cover-couple-names {
            font-size: 38px;
          }
          .cover-guest-plaque {
            padding: 12px 14px;
          }
          .cover-guest-note {
            display: none;
          }
        }

        @media (max-height: 580px) {
          .cover-photo-wrapper {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cover-header-group,
          .cover-centerpiece,
          .cover-footer-group {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
