import { Trophy } from "lucide-react";
import { CreatePostCard } from "@/feed/create-post-card";
import { PostCard } from "@/feed/post-card";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import { compactNumber } from "@/utils/format";
import { getTeamTheme } from "@/utils/teams";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";

export function FeedPage({
  currentUser,
  snapshot,
  actions,
}: {
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
  actions: FanPulseActions;
}) {
  const theme = getTeamTheme(currentUser.team);
  const fanRank = [...snapshot.users].sort((a, b) => b.fanPoints - a.fanPoints).findIndex((user) => user.id === currentUser.id) + 1;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <div
          className="overflow-hidden rounded-[2.2rem] border border-white/10 p-6"
          style={{
            background: `linear-gradient(135deg, hsla(${theme.from} / 0.45), rgba(15,23,42,0.65), hsla(${theme.accent} / 0.22))`,
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                Your Fan Feed
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-white">
                {theme.slogan}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                Live reactions, visual posts, and crowd energy tailored to your team identity.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Card className="border-white/15 bg-black/20">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Posts</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {snapshot.posts.filter((post) => post.userId === currentUser.id).length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/15 bg-black/20">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Fan Rank</p>
                  <p className="mt-2 font-display text-3xl font-semibold">#{fanRank}</p>
                </CardContent>
              </Card>
              <Card className="border-white/15 bg-black/20">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Engagement</p>
                  <p className="mt-2 font-display text-3xl font-semibold">
                    {compactNumber(snapshot.posts.reduce((sum, post) => sum + post.likesCount, 0))}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <CreatePostCard currentUser={currentUser} actions={actions} />

        <div className="space-y-5">
          {snapshot.posts.map((post) => {
            const author = snapshot.users.find((user) => user.id === post.userId);
            if (!author) return null;
            return (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                author={author}
                comments={snapshot.comments.filter((comment) => comment.postId === post.id)}
                actions={actions}
              />
            );
          })}
        </div>
      </section>

      <aside className="space-y-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <Trophy className="h-5 w-5 text-[hsl(var(--theme-accent-soft))]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Leaderboard Snapshot</p>
                <p className="text-xs text-white/45">Top fans by points tonight</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[...snapshot.users]
                .sort((a, b) => b.fanPoints - a.fanPoints)
                .slice(0, 5)
                .map((fan, index) => (
                  <div
                    key={fan.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        #{index + 1} {fan.name}
                      </p>
                      <p className="text-xs text-white/45">{fan.team ?? "Unassigned"}</p>
                    </div>
                    <span className="text-sm font-semibold text-[hsl(var(--theme-accent-soft))]">
                      {fan.fanPoints}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-white">Predictions</p>
            <p className="mt-2 text-sm text-white/65">
              Tap next-ball predictions in the sidebar later to boost points. The backend shape is ready.
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
