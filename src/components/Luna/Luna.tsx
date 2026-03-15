import React from 'react';

interface LunaProps {
  isSpeaking?: boolean;
  emotion?: 'joyful' | 'curious' | 'brave' | 'gentle' | 'silly' | 'wonder';
}

const Luna: React.FC<LunaProps> = ({ isSpeaking = false, emotion = 'joyful' }) => {
  const emotionStyles: Record<string, { glow: string; eyes: string; bg: string }> = {
    joyful: { glow: '#FFD93D', eyes: '✨', bg: 'from-amber-300 to-yellow-400' },
    curious: { glow: '#45B7D1', eyes: '🔍', bg: 'from-cyan-300 to-sky-400' },
    brave: { glow: '#FF6B9D', eyes: '💪', bg: 'from-rose-300 to-pink-400' },
    gentle: { glow: '#96CEB4', eyes: '🌸', bg: 'from-emerald-300 to-green-400' },
    silly: { glow: '#DDA0DD', eyes: '🤪', bg: 'from-purple-300 to-violet-400' },
    wonder: { glow: '#FFD93D', eyes: '⭐', bg: 'from-yellow-300 to-orange-400' },
  };

  const style = emotionStyles[emotion] || emotionStyles.joyful;

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <div
        className={`absolute -inset-4 rounded-full blur-xl opacity-30 ${isSpeaking ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: style.glow }}
      />

      {/* Luna body */}
      <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${style.bg} flex items-center justify-center shadow-lg ${isSpeaking ? 'animate-bounce-gentle' : 'hover:scale-105 transition-transform'}`}>
        {/* Face */}
        <div className="text-center">
          <div className="text-2xl md:text-3xl mb-1">{style.eyes}</div>
          <div className={`text-lg ${isSpeaking ? 'animate-pulse' : ''}`}>
            {isSpeaking ? '🗣️' : '😊'}
          </div>
        </div>

        {/* Sparkle decorations */}
        <div className="absolute -top-1 -right-1 text-sm animate-float">✨</div>
        <div className="absolute -bottom-1 -left-1 text-sm animate-float" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>

      {/* Name tag */}
      <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200/50">
        <span className="text-xs font-kiddo font-bold text-amber-700 dark:text-amber-300">Luna ✨</span>
      </div>
    </div>
  );
};

export default Luna;
