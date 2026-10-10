import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to copy text to clipboard with fallback.
 * Based on PRD Section 16 & 17.
 *
 * @param {number} resetDurationMs - Delay before resetting copied state (default: 2500ms)
 * @returns {{ copyToClipboard: (text: string) => Promise<boolean>, copiedText: string | null, isCopied: boolean }}
 */
export function useClipboard(resetDurationMs = 2500) {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef(null);

  const copyToClipboard = useCallback(
    async (text) => {
      if (!text) return false;

      let success = false;

      // 1. Try modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch {
          success = false;
        }
      }

      // 2. Fallback to textarea execCommand if Clipboard API failed or not available
      if (!success) {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          success = document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch (err) {
          console.warn('Clipboard fallback copy error:', err);
          success = false;
        }
      }

      if (success) {
        setCopiedText(text);
        setIsCopied(true);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setIsCopied(false);
          setCopiedText(null);
        }, resetDurationMs);
      }

      return success;
    },
    [resetDurationMs]
  );

  return { copyToClipboard, copiedText, isCopied };
}
