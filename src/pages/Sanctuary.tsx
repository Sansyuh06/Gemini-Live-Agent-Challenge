import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Mic, MicOff, Send, BookOpen, ArrowLeft, Phone } from 'lucide-react';
import Sage from '@/components/Sage/Sage';
import { SanctuaryPanel } from '@/components/Sanctuary/SanctuaryPanel';
import { useSage } from '@/hooks/useSage';
import { useSafety, CRISIS_RESOURCES } from '@/hooks/useSafety';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const Sanctuary: React.FC = () => {
  const navigate = useNavigate();
  const {
    turns, isGenerating, error, safetyFlag, reflection,
    initializeSession, sendMessage, generateReflection, dismissSafetyFlag, speakText,
  } = useSage();
  const { checkInputLocally, logSafetyEvent } = useSafety();

  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      const saved = localStorage.getItem('storyweaver-sanctuary-profile');
      if (saved) {
        const profile = JSON.parse(saved);
        initializeSession({ protagonistName: profile.protagonistName }, profile.moodLevel);
        setInitialized(true);
      } else {
        navigate('/sanctuary/onboarding');
      }
    }
  }, [initialized, initializeSession, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const msg = input.trim();
    setInput('');

    // Client-side crisis check BEFORE sending to server
    if (checkInputLocally(msg)) {
      logSafetyEvent(undefined, 'Client-side crisis phrase detected');
      // The server safety middleware will also catch this, but we pre-empt here
    }

    const turn = await sendMessage(msg);
    if (turn?.sageDialogue) {
      speakText(turn.sageDialogue);
    }
  };

  const handleEndSession = async () => {
    await generateReflection();
  };

  // ========== CRISIS / SAFETY SCREEN ==========
  if (safetyFlag) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-serif text-white">You matter. 💙</h2>
          <p className="text-white/70 font-light leading-relaxed">{safetyFlag.response}</p>

          <div className="space-y-3">
            {Object.values(CRISIS_RESOURCES).map((resource, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-teal-500/20 text-left">
                <p className="text-white/80 font-medium text-sm">{resource.label}</p>
                <p className="text-teal-300 font-mono text-lg">{resource.contact}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={dismissSafetyFlag}
              variant="outline"
              className="rounded-xl border-teal-500/30 text-teal-300"
            >
              Return to story
            </Button>
            <Button onClick={() => navigate('/')} className="rounded-xl bg-teal-700 text-white">
              <ArrowLeft className="h-4 w-4 mr-1" /> Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN SANCTUARY EXPERIENCE ==========
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 relative">
      <ParticleBackground theme="sanctuary" particleCount={30} className="fixed inset-0 pointer-events-none opacity-40" />

      {/* Safety footer — always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-teal-500/10 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-[10px] text-white/20 font-story tracking-wide">
            StoryWeaver is a creative tool, not a clinical service. If you are in crisis, please contact a professional.
          </p>
          <a href="tel:988" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-[10px] text-amber-400/80 hover:text-amber-400 transition-colors">
            <Phone className="h-3 w-3" /> Exit to Safety Resources
          </a>
        </div>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-teal-500/10 px-4 py-3 shadow-sm shadow-teal-900/10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-serif text-sm">StoryWeaver</span>
          </button>
          <Sage isSpeaking={isGenerating} />
          <div className="flex gap-2">
            {turns.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEndSession}
                className="text-teal-400/60 hover:text-teal-300 text-xs font-light"
              >
                <BookOpen className="h-3 w-3 mr-1" /> End & Reflect
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Story Panels */}
      <div className="max-w-3xl mx-auto px-4 py-8 pb-48 space-y-8 relative z-10">
        <AnimatePresence>
          {turns.length === 0 && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center py-32"
            >
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-teal-500/20 blur-[50px] rounded-full" />
                <Sage />
              </div>
              <p className="mt-8 text-white/50 font-serif-elegant text-xl italic tracking-wide">
                "Whenever you're ready..."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {turns.map((turn, i) => (
          <SanctuaryPanel key={i} turn={turn} index={i} />
        ))}

        {/* Reflection display */}
        {reflection && (
          <div className="p-6 rounded-2xl bg-teal-900/20 border border-teal-500/20 text-center">
            <p className="text-xs text-teal-400/50 mb-2">💭 Session Reflection</p>
            <p className="text-white/70 font-serif italic leading-relaxed">
              "{reflection}"
            </p>
            <Button
              onClick={() => navigate('/reflections')}
              variant="ghost"
              className="mt-4 text-teal-400/50 hover:text-teal-300 text-xs"
            >
              View all reflections →
            </Button>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-12 left-0 right-0 px-4 z-40"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 p-2.5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-teal-500/20 shadow-2xl shadow-teal-900/30 transition-all focus-within:border-teal-500/40 focus-within:bg-slate-900/95">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Share what's on your mind..."
              className="flex-1 px-5 py-3.5 bg-transparent text-white/90 placeholder:text-white/30 outline-none font-serif-elegant text-base transition-colors"
              disabled={isGenerating}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white px-6 shadow-md transition-all hover:scale-105 active:scale-95 h-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              <span className="font-serif-elegant text-sm tracking-wide">Flow</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sanctuary;
