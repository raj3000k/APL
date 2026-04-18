import { LocateFixed, Radar } from "lucide-react";
import { toast } from "sonner";
import { NearbyFanCard } from "@/nearby/nearby-fan-card";
import { TeamIdentity } from "@/components/team-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import { useNearbyFans } from "@/hooks/use-fanpulse";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";

export function NearbyPage({
  currentUser,
  snapshot,
  actions,
}: {
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
  actions: FanPulseActions;
}) {
  const nearbyQuery = useNearbyFans(currentUser.id);

  const findNearby = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation isn’t supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await actions.updateLocation.mutateAsync({
          userId: currentUser.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        await nearbyQuery.refetch();
        toast.success("Nearby fans refreshed.");
      },
      () => toast.error("Location permission is needed to find nearby fans."),
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Nearby Fans</CardTitle>
              <CardDescription>
                Same-team fans within 5-10 km using geolocation and database-friendly radius queries.
              </CardDescription>
            </div>
            <Button onClick={findNearby}>
              <LocateFixed className="h-4 w-4" />
              Find Fans Nearby
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Team filter</p>
            {currentUser.team ? (
              <TeamIdentity team={currentUser.team} className="mt-2" logoClassName="h-8 w-8" textClassName="text-2xl" />
            ) : null}
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Fans nearby</p>
            <p className="mt-2 text-2xl font-semibold text-white">{nearbyQuery.data?.length ?? 0}</p>
          </div>
          <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Status</p>
            <p className="mt-2 text-2xl font-semibold text-white">{currentUser.status}</p>
          </div>
        </CardContent>
      </Card>

      {nearbyQuery.data?.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {nearbyQuery.data.map((fan) => (
            <NearbyFanCard
              key={fan.id}
              fan={fan}
              onConnect={() =>
                actions.sendConnectionRequest.mutateAsync({
                  senderId: currentUser.id,
                  receiverId: fan.id,
                })
              }
              onInvite={() =>
                actions.createWatchParty.mutateAsync({
                  hostId: currentUser.id,
                  title: `${currentUser.team} Corner Watch Party`,
                  inviteeIds: [fan.id],
                })
              }
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-4">
              <Radar className="h-8 w-8 text-[hsl(var(--theme-accent-soft))]" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">No nearby fans yet</p>
              <p className="mt-2 max-w-md text-sm text-white/60">
                Tap the location button to store your coordinates and surface same-team fans nearby.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
          <CardDescription>Accept or reject requests, then jump into private chat rooms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot.connections
            .filter(
              (connection) =>
                connection.senderId === currentUser.id ||
                connection.receiverId === currentUser.id,
            )
            .map((connection) => {
              const otherUser = snapshot.users.find(
                (user) =>
                  user.id ===
                  (connection.senderId === currentUser.id
                    ? connection.receiverId
                    : connection.senderId),
              );

              return (
                <div
                  key={connection.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{otherUser?.name}</p>
                    <p className="text-sm text-white/55">Status: {connection.status}</p>
                  </div>
                  {connection.status === "pending" && connection.receiverId === currentUser.id ? (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          actions.respondToConnection.mutateAsync({
                            connectionId: connection.id,
                            status: "rejected",
                          })
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() =>
                          actions.respondToConnection.mutateAsync({
                            connectionId: connection.id,
                            status: "accepted",
                          })
                        }
                      >
                        Accept
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
