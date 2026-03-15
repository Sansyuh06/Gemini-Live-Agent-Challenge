import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, CheckCircle, Music, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { songs } from '@/data/storiesData';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';
import { useTTS, playSoundEffect } from '@/hooks/useTTS';

const SingAlongPage: React.FC = () => {
    const [selectedSong, setSelectedSong] = useState<typeof songs[0] | null>(null);
    const [highlightLine, setHighlightLine] = useState(0);
    const { completeSong, isSongCompleted } = useGame();
    const { toast } = useToast();
    const { isLoading: ttsLoading, isPlaying: ttsPlaying, speak, stop: stopTTS } = useTTS('luna');

    const categoryColors: Record<string, string> = {
        'classic': 'from-amber-400 to-yellow-400',
        'educational': 'from-sky-400 to-blue-400',
        'action-song': 'from-pink-400 to-rose-400',
    };

    const categoryLabels: Record<string, string> = {
        'classic': '🎵 Classic',
        'educational': '🎓 Educational',
        'action-song': '🤸 Action Song',
    };

    const handleComplete = async (songId: string, stars: number) => {
        await completeSong(songId);
        playSoundEffect('chime');
        toast({
            title: "🎤 Song Complete!",
            description: `Wonderful singing! You earned ${stars} stars!`,
        });
    };

    const openSong = (song: typeof songs[0]) => {
        setSelectedSong(song);
        setHighlightLine(0);
        // Start bouncing ball animation
        const nonEmptyLines = song.lyrics.filter(l => l.trim() !== '');
        let lineIndex = 0;
        const interval = setInterval(() => {
            lineIndex = (lineIndex + 1) % nonEmptyLines.length;
            // Find the actual index in the full lyrics array
            let count = -1;
            for (let i = 0; i < song.lyrics.length; i++) {
                if (song.lyrics[i].trim() !== '') count++;
                if (count === lineIndex) {
                    setHighlightLine(i);
                    break;
                }
            }
        }, 2000);
        // Store interval for cleanup
        (window as any).__singAlongInterval = interval;
    };

    const closeSong = () => {
        setSelectedSong(null);
        stopTTS();
        if ((window as any).__singAlongInterval) {
            clearInterval((window as any).__singAlongInterval);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-kiddo text-foreground mb-2">
                    Sing-Along 🎤
                </h1>
                <p className="text-muted-foreground font-story text-lg">
                    Pick a song and sing along! Watch the lyrics light up as you go! 🎶
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => {
                    const completed = isSongCompleted(song.id);
                    return (
                        <Card
                            key={song.id}
                            className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-2xl ${completed ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/40'
                                }`}
                            onClick={() => { playSoundEffect('pop'); openSong(song); }}
                        >
                            <CardContent className="p-6 text-center">
                                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${categoryColors[song.category]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                                    <span className="text-4xl">{song.emoji}</span>
                                </div>
                                <h3 className="font-kiddo text-lg mb-1 group-hover:text-primary transition-colors">
                                    {song.title}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-xs font-story">
                                        {categoryLabels[song.category]}
                                    </Badge>
                                    {completed && <CheckCircle className="h-4 w-4 text-primary" />}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Song Dialog */}
            <Dialog open={!!selectedSong} onOpenChange={closeSong}>
                {selectedSong && (
                    <DialogContent className="max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 font-kiddo text-xl">
                                <span className="text-3xl">{selectedSong.emoji}</span>
                                {selectedSong.title}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <div className="bg-muted/30 rounded-xl p-6 mb-6">
                                {selectedSong.lyrics.map((line, i) => (
                                    <p
                                        key={i}
                                        className={`font-story text-base leading-relaxed transition-all duration-500 ${line.trim() === '' ? 'h-4' :
                                                i === highlightLine
                                                    ? 'text-primary font-bold scale-105 origin-left'
                                                    : 'text-foreground/70'
                                            }`}
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>

                            {/* Sing with Luna Button */}
                            <div className="flex justify-center mb-4">
                                <Button
                                    variant="outline"
                                    className={`rounded-xl font-story gap-2 ${ttsPlaying ? 'border-primary text-primary bg-primary/10' : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'}`}
                                    onClick={() => {
                                        if (ttsPlaying) {
                                            stopTTS();
                                        } else {
                                            const fullLyrics = selectedSong.lyrics.filter(l => l.trim()).join('\n');
                                            speak(fullLyrics);
                                        }
                                    }}
                                    disabled={ttsLoading}
                                >
                                    {ttsLoading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
                                    ) : ttsPlaying ? (
                                        <><VolumeX className="h-4 w-4" /> Stop</>
                                    ) : (
                                        <><Volume2 className="h-4 w-4" /> 🎤 Sing with Luna</>
                                    )}
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-story">
                                    {categoryLabels[selectedSong.category]}
                                </Badge>
                                {isSongCompleted(selectedSong.id) ? (
                                    <Badge className="bg-primary/20 text-primary font-story">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Done! ⭐
                                    </Badge>
                                ) : (
                                    <Button
                                        className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-story"
                                        onClick={() => {
                                            handleComplete(selectedSong.id, selectedSong.stars);
                                            closeSong();
                                        }}
                                    >
                                        <Star className="h-4 w-4 mr-1" />
                                        I Sang It! (+{selectedSong.stars} ⭐)
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

export default SingAlongPage;
