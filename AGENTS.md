<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
In Next.js 16, `middleware.ts` is deprecated — use `src/proxy.ts` instead.
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

**i18n (vi + en)** — powered by `next-intl` v4.
- Routes live under `src/app/[locale]/` — both locales pre-rendered at build time
- Locale detection + redirect handled by `src/proxy.ts` (Next.js 16 proxy convention)
- UI strings: `messages/vi.json` + `messages/en.json`
- Blog content: `content/blog/vi/<slug>.mdx` + `content/blog/en/<slug>.mdx`
- Series content: `content/series/vi/` + `content/series/en/`
- If an English MDX file is missing, `content.ts` falls back to the Vietnamese version
- Internal links: use `Link` from `@/i18n/navigation` (NOT `next/link`) — it auto-prefixes the locale
- Same for `useRouter` / `usePathname` — import from `@/i18n/navigation`
- Server components: `getTranslations(namespace)` + `setRequestLocale(locale)` before any i18n call
- Client components: `useTranslations(namespace)`
- Language switcher: `LanguageSwitcher.tsx` (VI/EN toggle in header)
- Routing config: `src/i18n/routing.ts` — locales `['vi', 'en']`, default `vi`, prefix `always`

**Brand colors** — defined as CSS vars in `globals.css`, exposed as Tailwind tokens.
Use tokens only (`brand-yellow`, `brand-navy`, `brand-gray`), never hex.

**Dark mode** — class-based (`.dark` on `<html>`). CSS vars switch automatically;
only prose needs an explicit `dark:prose-invert`. `<html>` has `suppressHydrationWarning`
because an inline script in `<body>` adds `.dark` before React hydrates (anti-FOUC).
Toggle: `ThemeToggle.tsx` (localStorage + `prefers-color-scheme`).
Mobile nav: `MobileNav.tsx` (hamburger, hidden on `sm:`).

**OG image** — generated at build time via `src/app/[locale]/opengraph-image.tsx`
(ImageResponse, nodejs runtime, reads character jpg from filesystem, locale-aware subtitle).

**SEO** — sitemap with hreflang alternates for both locales, JSON-LD Organization
(layout) + Article/VideoObject (blog posts), canonical + alternates on every page.
Google Search Console: verified + sitemap submitted 2026-06-13.

## Content: adding a new post
1. `content/blog/vi/<slug>.mdx` — Vietnamese version (required)
2. `content/blog/en/<slug>.mdx` — English translation (optional; falls back to vi if missing)
3. Frontmatter: `title`, `description`, `date` (ISO), `pillar` (A/B/C/D),
   `episodeId`, optional `videoUrl`/`series`/`tags`/`coverImage`
4. Body: 300–600 words, Hook-Story-Lesson, tone = gần gũi/ấm áp/không giáo điều
5. Pillar D series: create `content/series/vi/<slug>.mdx` + set `series:` in post
6. `npm run build` → `vercel --prod`

## Conventions
- Server Components by default; `"use client"` only when interactivity is needed
- New pages go under `src/app/[locale]/` — add `setRequestLocale(locale)` + `generateMetadata`
- `generateMetadata` must include `alternates.canonical` + `alternates.languages` (vi + en)
- Structured data: `<script type="application/ld+json" dangerouslySetInnerHTML=...>`
- `site-config.ts` holds only locale-agnostic values (name, url, socials); descriptions are in `messages/*.json`

## TODO
- **Social URLs** — `site-config.ts` has placeholder `@onmatutu` handles; update when confirmed
- **Analytics** — GA4 `G-1PCZPEX30C` wired in `layout.tsx` via `next/script` ✅
- **i18n** — vi + en fully implemented ✅
- **Per-post OG image** — add `opengraph-image.tsx` in `app/[locale]/blog/[slug]/` for richer sharing
