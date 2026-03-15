import React from 'react';

interface MoodCheckInProps {
  onSelect: (level: number) => void;
  selected: number | null;
}

const moods = [
  { level: 1, emoji: '🌊', label: 'Stormy Sea', desc: 'Overwhelming, turbulent', color: 'from-slate-700 to-blue-900' },
  { level: 2, emoji: '🌫️', label: 'Foggy Forest', desc: 'Unclear, lost, disconnected', color: 'from-slate-600 to-slate-700' },
  { level: 3, emoji: '🌧️', label: 'Gentle Rain', desc: 'Sad but manageable', color: 'from-blue-700 to-slate-600' },
  { level: 4, emoji: '⛅', label: 'Partial Sun', desc: 'Some light breaking through', color: 'from-amber-700 to-slate-600' },
  { level: 5, emoji: '🌤️', label: 'Open Sky', desc: 'Calm, present, clear', color: 'from-sky-600 to-teal-600' },
];

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {moods.map(mood => (
        <button
          key={mood.level}
          onClick={() => onSelect(mood.level)}
          className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
            selected === mood.level
              ? `bg-gradient-to-b ${mood.color} ring-2 ring-teal-400/30 scale-105`
              : 'bg-slate-800/50 hover:bg-slate-800 hover:scale-105'
          }`}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span className="text-[10px] text-white/50 font-light leading-tight text-center">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};
