import { useState, useCallback, useRef } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface SanctuaryTurn {
  sageDialogue: string;
  narration: string;
  imagePrompt: string;
  imageUrl?: string;
  emotionalTheme: string;
  narrativeStage: string;
  reflectionNote?: string | null;
}

export interface SanctuaryProfile {
  protagonistName: string;
  previousSession?: {
    lastMoment: string;
    characterName: string;
  };
}

export function useSage() {
  const [turns, setTurns] = useState<SanctuaryTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [safetyFlag, setSafetyFlag] = useState<{ active: boolean; response: string } | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);
  const turnNumberRef = useRef(0);
  const [profile, setProfile] = useState<SanctuaryProfile | null>(null);
  const [moodLevel, setMoodLevel] = useState<number | null>(null);

  const initializeSession = useCallback((sanctuaryProfile: SanctuaryProfile, mood?: number) => {
    setProfile(sanctuaryProfile);
    setMoodLevel(mood || null);
    turnNumberRef.current = 0;
    setTurns([]);
    setError(null);
    setSafetyFlag(null);
    setReflection(null);
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!profile || isGenerating) return null;

    setIsGenerating(true);
    setError(null);
    turnNumberRef.current += 1;

    try {
      const previousNarration = turns.length > 0
        ? turns[turns.length - 1].narration
        : undefined;

      const res = await fetch(`${SERVER_URL}/api/gemini/sanctuary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          profile,
          turnNumber: turnNumberRef.current,
          moodLevel,
          previousNarration,
        }),
      });

      const data = await res.json();

      // Handle crisis/safety flag
      if (data.safetyFlag) {
        setSafetyFlag({ active: true, response: data.safetyResponse });
        return null;
      }

      if (!data.success) throw new Error(data.error);

      const turn: SanctuaryTurn = {
        ...data.data,
        imageUrl: undefined,
      };

      // Generate symbolic illustration in background
      if (turn.imagePrompt) {
        fetch(`${SERVER_URL}/api/fooocus/sanctuary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePrompt: turn.imagePrompt, emotionalTheme: turn.emotionalTheme }),
        })
          .then(r => r.json())
          .then(imgData => {
            if (imgData.success && imgData.images?.[0]) {
              setTurns(prev =>
                prev.map((t, i) =>
                  i === prev.length - 1 ? { ...t, imageUrl: imgData.images[0] } : t
                )
              );
            }
          })
          .catch(console.error);
      }

      setTurns(prev => [...prev, turn]);
      return turn;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [profile, isGenerating, turns, moodLevel]);

  const generateReflection = useCallback(async () => {
    if (turns.length === 0) return null;

    try {
      const sessionSummary = turns.map((t, i) =>
        `Turn ${i + 1}: ${t.narration} (Stage: ${t.narrativeStage})`
      ).join('\n');

      const res = await fetch(`${SERVER_URL}/api/gemini/reflection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionSummary }),
      });

      const data = await res.json();
      if (data.success) {
        setReflection(data.reflection);
        return data.reflection;
      }
    } catch (err) {
      console.error('Reflection generation failed:', err);
    }
    return null;
  }, [turns]);

  const speakText = useCallback(async (text: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'sage' }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      } else if (data.fallback) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        speechSynthesis.speak(utterance);
      }
    } catch {
      // Silently fail TTS
    }
  }, []);

  const dismissSafetyFlag = useCallback(() => {
    setSafetyFlag(null);
  }, []);

  return {
    turns,
    isGenerating,
    error,
    profile,
    safetyFlag,
    reflection,
    moodLevel,
    initializeSession,
    sendMessage,
    speakText,
    generateReflection,
    dismissSafetyFlag,
    setMoodLevel,
    turnNumber: turnNumberRef.current,
  };
}
