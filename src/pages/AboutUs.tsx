import React from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, Music, BookOpen, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/kiddoverse-logo.png";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="KiddoVerse" className="h-24 w-24 rounded-2xl drop-shadow-[0_0_20px_rgba(255,105,180,0.4)]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-kiddo font-bold text-primary mb-4 animate-bounce-gentle">
              About KiddoVerse 🌟
            </h1>
            <p className="text-xl text-muted-foreground font-story">
              Where learning meets imagination and fun for kids everywhere!
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 border-t border-border bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-kiddo font-bold text-primary mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                Our Mission
              </h2>
              <p className="text-muted-foreground font-story mb-4 text-lg leading-relaxed">
                KiddoVerse is designed to make early learning magical. We believe that children learn best when they are fully engaged, singing, playing, and imagining!
              </p>
              <p className="text-muted-foreground font-story text-lg leading-relaxed">
                Through interactive nursery rhymes, captivating stories, sing-along sessions, and fun word games, we're building a safe and joyful digital playground for the next generation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border-none rounded-2xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-12 w-12 bg-pink-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Music className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="font-kiddo text-lg mb-1">Rhymes</h3>
                <p className="text-sm text-muted-foreground font-story">Sing & learn</p>
              </div>
              <div className="bg-card border-none rounded-2xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-12 w-12 bg-purple-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-kiddo text-lg mb-1">Stories</h3>
                <p className="text-sm text-muted-foreground font-story">Read & dream</p>
              </div>
              <div className="bg-card border-none rounded-2xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-12 w-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="font-kiddo text-lg mb-1">Games</h3>
                <p className="text-sm text-muted-foreground font-story">Play & grow</p>
              </div>
              <div className="bg-card border-none rounded-2xl p-6 text-center shadow-md hover:-translate-y-1 transition-transform">
                <div className="h-12 w-12 bg-sky-400/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="font-kiddo text-lg mb-1">Safe</h3>
                <p className="text-sm text-muted-foreground font-story">Kid-friendly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-kiddo font-bold text-primary mb-4">Ready to Play? 🎨</h2>
          <p className="text-xl text-muted-foreground font-story mb-8">
            Join KiddoVerse today and start earning stars on your learning adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-xl font-story text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              onClick={() => navigate("/register")}
            >
              Get Started 🚀
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl font-story text-lg"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
