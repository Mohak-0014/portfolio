/**
 * ───────────────────────────────────────────────────────────────
 *  DEPARTURES — a bright airport-terminal take on the portfolio.
 *
 *  Each section is a flight on the split-flap board. You pick a
 *  destination, your boarding pass is scanned, and you arrive at the
 *  light-themed "destination guide" for that section.
 * ───────────────────────────────────────────────────────────────
 */

import { FRAMES } from "../prezi/frames";

export const AIRLINE = "CURIOSITY AIRWAYS";
export const AIRPORT = "MOHAK INTL · TERMINAL M";
export const ORIGIN = { code: "MOH", city: "Mohak Intl" };

export type Status = "ON TIME" | "BOARDING" | "NOW BOARDING" | "FINAL CALL" | "DELAYED";

export type Destination = {
  index: number;
  code: string; // IATA-ish three-letter code
  city: string; // destination name shown on the board
  label: string; // the underlying section label
  gate: string;
  flight: string;
  status: Status;
  accent: string;
};

/* deeper jewel tones — they read on a bright/ivory terminal, unlike neons */
const ACCENTS = [
  "#0F9488", // hello — teal
  "#2A7DB5", // about — sky
  "#7C5CD0", // projects — violet
  "#1FA37A", // skills — emerald
  "#D98A1F", // life — amber
  "#E05A6E", // sidequests — rose
  "#0E9AAE", // blog — cyan
  "#5466D0", // contact — indigo
];

const META: { code: string; city: string; gate: string; status: Status }[] = [
  { code: "HEL", city: "Hello", gate: "A1", status: "BOARDING" },
  { code: "ABT", city: "Backstory", gate: "A2", status: "ON TIME" },
  { code: "WRK", city: "Projects", gate: "B3", status: "NOW BOARDING" },
  { code: "SKL", city: "Toolkit", gate: "B4", status: "ON TIME" },
  { code: "LIF", city: "Off The Clock", gate: "C5", status: "ON TIME" },
  { code: "SDQ", city: "Sidequests", gate: "C6", status: "DELAYED" },
  { code: "BLG", city: "Writing", gate: "D7", status: "ON TIME" },
  { code: "CTC", city: "Contact", gate: "D8", status: "FINAL CALL" },
];

export const DESTINATIONS: Destination[] = FRAMES.map((f, i) => ({
  index: i,
  code: META[i].code,
  city: META[i].city,
  label: f.label,
  gate: META[i].gate,
  flight: `MN${String(i + 1).padStart(3, "0")}`,
  status: META[i].status,
  accent: ACCENTS[i],
}));

/** Colour for a board status. */
export function statusColor(s: Status): string {
  switch (s) {
    case "ON TIME":
      return "#36b37e";
    case "BOARDING":
    case "NOW BOARDING":
      return "#e9c46a";
    case "FINAL CALL":
      return "#f08a4b";
    case "DELAYED":
      return "#ef6b75";
  }
}

/** Rotating PA announcements — keep Mohak's dry humour. */
export const ANNOUNCEMENTS = [
  "Welcome to Mohak International. Please mind the scope creep.",
  "Now boarding flight MN003 to Projects at Gate B3 — have your curiosity ready.",
  "Paging passenger M. Nahata: you appear to be building again.",
  "Flight MN006 to Sidequests is delayed; passenger got distracted by a side project.",
  "Final call for MN008 to Contact. The inbox is open and waiting.",
  "A reminder that unattended ideas will be shipped to production.",
];
