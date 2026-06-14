import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const t = await getTranslations("nav");

  const navItems = [
    { href: "/blog" as const, label: t("blog") },
    { href: "/affirmations" as const, label: t("affirmations") },
    { href: "/about" as const, label: t("about") },
  ];

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
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Mobile hamburger */}
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  );
}
