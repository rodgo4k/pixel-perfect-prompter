import { useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";

const trendingSlugs = ["yokai-tales", "vagabond", "reino-sombrio", "assassin-no-kyuujitsu"];
const trendingMangas = trendingSlugs.map((s) => mangas.find((m) => m.slug === s)!);

const TrendingSection = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 150);
    },
    [isTransitioning]
  );

  const prev = () => goTo((current - 1 + trendingMangas.length) % trendingMangas.length);
  const next = () => goTo((current + 1) % trendingMangas.length);

  const manga = trendingMangas[current];

  return (
    <div className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Em alta</h2>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button onClick={next} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Link
        to={`/manga/${manga.slug}`}
        className={`block rounded-lg overflow-hidden group transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="w-full h-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        <p className="text-sm font-medium text-foreground mt-2 group-hover:text-primary transition-colors">
          {manga.title}
        </p>
      </Link>
      <div className="flex justify-center gap-1.5 mt-3">
        {trendingMangas.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
