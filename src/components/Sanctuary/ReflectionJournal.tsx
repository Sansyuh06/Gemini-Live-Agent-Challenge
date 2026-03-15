import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calendar, Brain } from 'lucide-react';

interface ReflectionEntry {
  reflection: string;
  mood?: number;
  date: string;
  panelCount: number;
}

interface ReflectionJournalProps {
  entries: ReflectionEntry[];
}

const moodEmojis: Record<number, string> = { 1: '🌊', 2: '🌫️', 3: '🌧️', 4: '⛅', 5: '🌤️' };

export const ReflectionJournal: React.FC<ReflectionJournalProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <Card className="rounded-2xl border-teal-500/10 bg-slate-900/60">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-8 w-8 text-teal-400/30 mx-auto mb-3" />
          <p className="text-white/40 font-serif">Your reflection journal is empty.</p>
          <p className="text-white/20 text-sm mt-1">Complete a Sanctuary session to begin.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-white/80 flex items-center gap-2">
        <Brain className="h-5 w-5 text-teal-400" />
        Reflection Journal
      </h3>
      {entries.map((entry, i) => (
        <Card key={i} className="rounded-2xl border-teal-500/10 bg-slate-900/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{entry.mood ? moodEmojis[entry.mood] : '📝'}</span>
              <div>
                <p className="text-xs text-teal-400/50 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="text-[10px] text-white/20">{entry.panelCount} story panels</p>
              </div>
            </div>
            <p className="text-white/70 font-serif text-sm leading-relaxed italic">
              "{entry.reflection}"
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
