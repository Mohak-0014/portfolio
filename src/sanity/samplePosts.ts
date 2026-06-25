import type { PortableTextBlock } from "@portabletext/react";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  coverImage?: unknown;
  body?: PortableTextBlock[];
  readingTime?: number;
};

/** Helper to build a simple Portable Text paragraph block. */
const p = (text: string): PortableTextBlock => ({
  _type: "block",
  _key: Math.random().toString(36).slice(2),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: "s", text, marks: [] }],
});

/**
 * Local fallback posts so the blog renders before Sanity is connected.
 * Once your CMS has posts, these are automatically replaced.
 */
export const samplePosts: Post[] = [
  {
    slug: "how-hard-can-it-be",
    title: "“How hard can it be?” — a developer's most dangerous sentence",
    excerpt:
      "A short field guide to the optimism that starts every side project and the lessons that survive it.",
    publishedAt: "2026-05-30",
    tags: ["side-projects", "learning"],
    readingTime: 4,
    body: [
      p(
        "Every project I've built started with the same four words: how hard can it be? This post is about what usually happens next."
      ),
      p(
        "Replace this with your own writing once Sanity is connected — until then it's here so the blog has something to show."
      ),
    ],
  },
  {
    slug: "building-travelos",
    title: "Building TravelOS: orchestrating travel with AI agents",
    excerpt:
      "Notes on wiring LangGraph agents to plan flights, hotels and itineraries without losing my mind.",
    publishedAt: "2026-04-18",
    tags: ["ai", "agents", "langgraph"],
    readingTime: 6,
    body: [
      p(
        "A behind-the-scenes look at how TravelOS coordinates multiple agents to turn a vague trip idea into a real plan."
      ),
    ],
  },
  {
    slug: "staying-sane-with-cricket",
    title: "Cricket, code, and staying sane",
    excerpt:
      "How a sport I'm obsessed with keeps me grounded while I chase the build-everything dream.",
    publishedAt: "2026-03-02",
    tags: ["life", "cricket"],
    readingTime: 3,
    body: [
      p(
        "Some thoughts on balance, the field at 5PM, and why I keep coming back to the crease."
      ),
    ],
  },
];
