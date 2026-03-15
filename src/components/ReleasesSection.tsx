import { Clock, Users } from "lucide-react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Link } from "react-router-dom";
import { mangas } from "@/data/mangas";

interface Release {
  title: string;
  chapter: string;
  group: string;
  time: string;
  demographic: string;
  slug: string;
}

const releases: Release[] = [
{ title: "Touhou - Mamizou-san no shippo wo...", chapter: "Capítulo 0", group: "Touhou Scans Brasil", time: "há 1 mês", demographic: "Ju", slug: "touhou-mamizou-san" },
{ title: "Night Flower", chapter: "Capítulo 0", group: "Mai_Yes_Vintage_Manga", time: "há 1 mês", demographic: "Ju", slug: "night-flower" },
{ title: "Height Difference", chapter: "Capítulo 0", group: "Manga Desu", time: "há 1 mês", demographic: "Ju", slug: "height-difference" },
{ title: "Assassin no Kyuujitsu", chapter: "Capítulo 3 — Frango", group: "Double Scan", time: "há 1 mês", demographic: "Ju", slug: "assassin-no-kyuujitsu" },
{ title: "Assassin no Kyuujitsu", chapter: "Capítulo 2 — Cão", group: "Double Scan", time: "há 1 mês", demographic: "Ju", slug: "assassin-no-kyuujitsu" },
{ title: "Assassin no Kyuujitsu", chapter: "Capítulo 1 — Sorvete", group: "Double Scan", time: "há 1 mês", demographic: "Ju", slug: "assassin-no-kyuujitsu" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 11 — Irmãs", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 10 — Bullying", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 9 — Zhu Yao", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 8 — Tratamento", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 7 — Pavilhão de Ling", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 6 — O Assassino", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 5", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 4 — Paciência", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 3 — Reunião", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "The Bloody Merchant Empress and the Cold...", chapter: "Capítulo 2 — Renascimento", group: "Cervo Scanlator", time: "há 1 mês", demographic: "Ju", slug: "the-bloody-merchant-empress" },
{ title: "Reino Sombrio", chapter: "Capítulo 12", group: "Kingdom Scans", time: "há 1 mês", demographic: "Sh", slug: "reino-sombrio" },
{ title: "Reino Sombrio", chapter: "Capítulo 11", group: "Kingdom Scans", time: "há 1 mês", demographic: "Sh", slug: "reino-sombrio" },
{ title: "Reino Sombrio", chapter: "Capítulo 10", group: "Kingdom Scans", time: "há 1 mês", demographic: "Sh", slug: "reino-sombrio" },
{ title: "Reino Sombrio", chapter: "Capítulo 9", group: "Kingdom Scans", time: "há 1 mês", demographic: "Sh", slug: "reino-sombrio" },
{ title: "Yokai Tales", chapter: "Capítulo 5 — Kitsune", group: "Yokai Scans", time: "há 2 semanas", demographic: "Sh", slug: "yokai-tales" },
{ title: "Yokai Tales", chapter: "Capítulo 4 — Tanuki", group: "Yokai Scans", time: "há 3 semanas", demographic: "Sh", slug: "yokai-tales" },
{ title: "Yokai Tales", chapter: "Capítulo 3 — Kappa", group: "Yokai Scans", time: "há 1 mês", demographic: "Sh", slug: "yokai-tales" }];


const getCover = (slug: string) => mangas.find((m) => m.slug === slug)?.cover || "";

const ReleaseItem = ({ release }: {release: Release;}) =>
<Link
  to={`/manga/${release.slug}`}
  className="flex items-center gap-3 py-2.5 rounded-lg transition-colors bg-neutral-950 my-[10px] mx-[10px] px-0">
  
    <img
    src={getCover(release.slug)}
    alt={release.title}
    width={40}
    height={56}
    loading="lazy"
    className="w-10 h-14 object-cover rounded flex-shrink-0" />
  
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
  </Link>;


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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
        {releases.map((release, i) =>
        <ReleaseItem key={i} release={release} />
        )}
      </div>
    </div>);

};

export default ReleasesSection;