import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronLeft, ChevronRight, Heart, Sparkles, Brain } from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

interface TherapyStory {
  id: string;
  title: string;
  emoji: string;
  category: string;
  categoryColor: string;
  description: string;
  pages: { text: string; illustration: string }[];
}

const therapyStories: TherapyStory[] = [
  {
    id: 'big-feelings',
    title: 'When Feelings Get BIG',
    emoji: '🌊',
    category: 'Emotions',
    categoryColor: 'from-blue-400 to-cyan-400',
    description: 'Learn that all feelings are okay and discover ways to manage big emotions.',
    pages: [
      { text: "Sometimes my feelings get really, really BIG. 🌊\n\nLike a wave in the ocean — they crash and splash and feel so strong.\n\nAnd that's okay. Feelings are never wrong.", illustration: '🌊' },
      { text: "When I feel ANGRY, my body gets hot like a volcano. 🌋\n\nI might want to yell or stomp my feet.\n\nBut I can take a deep breath... in... and out... \n\nAnd the volcano cools down, little by little.", illustration: '🌋' },
      { text: "When I feel SAD, it's like rain clouds in my heart. 🌧️\n\nI might want to cry, and that's perfectly fine.\n\nCrying is like the rain — it helps things grow.\n\nAfter the rain, the sun comes back again. 🌤️", illustration: '🌧️' },
      { text: "When I feel WORRIED, my tummy feels like butterflies. 🦋\n\nI can tell someone I trust how I feel.\n\nI can hug my favorite stuffed animal.\n\nI can count to five: 1... 2... 3... 4... 5...\n\nThe butterflies settle down.", illustration: '🦋' },
      { text: "ALL of my feelings are important. Every single one. 💝\n\nHappy, sad, angry, scared, excited, worried...\n\nThey are all part of ME.\n\nAnd I am wonderful, just as I am. ⭐", illustration: '💝' },
    ],
  },
  {
    id: 'new-routine',
    title: 'A New Day, A New Routine',
    emoji: '🌅',
    category: 'Routines',
    categoryColor: 'from-amber-400 to-orange-400',
    description: 'A predictable morning routine story to help with transitions and changes.',
    pages: [
      { text: "Every morning, the sun says hello! ☀️\n\nIt rises up, slow and gentle, painting the sky orange and pink.\n\nAnd just like the sun, I start my day — one step at a time.", illustration: '☀️' },
      { text: "Step 1: I wake up and stretch like a big cat! 🐱\n\nI stretch my arms up high... and wiggle my toes.\n\nGood morning, body! Thank you for a new day.", illustration: '🐱' },
      { text: "Step 2: I brush my teeth — scrub, scrub, scrub! 🪥\n\nUp and down, round and round.\n\nMy teeth are sparkly clean! ✨", illustration: '🪥' },
      { text: "Step 3: I get dressed! 👕\n\nSometimes I choose my own clothes.\n\nSometimes someone helps me, and that's okay too.\n\nOne piece at a time. I can do this!", illustration: '👕' },
      { text: "Step 4: Breakfast time! 🥣\n\nI sit in my special spot.\n\nI eat my food, one bite at a time.\n\nMy tummy says thank you!", illustration: '🥣' },
      { text: "Now I'm ready for my day! 🎒\n\nI know what comes next, and that feels good.\n\nEven if something changes, I can handle it.\n\nBecause I am brave and I follow my steps! 🌟", illustration: '🎒' },
    ],
  },
  {
    id: 'making-friends',
    title: 'How to Be a Friend',
    emoji: '🤝',
    category: 'Social Skills',
    categoryColor: 'from-green-400 to-emerald-400',
    description: 'Learn about friendship skills like sharing, listening, and being kind.',
    pages: [
      { text: "Being a friend is like planting a garden. 🌱\n\nIt takes time, care, and kindness.\n\nBut the flowers that grow are SO beautiful! 🌸", illustration: '🌱' },
      { text: "A good friend LISTENS. 👂\n\nWhen someone talks to me, I look at them.\n\nI wait for them to finish.\n\nThen I can share my thoughts too.\n\nListening says: 'I care about you!'", illustration: '👂' },
      { text: "A good friend SHARES. 🎁\n\nSharing can feel hard sometimes.\n\nBut when I share, my friend smiles.\n\nAnd that smile makes ME smile too!\n\nWe take turns, and everyone has fun.", illustration: '🎁' },
      { text: "A good friend is KIND. 💙\n\nIf someone falls, I help them up.\n\nIf someone is sad, I ask 'Are you okay?'\n\nKind words are like warm hugs for the heart.", illustration: '💙' },
      { text: "Sometimes friends disagree. And that's OKAY! 🤔\n\nI can say: 'I feel different about this.'\n\nWe don't have to agree on everything.\n\nWe just need to be respectful.\n\nDifferent is wonderful! 🌈", illustration: '🤔' },
      { text: "I am a GREAT friend! 🌟\n\nI listen. I share. I am kind.\n\nI don't have to be perfect.\n\nI just have to try my best.\n\nAnd that is MORE than enough. 💕", illustration: '🌟' },
    ],
  },
  {
    id: 'sensory-overload',
    title: 'When the World Gets Too Loud',
    emoji: '🔇',
    category: 'Sensory',
    categoryColor: 'from-purple-400 to-violet-400',
    description: 'Understanding and managing sensory overload with coping strategies.',
    pages: [
      { text: "Sometimes the world feels too MUCH. 😣\n\nToo loud. Too bright. Too busy.\n\nLike everything is turned up to maximum!\n\nAnd that's okay. My brain works in its own special way.", illustration: '😣' },
      { text: "Loud noises might hurt my ears. 🔊\n\nBright lights might bother my eyes. 💡\n\nToo many people might feel overwhelming. 👥\n\nThese feelings are REAL and they are VALID.", illustration: '🔊' },
      { text: "When it's too much, I have my toolkit: 🧰\n\n🎧 I can put on my headphones\n🕶️ I can wear my sunglasses\n🧸 I can squeeze my squishy toy\n🏃 I can go to a quiet spot", illustration: '🧰' },
      { text: "I can tell someone I trust: 🗣️\n\n'I need a break.'\n'It's too loud for me.'\n'Can we go somewhere quiet?'\n\nAsking for help is BRAVE, not weak!", illustration: '🗣️' },
      { text: "After my break, I feel better. 😌\n\nThe world slows down.\n\nMy body relaxes.\n\nI take a deep breath...\n\nAnd I know that I am STRONG. 💪✨", illustration: '😌' },
    ],
  },
];

