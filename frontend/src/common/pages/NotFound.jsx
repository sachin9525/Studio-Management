import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  Camera,
  ArrowLeft,
  Home,
  Compass,
  Film,
  Layers,
  Search,
  LogIn,
  Aperture,
  Clapperboard,
  Sparkles,
  ArrowRight,
  Tag,
  CornerDownRight
} from "lucide-react";

const KEYWORD_DIRECTORY = [
  { label: "Wedding Photography", path: "/#portfolio?category=Wedding", category: "Portfolio", tags: ["wedding", "shaadi", "marriage", "bride", "groom"] },
  { label: "Pre-Wedding Shoots", path: "/#portfolio?category=Pre-Wedding", category: "Portfolio", tags: ["prewedding", "pre-wedding", "couple", "love"] },
  { label: "Cinematography Films", path: "/#portfolio?category=Films", category: "Cinema", tags: ["video", "film", "cinema", "movie", "reel", "teaser"] },
  { label: "Royal Albums & Galleries", path: "/#portfolio", category: "Albums", tags: ["album", "photo", "gallery", "images", "pictures"] },
  { label: "Pricing & Packages", path: "/#packages", category: "Pricing", tags: ["package", "price", "cost", "pricing", "rate", "tier", "budget"] },
  { label: "Client Inquiries Desk", path: "/#contact", category: "Booking", tags: ["inquiry", "contact", "book", "quote", "hire", "call", "reach"] },
  { label: "Vendor Studio Portal", path: "/vendor/login", category: "Portals", tags: ["vendor", "studio", "partner", "login", "photographer"] },
  { label: "Platform Admin Console", path: "/admin/login", category: "Portals", tags: ["admin", "dashboard", "superadmin", "manage"] },
  { label: "Drone 4K Aerial Shoots", path: "/#portfolio", category: "Cinema", tags: ["drone", "aerial", "4k", "cinematic"] },
  { label: "Studio Services List", path: "/#services", category: "Services", tags: ["service", "services", "offerings"] },
];

const POPULAR_KEYWORDS = [
  "Wedding Shoots",
  "Pre-Wedding",
  "Cinematography",
  "Packages",
  "Client Desk"
];

