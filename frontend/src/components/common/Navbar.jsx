import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Camera } from "lucide-react";
import { NAV_LINKS } from "@/data/demoContent";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
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
      e.preventDefault();
      setOpen(false);
      const el = document.querySelector(href);
      if (el)
        el.scrollIntoView({ behavior: "smooth" });
    }
  };
  return <header
    className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-ink-950/90 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"}`}
  >
    <nav className="container-max flex items-center justify-between gap-4">
      <a
        href="#home"
        onClick={(e) => handleNavClick(e, "#home")}
        className="flex items-center gap-2.5 shrink-0 group"
      >
        <Camera className="w-6 h-6 text-gold-400 group-hover:rotate-12 transition-transform duration-500" />
        <span className="font-serif text-xl tracking-wide text-ink-50">
          {"SVML"}
          <span className="text-gold-400">.</span>
        </span>
      </a>
      {
        /* Desktop nav */
      }
      <ul className="hidden xl:flex items-center gap-6">
        {NAV_LINKS.filter((link) => ["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)).map((link) => <li key={link.label}><a
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className="text-[11px] uppercase tracking-widest text-ink-200 hover:text-gold-400 transition-colors duration-300"
        >{link.label}</a></li>)}
        <li className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-ink-200 hover:text-gold-400 transition-colors duration-300"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
          >
            {"Pages"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
          </button>
          {moreOpen && <div className="absolute right-0 top-full mt-4 min-w-44 rounded-sm border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur-xl" role="menu">{NAV_LINKS.filter((link) => !["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)).map((link) => <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              handleNavClick(e, link.href);
              setMoreOpen(false);
            }}
            className="block rounded-sm px-3 py-2.5 text-[11px] uppercase tracking-widest text-ink-300 hover:bg-white/5 hover:text-gold-400 transition-colors"
            role="menuitem"
          >{link.label}</a>)}</div>}
        </li>
      </ul>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <ThemeToggle />
        <Button to="/vendor/login" variant="ghost" size="sm">Vendor Login</Button>
        <Button to="/vendor/register" variant="gold" size="sm">Get Started</Button>
      </div>
      {
        /* Mobile toggle */
      }
      <div className="xl:hidden flex items-center gap-2">
        <ThemeToggle />
        {!open && <button
          className="text-ink-50 p-1"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        ><Menu className="w-6 h-6" /></button>}
      </div>
    </nav>
    {
      /* Mobile drawer */
    }
    <div
      className={`xl:hidden fixed inset-0 top-0 bg-ink-950/98 backdrop-blur-xl transition-all duration-500 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setMoreOpen(false);
        }}
        className="absolute top-5 right-6 z-10 p-2 text-ink-50 hover:text-gold-400 transition-colors"
        aria-label="Close menu"
      ><X className="w-7 h-7" /></button>
      <div className="flex flex-col h-full pt-24 pb-8 px-8 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.filter((link) => ["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)).map((link, i) => <li
            key={link.label}
            className={`border-b border-white/5 ${open ? "animate-fade-up" : ""}`}
            style={{ animationDelay: `${i * 40}ms` }}
          ><a
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="block py-4 font-serif text-2xl text-ink-100 hover:text-gold-400 transition-colors"
          >{link.label}</a></li>)}
          <li className="border-b border-white/5">
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex w-full items-center justify-between py-4 font-serif text-2xl text-ink-100 hover:text-gold-400 transition-colors"
              aria-expanded={moreOpen}
            >
              {"Pages"}
              <ChevronDown className={`w-5 h-5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && <div className="pb-3 pl-4">{NAV_LINKS.filter((link) => !["Home", "About", "Services", "Portfolio", "Testimonials", "Contact"].includes(link.label)).map((link) => <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2.5 text-sm uppercase tracking-widest text-ink-400 hover:text-gold-400 transition-colors"
            >{link.label}</a>)}</div>}
          </li>
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <Button to="/vendor/login" variant="outline" size="md" onClick={() => {
            setOpen(false);
            setMoreOpen(false);
          }}>Vendor Login</Button>
          <Button to="/vendor/register" variant="gold" size="md" onClick={() => {
            setOpen(false);
            setMoreOpen(false);
          }}>Get Started</Button>
        </div>
      </div>
    </div>
  </header>;
}
export {
  Navbar as default
};
