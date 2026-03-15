import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  staggerChildren?: number;
  staggerDelay?: number;
}

export const ScrollReveal = ({
  children,
  width = '100%',
  className,
  delay = 0,
  direction = 'up',
  staggerChildren,
  staggerDelay = 0.1
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const yOffset = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;
  const xOffset = direction === 'left' ? 50 : direction === 'right' ? -50 : 0;

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: yOffset, 
      x: xOffset,
      scale: direction === 'none' ? 0.95 : 1
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.22, 1, 0.36, 1] as const, // Custom spring-like easing
        staggerChildren: staggerChildren ? staggerDelay : 0,
      }
    }
  };

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
};
