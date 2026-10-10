import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

/**
 * Countdown Component — Bespoke Horology & Fine Calendar Plaque Edition
 *
 * Replaces generic SaaS pill badges and floating boxes with a unified
 * double-hairline stationery plaque and high-contrast serif horology numerals.
 */
export default function Countdown({ countdownConfig, dateDisplay }) {
  const targetDate = countdownConfig?.targetDateTime || '2027-06-20T08:00:00+07:00';
  const completedMessage = countdownConfig?.completedMessage || 'Alhamdulillah, Acara Telah Berlangsung';
  const { days, hours, minutes, seconds, isCompleted } = useCountdown(targetDate);

  const formattedDate = (dateDisplay || '20 . 06 . 2027').replace(/\s*\.\s*/g, '  ·  ');

  return (
    <section className="invitation-section section-paper countdown-section" id="countdown">
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

      <div className="countdown-container" data-aos="fade-up">
        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">II · Save The Date</span>
        </div>

        <h2 className="title-section">Menghitung Hari</h2>

        <div
          className="countdown-gonjong-divider gonjong-decoration"
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

        {/* Unified Horology Stationery Plaque */}
        <div className="horology-plaque wedding-card" aria-live="off">
          {dateDisplay && (
            <div className="horology-date-header">
              <span className="horology-date-rule" />
              <span className="horology-date-text font-heading">{formattedDate}</span>
              <span className="horology-date-rule" />
            </div>
          )}

          <div className="horology-grid">
            <div className="horology-cell">
              <span className="horology-digits font-heading">{days}</span>
              <span className="horology-label font-body">Hari</span>
            </div>

            <div className="horology-divider" aria-hidden="true" />

            <div className="horology-cell">
              <span className="horology-digits font-heading">{hours}</span>
              <span className="horology-label font-body">Jam</span>
            </div>

            <div className="horology-divider" aria-hidden="true" />

            <div className="horology-cell">
              <span className="horology-digits font-heading">{minutes}</span>
              <span className="horology-label font-body">Menit</span>
            </div>

            <div className="horology-divider" aria-hidden="true" />

            <div className="horology-cell">
              <span className="horology-digits font-heading">{seconds}</span>
              <span className="horology-label font-body">Detik</span>
            </div>
          </div>

          {isCompleted && (
            <div className="completed-banner font-heading">
              <span>{completedMessage}</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .countdown-section {
          padding-top: 68px;
          padding-bottom: 72px;
          background-color: var(--paper);
          position: relative;
        }

        .countdown-container {
          max-width: 410px;
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .countdown-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 26px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .countdown-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .horology-plaque {
          padding: 26px 18px 28px 18px;
          background: var(--ivory-50);
        }

        .horology-date-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 0.5px solid rgba(199, 161, 90, 0.3);
        }

        .horology-date-rule {
          width: 24px;
          height: 0.5px;
          background-color: var(--gold-500);
          opacity: 0.6;
        }

        .horology-date-text {
          font-size: 14px;
          letter-spacing: 0.24em;
          color: var(--gold-600);
          font-weight: 600;
        }

        .horology-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          width: 100%;
        }

        .horology-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4px 2px;
        }

        .horology-digits {
          font-size: clamp(32px, 8vw, 42px);
          font-weight: 600;
          color: var(--wine-900);
          line-height: 1.05;
          font-variant-numeric: tabular-nums;
          margin-bottom: 6px;
        }

        .horology-label {
          font-size: 9.5px;
          color: var(--muted);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .horology-divider {
          width: 1px;
          height: 42px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(199, 161, 90, 0.55),
            transparent
          );
        }

        .completed-banner {
          margin-top: 20px;
          padding-top: 14px;
          border-top: 0.5px solid rgba(199, 161, 90, 0.3);
          color: var(--wine-800);
          font-size: 16px;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
