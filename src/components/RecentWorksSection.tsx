import { ChevronLeft, ChevronRight } from "lucide-react";
import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import mangaCover5 from "@/assets/manga-cover-5.jpg";
import mangaCover6 from "@/assets/manga-cover-6.jpg";

const recentWorks = [
  { cover: mangaCover1, title: "Height Difference" },
  { cover: mangaCover2, title: "Night Flower" },
  { cover: mangaCover4, title: "The Bloody Merchant Empress" },
  { cover: mangaCover3, title: "Assassin no Kyuujitsu" },
  { cover: mangaCover5, title: "Touhou - Mamizou-san" },
  { cover: mangaCover6, title: "Yokai Tales" },
];

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
        {recentWorks.map((work, i) => (
          <div key={i} className="flex-shrink-0 w-40 cursor-pointer group">
            <div className="overflow-hidden rounded-lg">
              <img
                src={work.cover}
                alt={work.title}
                className="w-40 h-56 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentWorksSection;
