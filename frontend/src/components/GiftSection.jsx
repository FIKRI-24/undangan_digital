import React from 'react';
import GiftCard from './GiftCard';
import ShippingGiftCard from './ShippingGiftCard';

/**
 * GiftSection Component — Sovereign Wedding Registry Edition
 *
 * Replaces generic SaaS badges with a fine letterpress chapter header
 * and sovereign gold-foiled registry cards.
 */
export default function GiftSection({ gifts = [], giftShipping, onNotify }) {
  return (
    <section className="invitation-section section-cream gift-section" id="gift">
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

      <div className="gift-header" data-aos="fade-up">
        <div className="gift-gonjong-watermark gonjong-decoration" aria-hidden="true">
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
          <span className="editorial-chapter-roman">VI · Tokens of Love</span>
        </div>

        <h2 className="title-section">Tanda Kasih</h2>

        <div
          className="gift-gonjong-divider gonjong-decoration"
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
          Doa dan restu Anda merupakan karunia terindah bagi kami. Namun apabila memberi adalah ungkapan tanda kasih, Anda dapat mengirimkan hadiah melalui:
        </p>
      </div>

      {/* Sovereign Registry Cards Stack */}
      <div className="gift-cards-stack">
        {gifts.map((gift, idx) => (
          <div key={gift.id || gift.provider} data-aos="fade-up" data-aos-delay={idx * 90}>
            <GiftCard gift={gift} index={idx} onCopied={onNotify} />
          </div>
        ))}

        {giftShipping && (
          <div data-aos="fade-up" data-aos-delay={gifts.length * 90}>
            <ShippingGiftCard giftShipping={giftShipping} onCopied={onNotify} />
          </div>
        )}
      </div>

      <style>{`
        .gift-section {
          background-color: var(--cream-100);
          position: relative;
        }

        .gift-header {
          position: relative;
          z-index: 2;
          max-width: 390px;
          margin: 0 auto 38px auto;
          text-align: center;
        }

        .gift-gonjong-watermark {
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

        .gift-gonjong-watermark .watermark-gonjong-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .gift-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 16px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .gift-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .gift-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          max-width: 410px;
          margin-inline: auto;
        }
      `}</style>
    </section>
  );
}
