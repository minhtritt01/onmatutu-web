import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-gray bg-brand-white">
      <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-foreground/60">
        <p className="mb-3">
          © {new Date().getFullYear()} {siteConfig.name} — {siteConfig.hashtag}
        </p>
        <div className="flex gap-4">
          <a href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
          <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
