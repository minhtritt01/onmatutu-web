import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { siteConfig } from "@/lib/site-config";
import { getPostBySlug } from "@/lib/content";

export const runtime = "nodejs";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PILLAR_COLORS: Record<string, string> = {
  A: "#f4c95d",
  B: "#a8c5d6",
  C: "#7AE8B8",
  D: "#C87AB0",
};

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function Image({ params }: Props) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  const title = post?.frontmatter.title ?? siteConfig.name;
  const description = post?.frontmatter.description ?? "";
  const pillar = post?.frontmatter.pillar ?? "A";
  const episodeId = post?.frontmatter.episodeId ?? "";
  const accentColor = PILLAR_COLORS[pillar] ?? "#f4c95d";

  const imgData = readFileSync(
    join(process.cwd(), "public/character/phoenix-peaceful.jpg")
  );
  const src = `data:image/jpeg;base64,${imgData.toString("base64")}`;

  const truncatedDesc =
    description.length > 100 ? description.slice(0, 100) + "…" : description;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f0f11",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: 64,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span
              style={{
                background: accentColor,
                color: "#0f0f11",
                fontSize: 16,
                fontWeight: 700,
                padding: "4px 14px",
                borderRadius: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Pillar {pillar}
            </span>
            {episodeId && (
              <span style={{ color: accentColor, fontSize: 16, fontWeight: 600 }}>
                {episodeId}
              </span>
            )}
          </div>

          <span
            style={{
              color: "#f0ede8",
              fontSize: title.length > 40 ? 46 : 56,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {title}
          </span>

          {truncatedDesc && (
            <span
              style={{
                color: "rgba(240,237,232,0.55)",
                fontSize: 22,
                lineHeight: 1.5,
              }}
            >
              {truncatedDesc}
            </span>
          )}

          <span
            style={{
              color: accentColor,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 2,
              marginTop: "auto",
              textTransform: "uppercase",
            }}
          >
            {siteConfig.hashtag}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            width: 260,
            height: 260,
            borderRadius: "50%",
            overflow: "hidden",
            border: `5px solid ${accentColor}`,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={260} height={260} style={{ objectFit: "cover" }} alt="" />
        </div>
      </div>
    ),
    { ...size }
  );
}
