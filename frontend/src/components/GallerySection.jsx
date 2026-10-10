import React, { useState } from 'react';
import GalleryLightbox from './GalleryLightbox';

/**
 * GallerySection Component — Curated Fine Art Exhibition Edition
 *
 * Replaces generic SaaS badges and rounded cards with an editorial photo
 * exhibition grid featuring passe-partout mats and catalogue numbering.
 */
export default function GallerySection({ gallery = [] }) {
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setActiveImageIndex(null);
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <section className="invitation-section section-paper gallery-section" id="gallery">
      {/* Fine Corner Filigree */}
      <div className="ornament-container ornament-top-left" aria-hidden="true">
        <img
          src="/ornaments/ornament-minang-corner.svg"
          alt=""
          width="66"
          height="66"
          style={{ opacity: 0.6 }}
        />
      </div>
      <div
        className="ornament-container ornament-top-right"
        aria-hidden="true"
        style={{ transform: 'scaleX(-1)' }}
      >
        <img
          src="/ornaments/ornament-minang-corner.svg"
          alt=""
          width="66"
          height="66"
          style={{ opacity: 0.6 }}
        />
      </div>

      <div className="gallery-header" data-aos="fade-up">
        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">V · Portraits of Us</span>
        </div>

        <h2 className="title-section">Galeri Kebersamaan</h2>

        <div
          className="gallery-gonjong-divider gonjong-decoration"
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

        <p className="subtitle-section">
          Potret kenangan dan momen berharga dalam perjalanan cinta kami menuju hari bahagia.
        </p>
      </div>

      {/* Editorial Exhibition Grid */}
      <div className="gallery-editorial-grid">
        {gallery.map((photo, index) => {
          const isFeatured = index === 0 || index === 3 || (gallery.length > 5 && index === 5);
          const catalogNum = String(index + 1).padStart(2, '0');

          return (
            <div
              key={photo.id || index}
              className={`gallery-item-card ${isFeatured ? 'item-featured' : ''}`}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 70}
              data-aos-once="true"
              onClick={() => handleOpenLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLightbox(index);
                }
              }}
              aria-label={`Lihat foto ${photo.alt || index + 1} secara penuh`}
            >
              <div className="gallery-thumb-wrapper">
                <img
                  src={photo.src}
                  alt={photo.alt || `Potret prewedding ${index + 1}`}
                  className="gallery-thumb-img"
                  loading="lazy"
                  style={{ objectPosition: photo.objectPosition || '50% 35%' }}
                />
                <div className="gallery-hover-overlay">
                  <span className="hover-caption font-body">PERBESAR POTRET</span>
                </div>
              </div>
              <div className="gallery-caption-strip">
                <span className="caption-index font-heading">No. {catalogNum}</span>
                <span className="caption-rule" />
                <span className="caption-label font-body">COLLECTION</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        isOpen={activeImageIndex !== null}
        images={gallery}
        currentIndex={activeImageIndex || 0}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <style>{`
        .gallery-section {
          background-color: var(--paper);
          position: relative;
        }

        .gallery-header {
          max-width: 390px;
          margin: 0 auto 38px auto;
        }

        .gallery-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 16px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .gallery-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        /* Editorial 2-Column Exhibition Grid */
        .gallery-editorial-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 420px;
          margin-inline: auto;
        }

        .gallery-item-card {
          position: relative;
          background-color: var(--ivory-50);
          padding: 7px 7px 9px 7px;
          border: 1px solid rgba(199, 161, 90, 0.38);
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(37, 32, 30, 0.05);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
        }

        .gallery-item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(37, 32, 30, 0.1);
          border-color: var(--gold-500);
        }

        .item-featured {
          grid-column: span 2;
        }

        .gallery-thumb-wrapper {
          position: relative;
          width: 100%;
          height: 205px;
          overflow: hidden;
          background-color: var(--wine-900);
        }

        .item-featured .gallery-thumb-wrapper {
          height: 245px;
        }

        .gallery-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item-card:hover .gallery-thumb-img {
          transform: scale(1.05);
        }

        .gallery-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(24, 7, 9, 0.42);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-normal);
        }

        .gallery-item-card:hover .gallery-hover-overlay {
          opacity: 1;
        }

        .hover-caption {
          color: var(--ivory-50);
          font-size: 9.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 7px 14px;
          background: rgba(18, 6, 8, 0.78);
          border: 1px solid rgba(225, 201, 142, 0.65);
          border-radius: 2px;
        }

        .gallery-caption-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 7px 4px 0 4px;
        }

        .caption-index {
          font-size: 12px;
          font-style: italic;
          color: var(--wine-800);
          font-weight: 600;
        }

        .caption-rule {
          flex: 1;
          height: 0.5px;
          background-color: rgba(199, 161, 90, 0.35);
        }

        .caption-label {
          font-size: 8.5px;
          letter-spacing: 0.2em;
          color: var(--muted);
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
