import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight, Sparkles, Play, Award, Film, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { HERO_SLIDES, STUDIO_STATS } from "@/data/demoContent";
import Button from "@/components/common/Button";
import Canvas3DScene from "@/components/3d/Canvas3DScene";
import CameraLens3D from "@/components/3d/CameraLens3D";

function HeroSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-ink-950 flex flex-col justify-between pt-24 sm:pt-28 pb-12"
      style={{ colorScheme: 'dark' }}
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
            className={`w-full h-full object-cover ${i === active ? "animate-ken-burns scale-105" : ""}`}
          />
        </div>
      ))}

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-black/95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/80 pointer-events-none" />

      {/* Interactive 3D Canvas Background (Particles & Bokeh Constellation) */}
      <Canvas3DScene particleCount={90} className="z-10" />

      {/* Main Hero Container */}
      <div className="container-max relative z-20 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* 3D Eyebrow Pill */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-400/40 backdrop-blur-md shadow-2xl mb-6 group hover:border-gold-400/70 transition-all duration-300"
              style={{ backgroundColor: 'rgba(18, 16, 14, 0.85)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400" />
              </span>
              <span className="text-[11px] uppercase tracking-widest text-gold-300 font-semibold drop-shadow">
                SVML · India's Luxury Studio & Cine Platform
              </span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-45 transition-transform" />
            </div>

            {/* Master Headline (Always crisp white & luminous gold over dark photography) */}
            <h1
              className="heading-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-2xl text-balance leading-[1.08] tracking-tight drop-shadow-lg"
              style={{ color: '#ffffff' }}
            >
              Capture Your{' '}
              <span
                className="italic font-normal"
                style={{
                  color: '#f0d38b',
                  textShadow: '0 0 25px rgba(240, 211, 139, 0.45)',
                }}
              >
                Timeless
              </span>{' '}
              Stories in 3D Depth & Light
            </h1>

            <div className="h-px w-20 bg-gradient-to-r from-gold-400 via-amber-300 to-transparent my-6" />

            {/* Sub-headline */}
            <p
              className="text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed drop-shadow"
              style={{ color: '#e2e8f0' }}
            >
              From majestic Indian wedding rituals to private destination pre-weddings — crafted with Hollywood color science into heirlooms you will revisit for a lifetime.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8">
              <Button href="#wedding" variant="gold" size="lg" className="shadow-2xl shadow-gold-500/25 group font-bold">
                <span>Explore 3D Portfolio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a
                href="#contact"
                className="inline-flex items-center justify-center font-sans uppercase tracking-widest text-xs px-8 py-4 rounded-sm border border-white/40 text-white hover:border-gold-400 hover:text-gold-300 transition-all duration-300 shadow-lg backdrop-blur-md"
                style={{ backgroundColor: 'rgba(18, 16, 14, 0.65)' }}
              >
                Book Consultation
              </a>
              <Link
                to="/vendor/register"
                className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors ml-1 py-2 font-medium"
                style={{ color: '#e2e8f0' }}
              >
                <span>Join as Vendor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gold-400" />
              </Link>
            </div>

            {/* Live Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/15 w-full max-w-xl">
              {STUDIO_STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p
                    className="font-serif text-2xl sm:text-3xl font-semibold"
                    style={{ color: '#f0d38b' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-wider mt-0.5 font-medium"
                    style={{ color: '#cbd5e1' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero: Interactive 3D Camera Lens & Optical Rings */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <CameraLens3D className="w-full max-w-[420px]" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Slide Switchers & Scroll Indicator */}
      <div className="container-max relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        {/* Slide Indicators */}
        <div className="flex items-center gap-4">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-2.5 transition-all text-left ${
                i === active ? "opacity-100" : "opacity-50 hover:opacity-85"
              }`}
              aria-label={`Go to ${slide.caption}`}
            >
              <span
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "w-10 bg-gold-400 shadow-sm shadow-gold-400" : "w-4 bg-stone-500 group-hover:bg-gold-400"
                }`}
              />
              <span
                className="text-[10px] uppercase tracking-widest font-mono"
                style={{ color: i === active ? '#f0d38b' : '#cbd5e1', fontWeight: i === active ? 700 : 500 }}
              >
                0{i + 1} · {slide.caption}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll Cue */}
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors group"
          style={{ color: '#cbd5e1' }}
        >
          <span>Discover Studio</span>
          <ChevronDown className="w-4 h-4 text-gold-400 animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
