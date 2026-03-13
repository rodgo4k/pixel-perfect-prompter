import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, Users, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import { getMangaBySlug } from "@/data/mangas";

const TABS = ["Informações", "Capítulos", "Personagens", "Relações", "Covers", "Banners"];
const CHAPTERS_PER_PAGE = 30;

const MangaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const manga = getMangaBySlug(slug || "");
  const [activeTab, setActiveTab] = useState("Capítulos");
  const [volumeOpen, setVolumeOpen] = useState(true);
  const [chaptersCollapsed, setChaptersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-xl text-muted-foreground">Mangá não encontrado.</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(manga.chapters.length / CHAPTERS_PER_PAGE);
  const paginatedChapters = manga.chapters.slice(
    (currentPage - 1) * CHAPTERS_PER_PAGE,
    currentPage * CHAPTERS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with blurred background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={manga.cover}
            alt=""
            className="w-full h-full object-cover scale-110 blur-xl"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="h-12" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
            {/* Cover */}
            <div className="relative flex-shrink-0 self-start">
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-32 sm:w-44 h-48 sm:h-64 object-cover rounded-lg shadow-xl"
              />
              {/* Rating badge */}
              <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-primary text-primary-foreground">
                R16
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0 sm:pt-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-3">
                {manga.title}
              </h1>

              <button className="mb-4 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                Adicionar à biblioteca
              </button>

              <p className="text-xs sm:text-sm leading-relaxed text-secondary-foreground opacity-80 whitespace-pre-line">
                {manga.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === "Capítulos" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Collapse toggle */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setChaptersCollapsed((v) => !v)}
              className="px-3 py-1.5 text-xs font-medium rounded border border-border text-foreground hover:bg-secondary transition-colors"
            >
              {chaptersCollapsed ? "Expandir" : "Recolher"}
            </button>
          </div>

          {/* Volume accordion */}
          <div className="rounded-lg border border-border overflow-hidden bg-card">
            <button
              onClick={() => setVolumeOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">Volume 0</span>
              {volumeOpen ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {volumeOpen && !chaptersCollapsed && (
              <div>
                {paginatedChapters.map((ch) => (
                  <div key={ch.number}>
                    {/* Chapter header label */}
                    <div className="px-4 pt-4 pb-1">
                      <span className="text-xs font-semibold text-foreground">
                        Capítulo {ch.number}
                      </span>
                    </div>
                    {/* Chapter row */}
                    <div className="flex items-start gap-3 px-4 py-2 hover:bg-secondary/30 transition-colors cursor-pointer border-t border-border/50">
                      {/* Tree line indicator */}
                      <div className="flex items-center gap-2 mt-0.5 text-muted-foreground flex-shrink-0">
                        <span className="text-xs opacity-50">└</span>
                      </div>

                      {/* Chapter info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground">
                            Capítulo {ch.number}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Users className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{ch.group}</span>
                        </div>
                      </div>

                      {/* Right side: date + uploader */}
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ch.date}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          uploader
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-6">
              <select
                value={CHAPTERS_PER_PAGE}
                className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground"
                readOnly
              >
                <option value={30}>30</option>
              </select>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Informações" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Autor</p>
              <p className="text-sm font-medium text-foreground">{manga.author}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Artista</p>
              <p className="text-sm font-medium text-foreground">{manga.artist}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Status</p>
              <p className="text-sm font-medium text-foreground">{manga.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Demográfico</p>
              <p className="text-sm font-medium text-foreground">{manga.demographic}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {manga.genres.map((g) => (
              <span
                key={g}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {!["Capítulos", "Informações"].includes(activeTab) && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">Em breve.</p>
        </div>
      )}
    </div>
  );
};

export default MangaDetail;
