# Ổn Mà, Từ Từ — Website (#OnMaTuTu)

Next.js 16 (App Router, TypeScript, Tailwind v4) site for the channel. SEO-first, fully static via SSG.

## Getting started

```bash
npm install
npm run dev
```

## Re-enable Poppins font (real brand font, per `01-brand-identity.md`)

This sandbox build can't reach `fonts.googleapis.com`, so `src/app/layout.tsx`
currently uses a system font fallback. On your machine / Vercel, uncomment the
`next/font/google` Poppins + Geist Mono setup in `layout.tsx` and re-add the
`.variable` classes to the `<html>` element.

## Content workflow (MDX)

- Blog posts (1 per episode, expanded from script) -> `content/blog/*.mdx`
- Mini-series (Pillar D) -> `content/series/*.mdx`

Each blog post frontmatter:

```yaml
---
title: "..."
description: "..."
date: "2026-06-13"
pillar: "A" | "B" | "C" | "D"
episodeId: "EP00X"
videoUrl: "https://www.tiktok.com/embed/..." # optional
series: "7-ngay-thay-doi-nho" # optional, links to content/series/<slug>.mdx
tags: ["..."]
coverImage: "/images/ep00x.jpg" # optional
---
```

Workflow per `03-production-pipeline.md`:
1. Video status = "Published" in `06-episode-backlog.md`.
2. Write/expand the script into a blog post MDX (300-600 words, keep tone
   per `01-brand-identity.md`: gan gui, am ap, khong giao dieu).
3. Add to `content/blog/`, run `npm run build` to verify.
4. Update the episode row's Notes column with the published blog URL.

## SEO checklist already wired in

- `generateMetadata()` per page (title/description/OG/canonical)
- `Organization` + `Article` + `VideoObject` JSON-LD
- `sitemap.xml` and `robots.txt` auto-generated from content
- `next/image` for character art (update `siteConfig.ogImage` with a real
  1200x630 OG image before launch)

## TODO before launch

- [ ] Set real domain in `src/lib/site-config.ts` (`url`)
- [ ] Add real social URLs in `siteConfig.socials`
- [ ] Create `public/og-image.png` (1200x630)
- [ ] Re-enable Poppins font (see above)
- [ ] Connect Google Search Console + verify sitemap
- [ ] Add Google Analytics / GA4 (or Plausible) script in `layout.tsx`
