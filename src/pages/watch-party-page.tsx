import { useState } from "react";
import { PartyPopper, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";

export function WatchPartyPage({
  currentUser,
  snapshot,
  actions,
}: {
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
  actions: FanPulseActions;
}) {
  const [title, setTitle] = useState(`${currentUser.team} Final Overs Watch Party`);
  const nearbySameTeam = snapshot.users.filter(
    (user) => user.id !== currentUser.id && user.team === currentUser.team,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Create Watch Party</CardTitle>
          <CardDescription>
            Invite nearby fans into a shared room and keep the crowd count visible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          <Button
            className="w-full"
            onClick={async () => {
              await actions.createWatchParty.mutateAsync({
                hostId: currentUser.id,
                title,
                inviteeIds: nearbySameTeam.slice(0, 2).map((fan) => fan.id),
              });
              toast.success("Watch party created.");
            }}
          >
            <Plus className="h-4 w-4" />
            Create room
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {snapshot.watchParties.map((party) => {
          const host = snapshot.users.find((user) => user.id === party.hostId);
          return (
            <Card key={party.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-semibold text-white">{party.title}</p>
                    <p className="mt-2 text-sm text-white/60">
                      Hosted by {host?.name} • {party.participantIds.length} people watching together
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 p-3">
                    <PartyPopper className="h-5 w-5 text-[hsl(var(--theme-accent-soft))]" />
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {party.invitedIds.map((inviteeId) => {
                    const fan = snapshot.users.find((user) => user.id === inviteeId);
                    return (
                      <div
                        key={inviteeId}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <p className="font-semibold text-white">{fan?.name}</p>
                        <p className="text-sm text-white/55">Invited fan</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
