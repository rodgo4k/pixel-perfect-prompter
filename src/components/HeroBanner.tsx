import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";


const featuredSlugs = ["vagabond", "night-flower", "reino-sombrio"];
const featuredMangas = featuredSlugs.map((s) => mangas.find((m) => m.slug === s)!);

const MOBILE_CHAR_LIMIT = 80;

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setExpanded(false);
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
  const needsTruncation = manga.description.length > MOBILE_CHAR_LIMIT;
  const truncatedDesc = needsTruncation ?
  manga.description.slice(0, MOBILE_CHAR_LIMIT).trimEnd() + "…" :
  manga.description;

  return (
    <div className="relative overflow-hidden">
      {/* Background cover image with blur */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"}`
        }>
        
        <img
          src={manga.cover}
          alt=""
          width={503}
          height={700}
          fetchPriority="high"
          className="w-full h-full object-cover scale-110 blur-xl" />
        
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Spacer for fixed header */}
      <div className="h-12" />

      <div
        className={`relative flex items-start gap-4 sm:gap-6 p-4 sm:p-6 mx-auto transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"}`}
        style={{ maxWidth: 1912, minHeight: 350 }}>
        
        <Link to={`/manga/${manga.slug}`} className="flex-shrink-0">
          <img
            src={manga.cover}
            alt={manga.title}
            width={144}
            height={208}
            fetchPriority="high"
            className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-lg shadow-lg" />
          
        </Link>
        <div className="flex-1 min-w-0 pt-1 sm:pt-2">
          <Link to={`/manga/${manga.slug}`}>
            <h1 className="text-xl sm:text-3xl font-extrabold text-foreground mb-2 sm:mb-3 hover:text-primary transition-colors">
              {manga.title}
            </h1>
          </Link>

          {/* Desktop: full text always visible */}
          <p className="hidden sm:block text-sm leading-relaxed text-secondary-foreground opacity-80">
            {manga.description}
          </p>

          {/* Mobile: truncated with "ver mais" */}
          <div className="sm:hidden">
            <p className="text-xs leading-relaxed text-secondary-foreground opacity-80">
              {expanded ? manga.description : truncatedDesc}
            </p>
            {needsTruncation &&
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs font-semibold text-primary mt-1 hover:text-primary/80 transition-colors">
              
                {expanded ? "ver menos" : "ver mais"}
              </button>
            }
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-between px-4 sm:px-6 pb-4 max-w-6xl mx-auto">
        <div />
        <div className="flex gap-2">
          <button onClick={prev} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>);

};

export default HeroBanner;