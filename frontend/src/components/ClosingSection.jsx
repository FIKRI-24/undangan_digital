import React from 'react';

/**
 * ClosingSection Component — Couture Editorial Finale Edition
 *
 * Full-height emotional closing spread with double-hairline passe-partout
 * frame, gratitude letterpress typography, couple signature, and date.
 */
export default function ClosingSection({ config }) {
  const { groom, bride, dateDisplay, closingPhoto, closing, initialsGroom, initialsBride } = config;
  const formattedDate = (dateDisplay || '20 . 06 . 2027').replace(/\s*\.\s*/g, '  ·  ');

  return (
    <section className="closing-wedding-section" id="closing">
      {/* Background Portrait */}
      <div
        className="closing-bg-image"
        style={{
          backgroundImage: `url(${
            closingPhoto ||
            'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85'
          })`,
        }}
      />
      <div className="closing-overlay" />

      {/* Inset Passe-Partout Hairline Frame */}
      <div className="closing-passepartout" aria-hidden="true">
        <div className="closing-passepartout-inner" />
      </div>

      {/* Fine Botanical Corner Engravings */}
      <div className="closing-ornament top-left" aria-hidden="true" data-aos="fade">
        <img
          src="/ornaments/ornament-floral-top-left.svg"
          alt=""
          width="110"
          height="110"
        />
      </div>
      <div className="closing-ornament top-right" aria-hidden="true" data-aos="fade">
        <img
          src="/ornaments/ornament-floral-top-right.svg"
          alt=""
          width="110"
          height="110"
        />
      </div>

      {/* Editorial Closing Content */}
      <div className="closing-content" data-aos="fade-up">
        <div className="closing-monogram-seal" aria-hidden="true">
          <span className="seal-char font-heading">{initialsGroom || 'R'}</span>
          <span className="seal-amp font-script">&amp;</span>
          <span className="seal-char font-heading">{initialsBride || 'A'}</span>
        </div>

        <p className="closing-message font-body">
          {closing?.message ||
            'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.'}
        </p>

        <div className="closing-vertical-rule" aria-hidden="true" />

        <p className="closing-gratitude font-heading">
          {closing?.gratitude || 'Kami yang berbahagia,'}
        </p>

        <h2 className="closing-couple-names font-script" data-aos="zoom-in">
          {groom.shortName} <span className="ampersand">&amp;</span> {bride.shortName}
        </h2>

        <div
          className="closing-gonjong-divider gonjong-decoration"
          aria-hidden="true"
        >
          <img
            src="/ornaments/minang/gonjong-divider.svg"
            alt=""
            width="135"
            height="18"
            className="gonjong-divider-img"
          />
        </div>

        <p className="closing-date font-heading">{formattedDate}</p>
      </div>

      {/* Cultural Rising Gonjong Silhouette */}
      <div
        className="closing-gonjong-bottom gonjong-decoration"
        aria-hidden="true"
      >
        <img
          src="/ornaments/minang/gonjong-closing.svg"
          alt=""
          className="closing-gonjong-img"
        />
      </div>

      <style>{`
        .closing-wedding-section {
          position: relative;
          width: 100%;
          min-height: 580px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding: 96px 28px 110px 28px;
          background-color: var(--wine-900);
        }

        .closing-passepartout {
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(225, 201, 142, 0.3);
          pointer-events: none;
          z-index: 3;
        }

        .closing-passepartout-inner {
          position: absolute;
          inset: 5px;
          border: 0.5px solid rgba(225, 201, 142, 0.16);
        }

        .closing-gonjong-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          pointer-events: none;
          user-select: none;
          z-index: 4;
          opacity: 0.65;
          line-height: 0;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        .closing-gonjong-img {
          width: 100%;
          max-width: 480px;
          height: auto;
          display: block;
          filter: drop-shadow(0 -4px 14px rgba(0, 0, 0, 0.6));
        }

        .closing-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 12px auto 16px auto;
          opacity: 0.45;
          pointer-events: none;
          user-select: none;
        }

        .closing-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .closing-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          opacity: 0.68;
          transform: scale(1.02);
        }

        .closing-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(44, 11, 14, 0.72) 0%,
            rgba(22, 6, 7, 0.91) 78%,
            rgba(15, 4, 5, 0.98) 100%
          );
        }

        .closing-ornament {
          position: absolute;
          pointer-events: none;
          z-index: 4;
          opacity: 0.75;
        }

        .closing-ornament.top-left {
          top: 10px;
          left: 10px;
        }

        .closing-ornament.top-right {
          top: 10px;
          right: 10px;
        }

        .closing-content {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 380px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .closing-monogram-seal {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(225, 201, 142, 0.55);
          background: rgba(20, 6, 8, 0.45);
          box-shadow: inset 0 0 0 3px rgba(225, 201, 142, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          margin-bottom: 22px;
        }

        .seal-char {
          font-size: 16px;
          color: var(--gold-300);
          font-weight: 600;
        }

        .seal-amp {
          font-size: 14px;
          color: var(--ivory-50);
          opacity: 0.85;
        }

        .closing-message {
          font-size: 13.5px;
          line-height: 1.8;
          color: rgba(255, 253, 248, 0.9);
          margin-bottom: 20px;
          padding: 0 6px;
        }

        .closing-vertical-rule {
          width: 1px;
          height: 26px;
          background: linear-gradient(to bottom, var(--gold-300), transparent);
          opacity: 0.55;
          margin-bottom: 14px;
        }

        .closing-gratitude {
          font-size: 17px;
          color: var(--gold-300);
          letter-spacing: 0.06em;
          margin-bottom: 10px;
          font-style: italic;
        }

        .closing-couple-names {
          font-size: clamp(46px, 11vw, 66px);
          line-height: 1.1;
          color: var(--ivory-50);
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
          margin-bottom: 4px;
          font-weight: 400;
        }

        .closing-couple-names .ampersand {
          color: var(--gold-300);
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 0.68em;
          margin: 0 4px;
        }

        .closing-date {
          font-size: 14px;
          letter-spacing: 0.26em;
          color: var(--gold-300);
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}
