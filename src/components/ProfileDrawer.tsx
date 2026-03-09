import { X, User, Settings, BookOpen, Heart, LogOut } from "lucide-react";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Meu perfil" },
  { icon: BookOpen, label: "Minha biblioteca" },
  { icon: Heart, label: "Favoritos" },
  { icon: Settings, label: "Configurações" },
];

const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-2xl animate-slide-in-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Perfil</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* User info */}
        <div className="flex flex-col items-center gap-3 py-8 px-4 border-b border-border">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">Visitante</p>
            <p className="text-xs text-muted-foreground">Faça login para salvar seu progresso</p>
          </div>
          <button className="mt-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            Entrar / Criar conta
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-secondary/50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
