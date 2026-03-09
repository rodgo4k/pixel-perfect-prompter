import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Users, Star } from "lucide-react";
import Header from "@/components/Header";
import { getMangaBySlug } from "@/data/mangas";

const MangaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const manga = getMangaBySlug(slug || "");

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="bg-surface-dark">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={manga.cover}
              alt={manga.title}
              className="w-48 h-72 object-cover rounded-xl shadow-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold text-foreground mb-2">{manga.title}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {manga.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-secondary-foreground opacity-80 mb-6">
                {manga.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InfoItem icon={Users} label="Autor" value={manga.author} />
                <InfoItem icon={Star} label="Artista" value={manga.artist} />
                <InfoItem icon={BookOpen} label="Status" value={manga.status} />
                <InfoItem icon={Clock} label="Demográfico" value={manga.demographic} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Capítulos ({manga.chapters.length})
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          {manga.chapters.map((ch, i) => (
            <div
              key={ch.number}
              className={`flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Cap. {ch.number}
                  {ch.title && (
                    <span className="text-muted-foreground font-normal"> — {ch.title}</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" />
                  {ch.group}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {ch.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </p>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

export default MangaDetail;
