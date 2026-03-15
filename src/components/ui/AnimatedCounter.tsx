import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from './ScrollReveal'; // reuse cn utility

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  once?: boolean;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  once = true,
}: AnimatedCounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      delay: delay,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return controls.stop;
  }, [value, duration, delay, count]);

  return (
    <span className={cn('inline-block tabular-nums tracking-tight', className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};
