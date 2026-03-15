import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileDrawer from "./ProfileDrawer";

const Header = () => {
  const navigate = useNavigate();
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
          <span className={`text-lg font-bold text-foreground ${animating ? 'animate__animated animate__rubberBand' : ''}`}>​Aura   </span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-primary text-primary-foreground">
            Alpha
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setProfileOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>);

};

export default Header;
