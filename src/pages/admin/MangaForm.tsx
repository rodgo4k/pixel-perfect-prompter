import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";

const MangaForm = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "", slug: "", description: "", author: "", artist: "",
    status: "Em lançamento", demographic: "", genres: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const { data: manga } = useQuery({
    queryKey: ["admin-manga", id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from("mangas").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (manga) {
      setForm({
        title: manga.title, slug: manga.slug, description: manga.description || "",
        author: manga.author || "", artist: manga.artist || "",
        status: manga.status || "Em lançamento", demographic: manga.demographic || "",
        genres: manga.genres?.join(", ") || "",
      });
      if (manga.cover_url) setCoverPreview(manga.cover_url);
    }
  }, [manga]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: isNew ? generateSlug(title) : f.slug }));
  };

  const saveManga = useMutation({
    mutationFn: async () => {
      let cover_url = manga?.cover_url || null;

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${form.slug}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("manga-images").upload(path, coverFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("manga-images").getPublicUrl(path);
        cover_url = urlData.publicUrl;
      }

      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        author: form.author || null,
        artist: form.artist || null,
        status: form.status,
        demographic: form.demographic || null,
        genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
        cover_url,
      };

      if (isNew) {
        const { error } = await supabase.from("mangas").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("mangas").update(payload).eq("id", id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mangas"] });
      toast.success(isNew ? "Mangá criado!" : "Mangá atualizado!");
      navigate("/admin");
    },
    onError: (err: any) => {
      toast.error(err.message || "Erro ao salvar.");
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isNew ? "Novo Mangá" : "Editar Mangá"}
        </h1>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); saveManga.mutate(); }}
        className="space-y-4"
      >
        {/* Cover */}
        <div className="space-y-2">
          <Label>Capa</Label>
          <div className="flex items-end gap-4">
            {coverPreview && (
              <img src={coverPreview} alt="" className="w-24 h-36 rounded object-cover border border-border" />
            )}
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> Escolher imagem
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Sinopse</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input id="author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="artist">Artista</Label>
            <Input id="artist" value={form.artist} onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demographic">Demográfico</Label>
            <Input id="demographic" value={form.demographic} onChange={(e) => setForm((f) => ({ ...f, demographic: e.target.value }))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="genres">Gêneros (separados por vírgula)</Label>
          <Input id="genres" value={form.genres} onChange={(e) => setForm((f) => ({ ...f, genres: e.target.value }))} placeholder="Ação, Aventura, Drama" />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={saveManga.isPending} className="gap-2">
            <Save className="w-4 h-4" />
            {saveManga.isPending ? "Salvando..." : "Salvar"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MangaForm;
