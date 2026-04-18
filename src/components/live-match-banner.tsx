import { motion } from "framer-motion";
import { Flame, Gavel, HeartCrack, Siren } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { FanPulseActions } from "@/hooks/use-fanpulse";
import type { LiveMatch, ReactionType, UserProfile } from "@/utils/types";

const REACTIONS: Array<{
  value: ReactionType;
  label: string;
  icon: typeof Flame;
}> = [
  { value: "SIX", label: "SIX", icon: Flame },
  { value: "WICKET", label: "WICKET", icon: HeartCrack },
  { value: "CLOSE_CALL", label: "CLOSE CALL", icon: Siren },
  { value: "UMPIRE", label: "UMPIRE", icon: Gavel },
];

export function LiveMatchBanner({
  currentUser,
  liveMatch,
  actions,
}: {
  currentUser: UserProfile;
  liveMatch: LiveMatch;
  actions: FanPulseActions;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-20 z-30 mt-4"
    >
      <div className="glass-panel glow-ring overflow-hidden rounded-[2rem] border border-white/15 p-4">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,hsla(var(--theme-accent)/0.12),transparent)] opacity-70" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-rose-300">LIVE MODE</p>
            <h2 className="font-display text-2xl font-semibold">
              {liveMatch.homeTeam} vs {liveMatch.awayTeam} LIVE 🔴
            </h2>
            <p className="text-sm text-white/65">
              Tap a reaction to auto-join the emotion room in real time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            {REACTIONS.map((reaction) => {
              const Icon = reaction.icon;
              return (
                <Button
                  key={reaction.value}
                  variant="secondary"
                  className="group min-w-[132px] justify-start"
                  onClick={async () => {
                    await actions.reactToLiveMatch.mutateAsync({
                      userId: currentUser.id,
                      reaction: reaction.value,
                    });
                    toast.success(`Joined ${reaction.label} room`);
                  }}
                >
                  <motion.span whileTap={{ rotate: -24, scale: 1.08 }}>
                    <Icon className="h-4 w-4" />
                  </motion.span>
                  {reaction.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
