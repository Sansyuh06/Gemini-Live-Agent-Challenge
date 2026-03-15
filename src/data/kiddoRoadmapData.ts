import { BookOpen, Music, Star, Gamepad2, Sparkles } from 'lucide-react';

export interface RoadmapStage {
    id: string;
    title: string;
    description: string;
    icon: typeof BookOpen;
    color: string;
    milestones: string[];
}

export const roadmapStages: RoadmapStage[] = [
    {
        id: 'listening',
        title: 'Little Listener',
        description: 'Start by listening to rhymes and enjoying picture stories',
        icon: Music,
        color: 'from-pink-400 to-rose-400',
        milestones: ['Listen to 3 rhymes', 'Complete 1 story', 'Earn 50 ⭐'],
    },
    {
        id: 'explorer',
        title: 'Story Explorer',
        description: 'Read along with stories and learn new words',
        icon: BookOpen,
        color: 'from-sky-400 to-blue-400',
        milestones: ['Read 3 stories', 'Learn 5 new words', 'Earn 150 ⭐'],
    },
    {
        id: 'singer',
        title: 'Sing-Along Star',
        description: 'Sing your favorite songs and learn the lyrics',
        icon: Star,
        color: 'from-amber-400 to-yellow-400',
        milestones: ['Sing 3 songs', 'Complete all rhymes', 'Earn 300 ⭐'],
    },
    {
        id: 'player',
        title: 'Word Wizard',
        description: 'Play word games and become a spelling champion',
        icon: Gamepad2,
        color: 'from-emerald-400 to-green-400',
        milestones: ['Solve 10 words', 'Complete word games', 'Earn 500 ⭐'],
    },
    {
        id: 'champion',
        title: 'KiddoVerse Champion',
        description: 'You have mastered all the content! Keep exploring!',
        icon: Sparkles,
        color: 'from-purple-400 to-violet-400',
        milestones: ['Complete all activities', 'Earn 1000 ⭐', 'Share with friends'],
    },
];
