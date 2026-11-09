import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Globe,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  Mail,
  Menu,
  Route,
  UsersRound,
  Video,
  X,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

import { useSite } from "../context/SiteContext";
import { useAuth } from "../context/AuthContext";

const fallbackMenus = [
  {
    label: "Home",
    href: "/",
    position: 1,
    children: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Subjects",
    href: "/subjects",
    position: 2,
    children: [
      { label: "All Subjects", href: "/subjects" },
      { label: "Khmer Language", href: "/courses/sub1" },
      { label: "Mathematics", href: "/courses/sub2" },
      { label: "Science", href: "/courses/sub3" },
    ],
  },
  {
    label: "Learning Paths",
    href: "/subjects",
    position: 3,
    children: [
      { label: "Beginner", href: "/subjects" },
      { label: "Intermediate", href: "/subjects" },
      { label: "Advanced", href: "/subjects" },
    ],
  },
  {
    label: "Resources",
    href: "/videos",
    position: 4,
    children: [
      { label: "Worksheets", href: "/videos" },
      { label: "Activities", href: "/videos" },
      { label: "Videos", href: "/videos" },
    ],
  },
  {
    label: "For Parents",
    href: "/about",
    position: 5,
    children: [
      { label: "Child Progress", href: "/parent" },
      { label: "Safety & Privacy", href: "/privacy-for-children" },
      { label: "Parent Guide", href: "/about" },
    ],
  },
  {
    label: "About",
    href: "/about",
    position: 6,
    children: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about/team" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    position: 7,
    children: [
      { label: "Contact Us", href: "/contact" },
      { label: "Email", href: "/contact/email" },
      { label: "Location", href: "/contact/location" },
    ],
  },
  {
    label: "Login",
    href: "/login",
    position: 8,
    children: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Forgot Password", href: "/forgot-password" },
    ],
  },
];

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "km", label: "ភាសាខ្មែរ", short: "KM" },
];

const getHref = (item) => item?.href || item?.path || item?.url || "/";

const getLabel = (item) => item?.label ?? item?.name ?? "";

const getPosition = (item) => Number(item?.position ?? 999);

