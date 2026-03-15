import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Eye, Hand, Volume2, VolumeX, Heart, Sparkles, RotateCcw } from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { motion } from 'framer-motion';

// ==================== BREATHING EXERCISE ====================
const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setPhase(p => {
            if (p === 'inhale') return 'hold';
            if (p === 'hold') return 'exhale';
            setCycles(c => c + 1);
            return 'inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const reset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimer(4);
    setCycles(0);
  };

  const circleSize = phase === 'inhale' ? 'scale-100' : phase === 'hold' ? 'scale-100' : 'scale-50';
  const phaseColor = phase === 'inhale' ? 'from-sky-400 to-blue-500' : phase === 'hold' ? 'from-violet-400 to-purple-500' : 'from-teal-400 to-emerald-500';
  const phaseText = phase === 'inhale' ? 'Breathe In 🌬️' : phase === 'hold' ? 'Hold ✨' : 'Breathe Out 💨';

  return (
    <GlassmorphicCard variant="light" className="flex flex-col overflow-hidden border-sky-500/20 shadow-xl shadow-sky-900/5 h-full">
      <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 p-5 border-b border-sky-500/10">
        <h3 className="flex items-center gap-2 text-xl font-kiddo text-foreground">
          <Wind className="h-6 w-6 text-sky-400" />
          Breathing Bubble
        </h3>
      </div>
      <div className="p-8 flex flex-col items-center flex-1 justify-center">
        {/* Breathing circle */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColor} opacity-20 transition-transform duration-[4000ms] ease-in-out ${circleSize}`}
          />
          <div
            className={`absolute inset-4 rounded-full bg-gradient-to-br ${phaseColor} opacity-30 transition-transform duration-[4000ms] ease-in-out ${circleSize}`}
          />
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${phaseColor} flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${circleSize} shadow-lg`}
          >
            <span className="text-white font-kiddo text-2xl">{timer}</span>
          </div>
        </div>

        {isActive && (
          <p className="text-xl font-kiddo text-foreground mb-4 animate-pulse">{phaseText}</p>
        )}

        {cycles > 0 && (
          <Badge variant="outline" className="mb-4 border-sky-500/30 text-sky-400 font-story">
             {cycles} breath{cycles !== 1 ? 's' : ''} completed 🌟
          </Badge>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => setIsActive(!isActive)}
            className={`rounded-2xl font-kiddo text-lg px-6 h-auto py-3 shadow-lg hover:scale-105 active:scale-95 transition-all ${isActive ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-blue-500/20'} text-white`}
          >
            {isActive ? 'Pause' : 'Start Breathing'}
          </Button>
          {cycles > 0 && (
            <Button variant="outline" onClick={reset} className="rounded-2xl h-auto py-3 px-4 hover:bg-slate-100 dark:hover:bg-slate-800 font-story">
              <RotateCcw className="h-5 w-5 h-5 w-5 mr-1 text-slate-500" /> Reset
            </Button>
          )}
        </div>
      </div>
    </GlassmorphicCard>
  );
};

