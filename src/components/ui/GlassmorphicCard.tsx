import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from './ScrollReveal';

interface GlassmorphicCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'glow';
  interactive?: boolean;
}

export const GlassmorphicCard = ({ 
  children, 
  className,
  variant = 'light',
  interactive = false,
  ...props 
}: GlassmorphicCardProps) => {
  
  const variants = {
    light: 'bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl',
    dark: 'bg-black/60 backdrop-blur-2xl border border-white/5 shadow-2xl text-white',
    glow: 'bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] transition-shadow duration-500'
  };

  const interactives = interactive 
    ? "hover:-translate-y-1 hover:border-white/40 dark:hover:border-white/20 transition-all duration-300 cursor-pointer" 
    : "";

  return (
    <motion.div 
      className={cn(
        "rounded-2xl overflow-hidden relative", 
        variants[variant], 
        interactives,
        className
      )}
      {...props}
    >
      {/* Subtle shine effect for interactives */}
      {interactive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};
