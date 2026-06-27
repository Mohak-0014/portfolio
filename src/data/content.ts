/**
 * ───────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for all personal content.
 *  Every section reads from here, so you never touch component code.
 * ───────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Mohak Nahata",
  tagline: "Software engineer · AI, web & products that ship",
  intro:
    "I’m Mohak — a final-year engineering student who turns ideas into products and curiosity into things that ship. I’m drawn to hard problems, AI, and the kind of build that starts with “how hard can it be?” and ends with something that actually works.",
  status: "Final-year B.Tech · open to software roles",
  location: "Assam ↔ Delhi, India",
};

/** Short labels used around the hero / about. */
export const world = {
  role: "Software Engineer",
  focus: "AI · Web · Products",
  mood: "Curious, competitive, and always building.",
};

/** About / story arc. */
export const about = {
  origin:
    "I grew up competitive — sport first, cricket most of all. When the pandemic put the field on hold, I redirected that energy into technology and a habit of constant learning. Building software quickly became the new game, and it stuck.",
  chasing:
    "These days I’m focused on building thoughtful, AI-driven products — while learning everything I can and trying to keep healthy and balanced along the way. It’s very much a work in progress.",
  beats: [
    "Most things I build start with one simple question: what if?",
    "I’m drawn to problems that don’t have an obvious answer yet.",
    "Still building, still learning, still curious.",
  ],
};

/** Projects. */
export type Project = {
  slug: string;
  title: string;
  blurb: string;
  tech: string[];
  year?: string;
  // detail-page fields
  tagline?: string;
  overview?: string;
  highlights?: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "travelos",
    title: "TravelOS",
    blurb:
      "An AI-powered travel operating system that orchestrates flights, hotels, itineraries, and real-time assistance through intelligent agents.",
    tech: ["React", "LangGraph", "FastAPI", "PostgreSQL", "OpenAI / HF LLMs"],
    year: "2025",
    tagline: "Turn a vague trip idea into a real plan — automatically.",
    overview:
      "TravelOS coordinates a team of specialised agents (search, booking, itinerary, concierge) behind one conversational surface. A LangGraph orchestrator routes intent, keeps shared state, and hands off between agents so the system can plan, re-plan, and assist in real time.",
    highlights: [
      "Multi-agent orchestration with LangGraph + shared memory",
      "FastAPI backend with PostgreSQL for durable trip state",
      "Real-time assistance and itinerary re-planning",
    ],
  },
  {
    slug: "nudgeflow",
    title: "NudgeFlow",
    blurb:
      "An AI-powered habit engine that embeds micro-habits into existing workflows and delivers personalized nudges to help users build lasting routines.",
    tech: ["TypeScript", "Redis", "Celery", "scikit-learn", "Google Calendar API", "PostgreSQL"],
    year: "2025",
    tagline: "Habits that fit into the life you already have.",
    overview:
      "NudgeFlow learns the rhythm of your day from your calendar and behaviour, then slots tiny, well-timed nudges into the gaps. A scikit-learn model personalises timing while Celery + Redis handle the scheduling at scale.",
    highlights: [
      "Personalised nudge timing via a scikit-learn model",
      "Celery + Redis task pipeline for reliable delivery",
      "Google Calendar integration for context-aware habits",
    ],
  },
  {
    slug: "evacuai",
    title: "EvacuAI",
    blurb:
      "An ML-driven indoor emergency evacuation system that models buildings as graphs and dynamically computes the safest escape routes based on hazards and crowd congestion.",
    tech: ["Python", "NetworkX", "A*", "XGBoost", "Streamlit", "Matplotlib"],
    year: "2024",
    tagline: "The safest way out, recomputed every second.",
    overview:
      "EvacuAI represents a building as a weighted graph and continuously re-weights edges from live hazard and congestion signals. An XGBoost risk model feeds an A* search to surface the safest route for every occupant, visualised live in Streamlit.",
    highlights: [
      "Building-as-graph modelling with NetworkX",
      "XGBoost hazard/congestion risk scoring",
      "A* safest-path search with live re-routing",
    ],
  },
];

/** Skills & Experience. */
export const skills: { group: string; items: string[] }[] = [
  { group: "Build", items: ["Kotlin", "Java", "Python", "JavaScript"] },
  { group: "Create", items: ["React", "Next.js", "Android"] },
  { group: "Scale", items: ["FastAPI", "AWS", "Docker", "Redis"] },
  { group: "Explore", items: ["PyTorch", "Hugging Face", "LangChain", "LangGraph"] },
  { group: "Ship", items: ["Git", "GitHub Actions", "Postman"] },
];

export type TimelineItem = {
  when: string;
  title: string;
  org: string;
  detail: string;
};

export const timeline: TimelineItem[] = [
  {
    when: "2025",
    title: "Patent Granted",
    org: "Inventor",
    detail:
      "Semantic & LLM-Guided Autonomous Incident Triage and Resolution Routing System for Microservice Swarm Architectures.",
  },
  {
    when: "2025",
    title: "Software Engineering Intern",
    org: "Airtel — Xtelify",
    detail: "Building and shipping at scale on a production engineering team.",
  },
  {
    when: "Year 1 & 2",
    title: "Academic Merit Scholarship",
    org: "B.Tech",
    detail: "Awarded for academic performance in the first and second years.",
  },
];

/** Hobbies. */
export const hobbies: { name: string; note: string }[] = [
  { name: "Sport", note: "Playing and watching — cricket above all else." },
  { name: "Music", note: "Always something playing in the background." },
  { name: "People", note: "The ones who keep me grounded." },
  { name: "New tech", note: "Exploring tools and ideas just to see how they work." },
];

/** Sidequests — the playful chapter. */
export const sidequests: { title: string; status: string; note: string; icon: string }[] = [
  {
    icon: "🏃",
    title: "Running",
    status: "Training",
    note: "Trying to convince my legs that 10Ks are supposed to be fun. Next stop: a half marathon.",
  },
  {
    icon: "🏏",
    title: "Cricket Glory",
    status: "Delusional",
    note: "Still chasing a cover drive that works more than once an over.",
  },
  {
    icon: "🤖",
    title: "AI Tinkering",
    status: "Always-On",
    note: "Teaching machines to do my chores. So far they’ve mostly taught me patience.",
  },
  {
    icon: "🎸",
    title: "Future Skills",
    status: "Queued",
    note: "Learn an instrument and finally prove I have talents outside of staring at screens.",
  },
  {
    icon: "🧍",
    title: "Adulting",
    status: "Researching",
    note: "A long-term experiment to determine what adults are actually supposed to be doing.",
  },
];

/** Contact. */
export const contact = {
  email: "mohaknahata0014@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Mohak-0014" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mohak-nahata-1776ab416/" },
  ],
};

/** Nav — section anchors used by the navbar + scroll progress. */
export const sections = [
  { id: "hero", label: "Start" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "hobbies", label: "Hobbies" },
  { id: "sidequests", label: "Sidequests" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;
