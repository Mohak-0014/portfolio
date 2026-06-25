# Mohak Nahata — Portfolio

A storytelling portfolio: a fixed WebGL "personal world" (a cricket field at dusk)
that you travel through as you scroll, with vertical reveals, a horizontal-scroll
projects chapter, and a CMS-driven blog.

**Stack:** Next.js 15 (App Router) · React Three Fiber + drei (3D) · GSAP ScrollTrigger
+ Lenis (scroll) · Framer Motion (reveals) · Tailwind (navy/grey design system) ·
Sanity (headless CMS for the blog).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing your content

**All text lives in one file — you never touch components:**
`src/data/content.ts` — name, about, projects, skills, timeline, hobbies,
sidequests, contact.

Other touch points:
- **Design tokens / colors:** `tailwind.config.ts` (navy `ink.*`, grey `slate.*`,
  accent cyan-teal `accent`).
- **3D world:** `src/components/canvas/` — `WorldObject.tsx` is the central
  object (swap for a real `.glb` via drei's `<Gltf src="/models/world.glb" />`),
  `Experience.tsx` is the scroll-driven camera, `Starfield.tsx` the background.

> TODO: drop in your real GitHub/LinkedIn URLs in `src/data/content.ts`
> (`contact.socials`) — they currently point to the site roots.

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

- Respects `prefers-reduced-motion`: smooth scroll, the horizontal pin, and the
  WebGL layer all disable, falling back to a static gradient world.
- The 3D canvas is `pointer-events-none` and sits behind the content (`-z-10`).
