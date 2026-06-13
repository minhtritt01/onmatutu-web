import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const SERIES_DIR = path.join(process.cwd(), "content/series");

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

export function getAllPosts(): Post[] {
  return readMdxDir(BLOG_DIR).sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as PostFrontmatter, content };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostsByPillar(pillar: PostFrontmatter["pillar"]): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.pillar === pillar);
}

export function getPostsBySeries(seriesSlug: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.series === seriesSlug);
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

export function getAllSeries(): Series[] {
  return readMdxDir(SERIES_DIR).map((p) => ({
    slug: p.slug,
    frontmatter: p.frontmatter as unknown as SeriesFrontmatter,
    content: p.content,
  }));
}

export function getSeriesBySlug(slug: string): Series | null {
  const filePath = path.join(SERIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as SeriesFrontmatter, content };
}

export function getAllSeriesSlugs(): string[] {
  if (!fs.existsSync(SERIES_DIR)) return [];
  return fs
    .readdirSync(SERIES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
