import { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
}

/**
 * React hook for VITA Text-to-Speech narration.
 * Calls the backend /api/tts/synthesize endpoint and plays the returned WAV audio.
 */
export function useTTS(voice: 'luna' | 'sage' = 'luna') {
  const [state, setState] = useState<TTSState>({ isLoading: false, isPlaying: false, error: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState({ isLoading: false, isPlaying: false, error: null });
  }, []);

  const speak = useCallback(async (text: string) => {
    stop(); // Stop any previous audio
    if (!text.trim()) return;

    setState({ isLoading: true, isPlaying: false, error: null });

    try {
      const res = await fetch(`${API_BASE}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 500), voice }),
      });

      const data = await res.json();

      if (data.success && data.audio) {
        const audioSrc = `data:audio/wav;base64,${data.audio}`;
        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.onplay = () => setState(s => ({ ...s, isPlaying: true, isLoading: false }));
        audio.onended = () => setState({ isLoading: false, isPlaying: false, error: null });
        audio.onerror = () => setState({ isLoading: false, isPlaying: false, error: 'Audio playback failed' });

        await audio.play();
      } else {
        // Fallback to browser SpeechSynthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.onstart = () => setState({ isLoading: false, isPlaying: true, error: null });
          utterance.onend = () => setState({ isLoading: false, isPlaying: false, error: null });
          window.speechSynthesis.speak(utterance);
        } else {
          setState({ isLoading: false, isPlaying: false, error: 'TTS not available' });
        }
      }
    } catch (err) {
      // Fallback to browser SpeechSynthesis on network error
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.onstart = () => setState({ isLoading: false, isPlaying: true, error: null });
        utterance.onend = () => setState({ isLoading: false, isPlaying: false, error: null });
        window.speechSynthesis.speak(utterance);
      } else {
        setState({ isLoading: false, isPlaying: false, error: 'TTS connection failed' });
      }
    }
  }, [voice, stop]);

  return { ...state, speak, stop };
}

/**
 * Play a quick UI sound effect via Web Audio API
 */
export function playSoundEffect(type: 'pop' | 'chime' | 'whoosh' = 'pop') {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  switch (type) {
    case 'pop':
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
      break;
    case 'chime':
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523, ctx.currentTime);
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
      break;
    case 'whoosh':
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.25);
      break;
  }
}
