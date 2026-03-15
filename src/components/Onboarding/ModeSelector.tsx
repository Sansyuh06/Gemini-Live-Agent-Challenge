import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

const TiltContainer = ({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) => {
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  const rotateX = useTransform(y, [0, 400], [5, -5]);
  const rotateY = useTransform(x, [0, 400], [-5, 5]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouse}
        onMouseLeave={() => { x.set(200); y.set(200); }}
        className="h-full w-full cursor-pointer"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const ModeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 relative overflow-hidden"
    >
      <ParticleBackground theme="sanctuary" particleCount={60} className="opacity-40" />
      
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
        }}
        className="relative z-10 max-w-4xl w-full text-center"
      >
        {/* Title */}
        <motion.h1 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-5xl md:text-7xl font-serif-elegant font-light mb-3 text-white tracking-tight"
        >
          StoryWeaver
        </motion.h1>
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-lg md:text-xl text-white/50 font-light mb-2 italic font-story"
        >
          Your story. Your healing. Your words.
        </motion.p>
        <motion.div 
          variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-16" 
        />

        <motion.p 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="text-2xl text-white/80 mb-12 font-light font-display"
        >
          Who is StoryWeaver for today?
        </motion.p>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wonder Mode — Children */}
          <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { type: "spring" } } }}>
            <TiltContainer onClick={() => navigate('/wonder/onboarding')} className="h-full">
              <GlassmorphicCard variant="glow" interactive className="h-full border-border/30 hover:border-amber-400/40 rounded-3xl p-10">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center shadow-xl shadow-amber-500/20 transform-gpu transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-display font-medium mb-4 text-white group-hover:text-amber-300 transition-colors">
                  A child in my life
                </h2>
                <p className="text-white/60 text-base leading-relaxed mb-8 font-story">
                  Co-create illustrated adventures with Luna — a warm, playful AI companion who makes learning magical.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400/10 text-amber-300 text-sm font-medium border border-amber-400/20">
                  <Sparkles className="h-4 w-4" />
                  Wonder Mode — Ages 4–10
                </div>
              </GlassmorphicCard>
            </TiltContainer>
          </motion.div>


          {/* Sanctuary Mode — Adults */}
          <motion.div variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { type: "spring" } } }}>
            <TiltContainer onClick={() => navigate('/sanctuary/onboarding')} className="h-full">
              <GlassmorphicCard variant="glow" interactive className="h-full border-border/30 hover:border-teal-400/40 rounded-3xl p-10">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-teal-500/20 transform-gpu transition-transform group-hover:scale-110 group-hover:-rotate-6">
                  <Heart className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-display font-medium mb-4 text-white group-hover:text-teal-300 transition-colors">
                  For me
                </h2>
                <p className="text-white/60 text-base leading-relaxed mb-8 font-story">
                  A quiet space to explore your feelings through story with Sage — a calm, non-judgmental presence.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-400/10 text-teal-300 text-sm font-medium border border-teal-400/20">
                  <Heart className="h-4 w-4" />
                  Sanctuary Mode — Adults
                </div>
              </GlassmorphicCard>
            </TiltContainer>
          </motion.div>
        </div>

        <motion.p 
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1 } } }}
          className="mt-16 text-white/30 text-xs font-story tracking-widest uppercase"
        >
          SDG 3: Good Health · SDG 4: Quality Education · SDG 10: Reduced Inequalities
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default ModeSelector;
