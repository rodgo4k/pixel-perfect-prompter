import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";
import Header from "./Header";

const featuredSlugs = ["vagabond", "night-flower", "reino-sombrio"];
const featuredMangas = featuredSlugs.map((s) => mangas.find((m) => m.slug === s)!);

const HeroBanner = () => {
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

  const prev = () => goTo((current - 1 + featuredMangas.length) % featuredMangas.length);
  const next = () => goTo((current + 1) % featuredMangas.length);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % featuredMangas.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const manga = featuredMangas[current];

  return (
    <div className="relative overflow-hidden">
      {/* Background cover image with blur */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={manga.cover}
          alt=""
          className="w-full h-full object-cover scale-110 blur-xl"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <Header />

      <Link
        to={`/manga/${manga.slug}`}
        className={`relative flex items-start gap-6 p-6 max-w-6xl mx-auto transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="w-36 h-52 object-cover rounded-lg shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0 pt-2">
          <h1 className="text-3xl font-extrabold text-foreground mb-3">{manga.title}</h1>
          <p className="text-sm leading-relaxed text-secondary-foreground opacity-80">
            {manga.description}
          </p>
        </div>
      </Link>
      <div className="relative flex items-center justify-between px-6 pb-4 max-w-6xl mx-auto">
        <div className="flex gap-1.5">
          {featuredMangas.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
