import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  House,
  LogOut,
  MessageCircleMore,
  Radio,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { PropsWithChildren, ReactNode } from "react";
import { BallTrailCursor } from "@/components/ball-trail-cursor";
import { NotificationCenter } from "@/components/notification-center";
import { TeamIdentity } from "@/components/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TeamBadge } from "@/components/team-badge";
import { initials } from "@/utils/format";
import { getTeamTheme } from "@/utils/teams";
import type { FanPulseSnapshot, UserProfile } from "@/utils/types";

const navItems = [
  { to: "/", label: "Feed", icon: House },
  { to: "/nearby", label: "Nearby", icon: Compass },
  { to: "/chat", label: "Chat", icon: MessageCircleMore },
  { to: "/watch-party", label: "Watch Party", icon: Radio },
  { to: "/profile", label: "Profile", icon: UserCircle2 },
];

export function AppShell({
  currentUser,
  snapshot,
  onSignOut,
  onMarkNotificationsRead,
  stickyBanner,
  children,
}: PropsWithChildren<{
  currentUser: UserProfile;
  snapshot: FanPulseSnapshot;
  onSignOut: () => Promise<void>;
  onMarkNotificationsRead: () => Promise<unknown>;
  stickyBanner?: ReactNode;
}>) {
  const theme = getTeamTheme(currentUser.team);
  const notifications = snapshot.notifications.filter(
    (entry) => entry.userId === currentUser.id,
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BallTrailCursor />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-28 h-40 w-40 rounded-full bg-[hsla(var(--theme-accent)/0.18)] blur-3xl" />
        <div className="absolute bottom-16 right-[8%] h-52 w-52 rounded-full bg-[hsla(var(--theme-accent-soft)/0.12)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 px-4 pb-28 pt-4 md:px-6 lg:px-8 lg:pb-10">
        <aside className="glass-panel sticky top-4 hidden h-[calc(100vh-2rem)] w-[288px] flex-col rounded-[2rem] p-5 lg:flex">
          <div
            className="rounded-[1.75rem] p-5"
            style={{
              background: `linear-gradient(135deg, hsla(${theme.from} / 0.55), hsla(${theme.to} / 0.18))`,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              FanPulse IPL
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold">Stadium energy, online.</h1>
            <p className="mt-3 text-sm text-white/75">{theme.slogan}</p>
          </div>
          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white/12 text-white shadow-lg shadow-black/20"
                        : "text-white/65 hover:bg-white/8 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{currentUser.name}</p>
                {currentUser.team ? <TeamBadge team={currentUser.team} /> : null}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Fan points
                </p>
                <p className="mt-1 text-xl font-semibold text-white">{currentUser.fanPoints}</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-[hsl(var(--theme-accent-soft))]" />
            </div>
            <Button variant="ghost" className="mt-4 w-full justify-start" onClick={onSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="glass-panel sticky top-4 z-40 rounded-[2rem] px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45">
                  Premium Fan Network
                </p>
                {currentUser.team ? (
                  <TeamIdentity
                    team={currentUser.team}
                    showLabel
                    logoClassName="h-8 w-8"
                    textClassName="font-display text-2xl font-semibold text-white"
                    className="mt-1"
                  />
                ) : (
                  <h2 className="font-display text-2xl font-semibold text-white">{theme.label}</h2>
                )}
              </div>
              <div className="flex items-center gap-3">
                <NotificationCenter
                  notifications={notifications}
                  onMarkAllRead={onMarkNotificationsRead}
                />
                <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-white/55">{currentUser.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence>{stickyBanner}</AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <nav className="glass-panel fixed inset-x-4 bottom-4 z-50 flex items-center justify-between rounded-[1.8rem] px-2 py-2 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium ${
                  isActive
                    ? "bg-white/12 text-white"
                    : "text-white/55 transition hover:bg-white/8 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
