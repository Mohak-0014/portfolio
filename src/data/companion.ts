/**
 * Lines for the arrivals-greeter companion (see Greeter.tsx).
 *
 * One little chibi wanders the page and talks to you from a speech bubble. Each
 * line carries a `mood` so the sprite's pose/face reacts to what it's saying.
 * Voice is a "mixed bag": mostly self-deprecating and clever, with the odd line
 * that pokes the visitor. Keep lines short — a bubble is read in a glance.
 *
 * Each section has several lines across different moods; the companion picks one
 * at random and rotates through them while you linger. Keyed by the section ids
 * in `sections` (src/data/content.ts). `idle` shows when you sit still; `poke`
 * is what you get for clicking it.
 */

export type Mood =
  | "happy"
  | "cheeky"
  | "funny"
  | "angry"
  | "smug"
  | "surprised"
  | "sleepy";

export type Line = { text: string; mood: Mood };

export const PLACARDS: Record<string, Line[]> = {
  hero: [
    { text: "Oh good, a visitor. I’ve been rendering here since 2 a.m.", mood: "smug" },
    { text: "Welcome aboard. I’m the in-flight entertainment.", mood: "cheeky" },
    { text: "Scroll down — the plot, allegedly, thickens.", mood: "funny" },
    { text: "Hi! Statistically you’ll leave in 8 seconds. Prove me wrong.", mood: "surprised" },
    { text: "A wild portfolio appears. It used Charm. It’s super effective.", mood: "funny" },
    { text: "Make yourself at home. Mind the unfinished animations.", mood: "happy" },
  ],
  about: [
    { text: "The lore section. Spoiler: it runs on caffeine.", mood: "funny" },
    { text: "Final-year B.Tech — fluent in deadlines and denial.", mood: "cheeky" },
    { text: "He’ll undersell himself here, so I’ll oversell him.", mood: "smug" },
    { text: "Origin story incoming. No radioactive spiders, sadly.", mood: "happy" },
    { text: "Plot twist: the “about me” is mostly about snacks.", mood: "cheeky" },
    { text: "Yes, that’s really his face. I rendered it lovingly.", mood: "surprised" },
  ],
  projects: [
    { text: "Exhibits A through whatever: things that compile on a good day.", mood: "happy" },
    { text: "Built at 3 a.m., debugged at 4, regretted by 9.", mood: "sleepy" },
    { text: "“Works on my machine” — a legally binding statement.", mood: "cheeky" },
    { text: "Each of these survived at least one rage-quit.", mood: "funny" },
    { text: "Warning: contains traces of genius and Stack Overflow.", mood: "smug" },
    { text: "Click around. Nothing here bites. Probably.", mood: "surprised" },
  ],
  skills: [
    { text: "Skill: typing confidently until the red squiggles surrender.", mood: "funny" },
    { text: "The docs and I are in a committed relationship.", mood: "cheeky" },
    { text: "Certified in turning “it depends” into a whole career.", mood: "smug" },
    { text: "Fluent in three languages — two of them are JavaScript.", mood: "funny" },
    { text: "Yes, I can center a div. No, don’t ask how long it took.", mood: "cheeky" },
    { text: "Powered by curiosity, chai, and mild panic.", mood: "happy" },
  ],
  hobbies: [
    { text: "Cricket: where my bugs are politely called “no-balls.”", mood: "funny" },
    { text: "Off-screen I chase a leather ball. On-screen, edge cases.", mood: "happy" },
    { text: "Hobbies stop me refactoring at midnight. Mostly.", mood: "cheeky" },
    { text: "I have a cover drive and a recovery plan. One works.", mood: "funny" },
    { text: "Touch grass? I sprint on it. It’s called fielding.", mood: "cheeky" },
    { text: "Work–life balance: it wobbles, but it’s there.", mood: "happy" },
  ],
  sidequests: [
    { text: "Side quests: all the XP, none of the deadlines.", mood: "cheeky" },
    { text: "Built for the plot, not the résumé.", mood: "funny" },
    { text: "Lab escapees. No adult supervision was harmed.", mood: "surprised" },
    { text: "Where “what if I just…” becomes a whole weekend.", mood: "happy" },
    { text: "Half-baked ideas, fully committed.", mood: "funny" },
    { text: "These exist purely because I got curious. Worth it.", mood: "smug" },
  ],
  blog: [
    { text: "Words for when the compiler refuses to listen.", mood: "sleepy" },
    { text: "Hot takes, lukewarm grammar, zero refunds.", mood: "cheeky" },
    { text: "Yes, a dev with a blog. Revolutionary, I know.", mood: "smug" },
    { text: "Thoughts I had at 1 a.m. that survived daylight.", mood: "funny" },
    { text: "Free to read. The opinions cost nothing too.", mood: "cheeky" },
    { text: "I write it down so I don’t explain it twice.", mood: "happy" },
  ],
  contact: [
    { text: "You’ve scrolled the whole runway. Say hi before takeoff?", mood: "happy" },
    { text: "This is the “please hire him” bit. Subtle, right?", mood: "cheeky" },
    { text: "My inbox does a little dance for every message.", mood: "funny" },
    { text: "Don’t be shy — I reply faster than my CI pipeline.", mood: "funny" },
    { text: "One message and you’re officially my favorite visitor.", mood: "happy" },
    { text: "Slide into the contact form. Less weird than DMs.", mood: "cheeky" },
  ],
  idle: [
    { text: "Still here. Built different — mostly built tired.", mood: "sleepy" },
    { text: "Take your time. I’m contractually idle.", mood: "happy" },
    { text: "Psst. Poke me. I dare you.", mood: "cheeky" },
    { text: "You’re thorough. I respect the audacity.", mood: "smug" },
    { text: "I’d pace around, but someone told me to move less.", mood: "funny" },
  ],
  poke: [
    { text: "Ow. That’s assault on a minor sprite.", mood: "angry" },
    { text: "Poke me again and I’m filing a ticket.", mood: "angry" },
    { text: "Personal. Pixel. Space.", mood: "smug" },
    { text: "Bold move. I bruise like a banana.", mood: "funny" },
    { text: "We’ve been over this — I’m not a button.", mood: "cheeky" },
    { text: "Yikes! Warn a guy before the boop.", mood: "surprised" },
    { text: "Do that again and I’m unionizing.", mood: "angry" },
  ],
};
