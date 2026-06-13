<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: "Ổn Mà, Từ Từ" (#OnMaTuTu) — SEO website

## What this project is
Companion website for a Vietnamese motivational animation channel
(TikTok/YouTube Shorts/FB & IG Reels/Zalo/Douyin). The channel's content
strategy, brand identity, production pipeline, and episode backlog live in
the parent project's markdown docs (`01-brand-identity.md` through
`06-episode-backlog.md`) — treat these as source of truth for tone, colors,
character description, and content pillars (A/B/C/D).

Site purpose: SEO "home base" — blog posts that expand each published video's
script into a short article, mini-series pages, affirmations roundup, brand
story, and full technical SEO (sitemap, JSON-LD, OG tags).

---

## Current state

### Stack
- Next.js 16 App Router + TypeScript + Tailwind v4, fully static (SSG)
- Deployed on **Vercel** (project: `onmatutu-web`, account: `phantritts-projects`)
- Live at **https://onmatutu.com** (DNS via PaVietnam, A record → 76.76.21.21)
- `npm run build` passes; deploy with `vercel --prod`

### Brand colors (Tailwind tokens in `src/app/globals.css`)
- `brand-yellow` #F4C95D — accent, CTA buttons, borders
- `brand-navy` #A8C5D6 — secondary, pillar labels
- `brand-white` #FFFFFF (light) / #0F0F11 (dark) — switches via CSS var
- `brand-gray` #D9D9D9 (light) / #2A2A2E (dark) — borders

### Dark/light mode
- Class-based: `.dark` on `<html>` element
- Toggle button (`src/components/ThemeToggle.tsx`) — persists to localStorage, respects `prefers-color-scheme`
- Anti-FOUC inline script in `<body>` (first child), `suppressHydrationWarning` on `<html>`
- All color tokens switch via CSS variables; prose uses `dark:prose-invert`
- Mobile: hamburger menu (`src/components/MobileNav.tsx`), desktop nav hidden on `sm:` breakpoint

### Pages
| Route | File |
|-------|------|
| `/` | `src/app/page.tsx` |
| `/blog` | `src/app/blog/page.tsx` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |
| `/series/[slug]` | `src/app/series/[slug]/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/affirmations` | `src/app/affirmations/page.tsx` |
| 404 | `src/app/not-found.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| OG image | `src/app/opengraph-image.tsx` |

### SEO already wired
- Sitemap at `/sitemap.xml` — all pages + blog posts, with `priority` and `changeFrequency`
- `robots.txt` — allows all, points to sitemap
- JSON-LD Organization schema on every page (layout), Article/VideoObject on blog posts
- OG image generated at build time (`opengraph-image.tsx`) — 1200×630, dark bg, character art
- `keywords`, `authors`, `canonical`, `robots: index/follow` in root metadata
- All blog post `lastModified` uses actual frontmatter `date`

### Content system
- MDX files in `content/blog/*.mdx` and `content/series/*.mdx`
- Parsed via `src/lib/content.ts` (gray-matter)
- Fonts: Poppins (latin + latin-ext) + Geist Mono via `next/font/google`

---

## Pending / must do

### ✅ Done
1. **Google Search Console** — site verified, sitemap `https://onmatutu.com/sitemap.xml`
   submitted on 2026-06-13. Google will index pages within a few days.
   Monitor: Search Console → Coverage tab.

### 🟡 Nice to have — do soon
2. **Real social URLs** — `src/lib/site-config.ts` has placeholder handles
   (`@onmatutu`) — update once channels are confirmed
3. **More blog posts** — only 1 post exists (`ep001`). Each new published video
   should have a corresponding MDX post (see Content workflow below)

### 🟢 Optional / future
4. **Analytics** — no GA4 or Plausible wired yet; add to `layout.tsx` when ready
5. **OG image per blog post** — currently all pages share the site-level OG image;
   add `opengraph-image.tsx` inside `app/blog/[slug]/` to generate per-post images

---

## Content workflow for new posts
When a video reaches "Published" status in `06-episode-backlog.md`:
1. Create `content/blog/<slug>.mdx` with frontmatter:
   ```
   title, description, date (ISO), pillar (A/B/C/D), episodeId,
   optional: videoUrl, series, tags, coverImage
   ```
2. Body: 300-600 words, Hook-Story-Lesson structure expanded into prose.
   Tone = gần gũi/ấm áp/không giáo điều. Avoid cliché quotes — ground
   everything in the character's specific situation.
3. If part of a Pillar D mini-series, ensure `content/series/<series-slug>.mdx`
   exists and set `series: "<series-slug>"` in the post frontmatter.
4. Run `npm run build` to verify it compiles and appears in sitemap.
5. Run `vercel --prod` to deploy.

---

## Conventions
- Keep pages as Server Components (no `"use client"`) unless interactivity
  is required — site should remain fully static for SEO.
- All new pages need `generateMetadata()` with title, description, and
  `alternates: { canonical: \`${siteConfig.url}/path\` }`.
- Use brand color tokens (`brand-yellow`, `brand-navy`, `brand-background`,
  `brand-gray`) — never arbitrary hex values.
- Dark mode: use CSS variable tokens (they switch automatically). Only add
  explicit `dark:` classes for prose (`dark:prose-invert`) or one-off overrides.
- Structured data: inline `<script type="application/ld+json">` with
  `dangerouslySetInnerHTML` — see `layout.tsx` (Organization) and
  `blog/[slug]/page.tsx` (Article/VideoObject) for the pattern.
- All UI copy in Vietnamese, warm/casual tone matching brand identity.
- After any change: `npm run build` must pass before deploying.
