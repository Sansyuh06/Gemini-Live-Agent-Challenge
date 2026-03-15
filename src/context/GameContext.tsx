import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAchievementNotification } from '@/components/AchievementNotificationContainer';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement_type: string;
  requirement_value: number;
}

interface GameContextType {
  points: number;
  level: number;
  addPoints: (points: number) => void;
  completedChallenges: string[];
  completeChallenge: (challengeId: string) => void;
  rhymesLearned: number;
  storiesRead: number;
  songsCompleted: number;
  chatMessagesSent: number;
  wordsCompleted: number;
  incrementRhymes: () => void;
  incrementStories: () => void;
  incrementSongs: () => void;
  incrementChatMessages: () => void;
  incrementWords: () => void;
  // Specific completion functions
  completeRhyme: (rhymeId: string) => Promise<void>;
  completeStory: (storyId: string) => Promise<void>;
  completeSong: (songId: string) => Promise<void>;
  completeWord: (wordId: string) => Promise<void>;
  // Check if specific items are completed
  isRhymeCompleted: (rhymeId: string) => boolean;
  isStoryCompleted: (storyId: string) => boolean;
  isSongCompleted: (songId: string) => boolean;
  isWordCompleted: (wordId: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievementIds, setUserAchievementIds] = useState<Set<string>>(new Set());
  const { showAchievement } = useAchievementNotification();

