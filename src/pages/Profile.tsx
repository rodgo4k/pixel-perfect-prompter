import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";

const TABS = ["Informações", "Seguidores (0)", "Seguindo (0)", "Estatísticas"];

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      setDisplayName(user.user_metadata?.display_name || user.email?.split("@")[0] || "Usuário");
      supabase
        .from("profiles")
        .select("avatar_url, banner_url, display_name")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
          if (data?.banner_url) setBannerUrl(data.banner_url);
          if (data?.display_name) setDisplayName(data.display_name);
        });
    }
  }, [user, loading, navigate]);

  const uploadImage = async (file: File, type: "avatar" | "banner") => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${type}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(path);

      const url = urlData.publicUrl;
      const updateField = type === "avatar" ? { avatar_url: url } : { banner_url: url };
      
      await supabase
        .from("profiles")
        .update(updateField)
        .eq("user_id", user.id);

      if (type === "avatar") setAvatarUrl(url);
      else setBannerUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file, type);
    e.target.value = "";
  };

  if (loading) return <div className="min-h-screen bg-background" />;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center justify-center gap-2 w-64 py-3 rounded-lg bg-foreground/10 text-foreground text-sm font-semibold hover:shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-all"
          >
            <User className="w-4 h-4" />
            Login
          </button>
          <button className="flex items-center justify-center gap-2 w-64 py-3 rounded-lg bg-[hsl(235,86%,65%)] text-white text-sm font-semibold hover:bg-[hsl(235,86%,55%)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner */}
      <div className="relative w-full h-[280px] overflow-hidden group">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Banner"
            className="w-full h-full object-cover filter blur-[2px]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-muted to-secondary" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Banner edit button */}
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          disabled={uploading}
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "banner")}
        />

        {/* Avatar overlapping banner */}
        <div className="absolute -bottom-14 left-8 md:left-16">
          <div className="relative group/avatar">
            <Avatar className="w-[130px] h-[130px] border-4 border-background shadow-xl">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity"
              disabled={uploading}
            >
              <Camera className="w-6 h-6" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "avatar")}
            />
          </div>
        </div>

        {/* Display name next to avatar */}
        <div className="absolute bottom-4 left-[180px] md:left-[200px]">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider drop-shadow-lg">
            {displayName}
          </h1>
        </div>
      </div>

      {/* Spacer for avatar overflow */}
      <div className="h-8" />

      {/* Red accent line */}
      <div className="w-full h-[2px] bg-destructive" />

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-6 border-b border-border">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`py-3 text-sm font-medium transition-colors relative ${
                activeTab === i
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-destructive" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="py-8 min-h-[300px]">
          {activeTab === 0 && (
            <p className="text-muted-foreground text-sm">Nenhuma informação disponível.</p>
          )}
          {activeTab === 1 && (
            <p className="text-muted-foreground text-sm">Nenhum seguidor ainda.</p>
          )}
          {activeTab === 2 && (
            <p className="text-muted-foreground text-sm">Não está seguindo ninguém.</p>
          )}
          {activeTab === 3 && (
            <p className="text-muted-foreground text-sm">Nenhuma estatística disponível.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
