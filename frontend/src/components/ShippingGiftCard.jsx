import React from 'react';
import { useClipboard } from '../hooks/useClipboard';
import { Copy, Check, MapPin } from 'lucide-react';

/**
 * ShippingGiftCard Component — Fine Letterpress Delivery Registry Edition
 *
 * Displays physical gift delivery recipient information with double-hairline
 * stationery framing and 1-click copy address functionality.
 */
export default function ShippingGiftCard({ giftShipping, onCopied }) {
  const { copyToClipboard, isCopied } = useClipboard(2000);

  if (!giftShipping || !giftShipping.address) return null;

  const handleCopy = async () => {
    const textToCopy = `${giftShipping.recipient}\n${giftShipping.address}\n${giftShipping.phone || ''}`.trim();
    const success = await copyToClipboard(textToCopy);
    if (success && onCopied) {
      onCopied('Alamat pengiriman hadiah berhasil disalin');
    }
  };

  return (
    <div className="shipping-gift-card wedding-card">
      <div className="shipping-header">
        <span className="shipping-eyebrow font-body">PARCEL &amp; PHYSICAL REGISTRY</span>
        <h3 className="shipping-title font-heading text-wine-900">Alamat Pengiriman Kado</h3>
      </div>

      <div className="shipping-body">
        <div className="recipient-row">
          <span className="field-label font-body">NAMA PENERIMA</span>
          <p className="recipient-name font-heading">{giftShipping.recipient}</p>
        </div>

        {giftShipping.phone && (
          <div className="phone-row">
            <span className="field-label font-body">NOMOR KONTAK</span>
            <p className="field-value font-body">{giftShipping.phone}</p>
          </div>
        )}

        <div className="address-row">
          <span className="field-label font-body">ALAMAT TUJUAN</span>
          <div className="address-box">
            <MapPin size={15} className="text-gold-600 map-icon" />
            <p className="address-text font-body">{giftShipping.address}</p>
          </div>
        </div>

        <div className="shipping-action">
          <button
            type="button"
            className={`btn-outline btn-copy-shipping ${isCopied ? 'btn-copied' : ''}`}
            onClick={handleCopy}
            aria-label="Salin alamat kado ke papan klip"
          >
            {isCopied ? (
              <>
                <Check size={14} />
                <span>ALAMAT TERSALIN</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>SALIN ALAMAT PENGIRIMAN</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .shipping-gift-card {
          width: 100%;
          padding: 30px 24px;
          background: var(--ivory-50);
          text-align: center;
        }

        .shipping-header {
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 0.5px solid rgba(199, 161, 90, 0.35);
        }

        .shipping-eyebrow {
          font-size: 9.5px;
          letter-spacing: 0.22em;
          color: var(--gold-600);
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .shipping-title {
          font-size: 26px;
          font-weight: 600;
          line-height: 1.2;
        }

        .field-label {
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-600);
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .recipient-name {
          font-size: 20px;
          font-weight: 600;
          color: var(--wine-900);
          margin-bottom: 14px;
        }

        .phone-row {
          margin-bottom: 14px;
        }

        .field-value {
          color: var(--charcoal-900);
          font-size: 13.5px;
          font-weight: 500;
        }

        .address-box {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 8px;
          background: var(--paper);
          border: 0.5px solid rgba(199, 161, 90, 0.38);
          border-radius: 3px;
          padding: 14px 16px;
          margin-top: 6px;
          text-align: left;
        }

        .map-icon {
          flex-shrink: 0;
          margin-top: 3px;
        }

        .address-text {
          font-size: 13px;
          line-height: 1.65;
          color: var(--charcoal-900);
        }

        .shipping-action {
          margin-top: 22px;
          display: flex;
          justify-content: center;
        }

        .btn-copy-shipping {
          width: 100%;
          max-width: 270px;
        }

        .btn-copy-shipping.btn-copied {
          background: var(--status-hadir-bg);
          border-color: var(--status-hadir-border);
          color: var(--status-hadir-text);
        }
      `}</style>
    </div>
  );
}