  // Track specific completed items
  const [completedRhymeIds, setCompletedRhymeIds] = useState<Set<string>>(new Set());
  const [completedStoryIds, setCompletedStoryIds] = useState<Set<string>>(new Set());
  const [completedSongIds, setCompletedSongIds] = useState<Set<string>>(new Set());
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('kiddoverse-points');
    return saved ? parseInt(saved) : 0;
  });

  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('kiddoverse-completed');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessagesSent, setChatMessagesSent] = useState(() => {
    const saved = localStorage.getItem('kiddoverse-chat');
    return saved ? parseInt(saved) : 0;
  });

  // Derived counts from sets
  const rhymesLearned = completedRhymeIds.size;
  const storiesRead = completedStoryIds.size;
  const songsCompleted = completedSongIds.size;
  const wordsCompleted = completedWordIds.size;

  const level = Math.floor(points / 1000) + 1;

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch achievements and user achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await supabase.from('achievements').select('*');
      if (data) setAchievements(data);

      if (user) {
        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select('achievement_id')
          .eq('user_id', user.id);
        if (userAchievements) {
          setUserAchievementIds(new Set(userAchievements.map(ua => ua.achievement_id)));
        }
      }
    };
    fetchAchievements();
  }, [user]);

  // Fetch game progress from database
  useEffect(() => {
    const fetchGameProgress = async () => {
      if (!user) {
        // Load from localStorage for non-logged users
        const savedRhymes = localStorage.getItem('kiddoverse-rhymes');
        const savedStories = localStorage.getItem('kiddoverse-stories');
        const savedSongs = localStorage.getItem('kiddoverse-songs');
        const savedWords = localStorage.getItem('kiddoverse-words');

        if (savedRhymes) setCompletedRhymeIds(new Set(JSON.parse(savedRhymes)));
        if (savedStories) setCompletedStoryIds(new Set(JSON.parse(savedStories)));
        if (savedSongs) setCompletedSongIds(new Set(JSON.parse(savedSongs)));
        if (savedWords) setCompletedWordIds(new Set(JSON.parse(savedWords)));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('lab_progress')
          .select('lab_id, lab_type')
          .eq('user_id', user.id)
          .in('lab_type', ['rhyme', 'story', 'song', 'word']);

        if (error) throw error;

        const rhymeIds = new Set<string>();
        const storyIds = new Set<string>();
        const songIds = new Set<string>();
        const wordIds = new Set<string>();

        data?.forEach(item => {
          if (item.lab_type === 'rhyme') rhymeIds.add(item.lab_id);
          else if (item.lab_type === 'story') storyIds.add(item.lab_id);
          else if (item.lab_type === 'song') songIds.add(item.lab_id);
          else if (item.lab_type === 'word') wordIds.add(item.lab_id);
        });

        setCompletedRhymeIds(rhymeIds);
        setCompletedStoryIds(storyIds);
        setCompletedSongIds(songIds);
        setCompletedWordIds(wordIds);

        localStorage.setItem('kiddoverse-rhymes', JSON.stringify([...rhymeIds]));
        localStorage.setItem('kiddoverse-stories', JSON.stringify([...storyIds]));
        localStorage.setItem('kiddoverse-songs', JSON.stringify([...songIds]));
        localStorage.setItem('kiddoverse-words', JSON.stringify([...wordIds]));
      } catch (error) {
        console.error('Error fetching game progress:', error);
      }
    };

    fetchGameProgress();
  }, [user]);

  // Check and award achievements
  const checkAchievements = useCallback(async (type: string, value: number) => {
    if (!user) return;

    const eligible = achievements.filter(
      a => a.requirement_type === type &&
        a.requirement_value <= value &&
        !userAchievementIds.has(a.id)
    );

    for (const achievement of eligible) {
      const { error } = await supabase.from('user_achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
      });

      if (!error) {
        setUserAchievementIds(prev => new Set([...prev, achievement.id]));
        showAchievement({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          points: achievement.points,
        });
      }
    }
  }, [achievements, userAchievementIds, user, showAchievement]);

  // Sync points
  useEffect(() => {
    const syncPointsFromDB = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('points')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && data.points > 0) {
          const localPoints = parseInt(localStorage.getItem('kiddoverse-points') || '0');
          const maxPoints = Math.max(data.points, localPoints);
          setPoints(maxPoints);
        }
      } catch (error) {
        console.error('Error syncing points:', error);
      }
    };
    syncPointsFromDB();
  }, [user]);

  useEffect(() => {
    const syncPointsToDB = async () => {
      if (!user || points === 0) return;
      try {
        await supabase
          .from('profiles')
          .update({ points })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error saving points to database:', error);
      }
    };
    syncPointsToDB();
  }, [points, user]);

  useEffect(() => {
    if (points > 0) {
      checkAchievements('points_earned', points);
    }
  }, [points, checkAchievements]);

  const addPoints = (newPoints: number) => {
    setPoints(prev => prev + newPoints);
  };

  const completeChallenge = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
      addPoints(100);
      checkAchievements('challenges_completed', completedChallenges.length + 1);
    }
  };

  // Complete a rhyme
  const completeRhyme = useCallback(async (rhymeId: string) => {
    if (completedRhymeIds.has(rhymeId)) return;

    const newCompleted = new Set([...completedRhymeIds, rhymeId]);
    setCompletedRhymeIds(newCompleted);
    localStorage.setItem('kiddoverse-rhymes', JSON.stringify([...newCompleted]));

    if (user) {
      try {
        await supabase.from('lab_progress').insert({
          user_id: user.id,
          lab_id: rhymeId,
          lab_type: 'rhyme',
          points_earned: 10,
        });
      } catch (error: any) {
        if (error?.code !== '23505') {
          console.error('Error saving rhyme progress:', error);
        }
      }
    }

    addPoints(10);
    checkAchievements('rhymes_learned', newCompleted.size);
  }, [completedRhymeIds, user, checkAchievements]);

  // Complete a story
  const completeStory = useCallback(async (storyId: string) => {
    if (completedStoryIds.has(storyId)) return;

    const newCompleted = new Set([...completedStoryIds, storyId]);
    setCompletedStoryIds(newCompleted);
    localStorage.setItem('kiddoverse-stories', JSON.stringify([...newCompleted]));

    if (user) {
      try {
        await supabase.from('lab_progress').insert({
          user_id: user.id,
          lab_id: storyId,
          lab_type: 'story',
          points_earned: 25,
        });
      } catch (error: any) {
        if (error?.code !== '23505') {
          console.error('Error saving story progress:', error);
        }
      }
    }

    addPoints(25);
    checkAchievements('stories_read', newCompleted.size);
  }, [completedStoryIds, user, checkAchievements]);

  // Complete a song
  const completeSong = useCallback(async (songId: string) => {
    if (completedSongIds.has(songId)) return;

    const newCompleted = new Set([...completedSongIds, songId]);
    setCompletedSongIds(newCompleted);
    localStorage.setItem('kiddoverse-songs', JSON.stringify([...newCompleted]));

    if (user) {
      try {
        await supabase.from('lab_progress').insert({
          user_id: user.id,
          lab_id: songId,
          lab_type: 'song',
          points_earned: 15,
        });
      } catch (error: any) {
        if (error?.code !== '23505') {
          console.error('Error saving song progress:', error);
        }
      }
    }

    addPoints(15);
    checkAchievements('songs_completed', newCompleted.size);
  }, [completedSongIds, user, checkAchievements]);

  // Complete a word
  const completeWord = useCallback(async (wordId: string) => {
    if (completedWordIds.has(wordId)) return;

    const newCompleted = new Set([...completedWordIds, wordId]);
    setCompletedWordIds(newCompleted);
    localStorage.setItem('kiddoverse-words', JSON.stringify([...newCompleted]));

    if (user) {
      try {
        await supabase.from('lab_progress').insert({
          user_id: user.id,
          lab_id: wordId,
          lab_type: 'word',
          points_earned: 5,
        });
      } catch (error: any) {
        if (error?.code !== '23505') {
          console.error('Error saving word progress:', error);
        }
      }
    }

    addPoints(5);
    checkAchievements('words_completed', newCompleted.size);
  }, [completedWordIds, user, checkAchievements]);

  // Check functions
  const isRhymeCompleted = useCallback((rhymeId: string) => completedRhymeIds.has(rhymeId), [completedRhymeIds]);
  const isStoryCompleted = useCallback((storyId: string) => completedStoryIds.has(storyId), [completedStoryIds]);
  const isSongCompleted = useCallback((songId: string) => completedSongIds.has(songId), [completedSongIds]);
  const isWordCompleted = useCallback((wordId: string) => completedWordIds.has(wordId), [completedWordIds]);

  // Legacy increment functions
  const incrementRhymes = useCallback(() => {
    const nextId = `rhyme-${completedRhymeIds.size + 1}`;
    completeRhyme(nextId);
  }, [completedRhymeIds, completeRhyme]);

  const incrementStories = useCallback(() => {
    const nextId = `story-${completedStoryIds.size + 1}`;
    completeStory(nextId);
  }, [completedStoryIds, completeStory]);

  const incrementSongs = useCallback(() => {
    const nextId = `song-${completedSongIds.size + 1}`;
    completeSong(nextId);
  }, [completedSongIds, completeSong]);

  const incrementWords = useCallback(() => {
    const nextId = `word-${completedWordIds.size + 1}`;
    completeWord(nextId);
  }, [completedWordIds, completeWord]);

  const incrementChatMessages = useCallback(() => {
    setChatMessagesSent(prev => {
      const newVal = prev + 1;
      localStorage.setItem('kiddoverse-chat', newVal.toString());
      checkAchievements('chat_messages', newVal);
      return newVal;
    });
  }, [checkAchievements]);

  useEffect(() => {
    localStorage.setItem('kiddoverse-points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('kiddoverse-completed', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  return (
    <GameContext.Provider value={{
      points,
      level,
      addPoints,
      completedChallenges,
      completeChallenge,
      rhymesLearned,
      storiesRead,
      songsCompleted,
      wordsCompleted,
      chatMessagesSent,
      incrementRhymes,
      incrementStories,
      incrementSongs,
      incrementWords,
      incrementChatMessages,
      completeRhyme,
      completeStory,
      completeSong,
      completeWord,
      isRhymeCompleted,
      isStoryCompleted,
      isSongCompleted,
      isWordCompleted,
    }}>
      {children}
    </GameContext.Provider>
  );
};
