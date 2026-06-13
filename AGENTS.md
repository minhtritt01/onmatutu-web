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

## Current state (already scaffolded — do not rebuild from scratch)
- Next.js 16 App Router + TypeScript + Tailwind v4, fully static (SSG)
- `npm run build` passes successfully
- Brand colors wired as Tailwind theme tokens in `src/app/globals.css`:
  `brand-yellow` #F4C95D, `brand-navy` #A8C5D6, `brand-white` #FFFFFF,
  `brand-gray` #D9D9D9
- `@tailwindcss/typography` installed for MDX prose styling
- Content system: MDX files in `content/blog/*.mdx` and
  `content/series/*.mdx`, loaded via `src/lib/content.ts` (gray-matter)
- Pages built: `/`, `/blog`, `/blog/[slug]`, `/series/[slug]`, `/about`,
  `/affirmations`, plus `sitemap.ts` and `robots.ts`
- One example post: `content/blog/ep001-cham-hon-moi-nguoi.mdx`
- Character reference image copied to `public/character/phoenix-peaceful.jpg`
  and used on the homepage hero + about page

## Known TODO / things to fix
1. **Font**: `src/app/layout.tsx` currently uses a system font fallback
   because the build sandbox couldn't reach fonts.googleapis.com. The brand
   font is **Poppins** (per `01-brand-identity.md`, supports Vietnamese
   diacritics, used in CapCut). Re-enable the commented-out
   `next/font/google` Poppins + Geist Mono setup in `layout.tsx` and add the
   `.variable` classes back to the `<html>` element — this should just work
   in a normal dev environment.
2. **`siteConfig`** in `src/lib/site-config.ts` has placeholder values:
   - `url` is `https://onmatutu.com` — update to the real purchased domain
   - `socials` (tiktok/youtube/instagram/facebook) are placeholder handles —
     update to real channel URLs
   - `ogImage` points to `/og-image.png` which doesn't exist yet — create a
     1200x630 OG image (can reuse character art) and add to `public/`
3. **Default Next.js SVG assets** (`public/{file,globe,next,vercel,window}.svg`)
   are leftover from `create-next-app` and unused — safe to delete.

## Content workflow for new posts
When a video reaches "Published" status in `06-episode-backlog.md`:
1. Create `content/blog/<slug>.mdx` with frontmatter (see README for schema:
   title, description, date, pillar A-D, episodeId, optional videoUrl/series/
   tags/coverImage).
2. Body: 300-600 words, Hook-Story-Lesson structure expanded into prose,
   tone = gần gũi/ấm áp/không giáo điều (per brand identity doc), avoid
   cliché quotes — ground everything in the character's specific situation.
3. If part of a Pillar D mini-series, also ensure
   `content/series/<series-slug>.mdx` exists and set `series:
   "<series-slug>"` in the post frontmatter.
4. Run `npm run build` to verify it compiles and appears in sitemap.

## Conventions to follow
- Keep pages as Server Components (no `"use client"`) unless interactivity
  is required — site should remain fully static for SEO.
- All new pages need `generateMetadata()` (title, description, canonical via
  `siteConfig.url`).
- Use brand color tokens (`brand-yellow`, `brand-navy`, `brand-white`,
  `brand-gray`) rather than arbitrary hex values.
- Structured data: follow the existing pattern of inline `<script
  type="application/ld+json">` with `dangerouslySetInnerHTML` (see
  `layout.tsx` for Organization, `blog/[slug]/page.tsx` for
  Article/VideoObject).
- All UI copy is in Vietnamese, matching the warm/casual tone of the brand.

