import React from 'react';
import { Play, Pause, Disc3 } from 'lucide-react';

/**
 * MusicPlayer Component
 * Based on PRD Section 22 (UI-15 — FLOATING MUSIC PLAYER)
 *
 * Floating music disc controller (bottom-right).
 * Rotates gracefully while playing, pauses rotation when stopped.
 * Only visible after invitation cover is opened.
 */
export default function MusicPlayer({ isPlaying, onToggle, isVisible = true }) {
  if (!isVisible) return null;

  return (
    <aside className="floating-music-player">
      <button
        type="button"
        className={`music-toggle-btn ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={onToggle}
        aria-label={isPlaying ? 'Jeda musik pernikahan' : 'Putar musik pernikahan'}
        title={isPlaying ? 'Jeda musik' : 'Putar musik'}
      >
        {/* Rotating Vinyl Record Graphic */}
        <div className={`disc-wrapper ${isPlaying ? 'rotating' : ''}`}>
          <Disc3 size={32} className="disc-icon text-gold-300" />
        </div>

        {/* Center Play/Pause Badge */}
        <div className="center-action-badge">
          {isPlaying ? (
            <Pause size={12} className="action-icon text-white" />
          ) : (
            <Play size={12} className="action-icon text-white" style={{ marginLeft: '1px' }} />
          )}
        </div>
      </button>

      <style>{`
        .floating-music-player {
          position: fixed;
          right: 20px;
          bottom: 78px;
          z-index: 900;
          animation: musicPlayerEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (min-width: 481px) {
          .floating-music-player {
            right: calc(50% - var(--container-max-width) / 2 + 20px);
            bottom: 78px;
          }
        }

        .music-toggle-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3a0d11 0%, #200608 100%);
          border: 1.5px solid var(--gold-500);
          box-shadow: 0 6px 20px rgba(94, 23, 27, 0.4), 0 0 12px rgba(199, 161, 90, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }

        .music-toggle-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 26px rgba(94, 23, 27, 0.55), 0 0 16px rgba(199, 161, 90, 0.45);
          border-color: var(--gold-300);
        }

        .music-toggle-btn:active {
          transform: scale(0.95);
        }

        .disc-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .disc-wrapper.rotating {
          animation: spinSlow 12s linear infinite;
        }

        .disc-icon {
          filter: drop-shadow(0 0 4px rgba(199, 161, 90, 0.4));
        }

        .center-action-badge {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--wine-700), var(--burgundy-600));
          border: 1px solid var(--gold-500);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }

        @keyframes musicPlayerEnter {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </aside>
  );
}
