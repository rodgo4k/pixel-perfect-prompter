import { ChevronLeft, ChevronRight } from "lucide-react";
import vagabondCover from "@/assets/vagabond-cover.jpg";

const HeroBanner = () => {
  return (
    <div className="relative bg-surface-dark overflow-hidden">
      <div className="flex items-start gap-6 p-6 max-w-6xl mx-auto">
        <img
          src={vagabondCover}
          alt="Vagabond"
          className="w-36 h-52 object-cover rounded-lg shadow-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0 pt-2">
          <h1 className="text-3xl font-extrabold text-foreground mb-3">Vagabond</h1>
          <p className="text-sm leading-relaxed text-secondary-foreground opacity-80">
            Aos dezessete anos de idade, Miyamoto Musashi – ainda conhecido por seu nome de infância, Shinmen Takezo – era um jovem bruto selvagem iniciando o caminho da espada. No rescaldo da épica Batalha de Sekigahara, Takezo se vê como um sobrevivente fugitivo do lado perdedor da guerra. A natureza cruel de Takezo fez dele um pária, mesmo em sua própria aldeia, e ele é caçado como um animal. Nesta encruzilhada crucial na vida de Takezo, um monge excêntrico e um amigo de infância são os únicos que podem ajudá-lo a encontrar seu caminho.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 px-6 pb-4 max-w-6xl mx-auto">
        <button className="text-primary hover:text-primary/80 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="text-primary hover:text-primary/80 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
