# Mohak Nahata — Portfolio

A bright, glassy single-page portfolio. A fixed sky backdrop quietly shifts from
daytime toward dusk as you scroll, frosted-glass sections reveal on the way down,
the projects chapter scrolls sideways, a corner mascot reacts to where you are,
and the blog is CMS-driven.

**Stack:** Next.js 15 (App Router, React 19) · Tailwind (light glass design system) ·
Framer Motion (reveals + mascot) · GSAP ScrollTrigger + Lenis (smooth + pinned scroll) ·
Sanity (headless CMS for the blog).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## How it's wired

Everything renders from `src/app/page.tsx`:

- **`components/canvas/SceneCanvas.tsx`** — the fixed full-viewport backdrop. It's
  pure CSS gradients (a daytime sky that washes into dusk on scroll), sits behind
  the content at `-z-10`, and is `pointer-events-none`. No WebGL.
- **`components/companion/Greeter.tsx`** — the corner mascot. It watches the active
  section and shows mood-matched, slightly sarcastic placards (sprites in
  `public/companion/`, lines in `src/data/companion.ts`).
- **`components/ui/Navbar.tsx`** — floating nav with smooth-scroll anchors; collapses
  to a hamburger dropdown below `md`.
- **`components/ui/ScrollProgress.tsx`** — top reading-progress bar.
- **Sections** (`src/sections/`): `Hero`, `About`, `Projects` (GSAP-pinned
  horizontal-scroll track), `Skills`, `Hobbies`, `Sidequests`, `BlogPreview`
  (server component, async Sanity fetch), `Contact`.

Smooth scrolling is set up once in `components/SmoothScroll.tsx` (Lenis synced to
GSAP ScrollTrigger), wrapped around the app in `src/app/layout.tsx`.

> **Note:** `src/components/canvas/` also holds earlier React Three Fiber 3D
> experiments (`Diorama`, `Island`, `HotAirBalloon`, `AuroraField`,
> `ParticleField`, `Sky`, `HeroLaptop`, `Experience`, …). They are **not mounted**
> in the current site — `SceneCanvas` replaced them with the lighter CSS backdrop.
> They're kept as references; `three` / `@react-three/*` remain in `package.json`
> only for them.

## Editing your content

**All copy lives in data files — you never touch components:**

- `src/data/content.ts` — profile, about, projects, skills, timeline, hobbies,
  sidequests, contact (email + social links), and the nav `sections` list.
- `src/data/companion.ts` — the mascot's per-section placard lines and moods.

Other touch points:

- **Design tokens / colors:** `tailwind.config.ts` — `moon` (primary deep-ink text
  on light), `ink.*` / `slate.*` greys, and the emerald/teal `accent`. The `.glass`,
  `.btn-accent`, `.container-x`, and `.eyebrow` utilities live in `src/app/globals.css`.
- **Companion sprites:** `public/companion/*.png`.
- **Resume:** `public/Mohak_Nahata_Resume.pdf`.

## Blog (Sanity)

The blog works immediately with **local sample posts**
(`src/sanity/samplePosts.ts`). To publish real posts:

1. Create a project at https://www.sanity.io/manage.
2. Copy `.env.local.example` → `.env.local` and fill in the project ID/dataset.
3. Spin up a Sanity Studio and register the schema in `sanity/schemas/post.ts`
   (it matches what the site queries in `src/sanity/queries.ts`).
4. Publish a post — the site swaps from samples to live content automatically
   (revalidates every 60s).

## Accessibility & performance

- Respects `prefers-reduced-motion`: Lenis smooth scroll, the GSAP horizontal pin,
  and the mascot's motion all disable, and the projects track falls back to a
  native swipe-with-snap row.
- No WebGL on the page, so it stays light on phones; the backdrop is CSS-only and
  sits behind the content (`-z-10`, `pointer-events-none`).
- The navbar collapses to a hamburger menu on mobile.

## Deploy

Source lives at https://github.com/Mohak-0014/portfolio. It's a standard Next.js
App Router app — deploy by importing the repo on [Vercel](https://vercel.com/new)
(framework auto-detected) for automatic redeploys on every push.
