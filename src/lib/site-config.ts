export const siteConfig = {
  name: "Ổn Mà, Từ Từ",
  hashtag: "#OnMaTuTu",
  url: "https://onmatutu.com",
  ogImage: "/opengraph-image",
  socials: {
    tiktok: "https://www.tiktok.com/@onmatutu",
    youtube: "https://www.youtube.com/@onmatutu",
    instagram: "https://www.instagram.com/onmatutu",
    facebook: "https://www.facebook.com/onmatutuofficial",
  },
  // Generic social-proof stats shown on the homepage. Each item is a label
  // key (resolved to the `home.stat<Key>` i18n string) plus a raw number.
  // Add / remove / reorder freely — StatsStrip renders whatever is here.
  stats: [
    { key: "followers", value: 30 },
    { key: "views", value: 21167 },
    { key: "videos", value: 35 },
  ],
} as const;

export type Pillar = "A" | "B" | "C" | "D";
