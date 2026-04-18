import { Badge } from "@/components/ui/badge";
import { getTeamTheme } from "@/utils/teams";
import type { TeamKey } from "@/utils/types";

export function TeamBadge({ team }: { team: TeamKey }) {
  const theme = getTeamTheme(team);

  return (
    <Badge
      variant="accent"
      className="border-white/10 bg-white/10 text-white"
      style={{
        background: `linear-gradient(135deg, hsla(${theme.accent} / 0.25), hsla(${theme.accentSoft} / 0.12))`,
      }}
    >
      {team}
    </Badge>
  );
}