const TherapyStories: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<TherapyStory | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  if (selectedStory) {
    const page = selectedStory.pages[currentPage];
    const progress = ((currentPage + 1) / selectedStory.pages.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <ParticleBackground theme="sanctuary" particleCount={40} className="fixed inset-0 pointer-events-none opacity-30" />
        <Navigation />
        <div className="pt-28 pb-20 relative z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back & Progress */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                onClick={() => { setSelectedStory(null); setCurrentPage(0); }}
                className="font-kiddo text-lg hover:bg-white/50 dark:hover:bg-slate-900/50"
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> All Stories
              </Button>
              <Badge variant="secondary" className="font-kiddo text-sm px-4 py-1">
                Page {currentPage + 1} of {selectedStory.pages.length}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full h-3 mb-8 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`h-full bg-gradient-to-r ${selectedStory.categoryColor} rounded-full`}
              />
            </div>

            {/* Story Content */}
            <GlassmorphicCard variant="light" className="border-border rounded-3xl p-0 overflow-hidden shadow-2xl shadow-indigo-900/5">
              <div className="p-8 md:p-14">
                <div className="text-center mb-10">
                  <motion.span 
                    key={currentPage}
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="inline-block text-8xl md:text-9xl drop-shadow-md"
                  >
                    {page.illustration}
                  </motion.span>
                </div>
                <div className="prose prose-xl md:prose-2xl dark:prose-invert max-w-none text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {page.text.split('\n').map((line, i) => (
                        <p key={i} className="leading-loose font-story text-slate-800 dark:text-slate-200 mb-6">
                          {line}
                        </p>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 0}
                className="rounded-xl font-story"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <div className="flex gap-1.5">
                {selectedStory.pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentPage ? `bg-gradient-to-r ${selectedStory.categoryColor} scale-125` : 'bg-muted/50'}`}
                  />
                ))}
              </div>
              <Button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === selectedStory.pages.length - 1}
                className={`rounded-xl font-story bg-gradient-to-r ${selectedStory.categoryColor} text-white`}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <ParticleBackground theme="sanctuary" particleCount={50} className="fixed inset-0 pointer-events-none opacity-30" />
      <Navigation />
      <div className="pt-28 pb-24 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-rose-500/20 shadow-sm mb-6">
              <Brain className="h-5 w-5 text-rose-500 animate-pulse" />
              <span className="text-sm font-kiddo tracking-wide text-rose-700 dark:text-rose-300">Social Stories</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-kiddo mb-6 bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent drop-shadow-sm">
              Therapy Stories 💜
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-story leading-relaxed">
              Stories that help you understand your feelings, practice social skills, and feel proud of who you are.
            </p>
          </motion.div>

          {/* Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {therapyStories.map((story, index) => (
              <ScrollReveal key={story.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlassmorphicCard
                    variant="light"
                    className="border-rose-500/20 p-0 overflow-hidden cursor-pointer group shadow-xl shadow-rose-900/5 h-full"
                    onClick={() => setSelectedStory(story)}
                  >
                    <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${story.categoryColor} flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        <span className="drop-shadow-sm">{story.emoji}</span>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <Badge
                          variant="secondary"
                          className={`mb-3 text-xs font-kiddo uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-none`}
                        >
                          {story.category}
                        </Badge>
                        <h3 className="text-2xl font-kiddo mb-3 text-slate-800 dark:text-slate-100 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">{story.title}</h3>
                        <p className="text-base text-slate-600 dark:text-slate-400 font-story leading-relaxed mb-4">{story.description}</p>
                        <p className="text-sm font-kiddo text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-800/50 inline-block px-4 py-1.5 rounded-full">
                          📄 {story.pages.length} pages
                        </p>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyStories;
