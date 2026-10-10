import React from 'react';

function InstagramIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * CoupleSection Component — Editorial Portrait Gallery Edition
 *
 * Presents Groom & Bride in museum-grade passe-partout portrait arches with
 * offset gold hairlines, oversized script initial watermarks, and refined
 * letterpress genealogy typography.
 */
export default function CoupleSection({ groom, bride, invitationIntro, greetingSalam }) {
  const groomInitial = (groom?.shortName || groom?.fullName || 'R')[0].toUpperCase();
  const brideInitial = (bride?.shortName || bride?.fullName || 'A')[0].toUpperCase();

  return (
    <section className="invitation-section section-ivory couple-section" id="couple">
      {/* Fine Botanical Corner Engravings */}
      <div className="ornament-container ornament-top-left" aria-hidden="true">
        <img
          src="/ornaments/ornament-floral-top-left.svg"
          alt=""
          width="105"
          height="105"
        />
      </div>
      <div className="ornament-container ornament-top-right" aria-hidden="true">
        <img
          src="/ornaments/ornament-floral-top-right.svg"
          alt=""
          width="105"
          height="105"
        />
      </div>

      {/* Section Editorial Header */}
      <div className="couple-header" data-aos="fade-up">
        <div className="couple-gonjong-watermark gonjong-decoration" aria-hidden="true">
          <img
            src="/ornaments/minang/gonjong-main.svg"
            alt=""
            className="watermark-gonjong-img"
            width="210"
            height="66"
          />
        </div>

        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">I · The Matrimony</span>
        </div>

        <h2 className="title-section">Mempelai</h2>

        <div
          className="couple-gonjong-divider gonjong-decoration"
          aria-hidden="true"
          data-aos="zoom-in"
        >
          <img
            src="/ornaments/minang/gonjong-divider.svg"
            alt=""
            width="135"
            height="18"
            className="gonjong-divider-img"
          />
        </div>

        <p className="greeting-salam font-heading">
          {greetingSalam || 'Assalamu’alaikum Warahmatullahi Wabarakatuh'}
        </p>

        <p className="invitation-intro font-body">
          {invitationIntro ||
            'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:'}
        </p>
      </div>

      {/* ====================================================================
          GROOM EDITORIAL PORTRAIT
          ==================================================================== */}
      <article className="profile-editorial-card groom-card" data-aos="fade-up">
        <div className="portrait-stage">
          <span className="portrait-watermark-initial font-script" aria-hidden="true">
            {groomInitial}
          </span>

          <div className="portrait-wrapper">
            <div className="portrait-arch-offset" aria-hidden="true" />
            <div className="portrait-arch-frame">
              <img
                src={
                  groom.photo ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85'
                }
                alt={`Potret Mempelai Pria: ${groom.fullName}`}
                className="portrait-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <span className="profile-role-tag font-body">THE GROOM</span>

        <h3 className="profile-fullname font-heading text-wine-900">
          {groom.fullName}
        </h3>

        <div className="profile-genealogy font-body">
          <span className="family-label font-heading">
            {groom.familyLabel || 'Putra pertama dari'}
          </span>
          <p className="parent-names">
            <strong>{groom.father}</strong>
            <span className="parent-and font-heading">&amp;</span>
            <strong>{groom.mother}</strong>
          </p>
        </div>

        {groom.instagram && (
          <a
            href={groom.instagramUrl || `https://instagram.com/${groom.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-couture-link font-body"
            aria-label={`Instagram ${groom.shortName}`}
          >
            <InstagramIcon size={14} className="text-gold-600" />
            <span>@{groom.instagram.replace(/^@/, '')}</span>
          </a>
        )}
      </article>

      {/* ====================================================================
          SCULPTURAL AMPERSAND INTERLUDE
          ==================================================================== */}
      <div className="couple-separator" data-aos="zoom-in" aria-hidden="true">
        <div className="separator-line" />
        <div className="separator-medallion">
          <span className="separator-ampersand font-script">&amp;</span>
        </div>
        <div className="separator-line" />
      </div>

      {/* ====================================================================
          BRIDE EDITORIAL PORTRAIT
          ==================================================================== */}
      <article className="profile-editorial-card bride-card" data-aos="fade-up">
        <div className="portrait-stage">
          <span className="portrait-watermark-initial font-script" aria-hidden="true">
            {brideInitial}
          </span>

          <div className="portrait-wrapper">
            <div className="portrait-arch-offset" aria-hidden="true" />
            <div className="portrait-arch-frame">
              <img
                src={
                  bride.photo ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85'
                }
                alt={`Potret Mempelai Wanita: ${bride.fullName}`}
                className="portrait-image"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <span className="profile-role-tag font-body">THE BRIDE</span>

        <h3 className="profile-fullname font-heading text-wine-900">
          {bride.fullName}
        </h3>

        <div className="profile-genealogy font-body">
          <span className="family-label font-heading">
            {bride.familyLabel || 'Putri kedua dari'}
          </span>
          <p className="parent-names">
            <strong>{bride.father}</strong>
            <span className="parent-and font-heading">&amp;</span>
            <strong>{bride.mother}</strong>
          </p>
        </div>

        {bride.instagram && (
          <a
            href={bride.instagramUrl || `https://instagram.com/${bride.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-couture-link font-body"
            aria-label={`Instagram ${bride.shortName}`}
          >
            <InstagramIcon size={14} className="text-gold-600" />
            <span>@{bride.instagram.replace(/^@/, '')}</span>
          </a>
        )}
      </article>

      <style>{`
        .couple-section {
          background-color: var(--ivory-50);
          position: relative;
        }

        .couple-header {
          position: relative;
          z-index: 2;
          max-width: 390px;
          margin: 0 auto 48px auto;
          text-align: center;
        }

        .couple-gonjong-watermark {
          position: absolute;
          top: -12px;
          left: 0;
          right: 0;
          margin-inline: auto;
          width: 210px;
          max-width: 65%;
          opacity: 0.09;
          pointer-events: none;
          user-select: none;
          z-index: 0;
          display: flex;
          justify-content: center;
        }

        .couple-gonjong-watermark .watermark-gonjong-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .couple-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 18px auto;
          opacity: 0.38;
          pointer-events: none;
          user-select: none;
        }

        .couple-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .greeting-salam {
          font-size: 19px;
          font-style: italic;
          color: var(--wine-800);
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        .invitation-intro {
          font-size: 13.5px;
          color: var(--charcoal-900);
          line-height: 1.75;
          opacity: 0.86;
          padding: 0 6px;
        }

        /* Editorial Profile Card */
        .profile-editorial-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 380px;
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .portrait-stage {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
        }

        .portrait-watermark-initial {
          position: absolute;
          top: -28px;
          right: -34px;
          font-size: 130px;
          line-height: 1;
          color: var(--gold-500);
          opacity: 0.11;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .bride-card .portrait-watermark-initial {
          right: auto;
          left: -34px;
        }

        .portrait-wrapper {
          position: relative;
          z-index: 1;
          padding: 8px;
          background: var(--paper);
          border: 1px solid rgba(199, 161, 90, 0.42);
          border-radius: 130px 130px 8px 8px;
          box-shadow: 0 18px 42px rgba(37, 32, 30, 0.08);
        }

        .portrait-arch-offset {
          position: absolute;
          inset: -6px;
          border-radius: 136px 136px 10px 10px;
          border: 0.5px solid rgba(199, 161, 90, 0.32);
          pointer-events: none;
        }

        .portrait-arch-frame {
          width: 216px;
          height: 288px;
          border-radius: 122px 122px 4px 4px;
          overflow: hidden;
          border: 1px solid rgba(199, 161, 90, 0.55);
          position: relative;
          background-color: var(--wine-900);
        }

        [data-frame-style="oval"] .portrait-wrapper,
        [data-frame-style="oval"] .portrait-arch-offset {
          border-radius: 999px !important;
        }

        [data-frame-style="rounded"] .portrait-wrapper,
        [data-frame-style="rounded"] .portrait-arch-offset {
          border-radius: 26px !important;
        }

        .portrait-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .portrait-arch-frame:hover .portrait-image {
          transform: scale(1.045);
        }

        .profile-role-tag {
          font-size: 10px;
          letter-spacing: 0.28em;
          color: var(--gold-600);
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .profile-fullname {
          font-size: clamp(26px, 6.5vw, 31px);
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 14px;
          padding: 0 8px;
          letter-spacing: 0.01em;
        }

        .profile-genealogy {
          position: relative;
          padding: 14px 20px;
          margin-bottom: 18px;
          border-top: 0.5px solid rgba(199, 161, 90, 0.35);
          border-bottom: 0.5px solid rgba(199, 161, 90, 0.35);
          max-width: 320px;
          width: 100%;
        }

        .family-label {
          display: block;
          font-size: 15px;
          font-style: italic;
          color: var(--gold-600);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .parent-names {
          color: var(--charcoal-900);
          font-size: 13.5px;
          line-height: 1.6;
        }

        .parent-names strong {
          font-weight: 600;
          color: var(--wine-900);
          display: block;
        }

        .parent-and {
          color: var(--gold-600);
          font-style: italic;
          font-size: 14px;
          display: block;
          margin: 1px 0;
        }

        .instagram-couture-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 38px;
          padding: 7px 18px;
          border-radius: 3px;
          border: 1px solid rgba(199, 161, 90, 0.45);
          background-color: var(--paper);
          color: var(--wine-800);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          transition: all var(--transition-normal);
        }

        .instagram-couture-link:hover {
          background-color: var(--wine-900);
          color: var(--ivory-50);
          border-color: var(--wine-900);
          transform: translateY(-2px);
        }

        /* Sculptural Ampersand Interlude */
        .couple-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 280px;
          margin: 44px auto;
          gap: 14px;
        }

        .separator-line {
          flex: 1;
          height: 0.5px;
          background: linear-gradient(to right, transparent, var(--gold-500), transparent);
        }

        .separator-medallion {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(199, 161, 90, 0.45);
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 0 0 3px rgba(199, 161, 90, 0.12);
        }

        .separator-ampersand {
          font-size: 32px;
          color: var(--wine-700);
          line-height: 1;
        }
      `}</style>
    </section>
  );
}
