import React, { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Music, Gamepad2, Star } from "lucide-react";
import { useGame } from "@/context/GameContext";

const SKILL_SUBJECTS = [
  "Listening",
  "Reading",
  "Vocabulary",
  "Creativity",
  "Memory",
  "Expression",
] as const;

// How each activity type maps to the 6 skills
const activitySkillMap: Record<string, number[]> = {
  rhyme: [30, 10, 15, 10, 25, 20],
  story: [15, 30, 25, 20, 10, 15],
  song: [25, 5, 10, 15, 30, 30],
  word: [5, 20, 35, 10, 20, 5],
};

interface TrackConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  emoji: string;
  weights: number[];
}

const tracks: TrackConfig[] = [
  {
    id: "all-rounder",
    label: "All-Rounder",
    icon: Star,
    emoji: "🌟",
    weights: [1, 1, 1, 1, 1, 1],
  },
  {
    id: "story-lover",
    label: "Story Lover",
    icon: BookOpen,
    emoji: "📖",
    weights: [0.8, 1.5, 1.3, 1.2, 0.7, 0.9],
  },
  {
    id: "music-star",
    label: "Music Star",
    icon: Music,
    emoji: "🎵",
    weights: [1.3, 0.6, 0.7, 1, 1.4, 1.5],
  },
  {
    id: "word-wizard",
    label: "Word Wizard",
    icon: Gamepad2,
    emoji: "🧙",
    weights: [0.6, 1.3, 1.5, 0.9, 1.2, 0.7],
  },
];

const MAX_RAW = 150;

export const SkillMatrix: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState(tracks[0].id);
  const { rhymesLearned, storiesRead, songsCompleted, wordsCompleted } = useGame();

  const rawSkills = useMemo(() => {
    const scores = new Array(6).fill(0);

    const entries: [string, number][] = [
      ["rhyme", rhymesLearned],
      ["story", storiesRead],
      ["song", songsCompleted],
      ["word", wordsCompleted],
    ];

    entries.forEach(([type, count]) => {
      const mapping = activitySkillMap[type];
      if (!mapping) return;
      mapping.forEach((w, i) => {
        scores[i] += w * count;
      });
    });

    return scores;
  }, [rhymesLearned, storiesRead, songsCompleted, wordsCompleted]);

  const track = tracks.find((t) => t.id === activeTrack)!;

  const chartData = useMemo(() => {
    return SKILL_SUBJECTS.map((subject, i) => {
      const weighted = rawSkills[i] * track.weights[i];
      const score = Math.min(100, Math.round((weighted / MAX_RAW) * 100));
      return { subject, score, fullMark: 100 };
    });
  }, [rawSkills, track]);

  const hasAnyProgress = rawSkills.some((s) => s > 0);

  return (
    <Card className="border-border rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
            <Sparkles className="h-5 w-5 text-primary" />
            Skill Matrix
          </CardTitle>
          {!hasAnyProgress && (
            <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground font-story">
              Complete activities to fill your matrix! ✨
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Track sidebar */}
          <div className="flex md:flex-col gap-2 md:w-48 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isActive = t.id === activeTrack;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTrack(t.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium font-story transition-all whitespace-nowrap
                    ${isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent"
                    }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Radar chart */}
          <div className="flex-1 min-h-[320px]">
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={chartData}
              >
                <PolarGrid
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.4}
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground text-[11px] font-medium"
                      style={{ fontFamily: "'Baloo 2', cursive" }}
                    >
                      {payload.value}
                    </text>
                  )}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  key={activeTrack}
                  name="Skills"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {chartData.map((s) => (
            <Badge
              key={s.subject}
              variant="outline"
              className="text-xs border-primary/30 font-story"
            >
              {s.subject}: {s.score}%
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
