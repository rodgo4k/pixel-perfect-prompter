import { useState, useEffect, useCallback } from "react";
import { Search, Command, User } from "lucide-react";
import SearchModal from "./SearchModal";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(false);
      requestAnimationFrame(() => setAnimating(true));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const opacity = Math.min(window.scrollY / 200, 1);
      setScrollOpacity(opacity);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-shadow duration-300"
        style={{
          backgroundColor: `hsl(var(--background) / ${scrollOpacity})`,
          boxShadow: scrollOpacity > 0.8 ? `0 1px 3px hsl(var(--foreground) / 0.05)` : "none",
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2z" fill="currentColor" />
            <path d="M6 16l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className="text-lg font-bold text-foreground animate__animated animate__rubberBand">Taiyō</span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-primary text-primary-foreground">
            Alpha
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-sm hover:bg-muted transition-colors"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="text-xs">K</span>
          </button>
          <button onClick={() => setProfileOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Header;
