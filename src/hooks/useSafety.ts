import { useEffect, useCallback } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

/**
 * useSafety — monitors text input for crisis indicators client-side
 * and provides a server-side screening function.
 */

const CRISIS_PHRASES = [
  'want to die', 'wanna die', 'kill myself', 'hurt myself',
  'end it all', 'end it', "can't go on", 'cannot go on',
  'goodbye forever', 'no reason to live', 'better off dead',
  'not worth living', 'take my life', 'suicidal', 'self harm',
  'cut myself', 'nobody would miss me', 'disappear forever',
];

export const CRISIS_RESOURCES = {
  us: { label: '🇺🇸 Suicide & Crisis Lifeline', contact: 'Call or text 988' },
  uk: { label: '🇬🇧 Samaritans', contact: 'Call 116 123' },
  india: { label: '🇮🇳 iCall', contact: 'Call 9152987821' },
  global: { label: '🌍 Find a Helpline', contact: 'findahelpline.com' },
};

export function useSafety() {
  /**
   * Quick client-side check for crisis language.
   * Returns true if crisis phrases detected.
   */
  const checkInputLocally = useCallback((text: string): boolean => {
    const lower = text.toLowerCase().trim();
    return CRISIS_PHRASES.some(phrase => lower.includes(phrase));
  }, []);

  /**
   * Server-side safety screening (more thorough).
   */
  const screenOnServer = useCallback(async (text: string, userId?: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/sanctuary/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId }),
      });
      return await res.json();
    } catch {
      // If server is down, fall back to local check
      const isCrisis = CRISIS_PHRASES.some(p => text.toLowerCase().includes(p));
      return isCrisis ? { crisis: true, crisisResponse: 'Please reach out to a crisis line: 988 (US), 116 123 (UK), 9152987821 (India)' } : { crisis: false };
    }
  }, []);

  /**
   * Log a safety event to the server.
   */
  const logSafetyEvent = useCallback(async (userId: string | undefined, flagReason: string) => {
    try {
      await fetch(`${SERVER_URL}/api/sanctuary/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, flagReason, timestamp: new Date().toISOString() }),
      });
    } catch {
      console.warn('[Safety] Could not log safety event');
    }
  }, []);

  return {
    checkInputLocally,
    screenOnServer,
    logSafetyEvent,
    CRISIS_RESOURCES,
  };
}
