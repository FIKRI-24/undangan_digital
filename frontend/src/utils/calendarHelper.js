/**
 * Calendar Helper Utility
 * Generates Google Calendar web links and downloadable .ics files
 * for wedding events.
 */

/**
 * Format a Date object or date+time string into iCal timestamp format: YYYYMMDDTHHmmSS
 */
function formatDateToICal(dateStr, timeStr) {
  try {
    let baseDate = new Date();
    if (dateStr) {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        baseDate = parsed;
      }
    }

    let hours = 9;
    let minutes = 0;

    if (timeStr) {
      const match = timeStr.match(/(\d{1,2})[:.](\d{2})/);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = parseInt(match[2], 10);
      }
    }

    baseDate.setHours(hours, minutes, 0, 0);

    const pad = (n) => String(n).padStart(2, '0');
    const year = baseDate.getFullYear();
    const month = pad(baseDate.getMonth() + 1);
    const day = pad(baseDate.getDate());
    const hh = pad(baseDate.getHours());
    const mm = pad(baseDate.getMinutes());
    const ss = '00';

    return {
      dateObj: baseDate,
      iCalString: `${year}${month}${day}T${hh}${mm}${ss}`,
    };
  } catch {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return {
      dateObj: now,
      iCalString: `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T090000`,
    };
  }
}

/**
 * Generate Google Calendar URL for an event
 */
export function generateGoogleCalendarUrl(event, coupleTitle = 'Pernikahan') {
  const { type = 'Acara Pernikahan', date, startTime, endTimeLabel, venue = '', address = '' } = event;
  const title = `${type} - ${coupleTitle}`;
  const details = `Undangan ${type} ${coupleTitle}.\nLokasi: ${venue}\nAlamat: ${address}\n\nTerima kasih atas doa dan kehadirannya.`;
  const location = venue ? (address ? `${venue}, ${address}` : venue) : address;

  const start = formatDateToICal(date, startTime);
  
  let end = formatDateToICal(date, endTimeLabel);
  if (endTimeLabel?.toLowerCase().includes('selesai') || isNaN(end.dateObj.getTime()) || end.dateObj <= start.dateObj) {
    const endDate = new Date(start.dateObj.getTime() + 2 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    end = {
      dateObj: endDate,
      iCalString: `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`,
    };
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start.iCalString}/${end.iCalString}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Download .ics file for Apple Calendar, Outlook, and native mobile calendar
 */
export function downloadIcsFile(event, coupleTitle = 'Pernikahan') {
  const { type = 'Acara Pernikahan', date, startTime, endTimeLabel, venue = '', address = '' } = event;
  const title = `${type} - ${coupleTitle}`;
  const details = `Undangan ${type} ${coupleTitle}. Lokasi: ${venue}, ${address}`;
  const location = venue ? (address ? `${venue}, ${address}` : venue) : address;

  const start = formatDateToICal(date, startTime);
  let end = formatDateToICal(date, endTimeLabel);
  if (endTimeLabel?.toLowerCase().includes('selesai') || isNaN(end.dateObj.getTime()) || end.dateObj <= start.dateObj) {
    const endDate = new Date(start.dateObj.getTime() + 2 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    end = {
      dateObj: endDate,
      iCalString: `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`,
    };
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@wedding-invitation`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start.iCalString}`,
    `DTEND:${end.iCalString}`,
    `SUMMARY:${title.replace(/[,;]/g, ' ')}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location.replace(/[,;]/g, ' ')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Pengingat Acara Pernikahan',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${type.replace(/\s+/g, '_')}_Wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
