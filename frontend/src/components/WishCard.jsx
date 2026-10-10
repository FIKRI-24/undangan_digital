import React from 'react';
import { Check, X, HelpCircle, Clock, Users } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatRelativeTime';

/**
 * WishCard Component — Fine Stationery Guestbook Note Card Edition
 *
 * Renders individual guest wish and RSVP confirmation with a serif monogram
 * seal, literary quote formatting, and zero-XSS plain text rendering.
 */
export default function WishCard({ wish }) {
  if (!wish) return null;

  const { name, attendance, guest_count, message, created_at } = wish;

  const getBadgeConfig = () => {
    switch (attendance) {
      case 'hadir':
        return {
          label: 'Hadir',
          icon: <Check size={10} />,
          className: 'wish-badge-hadir',
        };
      case 'tidak_hadir':
        return {
          label: 'Berhalangan',
          icon: <X size={10} />,
          className: 'wish-badge-tidak-hadir',
        };
      case 'ragu':
      default:
        return {
          label: 'Masih Ragu',
          icon: <HelpCircle size={10} />,
          className: 'wish-badge-ragu',
        };
    }
  };

  const badge = getBadgeConfig();
  const timeFormatted = formatRelativeTime(created_at);

  return (
    <article className="wish-card" data-aos="fade-up" aria-label={`Ucapan dari ${name}`}>
      <div className="wish-card-header">
        <div className="wish-user-info">
          <div className="wish-avatar-seal" aria-hidden="true">
            {name ? name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="wish-user-meta">
            <h4 className="wish-user-name font-heading">{name}</h4>
            {guest_count && guest_count > 1 && attendance === 'hadir' && (
              <span className="wish-guest-count font-body">
                <Users size={10} /> {guest_count} Tamu
              </span>
            )}
          </div>
        </div>

        <span className={`wish-badge font-body ${badge.className}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>

      {message && (
        <p className="wish-message font-body">&ldquo;{message}&rdquo;</p>
      )}

      {timeFormatted && (
        <div className="wish-card-footer">
          <Clock size={10} className="wish-time-icon text-muted" />
          <time className="wish-time-text font-body text-muted" dateTime={created_at}>
            {timeFormatted}
          </time>
        </div>
      )}

      <style>{`
        .wish-card {
          background-color: var(--ivory-50);
          border: 1px solid rgba(199, 161, 90, 0.34);
          border-radius: 3px;
          padding: 18px 20px;
          box-shadow: 0 6px 20px rgba(37, 32, 30, 0.03);
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: left;
          position: relative;
        }

        .wish-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .wish-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wish-avatar-seal {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--paper);
          border: 1px solid rgba(199, 161, 90, 0.55);
          color: var(--wine-800);
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wish-user-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wish-user-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--wine-900);
          line-height: 1.2;
          word-break: break-word;
        }

        .wish-guest-count {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          color: var(--muted);
          font-weight: 500;
        }

        .wish-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 2px;
          font-size: 9.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .wish-badge-hadir {
          background-color: var(--status-hadir-bg);
          color: var(--status-hadir-text);
          border: 0.5px solid var(--status-hadir-border);
        }

        .wish-badge-tidak-hadir {
          background-color: var(--status-tidak-bg);
          color: var(--status-tidak-text);
          border: 0.5px solid var(--status-tidak-border);
        }

        .wish-badge-ragu {
          background-color: var(--status-ragu-bg);
          color: var(--status-ragu-text);
          border: 0.5px solid var(--status-ragu-border);
        }

        .wish-message {
          font-size: 13.5px;
          color: var(--charcoal-900);
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
          margin-top: 2px;
        }

        .wish-card-footer {
          display: flex;
          align-items: center;
          gap: 5px;
          padding-top: 8px;
          border-top: 0.5px solid rgba(199, 161, 90, 0.25);
        }

        .wish-time-icon {
          flex-shrink: 0;
        }

        .wish-time-text {
          font-size: 10.5px;
          letter-spacing: 0.04em;
        }
      `}</style>
    </article>
  );
}
