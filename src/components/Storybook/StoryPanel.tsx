import React from 'react';
import { Loader2, Star, HelpCircle } from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import type { WonderTurn } from '@/hooks/useLuna';

interface StoryPanelProps {
  turn: WonderTurn;
  index: number;
  onAnswer?: (correct: boolean) => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ turn, index, onAnswer }) => {
  const [showHint, setShowHint] = React.useState(false);

  return (
    <GlassmorphicCard variant="light" className="overflow-hidden p-0 border-amber-200/50 dark:border-amber-500/30 shadow-xl shadow-amber-500/10">
      {/* Illustration panel */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[450px] overflow-hidden bg-amber-50 dark:bg-slate-800">
          {turn.imageUrl ? (
            <img
              src={turn.imageUrl}
              alt={`Story panel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-amber-400/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Painting the scene... 🎨</p>
              </div>
            </div>
          )}

          {/* Panel number */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs rounded-full bg-white/80 dark:bg-slate-900/70 text-amber-600 dark:text-amber-300 font-kiddo shadow-sm">
              Page {index + 1}
            </span>
          </div>
        </div>

        {/* Story text */}
        <div className="p-8 sm:p-10 space-y-8 bg-white/40 dark:bg-slate-900/40">
          {/* Narration */}
          <p className="text-foreground font-story text-xl leading-relaxed text-slate-800 dark:text-slate-200">
            {turn.narration}
          </p>

          {/* Luna's dialogue */}
          {turn.lunaDialogue && (
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-500/30 shadow-inner">
              <span className="text-3xl shrink-0 animate-pulse">✨</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-kiddo mb-2">Luna says</p>
                <p className="text-slate-800 dark:text-slate-200 font-story text-base leading-relaxed">
                  {turn.lunaDialogue}
                </p>
              </div>
            </div>
          )}

          {/* Educational Moment */}
          {turn.educationalMoment && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/10 border border-violet-200/50 dark:border-violet-500/30 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-violet-500 animate-spin-slow" />
                <span className="text-sm font-kiddo text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  {turn.educationalMoment.type} Challenge!
                </span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 font-story text-base mb-4 leading-relaxed">
                {turn.educationalMoment.question}
              </p>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors font-kiddo bg-violet-100 dark:bg-violet-900/40 px-3 py-1.5 rounded-full"
              >
                <HelpCircle className="h-4 w-4" />
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </button>
              {showHint && (
                <div className="mt-4 p-4 rounded-xl bg-violet-100/50 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-500/20">
                  <p className="text-sm text-violet-700 dark:text-violet-300 font-story italic leading-relaxed">
                    💡 {turn.educationalMoment.hint}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
    </GlassmorphicCard>
  );
};
