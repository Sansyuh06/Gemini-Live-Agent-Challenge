import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Sparkles, Heart, Palette, Brain } from "lucide-react";
import logo from "@/assets/kiddoverse-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { learningPaths } from "@/data/learningPathsData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/dashboard", label: "My Space" },
    { to: "/rhymes", label: "Rhymes" },
    { to: "/stories", label: "Stories" },
  ];

  const newFeatureLinks = [
    { to: "/image-studio", label: "✨ AI Studio", icon: Sparkles },
    { to: "/calm-zone", label: "🧘 Calm Zone", icon: Heart },
    { to: "/therapy-stories", label: "📖 Stories+", icon: Brain },
    { to: "/sensory-play", label: "🎨 Sensory", icon: Palette },
  ];

  const handleMobileNavClick = (to: string) => {
    navigate(to);
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm py-2" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-kiddo-coral via-kiddo-sky to-kiddo-mint origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="KiddoVerse" className="h-10 w-10 rounded-xl" />
          <h1 className="text-xl md:text-2xl font-kiddo font-bold text-primary">
            KiddoVerse
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-story font-semibold transition-colors text-sm ${location.pathname === link.to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* New Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 font-story font-semibold transition-colors text-sm ${
              ['/image-studio', '/calm-zone', '/therapy-stories', '/sensory-play'].includes(location.pathname)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              Explore
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-popover" align="start">
              {newFeatureLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link to={link.to} className="cursor-pointer">
                    <link.icon className="mr-2 h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Learning Path Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`flex items-center gap-1 font-story font-semibold transition-colors text-sm ${location.pathname.startsWith('/path/')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
              }`}>
              Learning Path
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover" align="start">
              {learningPaths.map((path) => (
                <DropdownMenuItem key={path.slug} asChild>
                  <Link to={`/path/${path.slug}`} className="cursor-pointer">
                    <path.icon className="mr-2 h-4 w-4" />
                    <span>Lv.{path.level} — {path.title}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {/* CTA Button */}
          <Link to="/image-studio" className="hidden sm:block">
            <Button className="text-sm font-story rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white">
              <Sparkles className="h-4 w-4 mr-1" />
              Create AI Art
            </Button>
          </Link>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-border">
              <SheetHeader className="border-b border-border pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <img src={logo} alt="KiddoVerse" className="h-6 w-6 rounded-lg" />
                  <span className="font-kiddo text-primary">KiddoVerse</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => handleMobileNavClick(link.to)}
                    className={`flex items-center px-3 py-3 rounded-lg text-left transition-colors font-story ${location.pathname === link.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => handleMobileNavClick('/sing-along')}
                  className={`flex items-center px-3 py-3 rounded-lg text-left transition-colors font-story ${location.pathname === '/sing-along'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  🎵 Sing-Along
                </button>
                <button
                  onClick={() => handleMobileNavClick('/word-games')}
                  className={`flex items-center px-3 py-3 rounded-lg text-left transition-colors font-story ${location.pathname === '/word-games'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                    }`}
                >
                  🎮 Word Games
                </button>

                {/* New Features Section */}
                <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore ✨</p>
                {newFeatureLinks.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => handleMobileNavClick(link.to)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors font-story ${location.pathname === link.to
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </button>
                ))}

                <p className="px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Learning Path</p>
                {learningPaths.map((path) => (
                  <button
                    key={path.slug}
                    onClick={() => handleMobileNavClick(`/path/${path.slug}`)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-colors font-story ${location.pathname === `/path/${path.slug}`
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    <path.icon className="h-4 w-4" />
                    Lv.{path.level} — {path.title}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};
