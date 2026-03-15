import React from 'react';
import { motion } from 'framer-motion';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Loader2 } from 'lucide-react';
import type { SanctuaryTurn } from '@/hooks/useSage';

interface SanctuaryPanelProps {
  turn: SanctuaryTurn;
  index: number;
}

const stageLabels: Record<string, string> = {
  naming: '🏷️ Naming',
  mapping: '🗺️ Mapping',
  separating: '🔗 Separating',
  're-authoring': '✍️ Re-authoring',
  witnessing: '👁️ Witnessing',
};

export const SanctuaryPanel: React.FC<SanctuaryPanelProps> = ({ turn, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.1, 0.3) }}
    >
      <GlassmorphicCard variant="dark" className="overflow-hidden p-0 border-teal-500/20 shadow-2xl shadow-teal-900/20">
        {/* Image panel */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[450px] overflow-hidden bg-slate-900">
          {turn.imageUrl ? (
            <img
              src={turn.imageUrl}
              alt={`Story panel ${index + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-teal-400/50 mx-auto mb-2" />
                <p className="text-xs text-white/20">Illustration generating...</p>
              </div>
            </div>
          )}

          {/* Stage badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-[10px] rounded-full bg-slate-900/70 text-teal-300/80 backdrop-blur-sm">
              {stageLabels[turn.narrativeStage] || turn.narrativeStage}
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="p-8 sm:p-10 space-y-6">
          {/* Sage's dialogue */}
          <div>
            <p className="text-xs uppercase tracking-widest text-teal-500/60 mb-2 font-display">Sage</p>
            <p className="text-white/90 font-serif-elegant leading-loose italic text-lg sm:text-xl">
              "{turn.sageDialogue}"
            </p>
          </div>

          {/* Story narration */}
          {turn.narration && (
            <div className="pt-5 border-t border-teal-500/10">
              <p className="text-white/70 font-story leading-relaxed text-base">
                {turn.narration}
              </p>
            </div>
          )}

          {/* Reflection note */}
          {turn.reflectionNote && (
            <div className="pt-5 border-t border-teal-500/10 bg-teal-900/10 -mx-8 -sm:-mx-10 -mb-8 sm:-mb-10 p-8 sm:p-10 rounded-b-3xl">
              <p className="text-xs uppercase tracking-widest text-teal-400/50 mb-3 font-display">💭 Sage reflects</p>
              <p className="text-teal-300/80 text-base font-story italic leading-relaxed">
                {turn.reflectionNote}
              </p>
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};
