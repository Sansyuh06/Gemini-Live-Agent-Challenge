import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft, Volume2 } from 'lucide-react';
import Luna from '@/components/Luna/Luna';
import { StoryPanel } from '@/components/Storybook/StoryPanel';
import { useLuna } from '@/hooks/useLuna';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const StoryWeaverWonder: React.FC = () => {
  const navigate = useNavigate();
  const { turns, isGenerating, error, initializeSession, sendMessage, speakText, childProfile } = useLuna();
  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized) {
      const saved = localStorage.getItem('storyweaver-child-profile');
      if (saved) {
        const profile = JSON.parse(saved);
        initializeSession(profile);
        setInitialized(true);
      } else {
        navigate('/wonder/onboarding');
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

    const turn = await sendMessage(msg);
    if (turn?.narration) {
      speakText(turn.narration);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 relative">
      <ParticleBackground theme="wonder" particleCount={30} className="fixed inset-0 pointer-events-none opacity-50" />

      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-500/20 px-4 py-3 shadow-md shadow-amber-500/5"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-kiddo text-base">Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Luna isSpeaking={isGenerating} emotion={turns.length > 0 ? (turns[turns.length - 1].emotionalTone as any) : 'joyful'} />
          </div>
          <div>
            {childProfile && (
              <span className="text-sm font-kiddo text-amber-600 dark:text-amber-300 bg-amber-200/50 dark:bg-amber-900/40 px-4 py-2 rounded-full shadow-inner border border-amber-200 dark:border-amber-500/30">
                {childProfile.name}'s Story 📖
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Story Panels */}
      <div className="max-w-3xl mx-auto px-4 py-10 pb-48 space-y-8 relative z-10">
        <AnimatePresence>
          {turns.length === 0 && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-center py-24"
            >
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-amber-300/30 blur-[60px] rounded-full" />
                <Luna emotion="wonder" />
              </div>
              <h2 className="mt-8 text-4xl font-kiddo text-foreground">
                Hi{childProfile ? `, ${childProfile.name}` : ''}! 🌟
              </h2>
              <p className="mt-4 text-muted-foreground font-story text-xl max-w-lg mx-auto leading-relaxed">
                Tell me about the story you want to create! What kind of adventure should we go on?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {turns.map((turn, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="space-y-2 perspective-1200"
            >
              <StoryPanel turn={turn} index={i} />
              {turn.narration && (
                <div className="flex justify-end pr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(turn.narration)}
                    className="text-xs text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-full"
                  >
                    <Volume2 className="h-3 w-3 mr-1" /> Listen 🔊
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Luna isSpeaking emotion="curious" />
            <p className="mt-6 text-xl text-amber-500 font-kiddo animate-pulse tracking-wide">
              Luna is crafting your story... ✨
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4 px-6 rounded-2xl bg-destructive/10 border border-destructive/20 max-w-md mx-auto">
            <p className="text-destructive font-story text-base font-medium">{error}</p>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 px-4 pb-8 z-40"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 p-3 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-amber-200/50 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10 focus-within:border-amber-400 dark:focus-within:border-amber-400 transition-colors">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={turns.length === 0 ? "What adventure do you want? 🚀" : "What happens next? ✨"}
              className="flex-1 px-5 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none font-story text-lg"
              disabled={isGenerating}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="rounded-2xl h-auto px-6 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-kiddo text-lg shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="h-5 w-5 mr-2" />
              <span>Send</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryWeaverWonder;
