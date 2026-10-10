import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to manage single audio playback instance.
 * Based on PRD Section 22 & 39.
 *
 * Guaranteed single audio element, safe error handling for placeholders,
 * and audio policy compliance (no autoplay before user interaction).
 */
export function useAudio(audioUrl) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    // Create single Audio instance
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleCanPlay = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      console.warn('Audio playback notice (placeholder file or network):', e);
      setIsPlaying(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, [audioUrl]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
    } catch (err) {
      console.warn('Audio play prevented or placeholder format:', err.message);
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
    } catch (err) {
      console.warn('Audio pause error:', err);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return {
    isPlaying,
    isLoaded,
    play,
    pause,
    toggle,
  };
}
