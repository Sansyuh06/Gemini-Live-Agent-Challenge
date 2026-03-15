import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Brain, TrendingUp } from 'lucide-react';
import { ReflectionJournal } from '@/components/Sanctuary/ReflectionJournal';

interface ReflectionEntry {
  reflection: string;
  mood?: number;
  date: string;
  panelCount: number;
}

const moodEmojis: Record<number, string> = { 1: '🌊', 2: '🌫️', 3: '🌧️', 4: '⛅', 5: '🌤️' };
const moodLabels: Record<number, string> = { 1: 'Stormy', 2: 'Foggy', 3: 'Rainy', 4: 'Partial Sun', 5: 'Clear' };

const ReflectionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    const saved = localStorage.getItem('storyweaver-reflections');
    return saved ? JSON.parse(saved) : [];
  });

  // Mood timeline data
  const moodData = entries.filter(e => e.mood).slice(0, 14).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-teal-500/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-serif text-sm">Back</span>
          </button>
          <h1 className="font-serif text-white/80 text-lg">Your Journey</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Mood Timeline */}
        {moodData.length > 0 && (
          <Card className="rounded-2xl border-teal-500/10 bg-slate-900/60">
            <CardContent className="p-6">
              <h3 className="text-sm font-serif text-white/60 flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                Emotional Weather
              </h3>
              <div className="flex items-end justify-between gap-1 h-20">
                {moodData.map((entry, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-sm">{entry.mood ? moodEmojis[entry.mood] : '—'}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400"
                      style={{ height: `${(entry.mood || 3) * 15}px` }}
                    />
                    <span className="text-[8px] text-white/20">
                      {new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="rounded-2xl border-teal-500/10 bg-slate-900/60">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-serif text-teal-300">{entries.length}</p>
              <p className="text-[10px] text-white/30 mt-1">Sessions</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-teal-500/10 bg-slate-900/60">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-serif text-teal-300">
                {entries.reduce((a, e) => a + e.panelCount, 0)}
              </p>
              <p className="text-[10px] text-white/30 mt-1">Story Panels</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-teal-500/10 bg-slate-900/60">
            <CardContent className="p-4 text-center">
              <p className="text-2xl">{entries[0]?.mood ? moodEmojis[entries[0].mood] : '—'}</p>
              <p className="text-[10px] text-white/30 mt-1">Latest Mood</p>
            </CardContent>
          </Card>
        </div>

        {/* Reflection Journal */}
        <ReflectionJournal entries={entries} />

        {/* Start new session */}
        <div className="text-center pt-4">
          <Button
            onClick={() => navigate('/sanctuary')}
            className="rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 text-white font-serif font-light px-8 py-6 text-lg"
          >
            Begin a new session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionDashboard;
