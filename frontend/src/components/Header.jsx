import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, GraduationCap } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useSite } from "../context/SiteContext";

export function Header() {
  const { t } = useTranslation();
  const { menus, lang, changeLang, t: siteT } = useSite();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Use CMS menu data if available, fall back to defaults
  const headerItems = menus.header.length > 0
    ? menus.header.filter((m) => m.position <= 5)
    : [
        { href: "/", label: t("nav.home") },
        { href: "/subjects", label: t("nav.subjects") },
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
        { href: "/login", label: t("nav.login") }
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/80">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-blueberry"
        >
          <GraduationCap className="w-6 h-6" />
          <span>{siteT ? siteT({ en: "Little Learner", km: "Little Learner", ar: "ليتل ليرنر" }) : "Little Learner"}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {headerItems.map((item) => (
            <Link
              key={item.href || item.url}
              to={item.href || item.url}
              className={location.pathname === (item.href || item.url)
                ? "text-blueberry font-semibold"
                : "text-muted-foreground hover:text-foreground"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md border border-border bg-background text-foreground hover:bg-accent"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {headerItems.map((item) => (
            <button
              key={item.href || item.url}
              onClick={() => setOpen(false)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
