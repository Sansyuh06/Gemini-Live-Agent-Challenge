import { BookOpen, Music, Mic, Star, Sparkles } from 'lucide-react';

export interface LearningPath {
    level: number;
    title: string;
    slug: string;
    description: string;
    skills: string[];
    icon: typeof BookOpen;
    color: string;
}

export const learningPaths: LearningPath[] = [
    {
        level: 1,
        title: 'Tiny Tots',
        slug: 'tiny-tots',
        description: 'Start your adventure with simple, fun nursery rhymes and colorful picture stories!',
        skills: ['Listening', 'Repetition', 'Rhythm', 'Colors'],
        icon: Star,
        color: 'from-pink-400 to-rose-400',
    },
    {
        level: 2,
        title: 'Story Explorer',
        slug: 'story-explorer',
        description: 'Discover classic fairy tales, fables, and exciting adventures from around the world.',
        skills: ['Reading', 'Imagination', 'Vocabulary', 'Comprehension'],
        icon: BookOpen,
        color: 'from-sky-400 to-blue-400',
    },
    {
        level: 3,
        title: 'Sing-Along Star',
        slug: 'sing-along-star',
        description: 'Sing your favorite songs and learn new melodies with fun animated lyrics!',
        skills: ['Singing', 'Memory', 'Music', 'Expression'],
        icon: Music,
        color: 'from-amber-400 to-yellow-400',
    },
    {
        level: 4,
        title: 'Reading Champion',
        slug: 'reading-champion',
        description: 'Take on longer stories with chapters and become a confident reader.',
        skills: ['Fluency', 'Storytelling', 'Critical Thinking', 'Empathy'],
        icon: Mic,
        color: 'from-emerald-400 to-green-400',
    },
    {
        level: 5,
        title: 'Creative Spark',
        slug: 'creative-spark',
        description: 'Unlock your creativity! Write your own stories and share them with friends.',
        skills: ['Writing', 'Creativity', 'Presentation', 'Collaboration'],
        icon: Sparkles,
        color: 'from-purple-400 to-violet-400',
    },
];
