import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";

const navItems = [
  { href: "/blog", label: "Câu chuyện" },
  { href: "/affirmations", label: "Affirmation" },
  { href: "/about", label: "Giới thiệu" },
];

export function Header() {
  return (
    <header className="relative border-b border-brand-gray bg-background">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight sm:text-lg">
          {siteConfig.name}{" "}
          <span className="text-brand-yellow">{siteConfig.hashtag}</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <nav className="hidden gap-5 text-sm sm:flex">
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
          <ThemeToggle />
          {/* Mobile hamburger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
