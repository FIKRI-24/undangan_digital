import React from 'react';
import WishCard from './WishCard';
import { Loader2, RefreshCw, AlertCircle, HeartHandshake } from 'lucide-react';

/**
 * WishList Component
 * Based on PRD Section 19 (WISH LIST) & Requirement 6
 *
 * Renders list of wishes, empty state, error state with retry, and pagination loader.
 */
export default function WishList({
  wishes = [],
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  error = null,
  onRetry,
}) {
  // 1. Initial Loading State
  if (isLoading && wishes.length === 0) {
    return (
      <div className="wish-list-loading">
        <Loader2 size={24} className="animate-spin text-wine-700" />
        <p className="font-body text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          Memuat ucapan...
        </p>

        <style>{`
          .wish-list-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 40px 20px;
          }
        `}</style>
      </div>
    );
  }

  // 2. Error State (Requirement 6: Strictly no dummy wishes fallback)
  if (error && wishes.length === 0) {
    return (
      <div className="wish-list-error">
        <AlertCircle size={24} className="text-wine-700" />
        <p className="font-body error-title text-wine-900">Ucapan belum dapat dimuat.</p>
        <button type="button" className="btn-outline error-retry-btn" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>COBA LAGI</span>
        </button>

        <style>{`
          .wish-list-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 36px 20px;
            background: rgba(122, 32, 37, 0.04);
            border: 1px dashed rgba(199, 161, 90, 0.4);
            border-radius: var(--radius-card-sm);
            text-align: center;
          }

          .error-title {
            font-size: var(--text-sm);
            font-weight: 600;
          }

          .error-retry-btn {
            font-size: var(--text-xs);
            padding: 8px 18px;
            min-height: 44px;
          }
        `}</style>
      </div>
    );
  }

  // 3. Empty State (PRD Section 19)
  if (wishes.length === 0) {
    return (
      <div className="wish-empty-state">
        <HeartHandshake size={32} className="text-gold-500" />
        <h4 className="empty-title font-heading text-wine-900">Belum ada ucapan.</h4>
        <p className="empty-subtitle font-body text-muted">
          Jadilah yang pertama memberikan doa terbaik.
        </p>

        <style>{`
          .wish-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.6);
            border: 1px dashed rgba(199, 161, 90, 0.35);
            border-radius: var(--radius-card-sm);
            gap: 8px;
          }

          .empty-title {
            font-size: var(--text-lg);
            font-weight: 700;
          }

          .empty-subtitle {
            font-size: var(--text-sm);
            max-width: 280px;
            line-height: var(--leading-normal);
          }
        `}</style>
      </div>
    );
  }

  // 4. Render Wish Cards List
  return (
    <div className="wish-list-wrapper">
      <div className="wish-cards-stack">
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} />
        ))}
      </div>

      {/* Pagination Load More Button */}
      {hasMore && (
        <div className="load-more-container">
          <button
            type="button"
            className="btn-outline load-more-btn"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 size={14} className="animate-spin text-wine-700" />
                <span>MEMUAT...</span>
              </>
            ) : (
              <span>MUAT LEBIH BANYAK</span>
            )}
          </button>
        </div>
      )}

      <style>{`
        .wish-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .wish-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .load-more-container {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        .load-more-btn {
          width: 100%;
          max-width: 240px;
          font-size: var(--text-xs);
          padding: 10px 20px;
          text-transform: uppercase;
        }

        .load-more-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
