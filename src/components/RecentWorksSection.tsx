import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";

const recentSlugs = ["height-difference", "night-flower", "the-bloody-merchant-empress", "assassin-no-kyuujitsu", "touhou-mamizou-san", "yokai-tales"];
const recentWorks = recentSlugs.map((s) => mangas.find((m) => m.slug === s)!);

const RecentWorksSection = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Obras recentes</h2>
        <div className="flex items-center gap-2">
          <button className="text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="text-primary hover:text-primary/80 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {recentWorks.map((work) => (
          <Link key={work.slug} to={`/manga/${work.slug}`} className="flex-shrink-0 w-40 group">
            <div className="overflow-hidden rounded-lg">
              <img
                src={work.cover}
                alt={work.title}
                className="w-40 h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-medium text-foreground mt-2 truncate group-hover:text-primary transition-colors">
              {work.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentWorksSection;
