import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, Users, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import { getMangaBySlug } from "@/data/mangas";
import { supabase } from "@/integrations/supabase/client";
import MangaComments from "@/components/MangaComments";

const CHAPTERS_PER_PAGE = 30;

const MangaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const manga = getMangaBySlug(slug || "");
  const [volumeOpen, setVolumeOpen] = useState(true);
  const [chaptersCollapsed, setChaptersCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dbMangaId, setDbMangaId] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("mangas")
      .select("id")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        if (data) setDbMangaId(data.id);
      });
  }, [slug]);

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-xl text-muted-foreground">Mangá não encontrado.</p>
          <Link to="/" className="text-foreground hover:underline mt-4 inline-block">
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
          <div className="absolute inset-0 bg-background/60" />
        </div>

        <div className="h-12" />

        <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            {/* Cover - taller like reference */}
            <div className="relative flex-shrink-0 self-start">
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-[200px] sm:w-[220px] h-[300px] sm:h-[340px] object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-0 sm:pt-1">
              <h1 className="text-3xl sm:text-[40px] font-bold text-foreground mb-4 leading-tight">
                {manga.title}
              </h1>

              <button className="mb-5 px-5 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors">
                Adicionar à biblioteca
              </button>

              <p className="text-sm leading-relaxed text-foreground/80 mb-6 max-w-[900px]">
                {manga.description}
              </p>

              {/* Info fields - bordered label style */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                <InfoField label="Autor" value={manga.author} />
                <InfoField label="Artista" value={manga.artist} />
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-2">
                <InfoField label="Status" value={manga.status} />
                <InfoField label="Tipo" value={manga.demographic} />
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-5">
                <InfoField label="Visualizações" value="0" />
              </div>

              {/* Genre tags - outlined pills */}
              <div className="flex flex-wrap gap-2">
                {manga.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-border text-foreground/90 hover:bg-secondary/50 transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="border-t border-border" />
      </div>

      {/* Chapters section */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-6">
        {/* Collapse toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setChaptersCollapsed((v) => !v)}
            className="px-4 py-1.5 text-xs font-medium rounded border border-border text-foreground hover:bg-secondary transition-colors"
          >
            {chaptersCollapsed ? "Expandir" : "Recolher"}
          </button>
        </div>

        {/* Volume accordion */}
        <div className="rounded-lg overflow-hidden">
          <button
            onClick={() => setVolumeOpen((v) => !v)}
            className="w-full flex items-center justify-between py-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-sm font-semibold text-foreground">Sem volume</span>
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
                  <div className="pt-4 pb-1">
                    <span className="text-xs font-bold text-foreground">
                      Capítulo {ch.number}
                    </span>
                  </div>
                  {/* Chapter row */}
                  <div className="flex items-start gap-3 py-2 hover:bg-secondary/30 transition-colors cursor-pointer border-t border-border/30">
                    {/* Tree line indicator */}
                    <div className="flex items-center gap-2 mt-0.5 text-muted-foreground flex-shrink-0">
                      <span className="text-xs opacity-50">└</span>
                    </div>

                    {/* Left border accent */}
                    <div className="w-0.5 self-stretch bg-destructive/60 rounded-full flex-shrink-0" />

                    {/* Chapter info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          Capítulo {ch.number} — {ch.title}
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
              defaultValue={CHAPTERS_PER_PAGE}
              className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground"
            >
              <option value={30}>30</option>
            </select>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 text-xs rounded flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? "bg-destructive text-destructive-foreground"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="px-2 py-0.5 text-foreground border border-border/60 rounded text-sm">
      {value}
    </span>
  </div>
);

export default MangaDetail;
