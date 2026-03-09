import { ChevronUp, ChevronDown } from "lucide-react";
import trendingManga from "@/assets/trending-manga.jpg";

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
      <div className="rounded-lg overflow-hidden">
        <img
          src={trendingManga}
          alt="Manga em alta"
          className="w-full h-auto object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default TrendingSection;
