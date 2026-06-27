/**
 * ───────────────────────────────────────────────────────────────
 *  THE JOURNEY — a guided walk through Mohak International.
 *
 *  Instead of jumping around, you move forward stop by stop, like a
 *  real trip. Each checkpoint reveals a part of the story. The plane
 *  (stop index PLANE_STOP) is reached through a boarding-gate scan.
 * ───────────────────────────────────────────────────────────────
 */

export type Stop = {
  id: string;
  zone: string; // station name (overhead sign + footer)
  sign: string; // short overhead-sign label
  icon: string; // pictogram
  caption: string; // one-line scene caption (Mohak's voice)
  accent: string;
  section: number; // index into BODIES (content section)
};

export const ITINERARY: Stop[] = [
  {
    id: "entrance",
    zone: "Terminal Entrance",
    sign: "ARRIVALS · WELCOME",
    icon: "🚪",
    caption: "Welcome to Mohak International. Mind the scope creep.",
    accent: "#0F9488",
    section: 0, // Hello
  },
  {
    id: "passport",
    zone: "Passport Control",
    sign: "PASSPORT CONTROL",
    icon: "🛂",
    caption: "Please present your story for inspection.",
    accent: "#2A7DB5",
    section: 1, // About
  },
  {
    id: "checkin",
    zone: "Check-in Counter",
    sign: "CHECK-IN",
    icon: "🧳",
    caption: "Anything to declare? Just a toolkit and some ambition.",
    accent: "#1FA37A",
    section: 3, // Skills
  },
  {
    id: "security",
    zone: "Security Screening",
    sign: "SECURITY",
    icon: "🔍",
    caption: "Place your builds on the belt, please.",
    accent: "#7C5CD0",
    section: 2, // Projects
  },
  {
    id: "lounge",
    zone: "Departure Lounge",
    sign: "DEPARTURE LOUNGE",
    icon: "🛋️",
    caption: "Some time to kill before the gate.",
    accent: "#D98A1F",
    section: 5, // Sidequests
  },
  {
    id: "newsstand",
    zone: "Newsstand",
    sign: "NEWSSTAND",
    icon: "📰",
    caption: "Grab something to read for the flight.",
    accent: "#0E9AAE",
    section: 6, // Blog
  },
  {
    id: "cabin",
    zone: "On Board",
    sign: "SEAT 1A",
    icon: "✈️",
    caption: "Cruising altitude reached. Tray tables down.",
    accent: "#E05A6E",
    section: 4, // Hobbies / Life
  },
  {
    id: "arrival",
    zone: "Arrivals",
    sign: "ARRIVALS · DESTINATION",
    icon: "📍",
    caption: "You've arrived. Let's talk.",
    accent: "#5466D0",
    section: 7, // Contact
  },
];

/** The stop you board the plane for — entering it plays the gate scan. */
export const PLANE_STOP = 6;
