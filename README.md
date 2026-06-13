# Ổn Mà, Từ Từ — #OnMaTuTu

**Website:** [onmatutu.com](https://onmatutu.com)

Companion website for the **Ổn Mà, Từ Từ** Vietnamese motivational animation channel.
Short animated stories about motivation, mindset, and being kind to yourself — ổn mà, từ từ rồi cũng ổn.

---

## About the channel

**Ổn Mà, Từ Từ** creates short animated videos for people who are working, studying, and sometimes feel like everything is a bit too much.

The main character is not a motivational coach — they're more like a friend sitting next to you, saying _"it's okay, take it slow, things will work out."_

Each video takes a small everyday situation — failure, self-comparison, exhaustion, burnout — and offers a positive perspective: no lecturing, no empty quotes, just warmth and honesty.

### Channels

| Platform  | Link                                                               |
| --------- | ------------------------------------------------------------------ |
| TikTok    | [tiktok.com/@onmatutu](https://www.tiktok.com/@onmatutu)           |
| YouTube   | [youtube.com/@onmatutu](https://www.youtube.com/@onmatutu)         |
| Instagram | [instagram.com/onmatutu](https://www.instagram.com/onmatutu)       |
| Facebook  | [facebook.com/onmatutu](https://www.facebook.com/onmatutuofficial) |

---

## About this website

Built as an SEO home base. Each published video gets a companion blog post that expands the script into a short article — searchable on Google, shareable, and evergreen.

**Tech stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · MDX · Vercel

### Features

- Blog posts per episode (`/blog`)
- Mini-series pages for Pillar D content (`/series`)
- Daily affirmations (`/affirmations`)
- Dark / light mode
- Fully static (SSG) — fast and SEO-friendly
- Auto-generated sitemap, robots.txt, JSON-LD structured data, OG image

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verify before deploying
vercel --prod    # deploy to onmatutu.com
```

## Adding a new post

1. Create `content/blog/<slug>.mdx`:

```yaml
---
title: "..."
description: "..."
date: "2026-06-13"
pillar: "B"
episodeId: "EP001"
videoUrl: "" # optional TikTok/YouTube embed URL
series: "" # optional TikTok/YouTube embed URL
series: ""          # optional, links to content/series/<slug>.mdx
---
```

1. Write 300–600 words. Tone: warm, casual, no lecturing.
2. `npm run build` → `vercel --prod`