// ==================== 5-4-3-2-1 GROUNDING ====================
const GroundingExercise: React.FC = () => {
  const steps = [
    { count: 5, sense: 'things you can SEE 👀', color: 'from-blue-400 to-cyan-400', emoji: '👁️' },
    { count: 4, sense: 'things you can TOUCH 🤚', color: 'from-green-400 to-emerald-400', emoji: '✋' },
    { count: 3, sense: 'things you can HEAR 👂', color: 'from-yellow-400 to-amber-400', emoji: '👂' },
    { count: 2, sense: 'things you can SMELL 👃', color: 'from-orange-400 to-red-400', emoji: '👃' },
    { count: 1, sense: 'thing you can TASTE 👅', color: 'from-pink-400 to-rose-400', emoji: '👅' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<string[][]>([[], [], [], [], []]);
  const [inputVal, setInputVal] = useState('');
  const [completed, setCompleted] = useState(false);

  const addItem = () => {
    if (!inputVal.trim()) return;
    const newItems = [...items];
    newItems[currentStep] = [...newItems[currentStep], inputVal.trim()];
    setItems(newItems);
    setInputVal('');

    if (newItems[currentStep].length >= steps[currentStep].count) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setItems([[], [], [], [], []]);
    setInputVal('');
    setCompleted(false);
  };

  const step = steps[currentStep];

  return (
    <GlassmorphicCard variant="light" className="flex flex-col overflow-hidden border-emerald-500/20 shadow-xl shadow-emerald-900/5 h-full">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-5 border-b border-emerald-500/10">
        <h3 className="flex items-center gap-2 text-xl font-kiddo text-foreground">
          <Eye className="h-6 w-6 text-emerald-400" />
          5-4-3-2-1 Grounding
        </h3>
      </div>
      <div className="p-8 flex flex-col flex-1">
        {completed ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🌈</div>
            <h3 className="text-2xl font-kiddo mb-2 text-foreground">You did it!</h3>
            <p className="text-muted-foreground font-story mb-4">You're grounded and present. Well done! 💪</p>
            <Button onClick={reset} className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-story">
              <RotateCcw className="h-4 w-4 mr-1" /> Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    i < currentStep
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : i === currentStep
                      ? `bg-gradient-to-br ${s.color} text-white scale-110`
                      : 'bg-muted/30 border border-border/50'
                  }`}
                >
                  {i < currentStep ? '✅' : s.count}
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-kiddo text-foreground">
                Name <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent font-bold`}>{step.count}</span> {step.sense}
              </p>
              <p className="text-sm text-muted-foreground font-story mt-1">
                {items[currentStep].length} of {step.count} found
              </p>
            </div>

            {/* Input & items */}
            <div className="flex gap-2 mb-4">
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder={`Type something you can ${steps[currentStep].sense.split(' ').slice(-1)[0].replace('👀','see').replace('🤚','touch').replace('👂','hear').replace('👃','smell').replace('👅','taste')}...`}
                className="flex-1 px-4 py-2 rounded-xl bg-muted/50 border border-border/50 focus:border-green-400 outline-none text-sm font-story"
              />
              <Button onClick={addItem} className={`rounded-xl bg-gradient-to-r ${step.color} text-white`}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {items[currentStep].map((item, i) => (
                <Badge key={i} variant="outline" className="border-green-500/30 text-green-400 font-story">
                  {step.emoji} {item}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </GlassmorphicCard>
  );
};

// ==================== BUBBLE POP FIDGET ====================
const BubblePop: React.FC = () => {
  const [bubbles, setBubbles] = useState<boolean[]>(Array(35).fill(false));
  const [popped, setPopped] = useState(0);

  const popBubble = (index: number) => {
    if (bubbles[index]) return;
    const newBubbles = [...bubbles];
    newBubbles[index] = true;
    setBubbles(newBubbles);
    setPopped(p => p + 1);
  };

  const reset = () => {
    setBubbles(Array(35).fill(false));
    setPopped(0);
  };

  const colors = ['bg-pink-400/60', 'bg-violet-400/60', 'bg-sky-400/60', 'bg-emerald-400/60', 'bg-amber-400/60', 'bg-rose-400/60', 'bg-cyan-400/60'];

  return (
    <GlassmorphicCard variant="light" className="flex flex-col overflow-hidden border-pink-500/20 shadow-xl shadow-pink-900/5 h-full">
      <div className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 p-5 border-b border-pink-500/10 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-kiddo text-foreground">
          <Hand className="h-6 w-6 text-pink-400" />
          Bubble Pop 🫧
        </h3>
        <Badge variant="outline" className="border-pink-500/30 text-pink-500 font-kiddo text-sm px-3 py-1">
          {popped}/35
        </Badge>
      </div>
      <div className="p-8 flex flex-col items-center flex-1 justify-center">
        <div className="grid grid-cols-7 gap-3 mb-6">
          {bubbles.map((isPop, i) => (
            <button
              key={i}
              onClick={() => popBubble(i)}
              className={`aspect-square rounded-full transition-all duration-200 ${
                isPop
                  ? 'bg-muted/20 border border-border/30 scale-75'
                  : `${colors[i % colors.length]} hover:scale-110 active:scale-75 border-2 border-white/20 shadow-md cursor-pointer`
              }`}
              disabled={isPop}
            />
          ))}
        </div>
        {popped >= 35 && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <p className="font-kiddo text-2xl text-pink-500 mb-4 animate-bounce">Wow! All popped! 🎉</p>
            <Button onClick={reset} variant="outline" className="rounded-2xl font-kiddo text-lg h-auto py-2 px-6 border-pink-500/30 text-pink-500 hover:bg-pink-50">
              <RotateCcw className="h-5 w-5 mr-2" /> New Bubbles
            </Button>
          </motion.div>
        )}
      </div>
    </GlassmorphicCard>
  );
};

// ==================== MAIN CALM ZONE PAGE ====================
const CalmZone: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <ParticleBackground theme="sanctuary" particleCount={50} className="fixed inset-0 pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/5 via-teal-400/5 to-emerald-400/5 pointer-events-none" />

      <Navigation />
      <div className="pt-28 pb-24 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-500/20 shadow-sm mb-6">
              <Heart className="h-4 w-4 text-sky-500 animate-pulse" />
              <span className="text-sm font-kiddo tracking-wide text-sky-700 dark:text-sky-300">Your Safe Space</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-kiddo mb-6 bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              Calm Zone
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-story leading-relaxed">
              Take a moment to breathe, ground yourself, and find your calm. You're doing great! 💙
            </p>
          </motion.div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0.1}><BreathingExercise /></ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}><GroundingExercise /></ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}><BubblePop /></ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}><AffirmationCard /></ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== AFFIRMATION CARD ====================
