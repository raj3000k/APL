import type { TeamKey } from "@/utils/types";

export interface TeamTheme {
  key: TeamKey;
  label: string;
  slogan: string;
  from: string;
  via: string;
  to: string;
  accent: string;
  accentSoft: string;
}

export const TEAM_OPTIONS: TeamTheme[] = [
  {
    key: "RCB",
    label: "Royal Challengers Bengaluru",
    slogan: "Ee Sala Cup Namde 🔥",
    from: "0 72% 48%",
    via: "8 88% 58%",
    to: "14 100% 64%",
    accent: "18 100% 63%",
    accentSoft: "359 86% 78%",
  },
  {
    key: "MI",
    label: "Mumbai Indians",
    slogan: "Duniya Hila Denge 💙",
    from: "211 100% 42%",
    via: "221 86% 56%",
    to: "195 100% 60%",
    accent: "195 100% 63%",
    accentSoft: "212 100% 78%",
  },
  {
    key: "CSK",
    label: "Chennai Super Kings",
    slogan: "Whistle Podu 🦁",
    from: "45 98% 52%",
    via: "39 100% 60%",
    to: "21 100% 59%",
    accent: "47 100% 58%",
    accentSoft: "51 100% 80%",
  },
  {
    key: "KKR",
    label: "Kolkata Knight Riders",
    slogan: "Korbo Lorbo Jeetbo 💜",
    from: "272 59% 33%",
    via: "283 60% 45%",
    to: "303 63% 51%",
    accent: "288 88% 68%",
    accentSoft: "284 92% 82%",
  },
  {
    key: "SRH",
    label: "Sunrisers Hyderabad",
    slogan: "Orange Army Rising ☀️",
    from: "22 100% 47%",
    via: "13 98% 56%",
    to: "5 93% 61%",
    accent: "24 100% 58%",
    accentSoft: "26 100% 80%",
  },
  {
    key: "RR",
    label: "Rajasthan Royals",
    slogan: "Halla Bol 👑",
    from: "325 74% 47%",
    via: "310 74% 57%",
    to: "285 82% 65%",
    accent: "320 88% 68%",
    accentSoft: "321 100% 85%",
  },
  {
    key: "DC",
    label: "Delhi Capitals",
    slogan: "Yeh Hai Nayi Dilli ❤️",
    from: "219 92% 43%",
    via: "349 84% 57%",
    to: "14 100% 61%",
    accent: "351 100% 67%",
    accentSoft: "345 100% 84%",
  },
  {
    key: "PBKS",
    label: "Punjab Kings",
    slogan: "Sher Squad On 🔴",
    from: "353 83% 43%",
    via: "0 85% 56%",
    to: "12 95% 62%",
    accent: "8 100% 66%",
    accentSoft: "8 100% 82%",
  },
  {
    key: "GT",
    label: "Gujarat Titans",
    slogan: "Aava De ⚡",
    from: "222 46% 18%",
    via: "219 60% 28%",
    to: "210 70% 45%",
    accent: "40 93% 62%",
    accentSoft: "43 100% 82%",
  },
  {
    key: "LSG",
    label: "Lucknow Super Giants",
    slogan: "Blue Roar Loading 💫",
    from: "186 76% 36%",
    via: "197 90% 47%",
    to: "213 92% 58%",
    accent: "45 95% 61%",
    accentSoft: "48 100% 80%",
  },
];

export const DEFAULT_TEAM_THEME = TEAM_OPTIONS[0];

export const TEAM_THEME_MAP = Object.fromEntries(
  TEAM_OPTIONS.map((team) => [team.key, team]),
) as Record<TeamKey, TeamTheme>;

export function getTeamTheme(team?: TeamKey) {
  return team ? TEAM_THEME_MAP[team] : DEFAULT_TEAM_THEME;
}
