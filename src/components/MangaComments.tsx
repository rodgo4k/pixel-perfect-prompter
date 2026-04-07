import { useState, useEffect } from "react";
import { MessageSquare, Send, Smile, Trash2, CornerDownRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

const MangaComments = ({ mangaId }: { mangaId: string }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null; display_name: string | null } | null>(null);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("manga_id", mangaId)
      .order("created_at", { ascending: false });

    if (!data) return;

    const userIds = [...new Set(data.map((c) => c.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const allComments: Comment[] = data.map((c) => ({
      ...c,
      profile: profileMap.get(c.user_id) || undefined,
    }));

    // Build tree: separate root comments and replies
    const rootComments: Comment[] = [];
    const repliesMap = new Map<string, Comment[]>();

    allComments.forEach((c) => {
      if (!c.parent_id) {
        rootComments.push({ ...c, replies: [] });
      } else {
        const existing = repliesMap.get(c.parent_id) || [];
        existing.push(c);
        repliesMap.set(c.parent_id, existing);
      }
    });

    rootComments.forEach((root) => {
      const replies = repliesMap.get(root.id) || [];
      // Sort replies oldest first
      replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      root.replies = replies;
    });

    setComments(rootComments);
  };

  useEffect(() => {
    fetchComments();
  }, [mangaId]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("avatar_url, display_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setUserProfile(data);
      });
  }, [user]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);
    await supabase.from("comments").insert({
      manga_id: mangaId,
      user_id: user.id,
      content: newComment.trim(),
    });
    setNewComment("");
    setLoading(false);
    fetchComments();
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !user || !replyingTo) return;
    setLoading(true);
    await supabase.from("comments").insert({
      manga_id: mangaId,
      user_id: user.id,
      content: replyContent.trim(),
      parent_id: replyingTo.id,
    });
    setReplyContent("");
    setReplyingTo(null);
    setLoading(false);
    fetchComments();
  };

  const handleDelete = async (commentId: string) => {
    await supabase.from("comments").delete().eq("id", commentId);
    fetchComments();
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "agora";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`flex items-start gap-3 p-4 rounded-xl bg-secondary/20 border border-border/30 group ${isReply ? "ml-10" : ""}`}
    >
      <Avatar className="w-9 h-9 flex-shrink-0">
        {comment.profile?.avatar_url && (
          <AvatarImage src={comment.profile.avatar_url} />
        )}
        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
          {getInitials(comment.profile?.display_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {comment.profile?.display_name || "Usuário"}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-foreground/80 mt-1">{comment.content}</p>
        {user && !isReply && (
          <button
            onClick={() => setReplyingTo(replyingTo?.id === comment.id ? null : comment)}
            className="text-xs text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1 transition-colors"
          >
            <CornerDownRight className="w-3 h-3" />
            Responder
          </button>
        )}
      </div>
      {user?.id === comment.user_id && (
        <button
          onClick={() => handleDelete(comment.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="border-t border-border mb-8" />

      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          Comentários ({totalCount})
        </h2>
      </div>

      {/* Comment input */}
      {user ? (
        <div className="flex items-start gap-3 mb-8 p-4 rounded-xl bg-secondary/30 border border-border/50">
          <Avatar className="w-9 h-9 flex-shrink-0">
            {userProfile?.avatar_url && (
              <AvatarImage src={userProfile.avatar_url} />
            )}
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              {getInitials(userProfile?.display_name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Escreva um comentário..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <Smile className="w-5 h-5 text-muted-foreground flex-shrink-0 cursor-pointer hover:text-foreground transition-colors" />
            <button
              onClick={handleSubmit}
              disabled={loading || !newComment.trim()}
              className="px-4 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">
          Faça login para comentar.
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {renderComment(comment)}

            {/* Reply input */}
            {replyingTo?.id === comment.id && (
              <div className="ml-10 flex items-start gap-3 p-3 rounded-xl bg-secondary/20 border border-border/40">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  {userProfile?.avatar_url && (
                    <AvatarImage src={userProfile.avatar_url} />
                  )}
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {getInitials(userProfile?.display_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply()}
                    placeholder={`Respondendo ${comment.profile?.display_name || "Usuário"}...`}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={loading || !replyContent.trim()}
                    className="px-3 py-1 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-40"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies?.map((reply) => renderComment(reply, true))}
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        )}
      </div>
    </div>
  );
};

export default MangaComments;
