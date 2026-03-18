import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileDrawer from "./ProfileDrawer";
import SearchModal from "./SearchModal";

const Header = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
          boxShadow: scrollOpacity > 0.8 ? `0 1px 3px hsl(var(--foreground) / 0.05)` : "none"
        }}>
        
        <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2z" fill="currentColor" />
            <path d="M6 16l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span className={`text-lg font-bold text-foreground ${animating ? 'animate__animated animate__rubberBand' : ''}`}>​KuroCat   </span>
          <span className="px-2 py-0.5 text-[10px] uppercase rounded bg-primary text-primary-foreground font-extrabold">
            マンガ
          </span>
        </button>

        {/* Search Bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 flex-1 max-w-md mx-4 relative group">
          
          <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-primary/40 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity blur-[1px]" />
          <div className="relative flex items-center w-full rounded-full border border-border/40 bg-card/80 backdrop-blur-sm py-2.5 shadow-lg px-[16px] gap-[8px]">
            <span className="text-sm text-muted-foreground flex-1 text-left">Pesquisar... </span>
            <div className="relative flex-shrink-0">
              <Search className="text-muted-foreground w-[17px] h-[17px]" />
              
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button onClick={() => setProfileOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors px-[5px] py-[5px]">
            <User className="text-muted-foreground h-[24px] w-[24px]" />
          </button>
        </div>
      </header>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>);

};

export default Header;