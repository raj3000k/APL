import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TeamBadge } from "@/components/team-badge";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import { compactNumber, initials, timeAgo } from "@/utils/format";
import type { Comment, Post, UserProfile } from "@/utils/types";

export function PostCard({
  post,
  currentUser,
  author,
  comments,
  actions,
}: {
  post: Post;
  currentUser: UserProfile;
  author: UserProfile;
  comments: Comment[];
  actions: FanPulseActions;
}) {
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(post.likedBy.includes(currentUser.id));
  const [burst, setBurst] = useState(false);
  const badgeLabel = useMemo(() => {
    if (post.badge === "moment") return "🔥 Moment of the Match";
    if (post.badge === "crowd") return "Crowd Favorite";
    return null;
  }, [post.badge]);

  const handleLike = async () => {
    setLiked((state) => !state);
    setBurst(true);
    await actions.toggleLike.mutateAsync({ postId: post.id, userId: currentUser.id });
    window.setTimeout(() => setBurst(false), 420);
  };

  const handleComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    await actions.addComment.mutateAsync({
      postId: post.id,
      userId: currentUser.id,
      text: commentText,
    });
    setCommentText("");
  };

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.25 }}
      className="glass-panel overflow-hidden rounded-[2rem]"
    >
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{initials(author.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{author.name}</p>
              {author.team ? <TeamBadge team={author.team} /> : null}
            </div>
            <p className="text-xs text-white/45">
              {timeAgo(post.createdAt)}
              {post.matchTag ? ` • ${post.matchTag}` : ""}
            </p>
          </div>
        </div>
        {badgeLabel ? (
          <Badge variant="accent" className="hidden sm:inline-flex">
            {badgeLabel}
          </Badge>
        ) : null}
      </div>

      <div className="relative overflow-hidden">
        {post.mediaType === "video" ? (
          <div className="relative">
            <img src={post.mediaUrl} alt={post.caption} className="h-[340px] w-full object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <div className="rounded-full border border-white/20 bg-white/15 p-5 backdrop-blur-md">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <img src={post.mediaUrl} alt={post.caption} className="h-[340px] w-full object-cover" />
        )}
        <AnimatePresence>
          {burst ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1.4 }}
              exit={{ opacity: 0, scale: 1.8 }}
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <Heart className="h-24 w-24 fill-rose-400 text-rose-400/90 drop-shadow-[0_0_20px_rgba(244,63,94,0.55)]" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-7 text-white/90">{post.caption}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/55">
            <span>{compactNumber(post.likesCount)} likes</span>
            <span>•</span>
            <span>{comments.length} comments</span>
          </div>
          {post.team ? <TeamBadge team={post.team} /> : null}
        </div>
        <div className="flex gap-2">
          <Button variant={liked ? "default" : "secondary"} className="flex-1" onClick={handleLike}>
            <motion.span whileTap={{ rotate: -18, scale: 1.1 }}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </motion.span>
            Like
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="flex-1">
                <MessageCircle className="h-4 w-4" />
                Comment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Match chat for this post</DialogTitle>
                <DialogDescription>
                  Comment drawer with slide-up motion, just like you asked.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">
                        {comment.userId === currentUser.id ? currentUser.name : author.name}
                      </p>
                      <span className="text-xs text-white/45">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/75">{comment.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Drop your reaction..."
                />
                <Button onClick={handleComment}>Send</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="secondary"
            className="min-w-14 px-0"
            onClick={() => toast.success("Share link copied to the fan group.")}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
