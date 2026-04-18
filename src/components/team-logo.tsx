import { cn } from "@/utils/cn";
import { getTeamTheme } from "@/utils/teams";
import type { TeamKey } from "@/utils/types";

export function TeamLogo({
  team,
  className,
}: {
  team: TeamKey;
  className?: string;
}) {
  const theme = getTeamTheme(team);

  return (
    <img
      src={theme.logo}
      alt={`${theme.label} logo`}
      className={cn("h-6 w-6 object-contain", className)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

export function TeamIdentity({
  team,
  className,
  logoClassName,
  textClassName,
  showLabel = false,
}: {
  team: TeamKey;
  className?: string;
  logoClassName?: string;
  textClassName?: string;
  showLabel?: boolean;
}) {
  const theme = getTeamTheme(team);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TeamLogo team={team} className={logoClassName} />
      <span className={cn("font-semibold text-white", textClassName)}>
        {showLabel ? theme.label : team}
      </span>
    </div>
  );
}