export default function NotFound() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchVal, setSearchVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  const dashboardPath = user
    ? profile?.role === "vendor"
      ? "/vendor/dashboard"
      : "/admin/dashboard"
    : null;

  // Smart URL Keyword Matching (e.g. if mistyped /admn or /pckage)
  const matchedRoute = useMemo(() => {
    if (typeof window === "undefined") return null;
    const path = window.location.pathname.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!path || path.length < 3) return null;

    for (const item of KEYWORD_DIRECTORY) {
      for (const tag of item.tags) {
        if (path.includes(tag) || tag.includes(path)) {
          return item;
        }
      }
    }
    return null;
  }, []);

  // Filtered live keyword matching words based on user input
  const matchingKeywords = useMemo(() => {
    const query = searchVal.trim().toLowerCase();
    if (!query) return [];

    return KEYWORD_DIRECTORY.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchCat = item.category.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.includes(query));
      return matchLabel || matchCat || matchTags;
    }).slice(0, 5);
  }, [searchVal]);

  const handleSelectKeyword = (path) => {
    setIsFocused(false);
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (matchingKeywords.length > 0) {
      handleSelectKeyword(matchingKeywords[0].path);
    } else if (searchVal.trim()) {
      navigate(`/#portfolio?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filmStrips = [
    "SCENE 404",
    "TAKE 01",
    "FPS 24.00",
    "VERTIX CINEMA",
    "FRAME NOT FOUND",
    "ISO 800",
    "SHUTTER 180°",
    "RAW 4K DCI",
    "RE-ALIGNING LENS",
    "COLOR TEMP 5600K",
    "SCENE 404",
    "TAKE 01",
    "FPS 24.00"
  ];

  return (
    <div className="relative h-screen w-full flex flex-col justify-between bg-[#f5f2ea] dark:bg-[#06080e] text-[#1c1815] dark:text-[#f3f0ea] transition-colors duration-500 overflow-hidden select-none p-3 sm:p-5 md:p-6">
      
      {/* ─── Layer 1: Ambient Studio Spotlights (Subtle & Centered) ─── */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent blur-[120px] rounded-full pointer-events-none animate-pulse-halo" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-amber-600/10 dark:bg-amber-500/5 blur-[120px] rounded-full pointer-events-none animate-float-delayed" />
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-yellow-500/10 dark:bg-amber-400/5 blur-[130px] rounded-full pointer-events-none animate-pulse-halo" />

      {/* ─── Layer 2: Rotating Cinema Lens Guide Rings (Background) ─── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-35 dark:opacity-20">
        <div className="w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] rounded-full border border-dashed border-amber-600/30 dark:border-amber-400/25 animate-spin-slow relative">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-bold bg-[#f5f2ea] dark:bg-[#06080e] px-1.5">
            000°
          </span>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-bold bg-[#f5f2ea] dark:bg-[#06080e] px-1.5">
            180°
          </span>
          <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-bold bg-[#f5f2ea] dark:bg-[#06080e] px-1">
            270°
          </span>
          <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 font-bold bg-[#f5f2ea] dark:bg-[#06080e] px-1">
            090°
          </span>
        </div>
        <div className="absolute inset-16 sm:inset-20 rounded-full border border-amber-500/20 dark:border-amber-400/15 animate-spin-reverse-slow" />
      </div>

      {/* ─── Layer 3: Managed 4-Corner Viewfinder Telemetry ─── */}
      {/* Top-Left Corner */}
      <div className="absolute top-5 left-6 z-20 hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-amber-700/80 dark:text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
        <span className="text-sm font-sans leading-none text-amber-500 font-bold">⌜</span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span>LIVE REC · 24 FPS</span>
      </div>

      {/* Top-Right Corner */}
      <div className="absolute top-5 right-6 z-20 hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-amber-700/80 dark:text-amber-400/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-md">
        <span>4K DCI · PRORES</span>
        <span className="text-sm font-sans leading-none text-amber-500 font-bold">⌝</span>
      </div>

      {/* Bottom-Left Corner */}
      <div className="absolute bottom-11 left-6 z-20 hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8a7e72] dark:text-[#788094]">
        <span className="text-sm font-sans leading-none text-amber-500 font-bold">⌞</span>
        <span>SHUTTER 180° · ISO 800</span>
      </div>

      {/* Bottom-Right Corner */}
      <div className="absolute bottom-11 right-6 z-20 hidden md:flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8a7e72] dark:text-[#788094]">
        <span>BATTERY 100% ⚡</span>
        <span className="text-sm font-sans leading-none text-amber-500 font-bold">⌟</span>
      </div>

      {/* ─── Layer 4: Top Floating Glassy Island Header (Centered & Sleek) ─── */}
      <header className="relative z-30 w-full max-w-4xl mx-auto pt-1 sm:pt-2">
        <div className="w-full flex items-center justify-between px-5 sm:px-7 py-2.5 rounded-full bg-white/70 dark:bg-[#101420]/75 backdrop-blur-2xl border border-black/[0.08] dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
          
          {/* Logo & Brand Monogram */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#0b0e14] shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-4 h-4 text-[#0b0e14]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm font-bold tracking-wide text-[#1c1815] dark:text-[#f8f6f0] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                VERTIX SVML<span className="text-amber-500">.</span>
              </span>
              <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em] text-[#82776c] dark:text-[#788094]">
                Cinema Studio Suite
              </span>
            </div>
          </Link>

          {/* Right Header Navigation & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold text-[#5c5044] dark:text-[#a0a7b5] hover:text-[#1c1815] dark:hover:text-[#f8f6f0] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <Home className="w-3.5 h-3.5 text-amber-500" />
              <span>Studio Home</span>
            </Link>

            {dashboardPath && (
              <Link
                to={dashboardPath}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Console</span>
              </Link>
            )}

            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── Layer 5: Compact, Perfectly Centered Hero Canvas ─── */}
      <main className="relative z-20 w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center text-center px-4 py-2">
        
        {/* URL Keyword Match Pill (if user landed on mistyped URL) */}
        {matchedRoute ? (
          <Link
            to={matchedRoute.path}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 dark:bg-amber-400/15 border border-amber-500/35 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 text-xs font-sans font-semibold mb-3 hover:scale-105 transition-transform shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Looking for <strong className="underline underline-offset-2">{matchedRoute.label}</strong>? Click to visit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/20 text-amber-700 dark:text-amber-400 text-[10px] font-sans font-bold tracking-[0.2em] uppercase mb-2 shadow-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
            <span>SCENE 404 • FRAME UNREACHABLE</span>
          </div>
        )}

        {/* ─── Perfectly Proportioned "4 [APERTURE] 4" ─── */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-5 my-1 select-none">
          {/* Left 4 */}
          <span className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[105px] font-black leading-none bg-gradient-to-br from-[#1c1815] via-[#524131] to-[#997340] dark:from-[#ffffff] dark:via-[#f3e7cb] dark:to-[#a8864b] bg-clip-text text-transparent drop-shadow-sm">
            4
          </span>

          {/* Center Animated Aperture Lens */}
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/30 border-2 border-amber-500/50 shadow-xl shadow-amber-500/20 group">
            <Aperture className="w-11 h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 text-amber-600 dark:text-amber-400 animate-spin-slow" strokeWidth={1.4} />
            
            {/* Center Core with Lens Reflection */}
            <div className="absolute inset-0 m-auto w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 dark:from-amber-400 dark:to-yellow-200 flex items-center justify-center shadow-md shadow-amber-500/50">
              <div className="w-2 h-2 rounded-full bg-[#0b0e14] animate-pulse" />
            </div>
            
            {/* Optical Specular Glint */}
            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white/90 blur-[1px] pointer-events-none" />
          </div>

          {/* Right 4 */}
          <span className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[105px] font-black leading-none bg-gradient-to-br from-[#1c1815] via-[#524131] to-[#997340] dark:from-[#ffffff] dark:via-[#f3e7cb] dark:to-[#a8864b] bg-clip-text text-transparent drop-shadow-sm">
            4
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1815] dark:text-[#f8f6f0] tracking-tight mb-1.5">
          Lost in the Reel
        </h1>

        <p className="font-sans text-xs sm:text-sm text-[#61564c] dark:text-[#9ea3b0] max-w-md mx-auto leading-relaxed mb-3">
          The shoot, collection, or scene you requested has slipped out of focus. Type a keyword or choose a destination below.
        </p>

        {/* ─── Interactive Keyword Search Bar with Live Matching Dropdown ─── */}
        <div ref={searchContainerRef} className="relative max-w-sm w-full mx-auto mb-2.5">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="w-3.5 h-3.5 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:scale-110 transition-transform" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search wedding, packages, cinema, login…"
              className="w-full rounded-full pl-10 pr-20 py-2.5 text-xs font-sans border border-black/15 dark:border-white/15 bg-white/70 dark:bg-[#121622]/80 backdrop-blur-xl text-[#1c1815] dark:text-[#f8f6f0] placeholder:text-[#8f8478] dark:placeholder:text-[#6a7182] focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase bg-[#1c1815] text-[#f7f5f0] dark:bg-amber-400 dark:text-[#0b0e14] hover:opacity-90 transition-all active:scale-95 shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Live Matching Keywords Dropdown */}
          {isFocused && matchingKeywords.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 py-1.5 rounded-2xl bg-white/95 dark:bg-[#101420]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-2xl z-50 text-left animate-scale-in">
              <div className="px-3.5 py-1 text-[9px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold flex items-center justify-between">
                <span>Matching Keywords ({matchingKeywords.length})</span>
                <span className="text-[8px] opacity-70">Tap to go</span>
              </div>
              {matchingKeywords.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSelectKeyword(item.path)}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-xs hover:bg-amber-500/10 dark:hover:bg-amber-400/10 transition-colors text-[#1c1815] dark:text-[#f3f0ea] group"
                >
                  <span className="flex items-center gap-2">
                    <CornerDownRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#8a7e72] dark:text-[#788094] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Keyword Matching Suggestion Pills ─── */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3.5 max-w-md">
          <span className="text-[10px] font-mono uppercase text-[#8a7e72] dark:text-[#788094] flex items-center gap-1">
            <Tag className="w-2.5 h-2.5 text-amber-500" />
            <span>Try:</span>
          </span>
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setSearchVal(kw);
                const match = KEYWORD_DIRECTORY.find((k) => k.label.toLowerCase().includes(kw.toLowerCase()));
                if (match) handleSelectKeyword(match.path);
              }}
              className="text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] hover:bg-amber-500/15 dark:bg-white/[0.05] dark:hover:bg-amber-400/15 text-[#6b6055] dark:text-[#9ea3b0] hover:text-amber-700 dark:hover:text-amber-300 border border-black/5 dark:border-white/5 transition-all"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Primary Action Buttons (PROMINENTLY VISIBLE & CENTERED) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-[#302720] dark:text-[#d8dce6] border border-black/10 dark:border-white/10 backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Rewind Scene</span>
          </button>

          {dashboardPath && (
            <button
              type="button"
              onClick={() => navigate(dashboardPath)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-white/80 dark:bg-white/10 text-[#1c1815] dark:text-white border border-black/15 dark:border-white/20 backdrop-blur-xl hover:bg-black/5 dark:hover:bg-white/15 transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Go to Console</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#0b0e14] shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Studio</span>
          </button>
        </div>

        {/* Direct Studio Portals (Sleek Micro-Pills Row) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-white/50 hover:bg-white/85 dark:bg-[#101420]/50 dark:hover:bg-[#141a29]/80 backdrop-blur-xl border border-black/[0.06] hover:border-amber-500/40 dark:border-white/[0.08] dark:hover:border-amber-400/40 text-[#52463b] dark:text-[#a6adbc] hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-xs"
          >
            <Film className="w-3 h-3 text-amber-500" />
            <span>Portfolio Shoots</span>
          </Link>

          <Link
            to="/#packages"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-white/50 hover:bg-white/85 dark:bg-[#101420]/50 dark:hover:bg-[#141a29]/80 backdrop-blur-xl border border-black/[0.06] hover:border-amber-500/40 dark:border-white/[0.08] dark:hover:border-amber-400/40 text-[#52463b] dark:text-[#a6adbc] hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-xs"
          >
            <Layers className="w-3 h-3 text-amber-500" />
            <span>Studio Packages</span>
          </Link>

          <Link
            to="/#contact"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-white/50 hover:bg-white/85 dark:bg-[#101420]/50 dark:hover:bg-[#141a29]/80 backdrop-blur-xl border border-black/[0.06] hover:border-amber-500/40 dark:border-white/[0.08] dark:hover:border-amber-400/40 text-[#52463b] dark:text-[#a6adbc] hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-xs"
          >
            <Clapperboard className="w-3 h-3 text-amber-500" />
            <span>Client Desk</span>
          </Link>

          <Link
            to="/vendor/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium bg-white/50 hover:bg-white/85 dark:bg-[#101420]/50 dark:hover:bg-[#141a29]/80 backdrop-blur-xl border border-black/[0.06] hover:border-amber-500/40 dark:border-white/[0.08] dark:hover:border-amber-400/40 text-[#52463b] dark:text-[#a6adbc] hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-xs"
          >
            <LogIn className="w-3 h-3 text-amber-500" />
            <span>Vendor Portal</span>
          </Link>
        </div>
      </main>

      {/* ─── Layer 6: Compact Animated Film Reel Marquee Footer ─── */}
      <footer className="relative z-20 w-full pt-1 pb-1 overflow-hidden select-none">
        <div className="w-full overflow-hidden py-1 bg-black/[0.02] dark:bg-white/[0.02] border-y border-black/[0.05] dark:border-white/[0.05]">
          <div className="inline-flex gap-8 whitespace-nowrap animate-film-marquee text-[10px] font-mono tracking-widest text-[#8a7e72] dark:text-[#6a7182]">
            {filmStrips.map((item, index) => (
              <span key={index} className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="text-center text-[10px] font-sans text-[#8a7e72] dark:text-[#6c7487] mt-1.5">
          &copy; {new Date().getFullYear()} Vertix SVML Studio Suite. High-End Cinematography & Studio Management.
        </p>
      </footer>
    </div>
  );
}
