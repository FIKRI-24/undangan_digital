import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to calculate a realtime countdown to a target datetime.
 * Based on PRD Section 12.
 *
 * @param {string} targetDateIso - ISO 8601 string or valid date string (e.g. "2027-06-20T08:00:00+07:00")
 * @returns {{ days: string, hours: string, minutes: string, seconds: string, isCompleted: boolean }}
 */
export function useCountdown(targetDateIso) {
  const calculateTimeRemaining = useCallback(() => {
    if (!targetDateIso) {
      return { days: '00', hours: '00', minutes: '00', seconds: '00', isCompleted: false };
    }

    const targetTime = new Date(targetDateIso).getTime();
    const now = Date.now();
    const difference = targetTime - now;

    if (isNaN(difference) || difference <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isCompleted: true,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      isCompleted: false,
    };
  }, [targetDateIso]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  useEffect(() => {
    // Initial run
    setTimeLeft(calculateTimeRemaining());

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTimeRemaining]);

  return timeLeft;
}
