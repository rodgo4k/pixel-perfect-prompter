import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Plus, Trash2, Edit, Eye, EyeOff, Search, Save, X, Upload, BookOpen, Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const ChapterManager = () => {
  const { id: mangaId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: manga } = useQuery({
    queryKey: ["admin-manga", mangaId],
    queryFn: async () => {
      const { data, error } = await supabase.from("mangas").select("*").eq("id", mangaId!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin-chapters", mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*, scan_groups(name, avatar_url)")
        .eq("manga_id", mangaId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: scanGroups } = useQuery({
    queryKey: ["scan-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scan_groups").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const deleteChapter = useMutation({
    mutationFn: async (chId: string) => {
      const { error } = await supabase.from("chapters").delete().eq("id", chId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-chapters", mangaId] });
      toast.success("Capítulo deletado!");
    },
  });

  const filtered = chapters?.filter((c) =>
    c.number.includes(search) || c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalImages = chapters?.reduce((a, c) => a + (c.images_count || 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Header with manga info */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Gerenciamento de Capítulos</h1>
      </div>

      {manga && (
        <div className="flex gap-4 p-4 rounded-lg border border-border bg-card">
          {manga.cover_url ? (
            <img src={manga.cover_url} alt="" className="w-20 h-28 rounded object-cover" />
          ) : (
            <div className="w-20 h-28 rounded bg-muted flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">{manga.title}</h2>
            <p className="text-sm text-muted-foreground">
              Detalhes: {manga.demographic} | {manga.status}
            </p>
            <p className="text-sm text-muted-foreground">
              Capítulos da Obra: {chapters?.length ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Imagens: {totalImages}
            </p>
          </div>
        </div>
      )}

      {/* Search + Create */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar capítulo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={() => { setEditingChapter(null); setShowCreate(true); }}>
          Criar <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Chapters table */}
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Capítulo</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Imagens</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Data</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Scans</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((ch) => (
                <tr key={ch.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {ch.is_visible ? (
                        <Eye className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-destructive" />
                      )}
                      <span className="font-medium text-foreground">Cap. {ch.number}</span>
                      {ch.title && <span className="text-muted-foreground text-sm">— {ch.title}</span>}
                      {ch.is_extra && <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Extra</span>}
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ImageIcon className="w-3 h-3" /> {ch.images_count ?? 0}
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-sm text-muted-foreground">
                    {new Date(ch.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                    {(ch.scan_groups as any)?.name ?? "—"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingChapter(ch); setShowCreate(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar Capítulo {ch.number}?</AlertDialogTitle>
                            <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteChapter.mutate(ch.id)}>Deletar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum capítulo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Chapter Dialog */}
      <ChapterDialog
        open={showCreate}
        onClose={() => { setShowCreate(false); setEditingChapter(null); }}
        chapter={editingChapter}
        mangaId={mangaId!}
        scanGroups={scanGroups || []}
      />
    </div>
  );
};

interface ChapterDialogProps {
  open: boolean;
  onClose: () => void;
  chapter: any;
  mangaId: string;
  scanGroups: any[];
}

const ChapterDialog = ({ open, onClose, chapter, mangaId, scanGroups }: ChapterDialogProps) => {
  const isEdit = !!chapter;
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ number: "", volume: "", title: "", is_extra: false, is_visible: true, scan_group_id: "" });
  const [images, setImages] = useState<File[]>([]);
  const [scanSearch, setScanSearch] = useState("");
  const [showScanDropdown, setShowScanDropdown] = useState(false);

  // Reset form when opening
  useState(() => {
    if (chapter) {
      setForm({
        number: chapter.number, volume: chapter.volume || "", title: chapter.title || "",
        is_extra: chapter.is_extra || false, is_visible: chapter.is_visible ?? true,
        scan_group_id: chapter.scan_group_id || "",
      });
    } else {
      setForm({ number: "", volume: "", title: "", is_extra: false, is_visible: true, scan_group_id: "" });
    }
  });

  // Update form when chapter changes
  const resetForm = () => {
    if (chapter) {
      setForm({
        number: chapter.number, volume: chapter.volume || "", title: chapter.title || "",
        is_extra: chapter.is_extra || false, is_visible: chapter.is_visible ?? true,
        scan_group_id: chapter.scan_group_id || "",
      });
    } else {
      setForm({ number: "", volume: "", title: "", is_extra: false, is_visible: true, scan_group_id: "" });
    }
    setImages([]);
    setScanSearch("");
  };

  // biome-ignore lint: reset on open change
  useState(() => { resetForm(); });

  const saveChapter = useMutation({
    mutationFn: async () => {
      const payload = {
        manga_id: mangaId,
        number: form.number,
        volume: form.volume || null,
        title: form.title || null,
        is_extra: form.is_extra,
        is_visible: form.is_visible,
        scan_group_id: form.scan_group_id || null,
        images_count: isEdit ? (chapter.images_count || 0) + images.length : images.length,
      };

      let chapterId = chapter?.id;

      if (isEdit) {
        const { error } = await supabase.from("chapters").update(payload).eq("id", chapter.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("chapters").insert(payload).select("id").single();
        if (error) throw error;
        chapterId = data.id;
      }

      // Upload images
      if (images.length > 0 && chapterId) {
        const startPage = isEdit ? (chapter.images_count || 0) + 1 : 1;
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const ext = file.name.split(".").pop();
          const path = `chapters/${chapterId}/page-${startPage + i}.${ext}`;
          const { error: upErr } = await supabase.storage.from("manga-images").upload(path, file, { upsert: true });
          if (upErr) throw upErr;
          const { data: urlData } = supabase.storage.from("manga-images").getPublicUrl(path);

          const { error: imgErr } = await supabase.from("chapter_images").insert({
            chapter_id: chapterId, image_url: urlData.publicUrl, page_number: startPage + i,
          });
          if (imgErr) throw imgErr;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-chapters", mangaId] });
      toast.success(isEdit ? "Capítulo atualizado!" : "Capítulo criado!");
      onClose();
    },
    onError: (err: any) => toast.error(err.message || "Erro ao salvar."),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredScans = scanGroups.filter((s) =>
    s.name.toLowerCase().includes(scanSearch.toLowerCase())
  );

  const selectedScan = scanGroups.find((s) => s.id === form.scan_group_id);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Atualizar Capítulo ${chapter.number}` : "Novo Capítulo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); saveChapter.mutate(); }} className="space-y-4">
          {/* Number, Volume, Title row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Capítulo</Label>
              <Input value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Volume</Label>
              <Input value={form.volume} onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Título</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
          </div>

          {/* Extra / Visible toggles */}
          <div className="flex gap-6">
            <div className="space-y-1">
              <Label className="text-xs">Extra?</Label>
              <div className="flex gap-1">
                <Button type="button" size="sm" variant={!form.is_extra ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, is_extra: false }))}>Não</Button>
                <Button type="button" size="sm" variant={form.is_extra ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, is_extra: true }))}>Sim</Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Visível?</Label>
              <div className="flex gap-1">
                <Button type="button" size="sm" variant={!form.is_visible ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, is_visible: false }))}>Não</Button>
                <Button type="button" size="sm" variant={form.is_visible ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, is_visible: true }))}>Sim</Button>
              </div>
            </div>
          </div>

          {/* Scan group selector */}
          <div className="space-y-1 relative">
            <Label className="text-xs">Scan</Label>
            <Input
              placeholder="Selecione as scans deste capítulo."
              value={scanSearch}
              onChange={(e) => { setScanSearch(e.target.value); setShowScanDropdown(true); }}
              onFocus={() => setShowScanDropdown(true)}
            />
            {showScanDropdown && filteredScans.length > 0 && (
              <div className="absolute z-10 mt-1 w-full border border-border rounded-lg bg-popover shadow-lg max-h-40 overflow-y-auto">
                {filteredScans.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted transition-colors text-sm"
                    onClick={() => {
                      setForm((f) => ({ ...f, scan_group_id: s.id }));
                      setScanSearch("");
                      setShowScanDropdown(false);
                    }}
                  >
                    {s.avatar_url && <img src={s.avatar_url} alt="" className="w-5 h-5 rounded-full" />}
                    <span className="text-foreground">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
            {selectedScan && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Scans:</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                    {selectedScan.avatar_url && <img src={selectedScan.avatar_url} className="w-4 h-4 rounded-full" alt="" />}
                    {selectedScan.name}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, scan_group_id: "" }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Image upload area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Imagens ({images.length})</Label>
              <span className="text-xs text-muted-foreground">Até 100 imagens, 5MB por imagem</span>
            </div>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Arraste ou clique para enviar imagens.</p>
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>

            {images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <span className="absolute top-0.5 left-0.5 bg-background/80 text-[10px] px-1 rounded font-bold text-foreground">#{i + 1}</span>
                    <img src={URL.createObjectURL(img)} alt="" className="w-24 h-16 object-cover rounded border border-border" />
                    <button
                      type="button"
                      className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(i)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saveChapter.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {saveChapter.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterManager;
