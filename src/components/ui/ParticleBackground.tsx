import React, { useEffect, useRef } from 'react';
import { cn } from './ScrollReveal';

interface ParticleBackgroundProps {
  theme?: 'wonder' | 'sanctuary' | 'default';
  className?: string;
  particleCount?: number;
}

export const ParticleBackground = ({ 
  theme = 'default', 
  className,
  particleCount = 40 
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string;
    }> = [];
    
    let animationFrameId: number;

    // Theme color palettes
    const palettes = {
      wonder: ['#f472b6', '#fbbf24', '#38bdf8', '#a78bfa'], // playful: pink, yellow, blue, purple
      sanctuary: ['#2dd4bf', '#818cf8', '#6366f1', '#14b8a6'], // calm: teals, indigos
      default: ['#ffffff']
    };

    const colors = palettes[theme];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (theme === 'wonder' ? 4 : 2) + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - (theme === 'wonder' ? 0.5 : 0.2), // gentle upward float
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Twinkle effect
        p.opacity += (Math.random() - 0.5) * 0.02;
        if(p.opacity < 0.1) p.opacity = 0.1;
        if(p.opacity > 0.8) p.opacity = 0.8;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
      style={{ opacity: 0.6 }}
    />
  );
};
