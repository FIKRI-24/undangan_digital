import React from 'react';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/**
 * StorySection Component — Editorial Magazine Chapter Edition
 *
 * Replaces generic SaaS timeline boxes with a literary chapter sequence,
 * featuring Roman numeral overlines, passe-partout photo mats, and fine
 * vertical gold connecting threads.
 */
export default function StorySection({ stories }) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="invitation-section section-ivory story-section" id="story">
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

      <div className="story-header" data-aos="fade-up">
        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">IV · Our Journey</span>
        </div>

        <h2 className="title-section">Kisah Cinta Kami</h2>

        <div
          className="story-gonjong-divider gonjong-decoration"
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
          Setiap perjalanan memiliki maknanya sendiri, dan inilah rangkaian babak yang mempertemukan langkah kami.
        </p>
      </div>

      {/* Editorial Chapter Sequence */}
      <div className="story-chapters-list">
        {stories.map((story, index) => {
          const roman = ROMAN_NUMERALS[index] || String(index + 1);
          return (
            <React.Fragment key={story.id || index}>
              <article
                className="wedding-card story-chapter-plaque"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="chapter-meta-header">
                  <span className="chapter-roman font-heading">Chapter {roman}</span>
                  <span className="chapter-dot" aria-hidden="true">·</span>
                  <span className="chapter-date font-body">{story.dateLabel}</span>
                </div>

                {story.image && (
                  <div className="story-editorial-mat">
                    <div className="story-image-container">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="story-image"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <h3 className="story-card-title font-heading text-wine-900">
                  {story.title}
                </h3>

                <p className="story-card-body font-body">
                  {story.body}
                </p>
              </article>

              {index < stories.length - 1 && (
                <div className="story-connector-thread" aria-hidden="true">
                  <span className="thread-diamond" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .story-section {
          background-color: var(--ivory-50);
          position: relative;
        }

        .story-header {
          max-width: 390px;
          margin: 0 auto 42px auto;
        }

        .story-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 16px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .story-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .story-chapters-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 410px;
          margin-inline: auto;
        }

        .story-chapter-plaque {
          width: 100%;
          padding: 28px 22px 30px 22px;
          background: var(--paper);
          text-align: center;
        }

        .chapter-meta-header {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 0.5px solid rgba(199, 161, 90, 0.38);
        }

        .chapter-roman {
          font-size: 13px;
          font-style: italic;
          color: var(--wine-800);
          font-weight: 600;
          letter-spacing: 0.1em;
        }

        .chapter-dot {
          color: var(--gold-500);
        }

        .chapter-date {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-600);
          font-weight: 600;
        }

        .story-editorial-mat {
          padding: 6px;
          background: var(--ivory-50);
          border: 1px solid rgba(199, 161, 90, 0.35);
          margin-bottom: 18px;
        }

        .story-image-container {
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: var(--wine-900);
        }

        .story-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .story-chapter-plaque:hover .story-image {
          transform: scale(1.04);
        }

        .story-card-title {
          font-size: clamp(24px, 6vw, 28px);
          font-weight: 600;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .story-card-body {
          font-size: 13.5px;
          line-height: 1.78;
          color: var(--charcoal-900);
          opacity: 0.88;
          padding: 0 4px;
        }

        .story-connector-thread {
          height: 36px;
          width: 1px;
          background: linear-gradient(to bottom, var(--gold-500), rgba(199, 161, 90, 0.25));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .thread-diamond {
          width: 5px;
          height: 5px;
          background-color: var(--gold-500);
          transform: rotate(45deg);
        }
      `}</style>
    </section>
  );
}
