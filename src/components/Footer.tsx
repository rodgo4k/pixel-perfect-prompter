import { Cherry } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-between">
          {/* Left: Brand + Social */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Cherry className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Aura</span>
            </div>
            <div className="flex gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition-colors">
                
                <span className="font-bold">𝕏</span> Siga-nos no X
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition-colors">
                
                Discord
              </a>
            </div>
          </div>

          {/* Right: About */}
          <div className="max-w-md">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Sobre o Projeto
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-justify">
              A Aura Mangás nasceu com o objetivo de disponibilizar uma grande coleção de mangás em português, priorizando principalmente obras de origem japonesa. Nosso propósito é criar uma plataforma completa, interativa e duradoura, onde fãs possam explorar histórias incríveis enquanto ajudamos a fortalecer a comunidade e a cultura otaku no Brasil.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Aura Mangás. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>);

};

export default Footer;