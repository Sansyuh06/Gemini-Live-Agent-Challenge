import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Luna from '@/components/Luna/Luna';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const ChildOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(7);
  const [genre, setGenre] = useState('adventure');

  const genres = [
    { value: 'adventure', label: '🏰 Adventure', desc: 'Brave quests and treasure hunts' },
    { value: 'fantasy', label: '🦄 Fantasy', desc: 'Magic, dragons, and enchanted worlds' },
    { value: 'space', label: '🚀 Space', desc: 'Rockets, aliens, and galaxies' },
    { value: 'ocean', label: '🌊 Ocean', desc: 'Underwater friends and sea adventures' },
    { value: 'animals', label: '🦁 Animals', desc: 'Talking animals and jungle fun' },
  ];

  const handleStart = () => {
    localStorage.setItem('storyweaver-child-profile', JSON.stringify({ name, age, genre }));
    navigate('/wonder');
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" as const } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-pink-50 to-sky-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 px-4 relative overflow-hidden">
      <ParticleBackground theme="wonder" particleCount={40} className="opacity-50" />
      <div className="max-w-md w-full relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="light" className="p-8 text-center border-amber-200/50 dark:border-amber-500/30">
                <Luna emotion="joyful" />
                <h2 className="text-3xl font-kiddo mt-6 mb-2 text-foreground">Hello there! 🌟</h2>
                <p className="text-muted-foreground font-story mb-6 text-lg">
                  I'm Luna, your storytelling friend! What's your name?
                </p>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type your name..."
                  className="text-center text-xl rounded-xl mb-6 font-story py-6 shadow-inner bg-white/50 dark:bg-black/20 border-amber-200 dark:border-amber-500/30"
                  autoFocus
                />
                <Button
                  onClick={() => name.trim() && setStep(1)}
                  disabled={!name.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-kiddo text-xl py-7 shadow-lg shadow-amber-500/20"
                >
                  That's me! 🙋
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="light" className="p-8 text-center border-amber-200/50 dark:border-amber-500/30">
                <Luna emotion="curious" />
                <h2 className="text-3xl font-kiddo mt-6 mb-2 text-foreground">Hi {name}! 🎉</h2>
                <p className="text-muted-foreground font-story mb-6 text-lg">
                  How old are you?
                </p>
                <div className="flex justify-center gap-3 flex-wrap mb-8">
                  {[4, 5, 6, 7, 8, 9, 10].map(a => (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      className={`w-14 h-14 rounded-2xl text-2xl font-kiddo transition-all duration-300 ${
                        age === a
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white scale-110 shadow-lg shadow-amber-500/30'
                          : 'bg-white/60 dark:bg-white/10 hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-sm border border-amber-100 dark:border-amber-500/20'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-kiddo text-xl py-7 shadow-lg shadow-amber-500/20"
                >
                  Next! ➡️
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <GlassmorphicCard variant="light" className="p-8 text-center border-amber-200/50 dark:border-amber-500/30">
                <Luna emotion="wonder" />
                <h2 className="text-3xl font-kiddo mt-6 mb-2 text-foreground">What kind of story? 📖</h2>
                <p className="text-muted-foreground font-story mb-6 text-lg">
                  Pick your favourite!
                </p>
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {genres.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGenre(g.value)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 ${
                        genre === g.value
                          ? 'bg-gradient-to-r from-amber-400/20 to-yellow-400/20 border-2 border-amber-400 shadow-md scale-[1.02]'
                          : 'bg-white/60 dark:bg-white/5 border border-border/40 hover:border-amber-400/40 hover:bg-white/80 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="text-3xl">{g.label.split(' ')[0]}</span>
                      <div>
                        <p className="font-kiddo text-lg text-foreground">{g.label.split(' ').slice(1).join(' ')}</p>
                        <p className="text-sm text-muted-foreground font-story mt-0.5">{g.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleStart}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-kiddo text-xl py-7 shadow-lg shadow-pink-500/25 transition-transform hover:scale-[1.02]"
                >
                  Let's create a story! 🚀
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChildOnboarding;
