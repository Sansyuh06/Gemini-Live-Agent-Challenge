import React, { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Music, Shapes, Sparkles, RotateCcw, Play, Square } from 'lucide-react';

// ==================== COLOR MIXING CANVAS ====================
const ColorMixer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);

  const colors = [
    '#FF6B9D', '#FF8A5C', '#FFD93D', '#6BCB77',
    '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FF69B4', '#87CEEB', '#F0E68C',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalAlpha = 0.3;
    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Card className="border-border rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
          <Palette className="h-5 w-5 text-pink-400" />
          Color Splash 🎨
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-xl cursor-crosshair border border-border/30"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          onMouseMove={draw}
        />
        <div className="flex flex-wrap gap-2 items-center">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === color ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
          <Button variant="outline" size="sm" onClick={clear} className="ml-auto rounded-lg text-xs font-story">
            <RotateCcw className="h-3 w-3 mr-1" /> Clear
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-story">Brush:</span>
          <input
            type="range"
            min="5"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 accent-pink-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== PATTERN MATCH GAME ====================
const PatternMatch: React.FC = () => {
  const shapes = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'];
  const [pattern, setPattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showingPattern, setShowingPattern] = useState(false);
  const [level, setLevel] = useState(3);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generatePattern = () => {
    const newPattern: string[] = [];
    for (let i = 0; i < level; i++) {
      newPattern.push(shapes[Math.floor(Math.random() * shapes.length)]);
    }
    setPattern(newPattern);
    setUserPattern([]);
    setFeedback(null);
    setShowingPattern(true);
    setTimeout(() => setShowingPattern(false), level * 800);
  };

  const handleShapeClick = (shape: string) => {
    if (showingPattern) return;
    const newUserPattern = [...userPattern, shape];
    setUserPattern(newUserPattern);

    if (newUserPattern.length === pattern.length) {
      const correct = newUserPattern.every((s, i) => s === pattern[i]);
      if (correct) {
        setScore(score + level * 10);
        setFeedback('✅ Amazing! You matched it!');
        setLevel(l => Math.min(l + 1, 8));
      } else {
        setFeedback('❌ Not quite! Try again!');
      }
    }
  };

  return (
    <Card className="border-border rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
          <Shapes className="h-5 w-5 text-amber-400" />
          Pattern Match 🧩
          <Badge variant="outline" className="ml-auto border-amber-500/30 text-amber-400 font-story">
            Score: {score}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-story mb-2">
            Level {level - 2} — Remember {level} shapes!
          </p>
          {pattern.length === 0 ? (
            <Button onClick={generatePattern} className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-story">
              <Play className="h-4 w-4 mr-1" /> Start Round
            </Button>
          ) : showingPattern ? (
            <div className="flex justify-center gap-3 py-4">
              {pattern.map((shape, i) => (
                <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                  {shape}
                </span>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2 py-2 min-h-[48px]">
                {userPattern.map((shape, i) => (
                  <span key={i} className="text-3xl">{shape}</span>
                ))}
                {Array(pattern.length - userPattern.length).fill(null).map((_, i) => (
                  <span key={`empty-${i}`} className="w-8 h-8 rounded-full border border-dashed border-border/50" />
                ))}
              </div>
              <div className="flex justify-center gap-3 py-2 flex-wrap">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleShapeClick(shape)}
                    className="text-3xl hover:scale-125 transition-transform active:scale-95 p-1"
                    disabled={userPattern.length >= pattern.length}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </>
          )}
          {feedback && (
            <div className="mt-3">
              <p className="font-kiddo text-foreground">{feedback}</p>
              <Button onClick={generatePattern} variant="outline" className="mt-2 rounded-xl font-story">
                Next Round
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== SIMPLE MUSIC MAKER ====================
const MusicMaker: React.FC = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const instruments = [
    { name: 'Do', freq: 261.63, color: 'bg-red-400', key: '🎹' },
    { name: 'Re', freq: 293.66, color: 'bg-orange-400', key: '🎹' },
    { name: 'Mi', freq: 329.63, color: 'bg-yellow-400', key: '🎹' },
    { name: 'Fa', freq: 349.23, color: 'bg-green-400', key: '🎹' },
    { name: 'Sol', freq: 392.00, color: 'bg-teal-400', key: '🎹' },
    { name: 'La', freq: 440.00, color: 'bg-blue-400', key: '🎹' },
    { name: 'Si', freq: 493.88, color: 'bg-indigo-400', key: '🎹' },
    { name: 'Do!', freq: 523.25, color: 'bg-violet-400', key: '🎹' },
  ];

  const playNote = (freq: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  };

  return (
    <Card className="border-border rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
          <Music className="h-5 w-5 text-indigo-400" />
          Music Maker 🎵
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground font-story mb-3 text-center">
          Tap the keys to make music! 🎶
        </p>
        <div className="flex gap-1.5 justify-center">
          {instruments.map((inst) => (
            <button
              key={inst.name}
              onClick={() => playNote(inst.freq)}
              className={`${inst.color} hover:brightness-110 active:scale-95 w-10 h-24 md:w-12 md:h-28 rounded-b-xl text-white text-xs font-kiddo flex flex-col items-center justify-end pb-2 transition-all shadow-md hover:shadow-lg`}
            >
              {inst.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ==================== MAIN SENSORY PLAY PAGE ====================
const SensoryPlay: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-amber-500/20 border border-pink-500/30 mb-4">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-300">Interactive Play</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-kiddo font-bold mb-4 bg-gradient-to-r from-pink-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
              🎨 Sensory Play
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-story">
              Explore colors, sounds, and patterns! Let your creativity flow in a calm, fun way. 🌈
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <ColorMixer />
            <PatternMatch />
            <MusicMaker />
            
            {/* Relaxing Patterns */}
            <Card className="border-border rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  Calming Patterns ✨
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-6 gap-1.5 p-4">
                  {Array(36).fill(null).map((_, i) => {
                    const hue = (i * 10) % 360;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-lg transition-all duration-700 hover:scale-110 hover:rounded-full cursor-pointer"
                        style={{
                          backgroundColor: `hsl(${hue}, 70%, 60%)`,
                          animationDelay: `${i * 100}ms`,
                          opacity: 0.6,
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.opacity = '1';
                          (e.target as HTMLElement).style.transform = 'scale(1.2) rotate(45deg)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.opacity = '0.6';
                          (e.target as HTMLElement).style.transform = '';
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-center text-muted-foreground font-story mt-2">
                  Hover over the colors to make them dance! 🌈
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensoryPlay;
