import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Award,
  BookOpen,
  Music,
  Mic,
  Gamepad2,
  User,
  Palette,
  Heart,
  Sparkles,
  BookHeart,
  Wand2,
  Brain,
  Shield,
  Map,
  Trophy,
  Flower2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/kiddoverse-logo.png';
import { useAuth } from '@/context/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { useModeratorRole } from '@/hooks/useModeratorRole';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavSection {
  title: string;
  items: { icon: React.ElementType; label: string; path: string }[];
}

const navSections: NavSection[] = [
  {
    title: 'Home',
    items: [
      { icon: LayoutDashboard, label: 'My Space', path: '/dashboard' },
    ],
  },
  {
    title: 'Learn & Play',
    items: [
      { icon: Music, label: 'Nursery Rhymes', path: '/rhymes' },
      { icon: BookOpen, label: 'Story Time', path: '/stories' },
      { icon: Mic, label: 'Sing-Along', path: '/sing-along' },
      { icon: Gamepad2, label: 'Word Games', path: '/word-games' },
    ],
  },
  {
    title: 'StoryWeaver AI',
    items: [
      { icon: Wand2, label: 'StoryWeaver', path: '/storyweaver' },
      { icon: Sparkles, label: 'Wonder Mode', path: '/wonder' },
      { icon: Shield, label: 'Sanctuary Mode', path: '/sanctuary' },
      { icon: Brain, label: 'Reflections', path: '/reflections' },
    ],
  },
  {
    title: 'AI Studio',
    items: [
      { icon: Palette, label: 'AI Art Studio', path: '/image-studio' },
    ],
  },
  {
    title: 'Community',
    items: [
      { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
      { icon: Award, label: 'Achievements', path: '/achievements' },
      { icon: Map, label: 'Roadmap', path: '/roadmap' },
    ],
  },
];

export const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { isAdmin } = useAdminRole();
  const { isModerator } = useModeratorRole();
  const [collapsed, setCollapsed] = useState(false);

  const moderatorItems = isModerator ? [
    { icon: Award, label: 'Mod: Dashboard', path: '/moderator' },
  ] : [];

  const adminItems = isAdmin ? [
    { icon: Settings, label: 'Admin: Roles', path: '/admin/roles' },
  ] : [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link to="/" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <img src={logo} alt="KiddoVerse" className="h-8 w-8 flex-shrink-0 rounded-lg" />
          {!collapsed && (
            <span className="text-xl font-kiddo font-bold text-primary">KiddoVerse</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "absolute -right-3 top-6 bg-card border border-border rounded-full")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className={cn(sIdx > 0 && "mt-3")}>
            {/* Section header */}
            {!collapsed && (
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold font-story">
                {section.title}
              </div>
            )}
            {collapsed && sIdx > 0 && (
              <div className="mx-2 my-2 border-t border-border/40" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                    {!collapsed && <span className="text-sm font-medium font-story">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Moderator & Admin items */}
        {[...moderatorItems, ...adminItems].length > 0 && (
          <div className="mt-3">
            {!collapsed && (
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold font-story">
                Admin
              </div>
            )}
            {collapsed && <div className="mx-2 my-2 border-t border-border/40" />}
            <div className="space-y-0.5">
              {[...moderatorItems, ...adminItems].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                    {!collapsed && <span className="text-sm font-medium font-story">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-2 border-t border-border space-y-1">
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
            location.pathname === '/profile'
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium font-story">Profile</span>}
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
            location.pathname === '/settings'
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium font-story">Settings</span>}
        </Link>

        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium font-story">Sign Out</span>}
        </button>

        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate font-story">
            {user.email}
          </div>
        )}
      </div>
    </aside>
  );
};
