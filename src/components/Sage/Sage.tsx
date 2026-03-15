import React from 'react';

interface SageProps {
  isSpeaking?: boolean;
  emotionalTheme?: string;
}

const Sage: React.FC<SageProps> = ({ isSpeaking = false, emotionalTheme = 'default' }) => {
  return (
    <div className="relative flex flex-col items-center">
      {/* Calm glow */}
      <div className={`absolute -inset-6 rounded-full blur-2xl opacity-20 bg-teal-400 ${isSpeaking ? 'animate-pulse' : ''}`} />

      {/* Sage body — minimal, calming design */}
      <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-slate-600 to-teal-700 flex items-center justify-center shadow-xl border-2 border-teal-400/20 ${isSpeaking ? 'ring-2 ring-teal-400/30 ring-offset-2 ring-offset-background' : 'hover:scale-105 transition-transform'}`}>
        {/* Inner calm circle */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-500/30 to-slate-700/50 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl md:text-3xl transition-opacity ${isSpeaking ? 'opacity-100' : 'opacity-80'}`}>
              🕊️
            </div>
          </div>
        </div>

        {/* Subtle orbiting light */}
        <div className="absolute top-0 right-2 w-2 h-2 rounded-full bg-teal-300/60 animate-float" />
      </div>

      {/* Name tag */}
      <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-slate-800/50 to-teal-900/50 border border-teal-500/20">
        <span className="text-xs font-serif font-medium text-teal-300">Sage</span>
      </div>
    </div>
  );
};

export default Sage;
