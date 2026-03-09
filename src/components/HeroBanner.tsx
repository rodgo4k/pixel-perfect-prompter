import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import vagabondCover from "@/assets/vagabond-cover.jpg";
import mangaCover1 from "@/assets/manga-cover-1.jpg";
import mangaCover2 from "@/assets/manga-cover-2.jpg";

const featuredMangas = [
  {
    title: "Vagabond",
    cover: vagabondCover,
    description:
      "Aos dezessete anos de idade, Miyamoto Musashi – ainda conhecido por seu nome de infância, Shinmen Takezo – era um jovem bruto selvagem iniciando o caminho da espada. No rescaldo da épica Batalha de Sekigahara, Takezo se vê como um sobrevivente fugitivo do lado perdedor da guerra. A natureza cruel de Takezo fez dele um pária, mesmo em sua própria aldeia, e ele é caçado como um animal. Nesta encruzilhada crucial na vida de Takezo, um monge excêntrico e um amigo de infância são os únicos que podem ajudá-lo a encontrar seu caminho.",
  },
  {
    title: "Flor da Noite",
    cover: mangaCover1,
    description:
      "Em um Japão feudal mergulhado em conflitos, uma jovem guerreira busca vingança pela destruição de sua aldeia. Com habilidades únicas herdadas de seu mestre, ela percorre caminhos sombrios enfrentando inimigos poderosos enquanto descobre segredos sobre seu próprio passado e o verdadeiro significado da honra.",
  },
  {
    title: "Reino Sombrio",
    cover: mangaCover2,
    description:
      "Nas profundezas de um reino esquecido, criaturas ancestrais despertam após séculos de sono. Um grupo improvável de heróis — um espadachim cego, uma feiticeira exilada e um ladrão com coração de ouro — deve unir forças para impedir que a escuridão consuma o mundo dos vivos.",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 150);
    },
    [isTransitioning]
  );

  const prev = () => goTo((current - 1 + featuredMangas.length) % featuredMangas.length);
  const next = () => goTo((current + 1) % featuredMangas.length);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % featuredMangas.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const manga = featuredMangas[current];

  return (
    <div className="relative bg-surface-dark overflow-hidden">
      <div
        className={`flex items-start gap-6 p-6 max-w-6xl mx-auto transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={manga.cover}
          alt={manga.title}
          className="w-36 h-52 object-cover rounded-lg shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0 pt-2">
          <h1 className="text-3xl font-extrabold text-foreground mb-3">{manga.title}</h1>
          <p className="text-sm leading-relaxed text-secondary-foreground opacity-80">
            {manga.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 pb-4 max-w-6xl mx-auto">
        <div className="flex gap-1.5">
          {featuredMangas.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="text-primary hover:text-primary/80 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
