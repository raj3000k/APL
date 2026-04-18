import { formatDistanceToNowStrict } from "date-fns";

export function timeAgo(value: string) {
  return `${formatDistanceToNowStrict(new Date(value))} ago`;
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function kmDistance(value: number) {
  return `${value.toFixed(1)} km away`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
