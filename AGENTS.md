<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# "Ổn Mà, Từ Từ" (#OnMaTuTu) — SEO website

Vietnamese motivational animation channel companion site. SEO home base: blog posts
expand each video script into an article. Brand/tone/pillars (A/B/C/D) are in the
parent docs (`01-brand-identity.md` – `06-episode-backlog.md`).

## Stack & deployment
- Next.js 16 App Router + TypeScript + Tailwind v4, fully static SSG
- Live: **https://onmatutu.com** — Vercel project `onmatutu-web` (`phantritts-projects`)
- Deploy: `vercel --prod` — always run `npm run build` first

## Key non-obvious architecture

**Brand colors** — defined as CSS vars in `globals.css`, exposed as Tailwind tokens.
Use tokens only (`brand-yellow`, `brand-navy`, `brand-gray`), never hex.

**Dark mode** — class-based (`.dark` on `<html>`). CSS vars switch automatically;
only prose needs an explicit `dark:prose-invert`. `<html>` has `suppressHydrationWarning`
because an inline script in `<body>` adds `.dark` before React hydrates (anti-FOUC).
Toggle: `ThemeToggle.tsx` (localStorage + `prefers-color-scheme`).
Mobile nav: `MobileNav.tsx` (hamburger, hidden on `sm:`).

**OG image** — generated at build time via `src/app/opengraph-image.tsx` (ImageResponse,
nodejs runtime, reads character jpg from filesystem). All pages share it; no static file.

**SEO** — sitemap with `priority`/`changeFrequency`/real dates, JSON-LD Organization
(layout) + Article/VideoObject (blog posts), canonical on every page.
Google Search Console: verified + sitemap submitted 2026-06-13.

## Content: adding a new post
1. `content/blog/<slug>.mdx` — frontmatter: `title`, `description`, `date` (ISO),
   `pillar` (A/B/C/D), `episodeId`, optional `videoUrl`/`series`/`tags`/`coverImage`
2. Body: 300–600 words, Hook-Story-Lesson, tone = gần gũi/ấm áp/không giáo điều
3. Pillar D series: create `content/series/<slug>.mdx` + set `series:` in post
4. `npm run build` → `vercel --prod`

## Conventions
- Server Components by default; `"use client"` only when interactivity is needed
- New pages need `generateMetadata()` with `title`, `description`, `alternates.canonical`
- Structured data: `<script type="application/ld+json" dangerouslySetInnerHTML=...>`
- All UI copy in Vietnamese

## TODO
- **Social URLs** — `site-config.ts` has placeholder `@onmatutu` handles; update when confirmed
- **Analytics** — GA4 `G-1PCZPEX30C` wired in `layout.tsx` via `next/script` ✅
- **Per-post OG image** — add `opengraph-image.tsx` in `app/blog/[slug]/` for richer sharing
