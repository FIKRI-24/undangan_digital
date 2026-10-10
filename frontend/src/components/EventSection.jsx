import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, CalendarPlus, ChevronDown, Download, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarHelper';

/**
 * EventSection Component — Architectural Itinerary & Letterpress Edition
 *
 * Renders wedding ceremonies (Akad Nikah, Resepsi) as formal engraved
 * stationery plaques with Roman chapter numbers, hairline time/date grids,
 * and couture action buttons.
 */
export default function EventSection({ events }) {
  const [openCalendarIdx, setOpenCalendarIdx] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setOpenCalendarIdx(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <section className="invitation-section section-cream event-section" id="events">
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

      <div className="event-header" data-aos="fade-up">
        <div className="editorial-chapter-index">
          <span className="editorial-chapter-line" />
          <span className="editorial-chapter-roman">III · Order of Events</span>
        </div>

        <h2 className="title-section">Rangkaian Acara</h2>

        <div
          className="event-gonjong-divider gonjong-decoration"
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
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan rangkaian acara pernikahan pada:
        </p>
      </div>

      {/* Engraved Itinerary Plaques */}
      <div className="event-cards-list">
        {events.map((evt, idx) => {
          const indexNumber = String(idx + 1).padStart(2, '0');
          return (
            <article
              key={evt.id || evt.type}
              className="wedding-card event-itinerary-plaque"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              {/* Top Itinerary Header */}
              <div className="itinerary-header">
                <span className="itinerary-index font-heading">{indexNumber}</span>
                <h3 className="itinerary-title font-heading">{evt.type}</h3>
                <div className="itinerary-title-rule" />
              </div>

              {/* 2-Column Editorial Date & Time Strip */}
              <div className="itinerary-datetime-grid">
                <div className="datetime-col">
                  <span className="itinerary-meta-label font-body">HARI &amp; TANGGAL</span>
                  <p className="itinerary-meta-value font-heading">{evt.dateLabel}</p>
                </div>

                <div className="datetime-vertical-rule" aria-hidden="true" />

                <div className="datetime-col">
                  <span className="itinerary-meta-label font-body">WAKTU ACARA</span>
                  <p className="itinerary-meta-value font-heading">
                    {evt.startTime} – {evt.endTimeLabel}
                  </p>
                </div>
              </div>

              {/* Venue & Address Block */}
              <div className="itinerary-venue-block">
                <div className="venue-pin-line">
                  <MapPin size={14} className="text-gold-600" />
                  <span className="itinerary-meta-label font-body">TEMPAT PELAKSANAAN</span>
                </div>
                <p className="venue-name font-heading">{evt.venue}</p>
                <p className="venue-address font-body">{evt.address}</p>
              </div>

              {/* Action Buttons: Google Maps & Save to Calendar */}
              <div
                className="event-actions-group"
                ref={openCalendarIdx === idx ? calendarRef : null}
              >
                <a
                  href={
                    evt.mapsUrl ||
                    `https://maps.google.com/?q=${encodeURIComponent(
                      evt.venue + ' ' + evt.address
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary maps-btn"
                  aria-label={`Buka Google Maps untuk ${evt.type} di ${evt.venue}`}
                >
                  <Navigation size={13} />
                  <span>PETUNJUK LOKASI (MAPS)</span>
                </a>

                <div className="calendar-dropdown-wrap">
                  <button
                    type="button"
                    className="btn-outline btn-calendar-trigger"
                    onClick={() => setOpenCalendarIdx(openCalendarIdx === idx ? null : idx)}
                    aria-expanded={openCalendarIdx === idx}
                    aria-label={`Simpan ${evt.type} ke kalender`}
                  >
                    <CalendarPlus size={14} />
                    <span>SIMPAN KE KALENDER</span>
                    <ChevronDown
                      size={13}
                      style={{
                        transform: openCalendarIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        marginLeft: '4px',
                      }}
                    />
                  </button>

                  {openCalendarIdx === idx && (
                    <div className="calendar-menu-dropdown" role="menu">
                      <a
                        href={generateGoogleCalendarUrl(evt, 'Pernikahan')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="calendar-menu-item"
                        role="menuitem"
                        onClick={() => setOpenCalendarIdx(null)}
                      >
                        <ExternalLink size={14} className="text-gold-600" />
                        <span>Google Calendar</span>
                      </a>
                      <button
                        type="button"
                        className="calendar-menu-item"
                        role="menuitem"
                        onClick={() => {
                          downloadIcsFile(evt, 'Pernikahan');
                          setOpenCalendarIdx(null);
                        }}
                      >
                        <Download size={14} className="text-gold-600" />
                        <span>Apple / iCal (.ics)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style>{`
        .event-section {
          background-color: var(--cream-100);
          position: relative;
        }

        .event-header {
          max-width: 390px;
          margin: 0 auto 40px auto;
        }

        .event-gonjong-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px auto 16px auto;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
        }

        .event-gonjong-divider .gonjong-divider-img {
          width: 135px;
          max-width: 75%;
          height: auto;
        }

        .event-cards-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          width: 100%;
          max-width: 410px;
          margin-inline: auto;
        }

        .event-itinerary-plaque {
          text-align: center;
          padding: 34px 24px 30px 24px;
          background: var(--ivory-50);
        }

        .itinerary-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 22px;
        }

        .itinerary-index {
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.24em;
          color: var(--gold-600);
          margin-bottom: 4px;
        }

        .itinerary-title {
          font-size: clamp(26px, 6.5vw, 32px);
          color: var(--wine-900);
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1.15;
          margin-bottom: 12px;
        }

        .itinerary-title-rule {
          width: 56px;
          height: 1px;
          background: var(--gold-500);
          opacity: 0.6;
        }

        /* 2-Column Editorial Date & Time Strip */
        .itinerary-datetime-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 18px 8px;
          border-top: 0.5px solid rgba(199, 161, 90, 0.35);
          border-bottom: 0.5px solid rgba(199, 161, 90, 0.35);
          margin-bottom: 22px;
        }

        .datetime-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .datetime-vertical-rule {
          width: 0.5px;
          height: 38px;
          background-color: rgba(199, 161, 90, 0.45);
        }

        .itinerary-meta-label {
          font-size: 9.5px;
          letter-spacing: 0.2em;
          color: var(--gold-600);
          font-weight: 600;
          text-transform: uppercase;
        }

        .itinerary-meta-value {
          font-size: 16.5px;
          color: var(--wine-900);
          font-weight: 600;
          line-height: 1.3;
        }

        /* Venue Block */
        .itinerary-venue-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 26px;
          padding: 0 6px;
        }

        .venue-pin-line {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 6px;
        }

        .venue-name {
          font-size: 20px;
          color: var(--wine-900);
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 6px;
        }

        .venue-address {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.65;
          max-width: 320px;
        }

        /* Actions */
        .event-actions-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          width: 100%;
        }

        .maps-btn,
        .calendar-dropdown-wrap,
        .btn-calendar-trigger {
          width: 100%;
          max-width: 280px;
        }

        .calendar-dropdown-wrap {
          position: relative;
        }

        .calendar-menu-dropdown {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 0;
          right: 0;
          background: var(--ivory-50);
          border: 1px solid rgba(199, 161, 90, 0.55);
          border-radius: 4px;
          box-shadow: 0 12px 30px rgba(37, 32, 30, 0.14);
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 25;
        }

        .calendar-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 3px;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--wine-900);
          background: transparent;
          border: none;
          text-decoration: none;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background-color 0.15s ease;
        }

        .calendar-menu-item:hover {
          background-color: rgba(199, 161, 90, 0.14);
        }
      `}</style>
    </section>
  );
}
