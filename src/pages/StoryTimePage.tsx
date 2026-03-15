import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, CheckCircle, BookOpen, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { stories } from '@/data/storiesData';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { useTTS, playSoundEffect } from '@/hooks/useTTS';

const StoryTimePage: React.FC = () => {
    const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const { completeStory, isStoryCompleted } = useGame();
    const { toast } = useToast();
    const { isLoading: ttsLoading, isPlaying: ttsPlaying, speak, stop } = useTTS('luna');

    const categoryColors: Record<string, string> = {
        'fairy-tale': 'from-purple-400 to-violet-400',
        'fable': 'from-emerald-400 to-green-400',
        'adventure': 'from-sky-400 to-blue-400',
        'bedtime': 'from-indigo-400 to-blue-400',
    };

    const categoryLabels: Record<string, string> = {
        'fairy-tale': '🏰 Fairy Tale',
        'fable': '🦊 Fable',
        'adventure': '⚔️ Adventure',
        'bedtime': '🌙 Bedtime Story',
    };

    const handleComplete = async (storyId: string, stars: number) => {
        await completeStory(storyId);
        toast({
            title: "📖 Story Complete!",
            description: `Amazing! You earned ${stars} stars by finishing the story!`,
        });
    };

    const openStory = (story: typeof stories[0]) => {
        setSelectedStory(story);
        setCurrentPage(0);
    };

    if (selectedStory) {
        const totalPages = selectedStory.pages.length;
        const isLastPage = currentPage === totalPages - 1;
        const completed = isStoryCompleted(selectedStory.id);

        return (
            <DashboardLayout>
                <div className="relative">
                    <ParticleBackground theme="wonder" particleCount={30} className="fixed inset-0 pointer-events-none opacity-20" />
                    {/* Story Reader */}
                    <div className="max-w-3xl mx-auto relative z-10">
                        <Button
                            variant="ghost"
                            className="mb-6 font-kiddo text-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
                            onClick={() => setSelectedStory(null)}
                        >
                            <ChevronLeft className="h-5 w-5 mr-1" /> Back to Stories
                        </Button>

                        <GlassmorphicCard variant="light" className="rounded-3xl overflow-hidden border-sky-500/20 shadow-xl shadow-sky-900/5 p-0">
                            <div className={`bg-gradient-to-r ${categoryColors[selectedStory.category]} p-8 text-white text-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                                <motion.span 
                                    initial={{ scale: 0.5, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="text-6xl md:text-7xl block mb-4 drop-shadow-md relative z-10"
                                >
                                    {selectedStory.emoji}
                                </motion.span>
                                <h2 className="text-3xl md:text-4xl font-kiddo relative z-10">{selectedStory.title}</h2>
                                <p className="text-base opacity-90 font-story mt-2 relative z-10 tracking-wide">
                                    {categoryLabels[selectedStory.category]} • Ages {selectedStory.ageGroup}
                                </p>
                            </div>

                            <div className="p-8 md:p-12">
                                {/* Page content */}
                                <div className="min-h-[250px] flex items-center justify-center relative">
                                    <AnimatePresence mode="wait">
                                        <motion.p 
                                            key={currentPage}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="text-xl md:text-2xl font-story leading-relaxed text-slate-800 dark:text-slate-200 text-center"
                                        >
                                            {selectedStory.pages[currentPage]}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>

                                {/* Listen Button */}
                                <div className="flex justify-center my-4">
                                    <Button
                                        variant="outline"
                                        className={`rounded-xl font-story gap-2 ${ttsPlaying ? 'border-primary text-primary bg-primary/10' : ''}`}
                                        onClick={() => {
                                            if (ttsPlaying) {
                                                stop();
                                            } else {
                                                speak(selectedStory.pages[currentPage]);
                                            }
                                        }}
                                        disabled={ttsLoading}
                                    >
                                        {ttsLoading ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
                                        ) : ttsPlaying ? (
                                            <><VolumeX className="h-4 w-4" /> Stop</>
                                        ) : (
                                            <><Volume2 className="h-4 w-4" /> 🔊 Listen to Luna</>
                                        )}
                                    </Button>
                                </div>

                                {/* Page indicator */}
                            <div className="flex items-center justify-center gap-2 my-6">
                                {selectedStory.pages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`h-2 rounded-full transition-all ${i === currentPage ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    className="rounded-xl font-story"
                                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                </Button>

                                <span className="text-sm text-muted-foreground font-story">
                                    Page {currentPage + 1} of {totalPages}
                                </span>

                                {isLastPage ? (
                                    completed ? (
                                        <Badge className="bg-primary/20 text-primary font-story px-4 py-2">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Done! ⭐
                                        </Badge>
                                    ) : (
                                        <Button
                                            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-story"
                                            onClick={() => handleComplete(selectedStory.id, selectedStory.stars)}
                                        >
                                            <Star className="h-4 w-4 mr-1" /> Finish! (+{selectedStory.stars} ⭐)
                                        </Button>
                                    )
                                ) : (
                                    <Button
                                        className="rounded-xl font-story"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                            </div>

                            {/* Moral */}
                            {isLastPage && selectedStory.moral && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-center"
                                >
                                    <p className="text-base font-story text-slate-700 dark:text-slate-300">
                                        <span className="font-kiddo text-amber-500 text-lg uppercase tracking-wider block mb-2">✨ The Lesson</span> 
                                        {selectedStory.moral}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </GlassmorphicCard>
                </div>
            </div>
        </DashboardLayout>
    );
    }

    return (
        <DashboardLayout>
            <div className="relative">
                <ParticleBackground theme="wonder" particleCount={40} className="fixed inset-0 pointer-events-none opacity-20" />
                
                <div className="relative z-10 max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-500/20 shadow-sm mb-6">
                            <BookOpen className="h-4 w-4 text-sky-500" />
                            <span className="text-sm font-kiddo tracking-wide text-sky-700 dark:text-sky-300">Library</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-kiddo mb-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                            Story Time 📖
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-story max-w-2xl mx-auto">
                            Pick a story and read along page by page! Finish a story to earn ⭐ stars!
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story, index) => {
                            const completed = isStoryCompleted(story.id);
                            return (
                                <ScrollReveal key={story.id} delay={index * 0.1} direction="up">
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <GlassmorphicCard
                                            variant={completed ? "glow" : "light"}
                                            className={`cursor-pointer overflow-hidden p-0 h-full border-sky-500/20 shadow-lg ${completed ? 'shadow-amber-500/10 border-amber-500/30' : 'shadow-sky-900/5'}`}
                                            onClick={() => openStory(story)}
                                        >
                                            <div className={`bg-gradient-to-br ${categoryColors[story.category]} p-6 text-center relative overflow-hidden group`}>
                                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-6xl block drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{story.emoji}</span>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-kiddo text-xl mb-2 text-slate-800 dark:text-slate-100 transition-colors">
                                                    {story.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-story mb-4 uppercase tracking-wider">
                                                    {categoryLabels[story.category]}
                                                </p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex gap-2">
                                                        <Badge variant="secondary" className="text-xs font-kiddo bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-none">
                                                            Ages {story.ageGroup}
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs font-kiddo bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-none">
                                                            {story.pages.length} pages
                                                        </Badge>
                                                    </div>
                                                    {completed && <CheckCircle className="h-5 w-5 text-amber-500 drop-shadow-sm" />}
                                                </div>
                                                {story.moral && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-story italic leading-relaxed pt-3 border-t border-slate-200 dark:border-slate-800">
                                                        ✨ {story.moral}
                                                    </p>
                                                )}
                                            </div>
                                        </GlassmorphicCard>
                                    </motion.div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StoryTimePage;
