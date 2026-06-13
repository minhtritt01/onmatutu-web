"use client";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/blog", label: "Câu chuyện" },
  { href: "/affirmations", label: "Affirmation" },
  { href: "/about", label: "Giới thiệu" },
];

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng menu" : "Mở menu"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition hover:bg-brand-gray/30 hover:text-foreground"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[57px] border-b border-brand-gray bg-background px-4 py-3 shadow-sm">
          <nav className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 text-foreground/70 transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
