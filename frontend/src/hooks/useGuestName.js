import { useMemo } from 'react';

/**
 * Hook to retrieve and sanitize personalized guest name from URL query parameter.
 * Based on PRD Section 31.
 *
 * Example:
 *   /?to=Fikri%20Arrahman%20dan%20Partner
 * Returns:
 *   "Fikri Arrahman dan Partner"
 */
export function useGuestName() {
  const guestName = useMemo(() => {
    if (typeof window === 'undefined') return 'Bapak/Ibu/Saudara/i';

    try {
      const params = new URLSearchParams(window.location.search);
      const rawValue = params.get('to');

      if (!rawValue) return 'Bapak/Ibu/Saudara/i';

      // Trim whitespace and limit length to 120 characters to prevent overflow
      const cleaned = rawValue.trim().slice(0, 120);
      return cleaned || 'Bapak/Ibu/Saudara/i';
    } catch {
      return 'Bapak/Ibu/Saudara/i';
    }
  }, []);

  return guestName;
}
