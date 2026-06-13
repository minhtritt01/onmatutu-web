export const siteConfig = {
  name: "Ổn Mà, Từ Từ",
  hashtag: "#OnMaTuTu",
  description:
    "Những câu chuyện hoạt hình nhỏ về động lực, mindset và sự tử tế với chính mình — ổn mà, từ từ rồi cũng ổn.",
  url: "https://onmatutu.com", // TODO: replace with real domain
  ogImage: "/opengraph-image",
  socials: {
    tiktok: "https://www.tiktok.com/@onmatutu",
    youtube: "https://www.youtube.com/@onmatutu",
    instagram: "https://www.instagram.com/onmatutu",
    facebook: "https://www.facebook.com/onmatutu",
  },
  pillars: {
    A: "Câu chuyện ngụ ngôn ngắn",
    B: "Nhân vật phản ứng tình huống",
    C: "Affirmation / Lời nhắc buổi sáng",
    D: "Mini-series theo chủ đề",
  },
} as const;

export type Pillar = keyof typeof siteConfig.pillars;
