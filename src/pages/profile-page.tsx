import { Grid2X2, Heart, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamBadge } from "@/components/team-badge";
import { compactNumber, initials } from "@/utils/format";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";

export function ProfilePage({
  currentUser,
  snapshot,
}: {
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
}) {
  const myPosts = snapshot.posts.filter((post) => post.userId === currentUser.id);
  const totalLikes = myPosts.reduce((sum, post) => sum + post.likesCount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 rounded-[2rem]">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-semibold">{currentUser.name}</h1>
                {currentUser.team ? <TeamBadge team={currentUser.team} /> : null}
              </div>
              <p className="mt-2 text-white/65">{currentUser.status}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Posts</p>
                <p className="mt-2 text-2xl font-semibold">{myPosts.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Likes</p>
                <p className="mt-2 text-2xl font-semibold">{compactNumber(totalLikes)}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">Fan Points</p>
                <p className="mt-2 text-2xl font-semibold">{currentUser.fanPoints}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid2X2 className="h-5 w-5" />
              Posts Grid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {myPosts.map((post) => (
                <div key={post.id} className="overflow-hidden rounded-[1.5rem] border border-white/10">
                  <img src={post.mediaUrl} alt={post.caption} className="h-52 w-full object-cover" />
                  <div className="bg-black/20 p-4">
                    <p className="line-clamp-2 text-sm text-white/80">{post.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Fan Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-sm text-white/55">Most loved moment</p>
              <p className="mt-2 font-semibold text-white">
                {myPosts.sort((a, b) => b.likesCount - a.likesCount)[0]?.caption ??
                  "Create your first moment"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="flex items-center gap-2 text-sm text-white/55">
                <Heart className="h-4 w-4" />
                Average post love
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {myPosts.length ? Math.round(totalLikes / myPosts.length) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
