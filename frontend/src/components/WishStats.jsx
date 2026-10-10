import React from 'react';

/**
 * WishStats Component — Editorial Attendance Ledger Edition
 *
 * Replaces colorful SaaS pill chips with a fine stationery ledger strip
 * using tabular serif numerals and vertical hairline rules.
 */
export default function WishStats({ stats }) {
  const total = stats?.total || 0;
  const hadir = stats?.hadir || 0;
  const tidakHadir = stats?.tidak_hadir || 0;
  const ragu = stats?.ragu || 0;

  return (
    <div className="wish-stats-ledger">
      <div className="ledger-header">
        <span className="ledger-rule" />
        <span className="ledger-title font-heading">
          {total} {total === 1 ? 'Untaian Doa' : 'Untaian Doa & Konfirmasi'}
        </span>
        <span className="ledger-rule" />
      </div>

      <div className="ledger-grid">
        <div className="ledger-cell">
          <span className="ledger-num font-heading text-wine-900">{hadir}</span>
          <span className="ledger-label font-body">HADIR</span>
        </div>

        <div className="ledger-divider" aria-hidden="true" />

        <div className="ledger-cell">
          <span className="ledger-num font-heading text-wine-900">{ragu}</span>
          <span className="ledger-label font-body">MASIH RAGU</span>
        </div>

        <div className="ledger-divider" aria-hidden="true" />

        <div className="ledger-cell">
          <span className="ledger-num font-heading text-wine-900">{tidakHadir}</span>
          <span className="ledger-label font-body">BERHALANGAN</span>
        </div>
      </div>

      <style>{`
        .wish-stats-ledger {
          background: var(--ivory-50);
          border: 1px solid rgba(199, 161, 90, 0.38);
          border-radius: 4px;
          padding: 18px 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .ledger-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .ledger-rule {
          flex: 1;
          max-width: 36px;
          height: 0.5px;
          background-color: var(--gold-500);
          opacity: 0.55;
        }

        .ledger-title {
          font-size: 16px;
          font-style: italic;
          font-weight: 600;
          color: var(--wine-800);
        }

        .ledger-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          padding-top: 10px;
          border-top: 0.5px solid rgba(199, 161, 90, 0.25);
        }

        .ledger-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .ledger-num {
          font-size: 24px;
          font-weight: 600;
          line-height: 1.1;
          font-variant-numeric: tabular-nums;
        }

        .ledger-label {
          font-size: 9px;
          letter-spacing: 0.16em;
          color: var(--muted);
          font-weight: 600;
        }

        .ledger-divider {
          width: 0.5px;
          height: 28px;
          background-color: rgba(199, 161, 90, 0.4);
        }
      `}</style>
    </div>
  );
}
