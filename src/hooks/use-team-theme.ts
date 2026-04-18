import { useEffect } from "react";
import { getTeamTheme } from "@/utils/teams";
import type { TeamKey } from "@/utils/types";

export function useTeamTheme(team?: TeamKey) {
  useEffect(() => {
    const theme = getTeamTheme(team);
    const root = document.documentElement;

    root.style.setProperty("--theme-from", theme.from);
    root.style.setProperty("--theme-via", theme.via);
    root.style.setProperty("--theme-to", theme.to);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-accent-soft", theme.accentSoft);
  }, [team]);
}
