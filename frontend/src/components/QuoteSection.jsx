import React from 'react';

/**
 * QuoteSection Component — Fine Letterpress Book Spread Edition
 *
 * Designed as an intimate literary epigraph with an ornate serif drop-quote,
 * double-hairline passe-partout plaque, and classical citation.
 */
export default function QuoteSection({ quote }) {
  const quoteData = quote || {
    title: 'We Found Love',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
    source: 'QS. Ar-Rum : 21',
  };

  return (
    <section className="invitation-section section-paper quote-section" id="quote">
      {/* Fine Corner Filigree */}
      <div className="ornament-container ornament-top-left" aria-hidden="true" data-aos="fade">
        <img
          src="/ornaments/ornament-minang-corner.svg"
          alt=""
          width="68"
          height="68"
          style={{ opacity: 0.65 }}
        />
      </div>
      <div
        className="ornament-container ornament-top-right"
        aria-hidden="true"
        data-aos="fade"
        style={{ transform: 'scaleX(-1)' }}
      >
        <img
          src="/ornaments/ornament-minang-corner.svg"
          alt=""
          width="68"
          height="68"
          style={{ opacity: 0.65 }}
        />
      </div>

      <div className="quote-editorial-plaque" data-aos="fade-up">
        <span className="quote-watermark-mark font-heading" aria-hidden="true">
          &ldquo;
        </span>

        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">Sacred Verse</span>
        </div>

        <h2 className="quote-title font-script">
          {quoteData.title || 'We Found Love'}
        </h2>

        {/* Cultural / Gold Hairline Divider */}
        <div
          className="quote-gonjong-divider gonjong-decoration"
          aria-hidden="true"
        >
          <img
            src="/ornaments/minang/gonjong-divider.svg"
            alt=""
            width="140"
            height="18"
            className="gonjong-divider-img"
          />
        </div>

        <blockquote className="quote-text font-heading">
          &ldquo;{quoteData.text}&rdquo;
        </blockquote>

        <div className="quote-citation-wrap">
          <span className="citation-rule" />
          <p className="quote-source font-body">{quoteData.source}</p>
          <span className="citation-rule" />
        </div>
      </div>

      <style>{`
        .quote-section {
          padding: 72px 24px;
          background-color: var(--paper);
          position: relative;
        }

        .quote-editorial-plaque {
          max-width: 400px;
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding: 36px 24px 32px 24px;
          background: var(--ivory-50);
          border: 1px solid rgba(199, 161, 90, 0.38);
          border-radius: 4px;
          box-shadow: 0 12px 32px rgba(37, 32, 30, 0.04);
        }

        .quote-editorial-plaque::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 0.5px solid rgba(199, 161, 90, 0.22);
          pointer-events: none;
        }

        .quote-watermark-mark {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 96px;
          line-height: 1;
          color: var(--gold-500);
          opacity: 0.12;
          pointer-events: none;
          user-select: none;
          font-style: italic;
        }

        .quote-title {
          font-size: clamp(36px, 8vw, 44px);
          color: var(--wine-800);
          line-height: 1.15;
          margin-bottom: 4px;
          font-weight: 400;
        }

        .quote-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 20px auto;
          opacity: 0.4;
          pointer-events: none;
          user-select: none;
        }

        .quote-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 80%;
          height: auto;
        }

        .quote-text {
          font-size: 17.5px;
          line-height: 1.78;
          color: var(--charcoal-900);
          font-style: italic;
          font-weight: 400;
          margin-bottom: 22px;
          padding: 0 4px;
        }

        .quote-citation-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .citation-rule {
          width: 28px;
          height: 0.5px;
          background-color: var(--gold-500);
          opacity: 0.6;
        }

        .quote-source {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--wine-800);
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
