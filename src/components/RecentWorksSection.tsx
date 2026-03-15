import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";

const recentSlugs = [
"height-difference",
"night-flower",
"the-bloody-merchant-empress",
"assassin-no-kyuujitsu",
"touhou-mamizou-san",
"yokai-tales",
"vagabond",
"reino-sombrio",
"height-difference",
"night-flower",
"the-bloody-merchant-empress",
"assassin-no-kyuujitsu",
"touhou-mamizou-san",
"yokai-tales",
"vagabond"];


const recentWorks = recentSlugs.map((s) => mangas.find((m) => m.slug === s)!);

const RecentWorksSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Obras recentes</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="text-primary hover:text-primary/80 transition-colors">
            
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="text-primary hover:text-primary/80 transition-colors">
            
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        
        {recentWorks.map((work, i) =>
        <Link
          key={`${work.slug}-${i}`}
          to={`/manga/${work.slug}`}
          className="flex-shrink-0 w-[calc((100%-7*1rem)/8)] min-w-[120px] group">
          
            <div className="overflow-hidden rounded-lg">
              <img
              src={work.cover}
              alt={work.title}
              width={160}
              height={224}
              loading="lazy"
              className="w-full aspect-[5/7] object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl" />
            
            </div>
            <p className="text-sm font-medium text-foreground mt-2 truncate group-hover:text-primary transition-colors">
              {work.title}
            </p>
          </Link>
        )}
      </div>
    </div>);

};

export default RecentWorksSection;