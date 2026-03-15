import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmilePlus, TrendingUp } from 'lucide-react';

interface MoodEntry {
  emoji: string;
  label: string;
  note: string;
  timestamp: string;
}

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
  { emoji: '😌', label: 'Calm', color: 'bg-teal-400' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-400' },
  { emoji: '😤', label: 'Angry', color: 'bg-red-400' },
  { emoji: '😰', label: 'Worried', color: 'bg-purple-400' },
  { emoji: '😴', label: 'Tired', color: 'bg-indigo-400' },
  { emoji: '🤩', label: 'Excited', color: 'bg-orange-400' },
  { emoji: '😐', label: 'Meh', color: 'bg-gray-400' },
];

const affirmations = [
  "You're doing amazing! 🌟",
  "Every feeling is valid! 💙",
  "You are loved and special! 💕",
  "It's okay to feel this way! 🌈",
  "Tomorrow is a new day! ☀️",
  "You're braver than you think! 🦁",
  "Your feelings matter! ✨",
  "You're a superstar! ⭐",
];

export const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('kiddoverse-mood-entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAffirmation, setShowAffirmation] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('kiddoverse-mood-entries', JSON.stringify(entries));
  }, [entries]);

  const saveMood = () => {
    if (!selectedMood) return;

    const entry: MoodEntry = {
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      note,
      timestamp: new Date().toISOString(),
    };

    setEntries(prev => [entry, ...prev].slice(0, 30)); // Keep last 30
    setShowAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
    setSelectedMood(null);
    setNote('');

    setTimeout(() => setShowAffirmation(null), 3000);
  };

  const todayEntries = entries.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.timestamp).toDateString() === today;
  });

  return (
    <Card className="border-border rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
          <SmilePlus className="h-5 w-5 text-pink-400" />
          How are you feeling? 💭
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {showAffirmation ? (
          <div className="text-center py-6 animate-bounce-gentle">
            <div className="text-4xl mb-2">💝</div>
            <p className="text-lg font-kiddo text-foreground">{showAffirmation}</p>
          </div>
        ) : (
          <>
            {/* Mood Selection */}
            <div className="grid grid-cols-4 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedMood?.label === mood.label
                      ? `${mood.color}/20 border-2 border-current scale-105`
                      : 'hover:bg-muted/30 border border-transparent'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-[10px] font-story text-muted-foreground">{mood.label}</span>
                </button>
              ))}
            </div>

            {selectedMood && (
              <>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Want to tell me more? (optional) 💬"
                  className="w-full h-16 p-3 rounded-xl bg-muted/30 border border-border/50 focus:border-pink-400 outline-none text-sm font-story resize-none"
                />
                <Button
                  onClick={saveMood}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-story"
                >
                  Save My Mood {selectedMood.emoji}
                </Button>
              </>
            )}

            {/* Today's moods */}
            {todayEntries.length > 0 && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground font-story mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Today's moods:
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {todayEntries.map((entry, i) => (
                    <span
                      key={i}
                      className="text-lg"
                      title={`${entry.label}${entry.note ? `: ${entry.note}` : ''} — ${new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    >
                      {entry.emoji}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
