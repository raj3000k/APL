import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/utils/format";
import type { NotificationItem } from "@/utils/types";

export function NotificationCenter({
  notifications,
  onMarkAllRead,
}: {
  notifications: NotificationItem[];
  onMarkAllRead: () => Promise<unknown>;
}) {
  const unread = notifications.filter((entry) => !entry.read).length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--theme-accent))] px-1 text-[10px] font-bold text-[hsl(var(--theme-on-accent))]">
              {unread}
            </span>
          ) : null}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Likes, comments, invites, and nearby fans.</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-3">
          {notifications.length ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{notification.title}</p>
                      {!notification.read ? <Badge variant="accent">New</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-white/65">{notification.body}</p>
                  </div>
                  <span className="text-xs text-white/45">{timeAgo(notification.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/55">
              Your stadium inbox is quiet right now.
            </div>
          )}
        </div>
        <Button className="mt-6 w-full" variant="secondary" onClick={onMarkAllRead}>
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </DialogContent>
    </Dialog>
  );
}
