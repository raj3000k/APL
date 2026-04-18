import { Hash, Lock, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamBadge } from "@/components/team-badge";
import { cn } from "@/utils/cn";
import type { ChatRoom } from "@/utils/types";

export function ChatRoomList({
  rooms,
  activeRoomId,
  onSelect,
}: {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelect: (roomId: string) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Realtime rooms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
              room.id === activeRoomId
                ? "border-white/25 bg-white/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                {room.type === "watch-party" ? (
                  <Radio className="h-4 w-4 text-white/80" />
                ) : room.type === "team" ? (
                  <Lock className="h-4 w-4 text-white/80" />
                ) : (
                  <Hash className="h-4 w-4 text-white/80" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{room.name}</p>
                <p className="text-xs text-white/45">{room.type} room</p>
              </div>
            </div>
            {room.team ? <TeamBadge team={room.team} /> : null}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
