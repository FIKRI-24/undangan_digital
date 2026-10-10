/**
 * Formats an ISO date string or timestamp into Indonesian relative time.
 * Based on PRD Section 19.
 *
 * Rules:
 * - < 1 minute: "Baru saja"
 * - < 60 minutes: "X menit lalu"
 * - < 24 hours: "X jam lalu"
 * - < 48 hours: "Kemarin"
 * - < 7 days: "X hari lalu"
 * - >= 7 days: formatted localized date (e.g. "20 Jun 2027")
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 0) {
    return 'Baru saja';
  }

  if (diffSec < 60) {
    return 'Baru saja';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} menit lalu`;
  }

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'Kemarin';
  }

  if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  }

  // Indonesian localized date format: "20 Jun 2027"
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
