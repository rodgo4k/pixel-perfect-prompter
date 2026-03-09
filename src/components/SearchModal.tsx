import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mangas } from "@/data/mangas";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const results = query.trim()
    ? mangas.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()))
    : mangas;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const goToManga = useCallback(
    (index: number) => {
      if (results[index]) {
        onClose();
        navigate(`/manga/${results[index].slug}`);
      }
    },
    [results, onClose, navigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        goToManga(selectedIndex);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results.length, onClose, goToManga, selectedIndex]
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar mangá, autor, grupo..."
            className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-secondary rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado para "{query}"
            </p>
          ) : (
            results.map((manga, i) => (
              <button
                key={manga.slug}
                onClick={() => goToManga(i)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                  i === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-8 h-12 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{manga.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {manga.chapters.length} cap. · {manga.demographic}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-secondary rounded text-[10px]">↑↓</kbd> navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-secondary rounded text-[10px]">↵</kbd> abrir
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-secondary rounded text-[10px]">esc</kbd> fechar
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
