import React from 'react';
import { Check, Info } from 'lucide-react';

/**
 * Toast Component
 * Based on PRD Section 33 (TOAST SYSTEM)
 *
 * Displays lightweight notification feedback (e.g. for copying bank account or address).
 * Positioned centered above bottom controls with wedding luxury styling.
 */
export default function Toast({ message, isVisible, type = 'success' }) {
  if (!isVisible || !message) return null;

  return (
    <div className="wedding-toast-container" role="status" aria-live="polite">
      <div className={`wedding-toast ${type === 'success' ? 'toast-success' : 'toast-info'}`}>
        <div className="toast-icon-circle">
          {type === 'success' ? <Check size={14} className="text-white" /> : <Info size={14} className="text-white" />}
        </div>
        <span className="toast-text font-body">{message}</span>
      </div>

      <style>{`
        .wedding-toast-container {
          position: fixed;
          bottom: 84px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 999;
          pointer-events: none;
          display: flex;
          justify-content: center;
          width: 90%;
          max-width: 360px;
        }

        .wedding-toast {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(26, 22, 21, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--gold-500);
          border-radius: var(--radius-pill);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 14px rgba(199, 161, 90, 0.25);
          color: var(--ivory-50);
          pointer-events: auto;
          animation: toastEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .toast-icon-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--wine-700), var(--burgundy-600));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-text {
          font-size: var(--text-xs);
          font-weight: 500;
          letter-spacing: 0.03em;
          line-height: var(--leading-snug);
        }

        @keyframes toastEnter {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
