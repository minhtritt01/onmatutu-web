import fs from "fs";
import path from "path";
import matter from "gray-matter";

function videosDir(locale: string) {
  return path.join(process.cwd(), "content/videos", locale);
}

export type VideoEntryFrontmatter = {
  title: string;
  description: string;
  date: string;
  topic: string;
  accentColor: string;
  characterImages: string[];
  videoUrls?: {
    tiktok?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
  };
};

export type VideoEntry = {
  slug: string;
  frontmatter: VideoEntryFrontmatter;
  content: string;
};

function readVideosDir(dir: string): VideoEntry[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as VideoEntryFrontmatter, content };
    });
}

export function getAllVideos(locale = "vi"): VideoEntry[] {
  const items = readVideosDir(videosDir(locale));
  const source =
    items.length > 0 ? items : locale !== "vi" ? readVideosDir(videosDir("vi")) : [];
  return source.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getVideoBySlug(slug: string, locale = "vi"): VideoEntry | null {
  const filePath = path.join(videosDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    if (locale !== "vi") return getVideoBySlug(slug, "vi");
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as VideoEntryFrontmatter, content };
}

export function getAllVideoSlugs(locale = "vi"): string[] {
  const dir = videosDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
