import type { TeamKey } from "@/utils/types";

export interface TeamTheme {
  key?: TeamKey;
  label: string;
  slogan: string;
  source: string;
  logo: string;
  from: string;
  via: string;
  to: string;
  accent: string;
  accentSoft: string;
  shellStart: string;
  shellMid: string;
  shellEnd: string;
  onAccent: string;
}

function hexToHslChannels(hex: string) {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : sanitized;

  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation =
      delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case red:
        hue = ((green - blue) / delta) % 6;
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }
  }

  const computedHue = Math.round((hue * 60 + 360) % 360);
  const computedSaturation = Math.round(saturation * 100);
  const computedLightness = Math.round(lightness * 100);

  return `${computedHue} ${computedSaturation}% ${computedLightness}%`;
}

function buildTheme(input: {
  key?: TeamKey;
  label: string;
  slogan: string;
  source: string;
  logo: string;
  from: string;
  via: string;
  to: string;
  accent: string;
  accentSoft: string;
  shellStart: string;
  shellMid: string;
  shellEnd: string;
  onAccent: string;
}): TeamTheme {
  return {
    ...input,
    from: hexToHslChannels(input.from),
    via: hexToHslChannels(input.via),
    to: hexToHslChannels(input.to),
    accent: hexToHslChannels(input.accent),
    accentSoft: hexToHslChannels(input.accentSoft),
    shellStart: hexToHslChannels(input.shellStart),
    shellMid: hexToHslChannels(input.shellMid),
    shellEnd: hexToHslChannels(input.shellEnd),
    onAccent: hexToHslChannels(input.onAccent),
  };
}

export const IPL_BASE_THEME = buildTheme({
  label: "Indian Premier League",
  slogan: "Official colors, stadium-grade energy",
  source: "https://www.iplt20.com/",
  logo: "https://documents.iplt20.com/ipl/assets/images/ipl-logo-new-old.png",
  from: "#19398A",
  via: "#102A72",
  to: "#11141C",
  accent: "#F6C64B",
  accentSoft: "#A9C5FF",
  shellStart: "#11141C",
  shellMid: "#13244E",
  shellEnd: "#19398A",
  onAccent: "#11141C",
});

export const TEAM_OPTIONS: TeamTheme[] = [
  buildTheme({
    key: "RCB",
    label: "Royal Challengers Bengaluru",
    slogan: "Ee Sala Cup Namde 🔥",
    source: "https://www.royalchallengers.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/47/Royal_Challengers_Bangalore_Logo.svg",
    from: "#131313",
    via: "#B1060F",
    to: "#5A0A12",
    accent: "#D4A149",
    accentSoft: "#F0D28A",
    shellStart: "#11141C",
    shellMid: "#261114",
    shellEnd: "#5A0A12",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "MI",
    label: "Mumbai Indians",
    slogan: "Duniya Hila Denge 💙",
    source: "https://www.mumbaiindians.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
    from: "#001848",
    via: "#005FCC",
    to: "#083F88",
    accent: "#D1AB3E",
    accentSoft: "#EED58B",
    shellStart: "#11141C",
    shellMid: "#071C47",
    shellEnd: "#003B82",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "CSK",
    label: "Chennai Super Kings",
    slogan: "Whistle Podu 🦁",
    source: "https://www.chennaisuperkings.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/2e/Chennai_Super_Kings_Logo.svg",
    from: "#1B2A52",
    via: "#FFCB05",
    to: "#E1B400",
    accent: "#FFDE2F",
    accentSoft: "#FFF690",
    shellStart: "#11141C",
    shellMid: "#223A70",
    shellEnd: "#C6932F",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "KKR",
    label: "Kolkata Knight Riders",
    slogan: "Korbo Lorbo Jeetbo 💜",
    source: "https://www.kkr.in/",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg",
    from: "#1C122C",
    via: "#3B215D",
    to: "#5A2D88",
    accent: "#D4A54A",
    accentSoft: "#F3D79B",
    shellStart: "#11141C",
    shellMid: "#24123B",
    shellEnd: "#3B215D",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "SRH",
    label: "Sunrisers Hyderabad",
    slogan: "Orange Army Rising ☀️",
    source: "https://www.sunrisershyderabad.in/",
    logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_Logo.svg",
    from: "#171717",
    via: "#EF4123",
    to: "#C83719",
    accent: "#FFCB05",
    accentSoft: "#FFD37B",
    shellStart: "#11141C",
    shellMid: "#311713",
    shellEnd: "#8B2C18",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "RR",
    label: "Rajasthan Royals",
    slogan: "Halla Bol 👑",
    source: "https://www.rajasthanroyals.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg",
    from: "#5A033D",
    via: "#950461",
    to: "#E50695",
    accent: "#E96BB0",
    accentSoft: "#FFD9F0",
    shellStart: "#11141C",
    shellMid: "#3D062E",
    shellEnd: "#950461",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "DC",
    label: "Delhi Capitals",
    slogan: "Yeh Hai Nayi Dilli ❤️",
    source: "https://www.delhicapitals.in/",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals_Logo.svg",
    from: "#06245F",
    via: "#0B4EA2",
    to: "#1B6CC6",
    accent: "#EF1B23",
    accentSoft: "#FF9DA1",
    shellStart: "#11141C",
    shellMid: "#0D2246",
    shellEnd: "#06245F",
    onAccent: "#FFFFFF",
  }),
  buildTheme({
    key: "PBKS",
    label: "Punjab Kings",
    slogan: "Sher Squad On 🔴",
    source: "https://www.punjabkingsipl.in/",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg",
    from: "#2B0E13",
    via: "#C10004",
    to: "#ED1C24",
    accent: "#ED1C24",
    accentSoft: "#FFC5C8",
    shellStart: "#11141C",
    shellMid: "#290A10",
    shellEnd: "#7E0B11",
    onAccent: "#FFFFFF",
  }),
  buildTheme({
    key: "GT",
    label: "Gujarat Titans",
    slogan: "Aava De ⚡",
    source: "https://www.gujarattitansipl.com/",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
    from: "#061527",
    via: "#0B1D34",
    to: "#5BCBF5",
    accent: "#F3DC8A",
    accentSoft: "#BDA05F",
    shellStart: "#11141C",
    shellMid: "#081325",
    shellEnd: "#0B1D34",
    onAccent: "#11141C",
  }),
  buildTheme({
    key: "LSG",
    label: "Lucknow Super Giants",
    slogan: "Blue Roar Loading 💫",
    source: "https://www.lucknowsupergiants.in/",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/3d/Lucknow_Super_Giants_Logo.svg",
    from: "#0047AB",
    via: "#00AEEF",
    to: "#5BC2E7",
    accent: "#F47920",
    accentSoft: "#FFD09D",
    shellStart: "#11141C",
    shellMid: "#04315C",
    shellEnd: "#0069C7",
    onAccent: "#11141C",
  }),
];

export const DEFAULT_TEAM_THEME = IPL_BASE_THEME;

export const TEAM_THEME_MAP = Object.fromEntries(
  TEAM_OPTIONS.filter((team): team is TeamTheme & { key: TeamKey } => Boolean(team.key)).map(
    (team) => [team.key, team],
  ),
) as Record<TeamKey, TeamTheme>;

export function getTeamTheme(team?: TeamKey) {
  return team ? TEAM_THEME_MAP[team] : DEFAULT_TEAM_THEME;
}
