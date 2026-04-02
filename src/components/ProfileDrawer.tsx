import { X, User, Settings, BookOpen, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from("profiles")
        .select("avatar_url")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        });
    }
  }, [user]);

  if (!open) return null;

  const handleLogin = () => {
    onClose();
    navigate("/auth");
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="fixed top-0 right-0 w-[268px] h-[394px] bg-card border-l border-border shadow-2xl animate-slide-in-right flex flex-col rounded-bl-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {user ? "Menu" : "Bem-vindo"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {user ? (
          <>
            {/* User info */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <Avatar className="w-10 h-10">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : null}
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                  {(user.user_metadata?.display_name || user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.user_metadata?.display_name || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            {/* Authenticated menu */}
            <div className="flex-1 flex flex-col gap-1 p-3">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                <User className="w-[18px] h-[18px] text-muted-foreground" />
                Meu Perfil
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                <Settings className="w-[18px] h-[18px] text-muted-foreground" />
                Configurações
              </button>
              <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                <BookOpen className="w-[18px] h-[18px] text-muted-foreground" />
                Minhas Scans
              </button>

              {/* Theme toggle */}
              <div className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-foreground">
                {theme === "dark" ? (
                  <Moon className="w-[18px] h-[18px] text-muted-foreground" />
                ) : (
                  <Sun className="w-[18px] h-[18px] text-muted-foreground" />
                )}
                <span>Tema</span>
                <button
                  onClick={toggleTheme}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground hover:bg-secondary/80 transition-colors"
                >
                  {theme === "dark" ? "Escuro" : "Claro"}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-3 py-2.5 mt-auto text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Sair
              </button>
            </div>
          </>
        ) : (
          /* Guest menu */
          <div className="flex-1 flex flex-col gap-2 p-4 justify-center">
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <User className="w-4 h-4" />
              Login
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[hsl(235,86%,65%)] text-primary-foreground text-sm font-semibold hover:bg-[hsl(235,86%,55%)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDrawer;
