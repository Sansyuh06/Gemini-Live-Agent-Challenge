import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { GameProvider } from "@/context/GameContext";
import { AuthProvider } from "@/context/AuthContext";
import React, { Suspense } from 'react';
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index"; // Keep index synchronous for fast load

// Lazy load feature pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ProfileSettings = React.lazy(() => import("./pages/ProfileSettings"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Achievements = React.lazy(() => import("./pages/Achievements"));
const AdminRoles = React.lazy(() => import("./pages/AdminRoles"));
const ModeratorDashboard = React.lazy(() => import("./pages/ModeratorDashboard"));
const Roadmap = React.lazy(() => import("./pages/Roadmap"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const RhymesPage = React.lazy(() => import("./pages/RhymesPage"));
const StoryTimePage = React.lazy(() => import("./pages/StoryTimePage"));
const SingAlongPage = React.lazy(() => import("./pages/SingAlongPage"));
const WordGamePage = React.lazy(() => import("./pages/WordGamePage"));
const ImageStudio = React.lazy(() => import("./pages/ImageStudio"));
const CalmZone = React.lazy(() => import("./pages/CalmZone"));
const TherapyStories = React.lazy(() => import("./pages/TherapyStories"));
const SensoryPlay = React.lazy(() => import("./pages/SensoryPlay"));

// StoryWeaver lazy imports
const ModeSelector = React.lazy(() => import("./components/Onboarding/ModeSelector"));
const ChildOnboarding = React.lazy(() => import("./components/Onboarding/ChildOnboarding"));
const AdultOnboarding = React.lazy(() => import("./components/Onboarding/AdultOnboarding"));
const StoryWeaverWonder = React.lazy(() => import("./pages/StoryWeaverWonder"));
const Sanctuary = React.lazy(() => import("./pages/Sanctuary"));
const ReflectionDashboard = React.lazy(() => import("./pages/ReflectionDashboard"));

import { useThemeCustomization } from "./hooks/useThemeCustomization";

const queryClient = new QueryClient();

const ThemeInitializer = ({ children }: { children: React.ReactNode }) => {
  useThemeCustomization();
  return <>{children}</>;
};

const FallbackLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent shadow-lg shadow-sky-500/20"></div>
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="kiddoverse-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GameProvider>
          <ThemeInitializer>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<FallbackLoader />}>
                  <Routes>
                    {/* KiddoVerse Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/rhymes" element={<RhymesPage />} />
                    <Route path="/stories" element={<StoryTimePage />} />
                    <Route path="/sing-along" element={<SingAlongPage />} />
                    <Route path="/word-games" element={<WordGamePage />} />
                    <Route path="/settings" element={<ProfileSettings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/admin/roles" element={<AdminRoles />} />
                    <Route path="/moderator" element={<ModeratorDashboard />} />
                    <Route path="/roadmap" element={<Roadmap />} />

                    {/* Enhanced Features */}
                    <Route path="/image-studio" element={<ImageStudio />} />
                    <Route path="/calm-zone" element={<CalmZone />} />
                    <Route path="/therapy-stories" element={<TherapyStories />} />
                    <Route path="/sensory-play" element={<SensoryPlay />} />

                    {/* StoryWeaver Routes */}
                    <Route path="/storyweaver" element={<ModeSelector />} />
                    <Route path="/wonder/onboarding" element={<ChildOnboarding />} />
                    <Route path="/sanctuary/onboarding" element={<AdultOnboarding />} />
                    <Route path="/wonder" element={<StoryWeaverWonder />} />
                    <Route path="/sanctuary" element={<Sanctuary />} />
                    <Route path="/reflections" element={<ReflectionDashboard />} />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeInitializer>
        </GameProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
