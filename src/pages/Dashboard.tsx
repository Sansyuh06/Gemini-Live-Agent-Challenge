import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Star, Target, Clock, Flame, Award, ChevronRight, BookOpen, Music, Mic, Gamepad2, Trophy, CheckCircle, Lock, Sparkles
} from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { MoodTracker } from '@/components/MoodTracker';
import { useNavigate } from 'react-router-dom';
import { rhymes, stories, songs } from '@/data/storiesData';
import { SkillMatrix } from '@/components/SkillMatrix';
import { useEffect } from 'react';

const Dashboard: React.FC = () => {
  const { points, level, rhymesLearned, storiesRead, songsCompleted, wordsCompleted, chatMessagesSent } = useGame();
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);

  // Calculate login streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedDays: string[] = JSON.parse(localStorage.getItem('kiddoverse-login-days') || '[]');

    if (!savedDays.includes(today)) {
      savedDays.push(today);
      localStorage.setItem('kiddoverse-login-days', JSON.stringify(savedDays));
    }

    const sorted = [...new Set(savedDays)].sort().reverse();
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i]);
      const prev = new Date(sorted[i + 1]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    setCurrentStreak(streak);
  }, []);

  const totalActivitiesCompleted = rhymesLearned + storiesRead + songsCompleted + wordsCompleted;

  const activityCategories = [
    { name: 'Nursery Rhymes', completed: rhymesLearned, total: rhymes.length, color: 'from-pink-500 to-rose-400', emoji: '🎵' },
    { name: 'Stories', completed: storiesRead, total: stories.length, color: 'from-sky-500 to-blue-400', emoji: '📖' },
    { name: 'Sing-Along', completed: songsCompleted, total: songs.length, color: 'from-amber-500 to-yellow-400', emoji: '🎤' },
    { name: 'Word Games', completed: wordsCompleted, total: 20, color: 'from-emerald-500 to-green-400', emoji: '🎮' },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first activity', unlocked: totalActivitiesCompleted > 0, icon: Star },
    { name: 'Rhyme Master', description: 'Learn all nursery rhymes', unlocked: rhymesLearned >= rhymes.length, icon: Music },
    { name: 'Story Explorer', description: 'Read all stories', unlocked: storiesRead >= stories.length, icon: BookOpen },
    { name: 'Sing-Along Star', description: 'Complete all songs', unlocked: songsCompleted >= songs.length, icon: Mic },
    { name: 'Word Wizard', description: 'Complete 20 word games', unlocked: wordsCompleted >= 20, icon: Gamepad2 },
    { name: 'Super Star', description: 'Reach level 10', unlocked: level >= 10, icon: Sparkles },
  ];

  const recentActivity = [];
  if (rhymesLearned > 0) recentActivity.push({ type: 'activity', name: `${rhymesLearned} Rhyme${rhymesLearned > 1 ? 's' : ''} Learned`, stars: rhymesLearned * 10, time: 'Recently', emoji: '🎵' });
  if (storiesRead > 0) recentActivity.push({ type: 'activity', name: `${storiesRead} Stor${storiesRead > 1 ? 'ies' : 'y'} Read`, stars: storiesRead * 25, time: 'Recently', emoji: '📖' });
  if (songsCompleted > 0) recentActivity.push({ type: 'activity', name: `${songsCompleted} Song${songsCompleted > 1 ? 's' : ''} Completed`, stars: songsCompleted * 15, time: 'Recently', emoji: '🎤' });
  if (wordsCompleted > 0) recentActivity.push({ type: 'activity', name: `${wordsCompleted} Word${wordsCompleted > 1 ? 's' : ''} Spelled`, stars: wordsCompleted * 5, time: 'Recently', emoji: '🎮' });
  if (chatMessagesSent > 0) recentActivity.push({ type: 'activity', name: `${chatMessagesSent} Chat Message${chatMessagesSent > 1 ? 's' : ''} Sent`, stars: chatMessagesSent * 5, time: 'Recently', emoji: '💬' });
  if (recentActivity.length === 0) recentActivity.push({ type: 'info', name: 'No activity yet', stars: 0, time: 'Start exploring! 🚀', emoji: '👋' });

  const username = 'Explorer';

  // Recommended stories
  const recommended = [
    { title: 'The Three Little Pigs', emoji: '🐷', link: '/stories', desc: 'A classic tale of hard work!' },
    { title: 'Twinkle Twinkle Little Star', emoji: '⭐', link: '/rhymes', desc: 'The most beloved rhyme!' },
    { title: 'Old MacDonald Had a Farm', emoji: '🐄', link: '/sing-along', desc: 'Sing with the animals!' },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-primary">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-kiddo">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-kiddo text-foreground">
              Hi, {username}! 👋
            </h1>
            <p className="text-muted-foreground text-sm font-story">
              Ready for some fun learning today?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5 border-border text-foreground font-story">
            <Flame className="h-4 w-4 mr-1 text-primary" />
            Level {level}
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 border-border text-foreground font-story">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            {points} ⭐
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-border hover:border-primary/40 transition-colors rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-story">Total Stars</p>
                <p className="text-2xl font-kiddo text-foreground">{points.toLocaleString()} ⭐</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/40 transition-colors rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-story">Activities Done</p>
                <p className="text-2xl font-kiddo text-foreground">{totalActivitiesCompleted}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/40 transition-colors rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-story">Learning Streak</p>
                <p className="text-2xl font-kiddo text-foreground">{currentStreak} day{currentStreak !== 1 ? 's' : ''} 🔥</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-400/20 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/40 transition-colors rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 font-story">Achievements</p>
                <p className="text-2xl font-kiddo text-foreground">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-400/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {activityCategories.map((cat) => (
          <Card
            key={cat.name}
            className="border-border hover:border-primary/40 transition-all cursor-pointer group hover:-translate-y-0.5 rounded-2xl"
            onClick={() => navigate(cat.name === 'Nursery Rhymes' ? '/rhymes' : cat.name === 'Stories' ? '/stories' : cat.name === 'Sing-Along' ? '/sing-along' : '/word-games')}
          >
            <CardContent className="p-4 text-center">
              <span className="text-2xl">{cat.emoji}</span>
              <p className="text-sm font-kiddo mt-1 group-hover:text-primary transition-colors">{cat.name}</p>
              <p className="text-xs text-muted-foreground font-story">{cat.completed}/{cat.total} done</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="py-2 font-story">Overview</TabsTrigger>
          <TabsTrigger value="achievements" className="py-2 font-story">Achievements</TabsTrigger>
          <TabsTrigger value="recommended" className="py-2 font-story">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Progress */}
            <Card className="border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Activity Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityCategories.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-story">{category.emoji} {category.name}</span>
                      <span className="text-sm text-muted-foreground font-story">
                        {category.completed}/{category.total}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                        style={{ width: `${category.total > 0 ? (category.completed / category.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-kiddo">
                  <Clock className="h-5 w-5 text-secondary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                        {activity.emoji}
                      </div>
                      <div>
                        <p className="text-sm font-medium font-story">{activity.name}</p>
                        <p className="text-xs text-muted-foreground font-story">{activity.time}</p>
                      </div>
                    </div>
                    {activity.stars > 0 && (
                      <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 font-story">
                        +{activity.stars} ⭐
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Mood Tracker */}
          <MoodTracker />

          {/* Skill Matrix */}
          <SkillMatrix />
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.name}
                className={`transition-colors rounded-2xl ${achievement.unlocked
                  ? 'border-primary/50 hover:border-primary'
                  : 'border-border/50 opacity-60'
                  }`}
              >
                <CardContent className="p-6 flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${achievement.unlocked ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                    <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-kiddo">{achievement.name}</h3>
                      {achievement.unlocked ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 font-story">
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <Card
                key={item.title}
                className="border-border hover:border-primary/40 transition-all cursor-pointer group hover:-translate-y-0.5 rounded-2xl"
                onClick={() => navigate(item.link)}
              >
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-3 block">{item.emoji}</span>
                  <h3 className="font-kiddo mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-story">{item.desc}</p>
                  <Button variant="ghost" size="sm" className="mt-3 text-primary font-story">
                    Start Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
