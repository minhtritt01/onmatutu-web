import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const navItems = [
  { href: "/blog", label: "Câu chuyện" },
  { href: "/affirmations", label: "Affirmation" },
  { href: "/about", label: "Giới thiệu" },
];

export function Header() {
  return (
    <header className="border-b border-brand-gray bg-brand-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}{" "}
          <span className="text-brand-yellow">{siteConfig.hashtag}</span>
        </Link>
        <nav className="flex gap-5 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/70 transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
