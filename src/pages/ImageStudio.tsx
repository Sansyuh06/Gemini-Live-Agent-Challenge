import React, { useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Download, Loader2, Image as ImageIcon, Palette, AlertCircle } from 'lucide-react';
import {
  generateImage,
  checkFooocusHealth,
  PROMPT_SUGGESTIONS,
  STYLE_OPTIONS,
  ASPECT_RATIOS,
  type FooocusStatus,
} from '@/services/fooocusApi';
import { useToast } from '@/hooks/use-toast';

const ImageStudio: React.FC = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].value);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0].value);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [serverStatus, setServerStatus] = useState<FooocusStatus | null>(null);
  const [progress, setProgress] = useState(0);

  const checkServer = useCallback(async () => {
    const status = await checkFooocusHealth();
    setServerStatus(status);
    if (!status.online) {
      toast({
        title: 'Fooocus Server Offline 😴',
        description: 'Start your local Fooocus server to generate images! Run launch.py in the Fooocus folder.',
        variant: 'destructive',
      });
    }
    return status.online;
  }, [toast]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Please enter a prompt! ✏️', description: 'Describe what you want to create.' });
      return;
    }

    const online = await checkServer();
    if (!online) return;

    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 92));
    }, 500);

    try {
      const images = await generateImage({
        prompt,
        styles: [selectedStyle],
        aspectRatio: selectedRatio,
      });

      setProgress(100);
      clearInterval(interval);

      if (images.length > 0) {
        setGeneratedImages(prev => [...images, ...prev]);
        toast({ title: 'Image Created! 🎉', description: 'Your AI artwork is ready!' });
      } else {
        toast({ title: 'Generation Complete', description: 'No images returned. Try a different prompt!' });
      }
    } catch (error) {
      clearInterval(interval);
      toast({
        title: 'Generation Failed 😞',
        description: 'Make sure Fooocus is running. Try again!',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-4">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-kiddo font-bold mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              ✨ AI Art Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-story">
              Describe anything you can imagine and watch AI bring it to life! Create magical artwork, story illustrations, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prompt Input */}
              <Card className="border-border rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
                    <Wand2 className="h-5 w-5 text-violet-400" />
                    Your Imagination
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your dream artwork... e.g., 'A cute cat astronaut floating in space with planets'"
                    className="w-full h-24 p-3 rounded-xl bg-muted/50 border border-border/50 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 resize-none text-sm font-story transition-colors outline-none"
                  />
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-story py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Creating Magic... {Math.round(progress)}%
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Create Artwork ✨
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Prompts */}
              <Card className="border-border rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-story text-muted-foreground">✨ Quick Ideas</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {PROMPT_SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => setPrompt(s.prompt)}
                        className="px-3 py-1.5 text-xs rounded-full bg-muted/50 hover:bg-violet-500/20 hover:text-violet-300 border border-border/50 hover:border-violet-500/30 transition-colors font-story"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Style Picker */}
              <Card className="border-border rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-story text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    Art Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {STYLE_OPTIONS.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={`px-3 py-2 text-xs rounded-xl border transition-all font-story ${
                          selectedStyle === style.value
                            ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                            : 'bg-muted/30 border-border/50 hover:border-violet-500/30'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Aspect Ratio */}
              <Card className="border-border rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-story text-muted-foreground">📐 Size</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.value}
                        onClick={() => setSelectedRatio(ratio.value)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all font-story ${
                          selectedRatio === ratio.value
                            ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                            : 'bg-muted/30 border-border/50 hover:border-violet-500/30'
                        }`}
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Gallery */}
            <div className="lg:col-span-2">
              <Card className="border-border rounded-2xl h-full min-h-[500px]">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
                    <ImageIcon className="h-5 w-5 text-fuchsia-400" />
                    Your Creations
                    {generatedImages.length > 0 && (
                      <Badge variant="outline" className="text-violet-400 border-violet-400/30 ml-auto">
                        {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {generatedImages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <div className="text-6xl mb-4 animate-bounce-gentle">🎨</div>
                      <h3 className="text-lg font-kiddo text-muted-foreground mb-2">Your canvas awaits!</h3>
                      <p className="text-sm text-muted-foreground font-story max-w-sm">
                        Type what you imagine, pick a style, and click "Create Artwork" to see AI magic happen!
                      </p>
                      {serverStatus && !serverStatus.online && (
                        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-xs text-destructive font-story">
                            Fooocus server is offline. Start it to generate images!
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {generatedImages.map((img, index) => (
                        <div key={index} className="group relative rounded-2xl overflow-hidden border border-border/50 hover:border-violet-500/30 transition-all">
                          <img
                            src={img}
                            alt={`AI Generated Art ${index + 1}`}
                            className="w-full h-auto object-cover rounded-2xl"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23333"><rect width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="16">Image from Fooocus</text></svg>';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <a
                              href={img}
                              download={`kiddoverse-art-${index + 1}.png`}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                              <Download className="h-5 w-5 text-white" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
