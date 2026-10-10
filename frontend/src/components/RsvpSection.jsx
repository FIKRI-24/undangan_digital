import React, { useState, useEffect, useCallback } from 'react';
import { useGuestName } from '../hooks/useGuestName';
import { weddingApi } from '../services/api';
import WishStats from './WishStats';
import WishList from './WishList';
import { Send, Loader2, AlertCircle, Check } from 'lucide-react';
import AOS from 'aos';

/**
 * RsvpSection Component — Bespoke Letterpress RSVP & Guestbook Edition
 *
 * Replaces SaaS form cards with a fine stationery Répondez S'il Vous Plaît
 * card, interactive attendance selector buttons, and an editorial guestbook ledger.
 */
export default function RsvpSection({ slug = 'raka-alya', onNotify }) {
  const guestNameFromUrl = useGuestName();
  const initialName = guestNameFromUrl !== 'Bapak/Ibu/Saudara/i' ? guestNameFromUrl : '';

  const [name, setName] = useState(initialName);
  const [attendance, setAttendance] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wishes, setWishes] = useState([]);
  const [stats, setStats] = useState({ total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchInitialWishes = useCallback(async () => {
    setIsLoadingWishes(true);
    setFetchError(null);
    try {
      const data = await weddingApi.getWeddingWishes(slug, 1, 10);
      setWishes(data.items || []);
      setStats(data.stats || { total: 0, hadir: 0, tidak_hadir: 0, ragu: 0 });
      setHasMore(Boolean(data.pagination?.has_more));
      setPage(1);
    } catch (err) {
      console.error('[RsvpSection fetchInitialWishes Error]:', err);
      setFetchError(err.message || 'Gagal memuat ucapan.');
    } finally {
      setIsLoadingWishes(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchInitialWishes();
  }, [fetchInitialWishes]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await weddingApi.getWeddingWishes(slug, nextPage, 10);
      const newItems = data.items || [];

      setWishes((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const filteredNew = newItems.filter((item) => !existingIds.has(item.id));
        return [...prev, ...filteredNew];
      });

      setStats(data.stats || stats);
      setHasMore(Boolean(data.pagination?.has_more));
      setPage(nextPage);
    } catch (err) {
      console.error('[RsvpSection handleLoadMore Error]:', err);
      if (onNotify) {
        onNotify('Gagal memuat ucapan tambahan.');
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      setFormError('Nama lengkap harus diisi (2 hingga 100 karakter).');
      return;
    }

    if (!attendance) {
      setFormError('Silakan pilih konfirmasi kehadiran Anda.');
      return;
    }

    const payload = {
      name: trimmedName,
      attendance,
      guest_count: attendance === 'hadir' ? parseInt(guestCount, 10) || 1 : null,
      message: message.trim() || null,
    };

    setIsSubmitting(true);

    try {
      const response = await weddingApi.submitWeddingRsvp(slug, payload);

      if (response.success && response.data) {
        const newWish = response.data;

        setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);

        setStats((prev) => ({
          total: (prev.total || 0) + 1,
          hadir: attendance === 'hadir' ? (prev.hadir || 0) + 1 : prev.hadir || 0,
          tidak_hadir: attendance === 'tidak_hadir' ? (prev.tidak_hadir || 0) + 1 : prev.tidak_hadir || 0,
          ragu: attendance === 'ragu' ? (prev.ragu || 0) + 1 : prev.ragu || 0,
        }));

        setMessage('');
        setAttendance('');
        setGuestCount('1');

        if (onNotify) {
          onNotify('Ucapan & konfirmasi kehadiran berhasil dikirim.');
        }

        setTimeout(() => {
          AOS.refresh();
        }, 150);
      }
    } catch (err) {
      console.error('[RsvpSection handleSubmit Error]:', err);
      setFormError(err.message || 'Ucapan gagal dikirim. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="invitation-section section-cream rsvp-section" id="rsvp" aria-labelledby="rsvp-heading">
      <div className="rsvp-container">
        {/* Editorial Chapter Header */}
        <div className="rsvp-header" data-aos="fade-up">
          <div className="editorial-chapter-index">
            <span className="editorial-chapter-line" />
            <span className="editorial-chapter-roman">VII · Répondez S&apos;il Vous Plaît</span>
          </div>

          <h2 id="rsvp-heading" className="title-section">
            Doa &amp; Kehadiran
          </h2>

          <div
            className="rsvp-gonjong-divider gonjong-decoration"
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
            Merupakan kehormatan bagi kami apabila Anda berkenan mengonfirmasi kehadiran serta menuliskan doa restu.
          </p>
        </div>

        {/* Fine Letterpress RSVP Card */}
        <div className="rsvp-form-card wedding-card" data-aos="fade-up" data-aos-delay="80">
          <form onSubmit={handleSubmit} noValidate className="rsvp-form">
            {/* Field: Nama Lengkap */}
            <div className="form-group">
              <label htmlFor="rsvp-name" className="form-label font-body">
                NAMA LENGKAP TAMU <span className="text-wine-700">*</span>
              </label>
              <input
                id="rsvp-name"
                type="text"
                className="form-input font-heading"
                placeholder="Tuliskan nama lengkap Anda..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Field: Konfirmasi Kehadiran (Tactile Stationery Selector + Select Fallback) */}
            <div className="form-group">
              <label htmlFor="rsvp-attendance" className="form-label font-body">
                KONFIRMASI KEHADIRAN <span className="text-wine-700">*</span>
              </label>

              <div className="attendance-choice-grid" role="radiogroup" aria-label="Pilih Konfirmasi Kehadiran">
                {[
                  { value: 'hadir', label: 'Akan Hadir' },
                  { value: 'ragu', label: 'Masih Ragu' },
                  { value: 'tidak_hadir', label: 'Berhalangan' },
                ].map((opt) => {
                  const active = attendance === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      disabled={isSubmitting}
                      className={`attendance-choice-btn font-body ${active ? 'is-selected' : ''}`}
                      onClick={() => setAttendance(opt.value)}
                    >
                      {active && <Check size={12} />}
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field: Jumlah Tamu */}
            {attendance === 'hadir' && (
              <div className="form-group animate-fade-in">
                <label htmlFor="rsvp-guest-count" className="form-label font-body">
                  JUMLAH KEHADIRAN
                </label>
                <div className="select-wrapper">
                  <select
                    id="rsvp-guest-count"
                    className="form-select font-heading"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5 Orang</option>
                  </select>
                </div>
              </div>
            )}

            {/* Field: Ucapan & Doa */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="rsvp-message" className="form-label font-body">
                  UCAPAN &amp; DOA RESTU <span className="label-optional">(OPSIONAL)</span>
                </label>
                <span className="char-counter font-body">{message.length}/1000</span>
              </div>
              <textarea
                id="rsvp-message"
                className="form-textarea font-body"
                rows={4}
                placeholder="Tuliskan untaian doa dan harapan terbaik untuk kedua mempelai..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                disabled={isSubmitting}
              />
            </div>

            {formError && (
              <div className="form-error-alert" role="alert">
                <AlertCircle size={15} className="error-icon" />
                <span className="font-body error-text">{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary rsvp-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>MENGIRIM KONFIRMASI...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>KIRIM DOA &amp; KONFIRMASI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guestbook Ledger & Wishes */}
        <div className="wishes-display-area">
          <div data-aos="fade-up">
            <WishStats stats={stats} />
          </div>

          <WishList
            wishes={wishes}
            isLoading={isLoadingWishes}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            error={fetchError}
            onRetry={fetchInitialWishes}
          />
        </div>
      </div>

      <style>{`
        .rsvp-section {
          background-color: var(--cream-100);
          position: relative;
        }

        .rsvp-container {
          max-width: 410px;
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .rsvp-header {
          margin-bottom: 34px;
        }

        .rsvp-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 16px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .rsvp-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .rsvp-form-card {
          margin-bottom: 36px;
          padding: 32px 22px 28px 22px;
          background-color: var(--ivory-50);
          text-align: left;
        }

        .rsvp-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .form-label {
          font-size: 9.5px;
          font-weight: 600;
          color: var(--gold-600);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .label-optional {
          color: var(--muted);
          font-weight: 500;
        }

        .char-counter {
          font-size: 10px;
          color: var(--muted);
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 12px 14px;
          background-color: var(--paper);
          border: 1px solid rgba(199, 161, 90, 0.42);
          border-radius: 3px;
          color: var(--charcoal-900);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          outline: none;
          box-sizing: border-box;
        }

        .form-input,
        .form-select {
          font-size: 17px;
          font-weight: 500;
        }

        .form-textarea {
          font-size: 13.5px;
          resize: vertical;
          min-height: 96px;
          line-height: 1.65;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: var(--wine-800);
          background-color: var(--white);
          box-shadow: 0 0 0 3px rgba(199, 161, 90, 0.16);
        }

        /* Tactile Attendance Choice Grid */
        .attendance-choice-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .attendance-choice-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          min-height: 42px;
          padding: 8px 6px;
          background: var(--paper);
          border: 1px solid rgba(199, 161, 90, 0.4);
          border-radius: 3px;
          color: var(--charcoal-900);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .attendance-choice-btn:hover {
          border-color: var(--gold-600);
          background: rgba(199, 161, 90, 0.08);
        }

        .attendance-choice-btn.is-selected {
          background: var(--wine-900);
          color: var(--ivory-50);
          border-color: var(--gold-500);
          box-shadow: inset 0 0 0 2px rgba(225, 201, 142, 0.25);
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A2025' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .form-error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background-color: var(--status-tidak-bg);
          border: 1px solid var(--status-tidak-border);
          border-radius: 3px;
          color: var(--status-tidak-text);
        }

        .error-icon {
          flex-shrink: 0;
        }

        .error-text {
          font-size: 12px;
          font-weight: 500;
        }

        .rsvp-submit-btn {
          width: 100%;
          margin-top: 4px;
        }

        .rsvp-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .wishes-display-area {
          width: 100%;
        }

        .animate-fade-in {
          animation: rsvpAlertFadeIn 0.25s ease-out;
        }

        @keyframes rsvpAlertFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
