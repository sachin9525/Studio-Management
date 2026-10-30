import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "@/data/demoContent";
import Button from "@/components/common/Button";
function HeroSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6e3);
    return () => clearInterval(timer);
  }, []);
  return <section id="home" className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink-950">
    {
      /* Slides */
    }
    {HERO_SLIDES.map((slide, i) => <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
    ><img
      src={slide.url}
      alt={slide.alt}
      className={`w-full h-full object-cover ${i === active ? "animate-ken-burns" : ""}`}
    /></div>)}
    {
      /* Overlays */
    }
    <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/30 to-ink-950" />
    <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 to-transparent" />
    {
      /* Content */
    }
    <div className="relative h-full flex flex-col items-center justify-center text-center px-6"><div
      className="flex flex-col items-center gap-6 animate-fade-up"
      style={{ animationDelay: "200ms" }}
    >
      <span className="eyebrow text-gold-300">{"SVML \xB7 Sachin Video Mixing Lab \xB7 Est. 2018"}</span>
      <h1 className="heading-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white max-w-4xl text-balance leading-[1.05]">
        {"Capture Your Special"}
        <br />
        <span className="italic text-gold-300">Moments</span>
        {" Forever"}
      </h1>
      <div className="gold-line" />
      <p className="text-base md:text-lg text-ink-200 max-w-xl font-light">{"Beautiful wedding, pre-wedding and event photography \u2014 crafted into heirlooms you will revisit for a lifetime."}</p>
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        <Button href="#wedding" variant="gold" size="lg">Explore Portfolio</Button>
        <Button href="#contact" variant="outline" size="lg">Book Your Shoot</Button>
        <Link
          to="/vendor/register"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-200 hover:text-gold-300 transition-colors mt-2 sm:mt-0"
        >
          {"Join as Vendor"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div></div>
    {
      /* Slide indicators */
    }
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">{HERO_SLIDES.map((slide, i) => <button
      key={i}
      onClick={() => setActive(i)}
      className={`group flex flex-col items-center gap-2 ${i === active ? "opacity-100" : "opacity-50"}`}
      aria-label={`Go to ${slide.caption}`}
    >
      <span
        className={`h-0.5 transition-all duration-500 ${i === active ? "w-12 bg-gold-400" : "w-6 bg-ink-300 group-hover:bg-gold-400"}`}
      />
      <span
        className={`text-[10px] uppercase tracking-widest transition-colors ${i === active ? "text-gold-300" : "text-ink-400"}`}
      >{slide.caption}</span>
    </button>)}</div>
    {
      /* Scroll cue */
    }
    <a
      href="#about"
      className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-ink-300 hover:text-gold-400 transition-colors group"
      aria-label="Scroll down"
    >
      <span className="text-[10px] uppercase tracking-widest [writing-mode:vertical-lr]">Scroll</span>
      <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-gold-400" />
    </a>
  </section>;
}
export {
  HeroSection as default
};
