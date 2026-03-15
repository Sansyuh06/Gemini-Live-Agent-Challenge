import { useState, useCallback, useRef } from 'react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface WonderTurn {
  narration: string;
  lunaDialogue: string;
  imagePrompt: string;
  imageUrl?: string;
  educationalMoment?: {
    type: string;
    question: string;
    hint: string;
  } | null;
  emotionalTone: string;
}

export interface ChildProfile {
  name: string;
  age: number;
  genre: string;
  storyBible?: Record<string, unknown>;
}

export function useLuna() {
  const [turns, setTurns] = useState<WonderTurn[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnNumberRef = useRef(0);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);

  const initializeSession = useCallback((profile: ChildProfile) => {
    setChildProfile(profile);
    turnNumberRef.current = 0;
    setTurns([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!childProfile || isGenerating) return null;

    setIsGenerating(true);
    setError(null);
    turnNumberRef.current += 1;

    try {
      const previousNarration = turns.length > 0
        ? turns[turns.length - 1].narration
        : undefined;

      // Generate story from Gemini via backend
      const storyRes = await fetch(`${SERVER_URL}/api/gemini/wonder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          childProfile,
          turnNumber: turnNumberRef.current,
          previousNarration,
        }),
      });

      const storyData = await storyRes.json();
      if (!storyData.success) throw new Error(storyData.error);

      const turn: WonderTurn = {
        ...storyData.data,
        imageUrl: undefined,
      };

      // Generate image in background
      if (turn.imagePrompt) {
        fetch(`${SERVER_URL}/api/fooocus/wonder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePrompt: turn.imagePrompt, genre: childProfile.genre }),
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
  }, [childProfile, isGenerating, turns]);

  const speakText = useCallback(async (text: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'luna' }),
      });
      const data = await res.json();
      if (data.success && data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.play();
      } else if (data.fallback) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        speechSynthesis.speak(utterance);
      }
    } catch {
      // Silently fail TTS
    }
  }, []);

  return {
    turns,
    isGenerating,
    error,
    childProfile,
    initializeSession,
    sendMessage,
    speakText,
    turnNumber: turnNumberRef.current,
  };
}
