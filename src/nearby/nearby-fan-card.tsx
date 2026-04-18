import { MessageSquareHeart, PartyPopper, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TeamBadge } from "@/components/team-badge";
import { initials, kmDistance } from "@/utils/format";
import type { NearbyFan } from "@/utils/types";

export function NearbyFanCard({
  fan,
  onConnect,
  onInvite,
}: {
  fan: NearbyFan;
  onConnect: () => Promise<unknown>;
  onInvite: () => Promise<unknown>;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={fan.avatar} alt={fan.name} />
            <AvatarFallback>{initials(fan.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-lg font-semibold">{fan.name}</p>
              {fan.team ? <TeamBadge team={fan.team} /> : null}
            </div>
            <p className="mt-1 text-sm text-white/55">{kmDistance(fan.distanceKm)}</p>
            <p className="mt-2 text-sm text-white/75">{fan.status}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Button variant="secondary" onClick={onConnect}>
            <UserPlus className="h-4 w-4" />
            Connect
          </Button>
          <Button variant="secondary">
            <MessageSquareHeart className="h-4 w-4" />
            Chat
          </Button>
          <Button onClick={onInvite}>
            <PartyPopper className="h-4 w-4" />
            Invite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
