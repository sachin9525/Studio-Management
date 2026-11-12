import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Camera } from "lucide-react";
import { NAV_LINKS } from "@/data/demoContent";
import { useTheme } from "@/context/ThemeContext";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const isHomePage = typeof window !== "undefined" && window.location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }
      e.preventDefault();
      setOpen(false);
      const el = document.querySelector(href);
      if (el)
        el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // In Dark Mode: transparent at top of homepage, solid on scroll.
  // In Light Mode: always render a solid, high-contrast frosted porcelain navbar.
  const isNavSolid = !isHomePage || scrolled || !isDark;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isNavSolid
          ? "bg-white/95 dark:bg-ink-950/90 backdrop-blur-xl border-b border-neutral-200/80 dark:border-white/10 py-3.5 shadow-sm dark:shadow-md"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
      style={{
        backgroundColor: isDark
          ? isHomePage && !scrolled
            ? "transparent"
            : "rgba(21, 19, 17, 0.92)"
          : "rgba(255, 255, 255, 0.96)",
        borderBottom: isDark && isHomePage && !scrolled
          ? "1px solid transparent"
          : isDark
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: isDark
          ? isHomePage && !scrolled
            ? "none"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.5)"
          : "0 4px 25px -2px rgba(0, 0, 0, 0.07)",
      }}
    >
      <nav className="container-max flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <Camera className="w-6 h-6 text-amber-600 dark:text-gold-400 group-hover:rotate-12 transition-transform duration-500" />
          <span className="font-serif text-xl tracking-wide text-neutral-900 dark:text-ink-50 font-bold">
            {"SVML"}
            <span className="text-amber-600 dark:text-gold-400">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.filter((link) =>
            ["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)
          ).map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[11px] uppercase tracking-widest font-semibold text-neutral-700 hover:text-amber-700 dark:text-ink-200 dark:hover:text-gold-400 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* More Pages Dropdown */}
          <li className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest font-semibold text-neutral-700 hover:text-amber-700 dark:text-ink-200 dark:hover:text-gold-400 transition-colors duration-200"
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              {"Pages"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div
                className="absolute right-0 top-full mt-4 min-w-44 rounded-md border border-neutral-200 dark:border-white/10 bg-white/98 dark:bg-ink-900/95 p-2 shadow-2xl backdrop-blur-xl"
                role="menu"
              >
                {NAV_LINKS.filter(
                  (link) => !["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)
                ).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setMoreOpen(false);
                    }}
                    className="block rounded-sm px-3 py-2 text-[11px] uppercase tracking-widest font-medium text-neutral-700 hover:bg-neutral-100 hover:text-amber-700 dark:text-ink-300 dark:hover:bg-white/5 dark:hover:text-gold-400 transition-colors"
                    role="menuitem"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <Button
            to="/vendor/login"
            variant="ghost"
            size="sm"
            className="font-semibold text-neutral-800 hover:text-amber-700 dark:text-ink-100 dark:hover:text-gold-400"
          >
            Vendor Login
          </Button>
          <Button to="/vendor/register" variant="gold" size="sm" className="font-semibold shadow-sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="xl:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="p-2 rounded-md text-neutral-900 dark:text-ink-50 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (100% Solid Fullscreen Luxury Panel) */}
      <div
        className={`xl:hidden fixed inset-0 z-[100] h-screen w-screen flex flex-col transition-all duration-300 ${
          open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{
          backgroundColor: isDark ? '#141210' : '#faf8f5',
        }}
      >
        {/* Drawer Header with Brand Logo & Aligned Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-white/10 shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              handleNavClick(e, "#home");
              setOpen(false);
            }}
            className="flex items-center gap-2.5"
          >
            <Camera className="w-6 h-6 text-amber-600 dark:text-gold-400" />
            <span className="font-serif text-xl tracking-wide text-neutral-900 dark:text-ink-50 font-bold">
              SVML<span className="text-amber-600 dark:text-gold-400">.</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setMoreOpen(false);
              }}
              className="p-2 rounded-full border border-neutral-200/80 dark:border-white/10 text-neutral-900 dark:text-ink-50 hover:text-amber-600 dark:hover:text-gold-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col justify-between">
          <ul className="flex flex-col">
            {NAV_LINKS.filter((link) =>
              ["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)
            ).map((link, i) => (
              <li
                key={link.label}
                className="border-b border-neutral-200/70 dark:border-white/5"
              >
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between py-3.5 font-serif text-2xl text-neutral-900 dark:text-ink-100 hover:text-amber-600 dark:hover:text-gold-400 transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-500">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}

            {/* Pages Accordion */}
            <li className="border-b border-neutral-200/70 dark:border-white/5">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex w-full items-center justify-between py-3.5 font-serif text-2xl text-neutral-900 dark:text-ink-100 hover:text-amber-600 dark:hover:text-gold-400 transition-colors"
                aria-expanded={moreOpen}
              >
                <span>Pages</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    moreOpen ? "rotate-180 text-amber-600 dark:text-gold-400" : "text-neutral-400"
                  }`}
                />
              </button>
              {moreOpen && (
                <div className="py-2 pl-4 flex flex-col gap-1 border-l-2 border-amber-500/40 ml-2 mb-2">
                  {NAV_LINKS.filter(
                    (link) => !["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)
                  ).map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="py-2 text-sm uppercase tracking-widest font-semibold text-neutral-600 hover:text-amber-600 dark:text-neutral-300 dark:hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-white/10 flex flex-col gap-3">
            <Button
              to="/vendor/login"
              variant="outline"
              size="md"
              className="w-full justify-center font-semibold border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white"
              onClick={() => {
                setOpen(false);
                setMoreOpen(false);
              }}
            >
              Vendor Login
            </Button>
            <Button
              to="/vendor/register"
              variant="gold"
              size="md"
              className="w-full justify-center font-bold shadow-md"
              onClick={() => {
                setOpen(false);
                setMoreOpen(false);
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
