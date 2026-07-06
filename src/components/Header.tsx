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
    { href: "/videos" as const, label: t("videos") },
    { href: "/relax" as const, label: t("relax") },
    { href: "/quiz" as const, label: t("quiz") },
    { href: "/affirmations" as const, label: t("affirmations") },
    { href: "/about" as const, label: t("about") },
    { href: "/share-story" as const, label: t("share") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-base font-semibold tracking-tight sm:text-lg"
        >
          {siteConfig.name}{" "}
          <span className="hidden text-brand-yellow lg:inline">{siteConfig.hashtag}</span>
        </Link>
        <div className="flex items-center gap-3">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-5 text-sm xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-foreground/70 transition hover:text-foreground"
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
