import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ChatBot } from "@/components/ChatBot";
import { ChevronRight, Music, BookOpen, Mic, Gamepad2, Sparkles, Heart, Brain, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { learningPaths } from "@/data/learningPathsData";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlassmorphicCard } from "@/components/ui/GlassmorphicCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

const Index = () => {
  const activities = [
    {
      title: "Nursery Rhymes",
      emoji: "🎵",
      description: "Sing along to classic nursery rhymes with animated text and fun actions!",
      color: "from-pink-400 to-rose-400",
      icon: Music,
      link: "/rhymes",
      count: "8 Rhymes",
    },
    {
      title: "Story Time",
      emoji: "📖",
      description: "Read magical stories page by page — fairy tales, fables, and adventures!",
      color: "from-sky-400 to-blue-400",
      icon: BookOpen,
      link: "/stories",
      count: "5 Stories",
    },
    {
      title: "Sing-Along",
      emoji: "🎤",
      description: "Fun songs with bouncing lyrics! Old MacDonald, Wheels on the Bus, and more!",
      color: "from-amber-400 to-yellow-400",
      icon: Mic,
      link: "/sing-along",
      count: "5 Songs",
    },
    {
      title: "Word Games",
      emoji: "🎮",
      description: "Spell fun words, match pictures, and build your vocabulary through play!",
      color: "from-emerald-400 to-green-400",
      icon: Gamepad2,
      link: "/word-games",
      count: "20 Words",
    },
  ];

  const newFeatures = [
    {
      title: "AI Art Studio",
      emoji: "✨",
      description: "Create magical artwork with AI! Describe anything and watch it come to life.",
      color: "from-violet-400 to-fuchsia-400",
      icon: Sparkles,
      link: "/image-studio",
      count: "Unlimited",
      badge: "NEW",
    },
    {
      title: "Calm Zone",
      emoji: "🧘",
      description: "Breathing exercises, grounding activities, and fidget tools for when you need calm.",
      color: "from-sky-400 to-teal-400",
      icon: Heart,
      link: "/calm-zone",
      count: "4 Activities",
      badge: "WELLNESS",
    },
    {
      title: "Therapy Stories",
      emoji: "💜",
      description: "Social stories about managing feelings, making friends, and understanding yourself.",
      color: "from-rose-400 to-pink-400",
      icon: Brain,
      link: "/therapy-stories",
      count: "4 Stories",
      badge: "INCLUSIVE",
    },
    {
      title: "Sensory Play",
      emoji: "🎨",
      description: "Color mixing, pattern games, music making, and calming visual activities.",
      color: "from-orange-400 to-amber-400",
      icon: Palette,
      link: "/sensory-play",
      count: "4 Activities",
      badge: "INTERACTIVE",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />

      {/* StoryWeaver Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <ParticleBackground theme="sanctuary" particleCount={50} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <ScrollReveal>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-serif-elegant font-light text-white mb-4 tracking-tight">
                StoryWeaver
              </h2>
              <p className="text-white/60 italic mb-10 text-xl font-light">
                Your story. Your healing. Your words.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <Link to="/wonder/onboarding">
                  <GlassmorphicCard variant="glow" interactive className="p-8 h-full border-amber-500/20 hover:border-amber-400/50">
                    <span className="text-5xl mb-4 block">✨</span>
                    <h3 className="text-xl font-display font-medium text-amber-300 mb-2">Wonder Mode</h3>
                    <p className="text-white/60">AI storytelling with Luna for children ages 4–10</p>
                  </GlassmorphicCard>
                </Link>
                <Link to="/sanctuary/onboarding">
                  <GlassmorphicCard variant="glow" interactive className="p-8 h-full border-teal-500/20 hover:border-teal-400/50">
                    <span className="text-5xl mb-4 block">🕊️</span>
                    <h3 className="text-xl font-serif-elegant text-teal-300 mb-2">Sanctuary Mode</h3>
                    <p className="text-white/60">Narrative therapy with Sage for adult mental health</p>
                  </GlassmorphicCard>
                </Link>
              </div>
              <Link to="/storyweaver">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 font-display px-8 py-6 text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Enter StoryWeaver →
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* NEW: Explore Section */}
      <section className="py-24 bg-gradient-to-b from-background to-violet-950/5">
        <ScrollReveal>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
                Next-Gen Features ✨
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-story">
                AI-powered creation, wellness activities, and inclusive experiences — made for every kind of mind. 💜
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <ScrollReveal key={feature.title} delay={idx * 0.1}>
                    <Link to={feature.link} className="block h-full group">
                      <GlassmorphicCard variant="light" interactive className="h-full border-border">
                        <div className="absolute top-4 right-4 z-10">
                          <span className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-gradient-to-r ${feature.color} text-white shadow-sm`}>
                            {feature.badge}
                          </span>
                        </div>
                        <CardContent className="p-8 text-center relative z-0">
                          <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg shadow-${feature.color.split('-')[1]}-500/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500`}>
                            <span className="text-4xl">{feature.emoji}</span>
                          </div>
                          <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 font-story leading-relaxed">
                            {feature.description}
                          </p>
                          <div className="flex items-center justify-center">
                            <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary font-story">
                              {feature.count === "Unlimited" ? "Unlimited" : (
                                <><AnimatedCounter value={parseInt(feature.count)} /> Activities</>
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </GlassmorphicCard>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-kiddo mb-4 text-foreground">
              Your Learning Adventure 🗺️
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-story">
              Follow the path from Tiny Tots to Creative Spark — each step is a new adventure!
            </p>
          </div>

          {/* Learning Path Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary/30 transform md:-translate-x-1/2" />

            {learningPaths.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div
                  key={stage.level}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background transform -translate-x-1/2 z-10" />

                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="border-border hover:border-primary/40 transition-all hover:scale-[1.01] group cursor-pointer rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-primary font-medium font-story">LEVEL {stage.level}</span>
                              <ChevronRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors font-kiddo">
                              {stage.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 font-story">
                              {stage.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {stage.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground border border-border/50 font-story"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="challenges" className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-kiddo mb-4 text-foreground">
              Fun Activities 🎉
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-story">
              Pick an activity and start having fun! Every completed activity earns you ⭐ stars!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Link key={activity.title} to={activity.link}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/40 hover:-translate-y-1 rounded-2xl h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <span className="text-3xl">{activity.emoji}</span>
                      </div>
                      <h3 className="text-lg font-kiddo mb-2 group-hover:text-primary transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 font-story leading-relaxed">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary font-story">
                          {activity.count}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-story">
            © 2025 KiddoVerse. A magical world for every kind of mind — making learning inclusive, fun, and creative! 🌟💜
          </p>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Index;
