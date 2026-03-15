import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, CheckCircle, Music, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { rhymes } from '@/data/storiesData';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { useTTS, playSoundEffect } from '@/hooks/useTTS';

const RhymesPage: React.FC = () => {
    const [selectedRhyme, setSelectedRhyme] = useState<typeof rhymes[0] | null>(null);
    const { completeRhyme, isRhymeCompleted, points } = useGame();
    const { toast } = useToast();
    const { isLoading: ttsLoading, isPlaying: ttsPlaying, speak, stop } = useTTS('luna');

    const handleComplete = async (rhymeId: string, stars: number) => {
        await completeRhyme(rhymeId);
        playSoundEffect('chime');
        toast({
            title: "🌟 Rhyme Learned!",
            description: `Great job! You earned ${stars} stars!`,
        });
    };

    const categoryColors: Record<string, string> = {
        'nursery-rhyme': 'from-pink-400 to-rose-400',
        'action-rhyme': 'from-amber-400 to-yellow-400',
        'counting-rhyme': 'from-emerald-400 to-green-400',
    };

    const categoryLabels: Record<string, string> = {
        'nursery-rhyme': '🎵 Nursery Rhyme',
        'action-rhyme': '🤸 Action Rhyme',
        'counting-rhyme': '🔢 Counting Rhyme',
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-kiddo text-foreground mb-2">
                    Nursery Rhymes 🎵
                </h1>
                <p className="text-muted-foreground font-story text-lg">
                    Learn and enjoy classic nursery rhymes! Tap a rhyme to read it, then mark it as learned to earn ⭐ stars!
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rhymes.map((rhyme) => {
                    const completed = isRhymeCompleted(rhyme.id);
                    return (
                        <Card
                            key={rhyme.id}
                            className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl ${completed ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/40'
                                }`}
                            onClick={() => {
                                playSoundEffect('pop');
                                setSelectedRhyme(rhyme);
                            }}
                        >
                            <CardContent className="p-6 text-center">
                                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${categoryColors[rhyme.category]} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    <span className="text-3xl">{rhyme.emoji}</span>
                                </div>
                                <h3 className="font-kiddo text-base mb-1 group-hover:text-primary transition-colors">
                                    {rhyme.title}
                                </h3>
                                <p className="text-xs text-muted-foreground font-story mb-2">
                                    {categoryLabels[rhyme.category]}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                    <Badge variant="outline" className="text-xs font-story">
                                        Ages {rhyme.ageGroup}
                                    </Badge>
                                    {completed && (
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Rhyme Dialog */}
            <Dialog open={!!selectedRhyme} onOpenChange={() => { setSelectedRhyme(null); stop(); }}>
                {selectedRhyme && (
                    <DialogContent className="max-w-lg rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 font-kiddo text-xl">
                                <span className="text-3xl">{selectedRhyme.emoji}</span>
                                {selectedRhyme.title}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <div className="bg-muted/30 rounded-xl p-6 mb-4">
                                <pre className="whitespace-pre-wrap font-story text-base leading-relaxed text-foreground">
                                    {selectedRhyme.content}
                                </pre>
                            </div>

                            {/* Read Aloud Button */}
                            <div className="flex justify-center mb-4">
                                <Button
                                    variant="outline"
                                    className={`rounded-xl font-story gap-2 ${ttsPlaying ? 'border-primary text-primary bg-primary/10' : 'border-pink-500/30 text-pink-400 hover:bg-pink-500/10'}`}
                                    onClick={() => {
                                        if (ttsPlaying) {
                                            stop();
                                        } else {
                                            speak(selectedRhyme.content);
                                        }
                                    }}
                                    disabled={ttsLoading}
                                >
                                    {ttsLoading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
                                    ) : ttsPlaying ? (
                                        <><VolumeX className="h-4 w-4" /> Stop</>
                                    ) : (
                                        <><Volume2 className="h-4 w-4" /> 🔊 Read Aloud</>
                                    )}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-story">
                                    {categoryLabels[selectedRhyme.category]}
                                </Badge>
                                {isRhymeCompleted(selectedRhyme.id) ? (
                                    <Badge className="bg-primary/20 text-primary font-story">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Learned! ⭐
                                    </Badge>
                                ) : (
                                    <Button
                                        className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-story"
                                        onClick={() => {
                                            handleComplete(selectedRhyme.id, selectedRhyme.stars);
                                            setSelectedRhyme(null);
                                        }}
                                    >
                                        <Star className="h-4 w-4 mr-1" />
                                        I Learned It! (+{selectedRhyme.stars} ⭐)
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </DashboardLayout>
    );
};

export default RhymesPage;
