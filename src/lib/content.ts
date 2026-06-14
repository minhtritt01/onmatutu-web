import fs from "fs";
import path from "path";
import matter from "gray-matter";

function blogDir(locale: string) {
  return path.join(process.cwd(), "content/blog", locale);
}

function seriesDir(locale: string) {
  return path.join(process.cwd(), "content/series", locale);
}

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO
  pillar: "A" | "B" | "C" | "D";
  episodeId?: string; // e.g. EP001
  videoUrl?: string; // embed link (TikTok/YouTube)
  series?: string; // series slug, if part of one
  tags?: string[];
  coverImage?: string;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

function readMdxDir(dir: string): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as PostFrontmatter, content };
    });
}

export function getAllPosts(locale = "vi"): Post[] {
  const dir = blogDir(locale);
  const posts = readMdxDir(dir);
  // Fallback: if locale dir is empty, try vi
  const source = posts.length > 0 ? posts : locale !== "vi" ? readMdxDir(blogDir("vi")) : [];
  return source.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string, locale = "vi"): Post | null {
  const filePath = path.join(blogDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    if (locale !== "vi") return getPostBySlug(slug, "vi");
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as PostFrontmatter, content };
}

export function getAllPostSlugs(locale = "vi"): string[] {
  const dir = blogDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostsByPillar(pillar: PostFrontmatter["pillar"], locale = "vi"): Post[] {
  return getAllPosts(locale).filter((p) => p.frontmatter.pillar === pillar);
}

export function getPostsBySeries(seriesSlug: string, locale = "vi"): Post[] {
  return getAllPosts(locale).filter((p) => p.frontmatter.series === seriesSlug);
}

// --- Series ---

export type SeriesFrontmatter = {
  title: string;
  description: string;
  coverImage?: string;
};

export type Series = {
  slug: string;
  frontmatter: SeriesFrontmatter;
  content: string;
};

function readSeriesMdxDir(dir: string): Series[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as SeriesFrontmatter, content };
    });
}

export function getAllSeries(locale = "vi"): Series[] {
  const items = readSeriesMdxDir(seriesDir(locale));
  if (items.length > 0) return items;
  if (locale !== "vi") return readSeriesMdxDir(seriesDir("vi"));
  return [];
}

export function getSeriesBySlug(slug: string, locale = "vi"): Series | null {
  const filePath = path.join(seriesDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    if (locale !== "vi") return getSeriesBySlug(slug, "vi");
    return null;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as SeriesFrontmatter, content };
}

export function getAllSeriesSlugs(locale = "vi"): string[] {
  const dir = seriesDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