const affirmations = [
  { text: "I am brave and strong 💪", emoji: "🦁" },
  { text: "It's okay to feel my feelings 💙", emoji: "🌊" },
  { text: "I am loved just as I am 💕", emoji: "🌸" },
  { text: "I can do hard things ⭐", emoji: "🚀" },
  { text: "My brain is amazing and unique 🧠", emoji: "✨" },
  { text: "I am a good friend 🤝", emoji: "🌈" },
  { text: "Every day I'm learning and growing 🌱", emoji: "🌻" },
  { text: "It's okay to take a break 😌", emoji: "☁️" },
  { text: "I believe in myself 🌟", emoji: "🦋" },
  { text: "I am creative and wonderful 🎨", emoji: "🎪" },
];

const AffirmationCard: React.FC = () => {
  const [index, setIndex] = useState(Math.floor(Math.random() * affirmations.length));
  const aff = affirmations[index];

  return (
    <GlassmorphicCard variant="light" className="flex flex-col overflow-hidden border-amber-500/20 shadow-xl shadow-amber-900/5 h-full">
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 p-5 border-b border-amber-500/10">
        <h3 className="flex items-center gap-2 text-xl font-kiddo text-foreground">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Positive Words
        </h3>
      </div>
      <div className="p-8 flex flex-col items-center justify-center flex-1 min-h-[250px] relative">
        <motion.div 
          key={index}
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex flex-col items-center z-10"
        >
          <div className="text-7xl mb-6 drop-shadow-md hover:scale-110 transition-transform cursor-pointer">{aff.emoji}</div>
          <p className="text-2xl md:text-3xl font-kiddo text-center text-slate-800 dark:text-slate-100 mb-8 max-w-sm leading-tight">
            "{aff.text}"
          </p>
        </motion.div>
        
        <Button
          onClick={() => setIndex((index + 1) % affirmations.length)}
          className="rounded-2xl font-kiddo text-lg px-6 py-3 h-auto bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all z-10"
        >
          Next Affirmation ✨
        </Button>
      </div>
    </GlassmorphicCard>
  );
};

export default CalmZone;
