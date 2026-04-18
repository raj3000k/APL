import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import { initials, timeAgo } from "@/utils/format";
import type { ChatRoom, FanPulseSnapshot, UserProfile } from "@/utils/types";

export function ChatRoomPanel({
  room,
  snapshot,
  currentUser,
  actions,
}: {
  room: ChatRoom;
  snapshot: FanPulseSnapshot;
  currentUser: UserProfile;
  actions: FanPulseActions;
}) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(
    () => snapshot.messages.filter((entry) => entry.roomId === room.id),
    [room.id, snapshot.messages],
  );
  const typingUsers = useMemo(() => {
    const activeTyping = snapshot.typing.filter(
      (entry) => entry.roomId === room.id && new Date(entry.until) > new Date(),
    );
    return activeTyping
      .map((entry) => snapshot.users.find((user) => user.id === entry.userId)?.name)
      .filter(Boolean);
  }, [room.id, snapshot.typing, snapshot.users]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, [messages.length, typingUsers.length]);

  return (
    <Card className="flex h-full min-h-[640px] flex-col">
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div
          ref={scrollRef}
          className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-[1.75rem] border border-white/10 bg-black/20 p-4"
        >
          {messages.map((entry) => {
            const author = snapshot.users.find((user) => user.id === entry.userId);
            const isOwn = entry.userId === currentUser.id;
            return (
              <div
                key={entry.id}
                className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
              >
                {!isOwn ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={author?.avatar} alt={author?.name ?? "Fan"} />
                    <AvatarFallback>{initials(author?.name ?? "Fan")}</AvatarFallback>
                  </Avatar>
                ) : null}
                <div
                  className={`max-w-[80%] rounded-[1.5rem] px-4 py-3 ${
                    isOwn
                      ? "bg-[hsl(var(--theme-accent))] text-[hsl(var(--theme-on-accent))]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {!isOwn ? <p className="text-xs font-semibold">{author?.name}</p> : null}
                  <p className="mt-1 text-sm leading-6">{entry.text}</p>
                  <p
                    className={`mt-2 text-[11px] ${
                      isOwn ? "text-[hsl(var(--theme-on-accent))] opacity-75" : "text-white/45"
                    }`}
                  >
                    {timeAgo(entry.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="min-h-6 text-sm text-white/50">
          {typingUsers.length ? `${typingUsers.join(", ")} typing...` : "Emoji-friendly live chat ready"}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              void actions.setTyping.mutateAsync({
                roomId: room.id,
                userId: currentUser.id,
                isTyping: true,
              });
            }}
            placeholder="Send a realtime reaction..."
          />
          <Button
            onClick={async () => {
              if (!message.trim()) {
                return;
              }
              await actions.sendMessage.mutateAsync({
                roomId: room.id,
                userId: currentUser.id,
                text: message,
              });
              setMessage("");
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
