import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { wordGameWords } from '@/data/storiesData';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/hooks/use-toast';

const WordGamePage: React.FC = () => {
    const { completeWord, isWordCompleted, wordsCompleted } = useGame();
    const { toast } = useToast();

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [guess, setGuess] = useState<string[]>([]);
    const [scrambled, setScrambled] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const currentWord = wordGameWords[currentWordIndex];

    const scrambleWord = useCallback((word: string) => {
        const letters = word.split('');
        // Fisher-Yates shuffle
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        // Make sure it's actually scrambled
        if (letters.join('') === word && word.length > 1) {
            [letters[0], letters[1]] = [letters[1], letters[0]];
        }
        return letters;
    }, []);

    const resetWord = useCallback(() => {
        setGuess([]);
        setScrambled(scrambleWord(currentWord.word));
        setIsCorrect(false);
        setShowHint(false);
    }, [currentWord, scrambleWord]);

    useEffect(() => {
        resetWord();
    }, [currentWordIndex, resetWord]);

    const handleLetterClick = (letter: string, index: number) => {
        if (isCorrect) return;

        const newGuess = [...guess, letter];
        const newScrambled = [...scrambled];
        newScrambled.splice(index, 1);

        setGuess(newGuess);
        setScrambled(newScrambled);

        // Check if word is complete
        if (newGuess.length === currentWord.word.length) {
            const guessedWord = newGuess.join('');
            if (guessedWord === currentWord.word) {
                setIsCorrect(true);
                if (!isWordCompleted(currentWord.word)) {
                    completeWord(currentWord.word);
                    toast({
                        title: "🎉 Correct!",
                        description: `You spelled "${currentWord.word}"! +5 ⭐`,
                    });
                }
            } else {
                // Wrong answer — shake and reset after a moment
                toast({
                    title: "Oops! 😅",
                    description: "Not quite right. Try again!",
                    variant: "destructive",
                });
                setTimeout(() => {
                    resetWord();
                }, 800);
            }
        }
    };

    const handleGuessLetterClick = (index: number) => {
        if (isCorrect) return;
        const letter = guess[index];
        const newGuess = [...guess];
        newGuess.splice(index, 1);
        setGuess(newGuess);
        setScrambled([...scrambled, letter]);
    };

    const nextWord = () => {
        setCurrentWordIndex((prev) => (prev + 1) % wordGameWords.length);
    };

    const prevWord = () => {
        setCurrentWordIndex((prev) => (prev - 1 + wordGameWords.length) % wordGameWords.length);
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-kiddo text-foreground mb-2">
                    Word Games 🎮
                </h1>
                <p className="text-muted-foreground font-story text-lg">
                    Unscramble the letters to spell the word! Tap the letters in the right order! 🧩
                </p>
                <div className="flex items-center gap-3 mt-3">
                    <Badge variant="outline" className="font-story">
                        Word {currentWordIndex + 1} / {wordGameWords.length}
                    </Badge>
                    <Badge variant="outline" className="font-story text-yellow-500 border-yellow-500/30">
                        {wordsCompleted} completed ⭐
                    </Badge>
                </div>
            </div>

            <div className="max-w-lg mx-auto">
                <Card className="rounded-2xl overflow-hidden">
                    {/* Emoji Display */}
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-8 text-center">
                        <span className="text-7xl block mb-2 animate-bounce-gentle">{currentWord.emoji}</span>
                        {showHint && (
                            <p className="text-white/90 font-story text-sm animate-fade-in">
                                💡 Hint: {currentWord.hint}
                            </p>
                        )}
                    </div>

                    <CardContent className="p-8">
                        {/* Guest slots */}
                        <div className="flex justify-center gap-2 mb-8">
                            {currentWord.word.split('').map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => i < guess.length && handleGuessLetterClick(i)}
                                    className={`h-14 w-14 rounded-xl border-2 flex items-center justify-center text-xl font-kiddo transition-all ${i < guess.length
                                            ? isCorrect
                                                ? 'border-green-400 bg-green-400/10 text-green-600 scale-110'
                                                : 'border-primary bg-primary/10 text-primary cursor-pointer hover:scale-105'
                                            : 'border-border bg-muted/30'
                                        }`}
                                >
                                    {i < guess.length ? guess[i] : ''}
                                </button>
                            ))}
                        </div>

                        {/* Scrambled letters */}
                        {!isCorrect && (
                            <div className="flex justify-center gap-2 mb-6 flex-wrap">
                                {scrambled.map((letter, i) => (
                                    <button
                                        key={`${letter}-${i}`}
                                        onClick={() => handleLetterClick(letter, i)}
                                        className="h-14 w-14 rounded-xl border-2 border-border bg-card hover:border-primary hover:bg-primary/10 flex items-center justify-center text-xl font-kiddo transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm"
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Success message */}
                        {isCorrect && (
                            <div className="text-center mb-6 animate-bounce-in">
                                <p className="text-2xl font-kiddo text-primary mb-2">
                                    🎉 Correct!
                                </p>
                                <p className="text-muted-foreground font-story">
                                    You spelled <span className="font-bold text-foreground">{currentWord.word}</span>!
                                </p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl font-story" onClick={resetWord}>
                                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                                </Button>
                                {!showHint && !isCorrect && (
                                    <Button variant="outline" size="sm" className="rounded-xl font-story" onClick={() => setShowHint(true)}>
                                        💡 Hint
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl font-story" onClick={prevWord}>
                                    ← Prev
                                </Button>
                                <Button size="sm" className="rounded-xl font-story bg-gradient-to-r from-pink-500 to-purple-500 text-white" onClick={nextWord}>
                                    Next →
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Word Grid Below */}
                <div className="mt-8">
                    <h3 className="font-kiddo text-lg mb-4">All Words</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {wordGameWords.map((word, i) => {
                            const done = isWordCompleted(word.word);
                            return (
                                <button
                                    key={word.word}
                                    onClick={() => setCurrentWordIndex(i)}
                                    className={`p-2 rounded-xl text-center transition-all ${i === currentWordIndex
                                            ? 'bg-primary/20 border-2 border-primary'
                                            : done
                                                ? 'bg-green-400/10 border border-green-400/30'
                                                : 'bg-muted/30 border border-border hover:border-primary/40'
                                        }`}
                                >
                                    <span className="text-lg">{word.emoji}</span>
                                    {done && <CheckCircle className="h-3 w-3 text-green-500 mx-auto mt-0.5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WordGamePage;
