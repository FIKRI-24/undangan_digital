import React from 'react';
import { useClipboard } from '../hooks/useClipboard';
import { Copy, Check } from 'lucide-react';

/**
 * GiftCard Component — Couture Gold-Foiled Linen Registry Card Edition
 *
 * Replaces the fake CSS ATM chip card with a bespoke gold-foiled stationery
 * registry plaque featuring double-hairline inset borders and tabular serif numerals.
 */
export default function GiftCard({ gift, index = 0, onCopied }) {
  const { copyToClipboard, isCopied } = useClipboard(2000);

  const handleCopy = async () => {
    const success = await copyToClipboard(gift.number);
    if (success && onCopied) {
      onCopied(`Nomor rekening ${gift.provider} berhasil disalin`);
    }
  };

  const displayAccountNumber = gift.number
    ? String(gift.number).replace(/(\d{4})(?=\d)/g, '$1 ')
    : '';

  const registryNumber = String(index + 1).padStart(2, '0');

  return (
    <div className="sovereign-gift-card">
      <div className="sovereign-inner-hairline" aria-hidden="true" />

      {/* Top Row: Provider Crest & Registry Seal */}
      <div className="card-top-row">
        <div className="provider-brand">
          <span className="registry-overline font-body">WEDDING REGISTRY · {registryNumber}</span>
          <span className="provider-name-display font-heading">{gift.provider}</span>
        </div>

        {/* Fine Geometric Crest Emblem */}
        <div className="sovereign-crest" aria-hidden="true">
          <div className="crest-diamond-outer">
            <div className="crest-diamond-inner" />
          </div>
        </div>
      </div>

      {/* Account Number */}
      <div className="card-number-wrapper">
        <span className="card-label font-body">NOMOR REKENING / VIRTUAL ACCOUNT</span>
        <p className="card-account-number font-heading">
          {displayAccountNumber || gift.number}
        </p>
      </div>

      {/* Account Holder & Copy Action */}
      <div className="card-bottom-row">
        <div className="holder-info">
          <span className="card-label font-body">ATAS NAMA PENERIMA</span>
          <p className="card-holder-name font-heading">{gift.holder}</p>
        </div>

        <button
          type="button"
          className={`btn-copy-account ${isCopied ? 'btn-copied' : ''}`}
          onClick={handleCopy}
          aria-label={`Salin nomor rekening ${gift.provider}`}
        >
          {isCopied ? (
            <>
              <Check size={13} />
              <span>TERSALIN</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>SALIN NOMOR</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        .sovereign-gift-card {
          position: relative;
          width: 100%;
          border-radius: 4px;
          padding: 28px 24px 26px 24px;
          background: linear-gradient(
            145deg,
            var(--wine-900) 0%,
            var(--black-soft) 100%
          );
          border: 1px solid rgba(225, 201, 142, 0.5);
          box-shadow: 0 14px 34px rgba(22, 6, 7, 0.22);
          color: var(--ivory-50);
          overflow: hidden;
          text-align: left;
        }

        .sovereign-inner-hairline {
          position: absolute;
          inset: 5px;
          border: 0.5px solid rgba(225, 201, 142, 0.24);
          pointer-events: none;
        }

        .card-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 0.5px solid rgba(225, 201, 142, 0.25);
          position: relative;
          z-index: 2;
        }

        .provider-brand {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .registry-overline {
          font-size: 9px;
          letter-spacing: 0.24em;
          color: var(--gold-300);
          opacity: 0.8;
        }

        .provider-name-display {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--gold-300);
          line-height: 1.1;
        }

        .sovereign-crest {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crest-diamond-outer {
          width: 22px;
          height: 22px;
          border: 1px solid rgba(225, 201, 142, 0.6);
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .crest-diamond-inner {
          width: 10px;
          height: 10px;
          border: 0.5px solid rgba(225, 201, 142, 0.45);
          background: rgba(225, 201, 142, 0.15);
        }

        .card-label {
          display: block;
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 253, 248, 0.65);
          margin-bottom: 4px;
        }

        .card-number-wrapper {
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .card-account-number {
          font-size: clamp(22px, 5.8vw, 27px);
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--ivory-50);
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
          word-break: break-all;
        }

        .card-bottom-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .holder-info {
          flex: 1;
        }

        .card-holder-name {
          font-size: 18px;
          font-weight: 500;
          font-style: italic;
          color: var(--gold-300);
          letter-spacing: 0.03em;
          line-height: 1.2;
        }

        .btn-copy-account {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 40px;
          padding: 8px 16px;
          border-radius: 3px;
          background: rgba(225, 201, 142, 0.14);
          border: 1px solid rgba(225, 201, 142, 0.6);
          color: var(--gold-300);
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }

        .btn-copy-account:hover {
          background: var(--gold-500);
          color: var(--black-soft);
          border-color: var(--gold-300);
          transform: translateY(-1px);
        }

        .btn-copy-account.btn-copied {
          background: rgba(34, 120, 65, 0.28);
          border-color: rgba(120, 220, 150, 0.6);
          color: #d4f7df;
        }
      `}</style>
    </div>
  );
}
