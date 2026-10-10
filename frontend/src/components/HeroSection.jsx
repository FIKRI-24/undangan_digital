import React from 'react';
import AmbientGoldDust from './AmbientGoldDust';

/**
 * HeroSection Component — Vogue Editorial Edition
 *
 * Fullscreen mobile-first hero (min-height 100svh) featuring:
 * - Full-bleed prewedding portrait with warm editorial grading
 * - Inset double-hairline passe-partout frame
 * - Delicate monogram crest, sculptural script names, and Roman/editorial date strip
 * - Subtle vertical scroll thread indicator
 */
export default function HeroSection({ config }) {
  const { groom, bride, dateDisplay, dateFull, heroPhoto, initialsGroom, initialsBride } = config;

  const formattedDate = (dateDisplay || '20 . 06 . 2027').replace(/\s*\.\s*/g, '  ·  ');

  return (
    <section className="hero-wedding-section" id="hero">
      {/* Editorial Portrait Background */}
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url(${
            heroPhoto ||
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85'
          })`,
        }}
      />
      <div className="hero-overlay" />

      {/* Subtle Ambient Gold Shimmer */}
      <AmbientGoldDust count={7} />

      {/* Inset Passe-Partout Hairline Frame */}
      <div className="hero-passepartout" aria-hidden="true">
        <div className="hero-passepartout-inner" />
      </div>

      {/* Fine Botanical Corner Engravings */}
      <div className="hero-ornament top-left" aria-hidden="true" data-aos="fade">
        <img
          src="/ornaments/ornament-floral-top-left.svg"
          alt=""
          width="115"
          height="115"
        />
      </div>
      <div className="hero-ornament top-right" aria-hidden="true" data-aos="fade">
        <img
          src="/ornaments/ornament-floral-top-right.svg"
          alt=""
          width="115"
          height="115"
        />
      </div>

      {/* Editorial Hero Composition */}
      <div className="hero-content" data-aos="fade-up">
        <div className="hero-top-tag animate-fade-up">
          <span className="hero-eyebrow font-body">
            {config?.themeConfig?.customTexts?.coverTitle || 'THE WEDDING CELEBRATION OF'}
          </span>
          <div className="hero-vertical-rule" aria-hidden="true" />
        </div>

        {/* Fine Monogram Emblem */}
        <div
          className="hero-monogram animate-fade-up delay-100"
          aria-label={`Inisial ${initialsGroom || 'R'} dan ${initialsBride || 'A'}`}
        >
          <div className="monogram-frame">
            <span className="monogram-letter font-heading">{initialsGroom || 'R'}</span>
            <span className="monogram-ampersand font-script">&amp;</span>
            <span className="monogram-letter font-heading">{initialsBride || 'A'}</span>
          </div>
        </div>

        {/* Couple Names in Sculptural Script */}
        <h1 className="hero-couple-name font-script animate-fade-up delay-200">
          {groom.shortName} <span className="ampersand">&amp;</span> {bride.shortName}
        </h1>

        {/* Editorial Date Plaque */}
        <div className="hero-date-plaque animate-fade-up delay-300">
          <span className="date-hairline" />
          <p className="hero-date font-heading">{formattedDate}</p>
          <span className="date-hairline" />
        </div>

        {dateFull && (
          <p className="hero-date-full font-heading animate-fade-up delay-400">
            {dateFull}
          </p>
        )}

        {/* Romantic Editorial Subtitle */}
        <p className="hero-subtext font-body animate-fade-up delay-500">
          {config?.themeConfig?.customTexts?.heroSubtitle ||
            'Dengan penuh rasa syukur dan sukacita, kami mengundang Anda untuk merayakan awal perjalanan suci kami.'}
        </p>

        {/* Scroll Indicator Thread */}
        <div className="hero-scroll-indicator" aria-hidden="true">
          <span className="scroll-label font-body">SCROLL</span>
          <span className="scroll-thread" />
        </div>
      </div>

      <style>{`
        .hero-wedding-section {
          position: relative;
          width: 100%;
          min-height: 100svh;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          text-align: center;
          overflow: hidden;
          padding: 88px 28px 56px 28px;
          background-color: var(--wine-900);
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 25%;
          background-repeat: no-repeat;
          opacity: 0.82;
          transform: scale(1.02);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(22, 6, 7, 0.55) 0%,
            rgba(56, 14, 18, 0.35) 38%,
            rgba(22, 6, 7, 0.92) 88%,
            rgba(16, 5, 6, 0.98) 100%
          );
        }

        .hero-passepartout {
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(225, 201, 142, 0.32);
          pointer-events: none;
          z-index: 3;
        }

        .hero-passepartout-inner {
          position: absolute;
          inset: 5px;
          border: 0.5px solid rgba(225, 201, 142, 0.16);
        }

        .hero-ornament {
          position: absolute;
          pointer-events: none;
          z-index: 4;
          opacity: 0.75;
        }

        .hero-ornament.top-left {
          top: 10px;
          left: 10px;
        }

        .hero-ornament.top-right {
          top: 10px;
          right: 10px;
        }

        .hero-content {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 400px;
          margin: auto 0 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-top-tag {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .hero-eyebrow {
          font-size: 10.5px;
          letter-spacing: 0.32em;
          color: var(--gold-300);
          text-transform: uppercase;
          font-weight: 500;
        }

        .hero-vertical-rule {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, var(--gold-300), transparent);
          opacity: 0.6;
        }

        .hero-monogram {
          margin-bottom: 16px;
        }

        .monogram-frame {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 1px solid rgba(225, 201, 142, 0.65);
          background: rgba(24, 7, 9, 0.55);
          box-shadow: inset 0 0 0 4px rgba(225, 201, 142, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
        }

        .monogram-letter {
          font-size: 20px;
          color: var(--gold-300);
          font-weight: 500;
          line-height: 1;
        }

        .monogram-ampersand {
          font-size: 16px;
          color: var(--ivory-50);
          opacity: 0.85;
        }

        .hero-couple-name {
          font-size: clamp(50px, 12vw, 72px);
          line-height: 1.08;
          color: var(--ivory-50);
          text-shadow: 0 4px 26px rgba(0, 0, 0, 0.65);
          margin-bottom: 12px;
          padding: 0 8px;
          font-weight: 400;
        }

        .hero-couple-name .ampersand {
          color: var(--gold-300);
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 0.65em;
          margin: 0 4px;
        }

        .hero-date-plaque {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          width: 100%;
          max-width: 280px;
          margin-bottom: 6px;
        }

        .date-hairline {
          flex: 1;
          height: 0.5px;
          background: linear-gradient(to right, transparent, var(--gold-500), transparent);
        }

        .hero-date {
          font-size: 16px;
          letter-spacing: 0.24em;
          color: var(--gold-300);
          font-weight: 600;
          white-space: nowrap;
        }

        .hero-date-full {
          font-size: 14px;
          font-style: italic;
          color: rgba(255, 253, 248, 0.82);
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .hero-subtext {
          font-size: 12.5px;
          color: rgba(255, 253, 248, 0.78);
          line-height: 1.75;
          max-width: 320px;
          margin-inline: auto;
          letter-spacing: 0.02em;
          margin-bottom: 24px;
        }

        .hero-scroll-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0.7;
        }

        .scroll-label {
          font-size: 9px;
          letter-spacing: 0.3em;
          color: var(--gold-300);
        }

        .scroll-thread {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, var(--gold-300), transparent);
        }
      `}</style>
    </section>
  );
}
