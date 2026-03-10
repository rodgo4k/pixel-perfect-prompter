import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit, BookOpen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MangaList = () => {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: mangas, isLoading } = useQuery({
    queryKey: ["admin-mangas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mangas")
        .select("*, chapters(count)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteManga = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("mangas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mangas"] });
      toast.success("Mangá deletado!");
    },
  });

  const filtered = mangas?.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Mangás</h1>
        <Link to="/admin/manga/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Novo Mangá
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar mangá..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Mangá</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Capítulos</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((manga) => (
                <tr key={manga.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {manga.cover_url ? (
                        <img src={manga.cover_url} alt="" className="w-10 h-14 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-14 rounded bg-muted flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{manga.title}</p>
                        <p className="text-xs text-muted-foreground">{manga.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{manga.status}</span>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {(manga.chapters as any)?.[0]?.count ?? 0}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/manga/${manga.id}`}>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/manga/${manga.id}/chapters`}>
                        <Button variant="ghost" size="icon" title="Capítulos">
                          <BookOpen className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Deletar">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deletar "{manga.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Todos os capítulos e imagens serão removidos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteManga.mutate(manga.id)}>
                              Deletar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Nenhum mangá encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MangaList;
