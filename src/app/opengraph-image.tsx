import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const imgData = readFileSync(
    join(process.cwd(), "public/character/phoenix-peaceful.jpg")
  );
  const src = `data:image/jpeg;base64,${imgData.toString("base64")}`;

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
        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: 64,
          }}
        >
          <span
            style={{
              color: "#f4c95d",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 3,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.hashtag}
          </span>
          <span
            style={{
              color: "#f0ede8",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            {siteConfig.name}
          </span>
          <span
            style={{
              color: "rgba(240,237,232,0.55)",
              fontSize: 26,
              lineHeight: 1.55,
            }}
          >
            Câu chuyện hoạt hình về động lực, mindset và sự tử tế với chính mình.
          </span>
        </div>

        {/* Character image */}
        <div
          style={{
            display: "flex",
            width: 260,
            height: 260,
            borderRadius: "50%",
            overflow: "hidden",
            border: "5px solid #f4c95d",
            flexShrink: 0,
          }}
        >
          <img
            src={src}
            width={260}
            height={260}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
