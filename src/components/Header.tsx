import { Search, Command, User } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-surface-dark">
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2z" fill="currentColor" />
          <path d="M6 16l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-lg font-bold text-foreground">Taiyō</span>
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-primary text-primary-foreground">
          Alpha
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-muted-foreground text-sm hover:bg-muted transition-colors">
          <Command className="w-3.5 h-3.5" />
          <span className="text-xs">K</span>
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
