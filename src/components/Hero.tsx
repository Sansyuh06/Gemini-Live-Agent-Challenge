import React from "react";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import logo from "@/assets/kiddoverse-logo.png";

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const scrollToChallenges = () => {
    const challengesSection = document.getElementById('challenges');
    if (challengesSection) {
      challengesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 via-purple-50/50 to-sky-100/50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-blue-950/20" />
      <ParticleBackground theme="wonder" particleCount={30} className="opacity-60" />

      {/* Floating decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">⭐</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-25" style={{ animationDelay: '1s' }}>🌈</div>
        <div className="absolute bottom-40 left-20 text-4xl animate-float opacity-20" style={{ animationDelay: '2s' }}>📚</div>
        <div className="absolute top-60 left-1/3 text-5xl animate-float opacity-25" style={{ animationDelay: '0.5s' }}>🎵</div>
        <div className="absolute bottom-60 right-1/3 text-4xl animate-float opacity-20" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute bottom-20 right-10 text-5xl animate-float opacity-25" style={{ animationDelay: '0.8s' }}>🦋</div>
        <div className="absolute top-32 right-1/4 text-4xl animate-float opacity-20" style={{ animationDelay: '2.5s' }}>🧠</div>
        <div className="absolute bottom-32 left-1/4 text-5xl animate-float opacity-20" style={{ animationDelay: '1.8s' }}>💜</div>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center mt-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <motion.div 
            className="mb-8 flex justify-center"
            variants={{
              hidden: { scale: 0.8, opacity: 0, y: 20 },
              visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
            }}
          >
            <div className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img src={logo} alt="KiddoVerse" className="h-40 w-40 md:h-56 md:w-56 rounded-[2rem] shadow-2xl shadow-primary/20" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-kiddo font-bold mb-4 rainbow-text tracking-tight py-2"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            KiddoVerse
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-xl mx-auto leading-relaxed font-story font-medium"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            A magical world for every kind of mind 🌟
          </motion.p>
          <motion.p 
            className="text-base md:text-lg text-muted-foreground/80 mb-10 max-w-lg mx-auto font-story"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            Learn, create, and explore — with AI-powered art, calming activities, and interactive stories designed for <strong>every</strong> child. 💜
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-[80%]"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-xl shadow-pink-500/20" onClick={scrollToChallenges}>
              <Play className="h-5 w-5 mr-2" />
              Start Exploring!
            </Button>
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-xl shadow-fuchsia-500/20" onClick={() => navigate('/image-studio')}>
              <Sparkles className="h-5 w-5 mr-2" />
              Create with AI ✨
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};