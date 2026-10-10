import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * GalleryLightbox Component
 * Based on PRD Section 15 (UI-08 — GALLERY LIGHTBOX)
 *
 * Fullscreen modal viewer with keyboard navigation (ESC, ArrowLeft, ArrowRight),
 * touch-friendly buttons, and body scroll lock.
 */
export default function GalleryLightbox({
  isOpen,
  images = [],
  currentIndex = 0,
  onClose,
  onNext,
  onPrev,
}) {
  const currentImage = images[currentIndex];

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.classList.remove('scroll-locked');
    };
  }, [isOpen]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="gallery-lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Tampilan Penuh Galeri Foto"
      onClick={handleBackdropClick}
    >
      {/* Top Bar: Counter & Close Button */}
      <div className="lightbox-header">
        <span className="lightbox-counter font-body">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          className="lightbox-btn-close"
          onClick={onClose}
          aria-label="Tutup Galeri"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="lightbox-stage">
        {/* Previous Button */}
        <button
          type="button"
          className="lightbox-nav-btn nav-prev"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Foto Sebelumnya"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Display Image */}
        <div className="lightbox-img-wrapper">
          <img
            src={currentImage.src}
            alt={currentImage.alt || 'Foto Galeri Pernikahan'}
            className="lightbox-main-img"
          />
          {currentImage.alt && (
            <p className="lightbox-caption font-body">{currentImage.alt}</p>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="lightbox-nav-btn nav-next"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Foto Selanjutnya"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <style>{`
        .gallery-lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background-color: rgba(14, 4, 5, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          animation: lightboxFadeIn 0.3s ease forwards;
        }

        .lightbox-header {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          z-index: 10;
        }

        .lightbox-counter {
          color: var(--gold-300);
          font-size: var(--text-sm);
          letter-spacing: 0.15em;
          font-weight: 600;
        }

        .lightbox-btn-close {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(199, 161, 90, 0.4);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .lightbox-btn-close:hover {
          background: rgba(122, 32, 37, 0.8);
          border-color: var(--gold-500);
          transform: scale(1.05);
        }

        .lightbox-stage {
          position: relative;
          width: 100%;
          max-width: 580px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-img-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-height: 78vh;
          max-width: 88vw;
        }

        .lightbox-main-img {
          max-height: 72vh;
          max-width: 86vw;
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid rgba(199, 161, 90, 0.3);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .lightbox-caption {
          font-size: var(--text-xs);
          color: var(--dusty-rose-300);
          margin-top: 10px;
          text-align: center;
          letter-spacing: 0.04em;
        }

        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(30, 20, 18, 0.75);
          border: 1px solid rgba(199, 161, 90, 0.4);
          color: var(--gold-300);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all var(--transition-normal);
        }

        .lightbox-nav-btn:hover {
          background: rgba(122, 32, 37, 0.9);
          color: var(--white);
          border-color: var(--gold-500);
        }

        .nav-prev {
          left: 4px;
        }

        .nav-next {
          right: 4px;
        }

        @keyframes lightboxFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
