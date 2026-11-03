import { useState } from "react";
import { SERVICES } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import { ArrowUpRight, Clock, Users, Sparkles, CheckCircle2 } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

const CATEGORIES = ["All", "Weddings", "Pre-Wedding", "Celebrations", "Cinematography"];

function ServiceSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = activeCategory === "All"
    ? SERVICES
    : SERVICES.filter((s) => {
        if (activeCategory === "Weddings") return s.id.includes("wedding") || s.id.includes("traditional") || s.id.includes("candid");
        if (activeCategory === "Pre-Wedding") return s.id.includes("pre-wedding") || s.id.includes("engagement");
        if (activeCategory === "Celebrations") return s.id.includes("birthday") || s.id.includes("anniversary") || s.id.includes("corporate");
        if (activeCategory === "Cinematography") return s.id.includes("video") || s.id.includes("drone");
        return true;
      });

  return (
    <section id="services" className="section-pad bg-ink-950 relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Tailored Production Catalog</span>
            </div>
            <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal">
              Services Crafted for Every <span className="italic text-gold-300">Celebration</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-300 max-w-xl font-light">
              Complete photography and cinematography coverage for weddings and landmark events of every scale.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-gold-400 text-ink-950 font-semibold shadow-lg shadow-gold-500/20 scale-105"
                    : "bg-ink-900/80 text-ink-300 hover:text-ink-50 hover:bg-ink-800 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, i) => (
            <TiltCard3D
              key={service.id}
              maxTilt={10}
              scale={1.03}
              className="group rounded-sm bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 hover:border-gold-400/60 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/15 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                {/* 3D Holographic Tag */}
                <div
                  className="absolute top-3 left-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-semibold bg-black/80 backdrop-blur-md border border-white/20 text-[#f0d38b] shadow">
                    Featured Offering
                  </span>
                </div>
              </div>

              {/* Description & Deliverables */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-ink-900 border-t border-black/5 dark:border-white/5">
                <div>
                  <h3 className="font-serif text-2xl text-ink-50 font-medium group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-400 dark:text-ink-300 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>4K RAW + Drone Available</span>
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-gold-600 dark:text-gold-300 group-hover:text-gold-500 font-semibold transition-colors"
                  >
                    <span>Inquire</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceSection;
