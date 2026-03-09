import { ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";

const trendingManga = mangas.find((m) => m.slug === "yokai-tales")!;

const TrendingSection = () => {
  return (
    <div className="w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Em alta</h2>
        <div className="flex items-center gap-1">
          <button className="text-primary hover:text-primary/80 transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button className="text-primary hover:text-primary/80 transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Link to={`/manga/${trendingManga.slug}`} className="block rounded-lg overflow-hidden group">
        <img
          src={trendingManga.cover}
          alt="Manga em alta"
          className="w-full h-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
    </div>
  );
};

export default TrendingSection;
