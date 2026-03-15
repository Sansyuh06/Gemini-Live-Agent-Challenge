import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import Sage from '@/components/Sage/Sage';
import { MoodCheckIn } from '@/components/Sanctuary/MoodCheckIn';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const AdultOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [protagonistName, setProtagonistName] = useState('');
  const [moodLevel, setMoodLevel] = useState<number | null>(null);

  const handleStart = () => {
    localStorage.setItem('storyweaver-sanctuary-profile', JSON.stringify({
      protagonistName,
      moodLevel,
    }));
    navigate('/sanctuary');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" as const } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 relative overflow-hidden">
      <ParticleBackground theme="sanctuary" particleCount={50} className="opacity-40" />
      <div className="max-w-lg w-full relative z-10">
        <AnimatePresence mode="wait">
          {/* Screen 1: Disclaimer */}
          {step === 0 && (
            <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="dark" className="p-10 text-center border-teal-500/20">
                <Sage />
                <div className="mt-8 mb-8 text-left">
                  <p className="text-white/80 font-story font-light leading-relaxed mb-4 text-lg">
                    StoryWeaver is a creative space to explore your feelings through story. 
                    It is not therapy and cannot replace professional support.
                  </p>
                  <p className="text-white/80 font-story font-light leading-relaxed mb-6 text-lg">
                    It is simply a quiet place for your narrative.
                  </p>
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200/80 font-story leading-relaxed">
                      If you are in crisis, please contact a professional. Crisis lines: <br/>
                      <strong className="text-amber-400 font-medium">988 (US), 116 123 (UK), 9152987821 (India).</strong>
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setStep(1)}
                  className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-serif-elegant text-xl py-7 shadow-lg shadow-teal-700/20 transition-all hover:scale-[1.02]"
                >
                  I understand. Continue.
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* Screen 2: Mood Check-in */}
          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="dark" className="p-10 text-center border-teal-500/20">
                <h2 className="text-3xl font-serif-elegant text-white/90 mb-3">
                  How does today feel?
                </h2>
                <p className="text-white/40 text-base mb-8 font-story">
                  There are no wrong answers.
                </p>
                <div className="mb-4">
                  <MoodCheckIn
                    onSelect={(level) => {
                      setMoodLevel(level);
                      setTimeout(() => setStep(2), 600);
                    }}
                    selected={moodLevel}
                  />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="mt-8 text-white/40 hover:text-white/80 hover:bg-white/5 font-story text-base py-6 w-full rounded-xl"
                >
                  Skip for now
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* Screen 3: Name protagonist */}
          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="dark" className="p-10 text-center border-teal-500/20">
                <Sage />
                <h2 className="text-2xl font-serif-elegant text-white/90 mt-8 mb-4 leading-snug">
                  What would you like to call your story's protagonist?
                </h2>
                <p className="text-white/50 text-base mb-8 font-story leading-relaxed border-l-2 border-teal-500/30 pl-4 text-left italic">
                  This is not you — it is the character who will carry your story. 
                  This creates narrative distance, which is part of the process.
                </p>
                <Input
                  value={protagonistName}
                  onChange={e => setProtagonistName(e.target.value)}
                  placeholder="Give them a name..."
                  className="text-center text-xl rounded-xl mb-8 bg-slate-900/50 border-teal-500/30 text-white placeholder:text-white/30 font-serif-elegant py-7 shadow-inner"
                  autoFocus
                />
                <Button
                  onClick={handleStart}
                  disabled={!protagonistName.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-serif-elegant text-xl py-7 shadow-lg shadow-teal-700/20 transition-all hover:scale-[1.02]"
                >
                  Begin my story
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdultOnboarding;
