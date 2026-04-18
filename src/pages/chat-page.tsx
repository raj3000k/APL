import { useMemo, useState } from "react";
import { ChatRoomList } from "@/chat/chat-room-list";
import { ChatRoomPanel } from "@/chat/chat-room-panel";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";

export function ChatPage({
  currentUser,
  snapshot,
  actions,
}: {
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
  actions: FanPulseActions;
}) {
  const availableRooms = useMemo(
    () =>
      snapshot.rooms.filter((room) => {
        if (room.type === "team") {
          return room.team === currentUser.team;
        }
        return room.participantIds.includes(currentUser.id) || room.type !== "connection";
      }),
    [currentUser.id, currentUser.team, snapshot.rooms],
  );
  const [activeRoomId, setActiveRoomId] = useState(availableRooms[0]?.id ?? "");
  const activeRoom = availableRooms.find((room) => room.id === activeRoomId) ?? availableRooms[0];

  if (!activeRoom) {
    return <div className="text-white/65">No rooms available yet.</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      <ChatRoomList
        rooms={availableRooms}
        activeRoomId={activeRoom.id}
        onSelect={setActiveRoomId}
      />
      <ChatRoomPanel
        room={activeRoom}
        snapshot={snapshot}
        currentUser={currentUser}
        actions={actions}
      />
    </div>
  );
}
