import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HERO_SLIDES, STUDIO_STATS } from "@/data/demoContent";
import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/common/Button";
import Canvas3DScene from "@/components/3d/Canvas3DScene";
import CameraLens3D from "@/components/3d/CameraLens3D";

function HeroSection() {
  const [active, setActive] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-12 transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'rgb(21, 19, 17)' : '#faf8f5',
      }}
    >
      {/* Background Slides with 3D Depth Overlays */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            className={`w-full h-full object-cover object-[center_35%] transition-all duration-700 ${
              i === active ? "animate-ken-burns scale-105" : ""
            } opacity-100 brightness-[1.02] contrast-[1.06] saturate-[1.05]`}
          />
        </div>
      ))}

      {/* Cinematic Gradient Overlays (Dual-Themed) */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-black/95 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/80 pointer-events-none" />
        </>
      ) : (
        <>
          {/* Light Mode: Directional scrim strictly behind text on the left (0-55%), leaving the entire right 45% couple photo 100% crisp, vivid, and colorful */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/95 via-[#faf8f5]/75 via-30% to-transparent to-55% pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#faf8f5] to-transparent pointer-events-none" />
        </>
      )}

      {/* Interactive 3D Canvas Background (Particles & Bokeh Constellation) */}
      <Canvas3DScene particleCount={90} className="z-10" />

      {/* Main Hero Container */}
      <div className="container-max relative z-20 my-auto py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 3D Eyebrow Pill */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border backdrop-blur-md shadow-sm mb-4 sm:mb-6 group transition-all duration-300"
              style={{
                backgroundColor: isDark ? 'rgba(18, 16, 14, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: isDark ? 'rgba(216, 179, 106, 0.4)' : 'rgba(180, 130, 40, 0.3)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span
                className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold"
                style={{ color: isDark ? '#f0d38b' : '#854d0e' }}
              >
                SVML · India's Luxury Studio & Cine Platform
              </span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-gold-400 group-hover:rotate-45 transition-transform" />
            </div>

            {/* Master Headline (Viewport-Fluid Scale) */}
            <h1
              className="heading-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl max-w-2xl text-balance leading-[1.1] tracking-tight transition-colors drop-shadow-sm"
              style={{
                color: isDark ? '#ffffff' : '#09090b',
                textShadow: isDark
                  ? '0 2px 20px rgba(0, 0, 0, 0.6)'
                  : '0 1px 2px rgba(255, 255, 255, 0.85)',
              }}
            >
              Capture Your{' '}
              <span
                className="italic font-normal"
                style={{
                  color: isDark ? '#f0d38b' : '#b45309',
                  textShadow: isDark
                    ? '0 0 25px rgba(240, 211, 139, 0.45)'
                    : '0 0 20px rgba(180, 83, 9, 0.2)',
                }}
              >
                Timeless
              </span>{' '}
              Stories in 3D Depth & Light
            </h1>

            <div
              className={`h-px w-16 sm:w-20 my-4 sm:my-5 ${
                isDark
                  ? 'bg-gradient-to-r from-gold-400 via-amber-300 to-transparent'
                  : 'bg-gradient-to-r from-amber-600 via-amber-400 to-transparent'
              }`}
            />

            {/* Sub-headline */}
            <p
              className="text-xs sm:text-sm md:text-base lg:text-base xl:text-lg max-w-xl font-normal leading-relaxed transition-colors"
              style={{ color: isDark ? '#e2e8f0' : '#3f3f46' }}
            >
              From majestic Indian wedding rituals to private destination pre-weddings — crafted with Hollywood color science into heirlooms you will revisit for a lifetime.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-7">
              <Button href="#wedding" variant="gold" size="lg" className="shadow-xl shadow-amber-600/20 group font-bold">
                <span>Explore 3D Portfolio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a
                href="#contact"
                className="inline-flex items-center justify-center font-sans uppercase tracking-widest text-xs px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm border transition-all duration-300 shadow-sm backdrop-blur-md font-semibold"
                style={{
                  backgroundColor: isDark ? 'rgba(18, 16, 14, 0.65)' : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.15)',
                  color: isDark ? '#ffffff' : '#09090b',
                }}
              >
                Book Consultation
              </a>
              <Link
                to="/vendor/register"
                className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors ml-1 py-2 font-semibold"
                style={{ color: isDark ? '#e2e8f0' : '#18181b' }}
              >
                <span>Join as Vendor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-600 dark:text-gold-400" />
              </Link>
            </div>

            {/* Live Stats Ribbon (Responsive Spacing) */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-5 sm:pt-6 w-full max-w-xl border-t transition-colors"
              style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)' }}
            >
              {STUDIO_STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p
                    className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold"
                    style={{ color: isDark ? '#f0d38b' : '#854d0e' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[9px] sm:text-[10px] uppercase tracking-wider mt-0.5 font-semibold"
                    style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero: Interactive 3D Camera Lens & Optical Rings */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <CameraLens3D currentImage={HERO_SLIDES[active]?.url} className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px]" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Slide Switchers & Scroll Indicator */}
      <div
        className="container-max relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t transition-colors"
        style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
      >
        {/* Slide Indicators */}
        <div className="flex items-center gap-4">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-2.5 transition-all text-left ${
                i === active ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Go to ${slide.caption}`}
            >
              <span
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-10 bg-amber-600 dark:bg-gold-400 shadow-sm shadow-amber-500/30"
                    : "w-4 bg-stone-300 dark:bg-stone-500 group-hover:bg-amber-600 dark:group-hover:bg-gold-400"
                }`}
              />
              <span
                className="text-[10px] uppercase tracking-widest font-mono"
                style={{
                  color: isDark
                    ? i === active ? '#f0d38b' : '#cbd5e1'
                    : i === active ? '#854d0e' : '#4b5563',
                  fontWeight: i === active ? 700 : 500,
                }}
              >
                0{i + 1} · {slide.caption}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll Cue */}
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors group font-semibold"
          style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}
        >
          <span>Discover Studio</span>
          <ChevronDown className="w-4 h-4 text-amber-600 dark:text-gold-400 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
