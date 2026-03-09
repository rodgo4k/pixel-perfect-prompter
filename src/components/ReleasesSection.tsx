import { Clock, Users } from "lucide-react";
import { LayoutGrid, LayoutList } from "lucide-react";
import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";
import mangaCover3 from "@/assets/manga-cover-3.jpg";
import mangaCover4 from "@/assets/manga-cover-4.jpg";
import mangaCover5 from "@/assets/manga-cover-5.jpg";
import mangaCover6 from "@/assets/manga-cover-6.jpg";

const covers = [mangaCover1, mangaCover2, mangaCover3, mangaCover4, mangaCover5, mangaCover6];

interface Release {
  title: string;
  chapter: string;
  group: string;
  time: string;
  demographic: string;
  coverIndex: number;
}

const releases: Release[] = [
  { title: "Touhou - Mamizou-san no shippo wo...", chapter: "Capítulo 0", group: "Touhou Scans Brasil", time: "há 1 mês", demographic: "Ju", coverIndex: 0 },
  { title: "Night Flower", chapter: "Capítulo 0", group: "Mai_Yes_Vintage_Manga", time: "há 1 mês", demographic: "Ju", coverIndex: 1 },
  { title: "Height Difference", chapter: "Capítulo 0", group: "Manga Desu", time: "há 1 mês", demographic: "Ju", coverIndex: 4 },
  { title: "Assassin no Kyuujitsu", chapter: "Capítulo 3 — Frango", group: "Double Scan", time: "há 1 mês", demographic: "Ju", coverIndex: 2 },
  { title: "Assassin no Kyuujitsu", chapter: "Capítulo 2 — Cão", group: "Double Scan", time: "há 1 mês", demographic: "Ju", coverIndex: 2 },
  { title: "Assassin no Kyuujitsu", chapter: "Capítulo 1 — Sorvete", group: "Double Scan", time: "há 1 mês", demographic: "Ju", coverIndex: 2 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 11 — Irmãs", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 10 — Bullying", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 9 — Zhu Yao", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 8 — Tratamento", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 7 — Pavilhão de Ling", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 6 — O Assassino", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 5", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 4 — Paciência", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 3 — Reunião", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
  { title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 2 — Renascimento", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", coverIndex: 3 },
];

const ReleaseItem = ({ release }: { release: Release }) => (
  <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer">
    <img
      src={covers[release.coverIndex]}
      alt={release.title}
      className="w-10 h-14 object-cover rounded flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{release.title}</p>
      <p className="text-xs font-semibold text-primary">{release.chapter}</p>
      <div className="flex items-center gap-3 mt-0.5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          {release.group}
        </span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        {release.time}
      </span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Users className="w-3 h-3" />
        {release.demographic}
      </span>
    </div>
  </div>
);

const ReleasesSection = () => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Lançamentos</h2>
        <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
          <button className="p-2 bg-primary text-primary-foreground">
            <LayoutList className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {releases.map((release, i) => (
          <ReleaseItem key={i} release={release} />
        ))}
      </div>
    </div>
  );
};

export default ReleasesSection;