export function Header() {
  const { t, i18n } = useTranslation();
  const { menus, changeLang, settings } = useSite();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const siteName = settings?.site_name || "Little Learner";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Dark mode follows the existing HTML theme class or color scheme.
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;

    return (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark"
    );
  });

  // Listen for theme changes made by the rest of the application.
  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(
        root.classList.contains("dark") || root.dataset.theme === "dark",
      );
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Theme variables.
  const theme = isDark
    ? {
        header: "bg-slate-950/75 border-white/10",
        logoText: "text-white",
        logoBg: "bg-gradient-to-br from-indigo-500 to-violet-600",
        navBg: "bg-white/[0.05] border-white/[0.08]",
        navText: "text-slate-300 hover:text-white",
        navActive: "bg-white/15 text-white shadow-lg shadow-black/10",
        dropdown: "bg-slate-900/95 border-white/10",
        dropdownText: "text-slate-300 hover:bg-white/10 hover:text-white",
        dropdownActive: "bg-indigo-500/20 text-indigo-300",
        iconBg: "bg-white/[0.08] text-indigo-300",
        button: "bg-white/10 text-slate-200 hover:bg-white/15 border-white/10",
        action: "bg-amber-300 text-slate-900 hover:bg-amber-200",
        mobile: "bg-slate-950/95 border-white/10",
        mobileItem: "text-slate-300 hover:bg-white/10",
        mobileActive: "bg-indigo-500/20 text-indigo-300",
        divider: "border-white/10",
        muted: "text-slate-400",
        submenu: "border-indigo-400/30",
      }
    : {
        header: "bg-white/75 border-white/70",
        logoText: "text-slate-800",
        logoBg: "bg-gradient-to-br from-indigo-500 to-violet-600",
        navBg: "bg-white/55 border-white/80",
        navText: "text-slate-600 hover:text-indigo-600",
        navActive: "bg-white/90 text-indigo-700 shadow-sm",
        dropdown: "bg-white/90 border-white/80",
        dropdownText: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700",
        dropdownActive: "bg-indigo-50 text-indigo-700",
        iconBg: "bg-indigo-50 text-indigo-600",
        button: "bg-white/65 text-slate-600 hover:bg-white border-slate-200/70",
        action:
          "bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-950 hover:from-amber-200 hover:to-yellow-200",
        mobile: "bg-white/90 border-slate-200/60",
        mobileItem: "text-slate-700 hover:bg-white",
        mobileActive: "bg-indigo-50 text-indigo-700",
        divider: "border-slate-200/70",
        muted: "text-slate-500",
        submenu: "border-indigo-200",
      };

  // CMS menus or fallback menus.
  const allMenus = useMemo(() => {
    return Array.isArray(menus?.header) && menus.header.length
      ? menus.header
      : fallbackMenus;
  }, [menus?.header]);

  // Dashboard according to authenticated role.
  const dashboardPath =
    {
      admin: "/admin",
      teacher: "/teacher/library",
      parent: "/parent",
      student: "/student/todo",
    }[user?.role] || "/login";

  const headerMenus = useMemo(() => {
    const items = [...allMenus];

    if (isAuthenticated) {
      items.push({
        id: "authenticated-dashboard",
        label: "Dashboard",
        href: dashboardPath,
        position: 99,
      });
    }

    return items
      .filter((item) => item.parent_id == null)
      .sort((a, b) => getPosition(a) - getPosition(b));
  }, [allMenus, isAuthenticated, dashboardPath]);

  // Get nested and flat CMS submenus.
  const getChildren = (item) => {
    const nested = item.children || item.submenus || item.items;

    if (Array.isArray(nested) && nested.length) {
      return [...nested].sort((a, b) => getPosition(a) - getPosition(b));
    }

    if (item.id == null) return [];

    return allMenus
      .filter(
        (child) =>
          child.parent_id != null &&
          String(child.parent_id) === String(item.id),
      )
      .sort((a, b) => getPosition(a) - getPosition(b));
  };

  // Translation support.
  const renderMenuLabel = (item) => {
    if (item.labelKey) return t(item.labelKey);
    if (item.translationKey) return t(item.translationKey);

    const label = getLabel(item);

    if (typeof label === "object" && label !== null) {
      return label[currentLang] || label.en || "";
    }

    return label;
  };

  const currentLang = i18n.language?.slice(0, 2).toLowerCase() || "en";

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  // Menu icons.
  const iconFor = (item) => {
    const href = getHref(item);
    const label = String(renderMenuLabel(item)).toLowerCase();

    if (href === "/") return Home;
    if (href === "/subjects" || label.includes("subject")) return BookOpen;
    if (
      href === "/videos" ||
      label.includes("resource") ||
      label.includes("video")
    )
      return Video;
    if (label.includes("path")) return Route;
    if (label.includes("parent")) return UsersRound;
    if (href === "/about" || label.includes("about")) return Info;
    if (href === "/contact" || label.includes("contact")) return Mail;
    if (href === "/login" || label.includes("login")) return LogIn;
    if (label.includes("dashboard")) return LayoutDashboard;

    return CircleHelp;
  };

  const isActive = (item) => {
    const href = getHref(item);

    if (href === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  const isAction = (item) => {
    const label = String(renderMenuLabel(item)).toLowerCase();

    return label === "dashboard";
  };

  const desktopNavigation = headerMenus.filter((item) => !isAction(item));

  const desktopAction = headerMenus.find(isAction);

  const changeLanguage = (code) => {
    changeLang(code);
    setLanguageOpen(false);
  };

  // Close navigation after route change.
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setMobileDropdown(null);
    setLanguageOpen(false);
  }, [location.pathname]);

  // Escape key support.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setActiveDropdown(null);
        setMobileDropdown(null);
        setLanguageOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = !isDark;

    root.classList.toggle("dark", nextTheme);
    root.dataset.theme = nextTheme ? "dark" : "light";

    setIsDark(nextTheme);
  };

  const renderLanguageOptions = () => (
    <div className="space-y-1">
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          onClick={() => changeLanguage(language.code)}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
            currentLanguage.code === language.code
              ? theme.dropdownActive
              : theme.dropdownText
          }`}
        >
          <span>{language.label}</span>
          {currentLanguage.code === language.code && <span>✓</span>}
        </button>
      ))}
    </div>
  );

  const renderDesktopAction = () => {
    if (!desktopAction) return null;

    const ActionIcon = iconFor(desktopAction);

    return (
      <Link
        to={getHref(desktopAction)}
        className={`hidden shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/10 transition hover:-translate-y-0.5 xl:flex ${theme.action}`}
      >
        <ActionIcon size={16} />
        {renderMenuLabel(desktopAction)}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-t-4 border-t-[#FFD75E] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 ${theme.header}`}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-20 -top-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Main Header */}
      <div className="mx-auto flex min-h-[76px] max-w-[1320px] items-center gap-2 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className={`relative flex h-11 w-11 items-center justify-center rounded-[1.1rem] text-white shadow-lg shadow-indigo-500/20 transition duration-300 group-hover:-rotate-6 group-hover:scale-105 ${theme.logoBg}`}
          >
            <BookOpen size={22} strokeWidth={2.2} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-300">
              <Sparkles size={9} className="text-amber-900" />
            </span>
          </div>

          <div className="flex flex-col">
            <span
              className={`whitespace-nowrap text-lg font-extrabold tracking-tight sm:text-xl ${theme.logoText}`}
            >
              {siteName}
            </span>
            <span
              className={`hidden text-[10px] font-semibold tracking-[0.16em] sm:block ${theme.muted}`}
            >
              EXPLORE • LEARN • GROW
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`mx-auto hidden min-w-0 flex-1 items-center justify-center gap-0 rounded-[1.1rem] border p-1.5 shadow-sm backdrop-blur-xl lg:flex ${theme.navBg}`}
        >
          {desktopNavigation.map((item, index) => {
            const key = item.id || item.key || `${getHref(item)}-${index}`;

            const children = getChildren(item);
            const hasDropdown = children.length > 0;
            const Icon = iconFor(item);
            const active = isActive(item);

            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => {
                  if (hasDropdown) setActiveDropdown(key);
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="flex items-center">
                  <Link
                    to={getHref(item)}
                    onClick={() => setActiveDropdown(null)}
                    className={`flex items-center gap-1 whitespace-nowrap rounded-xl px-2 py-2.5 text-xs font-bold transition-all duration-200 xl:px-2 xl:text-xs ${
                      active ? theme.navActive : theme.navText
                    }`}
                  >
                    <Icon size={15} />
                    {renderMenuLabel(item)}
                  </Link>

                  {hasDropdown && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDropdown((current) =>
                          current === key ? null : key,
                        )
                      }
                      className={`flex h-9 w-5 items-center justify-center rounded-lg transition ${theme.navText}`}
                      aria-label={`Toggle ${renderMenuLabel(item)} submenu`}
                      aria-expanded={activeDropdown === key}
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          activeDropdown === key ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Desktop Dropdown */}
                {hasDropdown && (
                  <div
                    className={`absolute start-0 top-full z-50 w-64 pt-3 transition-all duration-200 ${
                      activeDropdown === key
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div
                      className={`overflow-hidden rounded-2xl border p-2 shadow-2xl shadow-black/10 backdrop-blur-2xl ${theme.dropdown}`}
                    >
                      <div className="mb-2 flex items-center gap-2 px-3 py-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${theme.iconBg}`}
                        >
                          <Icon size={15} />
                        </span>
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${theme.muted}`}
                        >
                          {renderMenuLabel(item)}
                        </span>
                      </div>

                      {children.map((child, childIndex) => {
                        const ChildIcon = iconFor(child);
                        const childHref = getHref(child);
                        const childActive = location.pathname === childHref;

                        return (
                          <Link
                            key={
                              child.id ||
                              child.key ||
                              `${childHref}-${childIndex}`
                            }
                            to={childHref}
                            onClick={() => setActiveDropdown(null)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all ${
                              childActive
                                ? theme.dropdownActive
                                : theme.dropdownText
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 ${theme.iconBg}`}
                            >
                              <ChildIcon size={17} />
                            </span>

                            <span className="flex-1 font-medium">
                              {renderMenuLabel(child)}
                            </span>

                            <span className="text-xs opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
                              →
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {renderDesktopAction()}

          {/* Theme Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-xl transition hover:-translate-y-0.5 ${theme.button}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold backdrop-blur-xl transition ${theme.button}`}
              aria-label="Select language"
              aria-expanded={languageOpen}
            >
              <Globe size={16} />
              {currentLanguage.short}
              <ChevronDown
                size={13}
                className={`transition-transform ${
                  languageOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageOpen && (
              <div
                className={`absolute end-0 top-full z-50 mt-2 w-48 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl ${theme.dropdown}`}
              >
                {renderLanguageOptions()}
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Actions */}
        <div className="ms-auto flex shrink-0 items-center gap-2 lg:hidden">
          {/* Compact Language */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              className={`flex h-10 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold ${theme.button}`}
              aria-label="Select language"
              aria-expanded={languageOpen}
            >
              <Globe size={16} />
              {currentLanguage.short}
            </button>

            {languageOpen && (
              <div
                className={`absolute end-0 top-full z-50 mt-2 w-48 rounded-2xl border p-2 shadow-xl ${theme.dropdown}`}
              >
                {renderLanguageOptions()}
              </div>
            )}
          </div>

          {/* Mobile Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${theme.button}`}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${theme.button}`}
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-y-auto border-t backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          theme.mobile
        } ${
          mobileOpen
            ? "max-h-[calc(100dvh-76px)] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl space-y-2 px-4 py-4 sm:px-6">
          {/* Mobile User Action */}
          {desktopAction && (
            <Link
              to={getHref(desktopAction)}
              onClick={() => setMobileOpen(false)}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${theme.action}`}
            >
              {(() => {
                const ActionIcon = iconFor(desktopAction);
                return <ActionIcon size={18} />;
              })()}
              {renderMenuLabel(desktopAction)}
            </Link>
          )}

          {headerMenus
            .filter((item) => !isAction(item))
            .map((item, index) => {
              const key = item.id || item.key || `${getHref(item)}-${index}`;

              const children = getChildren(item);
              const hasDropdown = children.length > 0;
              const Icon = iconFor(item);
              const active = isActive(item);

              return (
                <div key={key}>
                  <div className="flex items-center gap-2">
                    <Link
                      to={getHref(item)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex min-h-12 flex-1 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        active ? theme.mobileActive : theme.mobileItem
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.iconBg}`}
                      >
                        <Icon size={17} />
                      </span>

                      {renderMenuLabel(item)}
                    </Link>

                    {hasDropdown && (
                      <button
                        type="button"
                        onClick={() =>
                          setMobileDropdown((current) =>
                            current === key ? null : key,
                          )
                        }
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${theme.button}`}
                        aria-label={`Toggle ${renderMenuLabel(item)} submenu`}
                        aria-expanded={mobileDropdown === key}
                      >
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${
                            mobileDropdown === key ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  {hasDropdown && mobileDropdown === key && (
                    <div
                      className={`ms-5 mt-2 space-y-1 border-s-2 py-1 ps-3 ${theme.submenu}`}
                    >
                      {children.map((child, childIndex) => {
                        const ChildIcon = iconFor(child);
                        const childHref = getHref(child);

                        return (
                          <Link
                            key={
                              child.id ||
                              child.key ||
                              `${childHref}-${childIndex}`
                            }
                            to={childHref}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                              location.pathname === childHref
                                ? theme.dropdownActive
                                : theme.dropdownText
                            }`}
                          >
                            <ChildIcon size={16} />
                            {renderMenuLabel(child)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Mobile Footer */}
          <div className={`mt-4 border-t pt-4 ${theme.divider}`}>
            <div
              className={`flex items-center justify-between px-3 text-xs ${theme.muted}`}
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={16} />
                {siteName}
              </span>
              <span>Learn • Explore • Grow</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
