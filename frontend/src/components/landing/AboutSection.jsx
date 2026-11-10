import { STUDIO_STATS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import { Sparkles, Award, MapPin, Camera } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

function AboutSection() {
  return (
    <section id="about" className="section-pad bg-ink-950 bg-grain relative overflow-hidden">
      {/* Subtle Ambient Light */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-max grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center relative z-10">
        {/* Left Side: 3D Layered Interactive Photo Collage */}
        <div className="lg:col-span-6 relative order-2 lg:order-1">
          <TiltCard3D maxTilt={7} className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/23384885/pexels-photo-23384885.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Photographer with camera and album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-sm shadow-xl border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/16313526/pexels-photo-16313526.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Photo editing setup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="space-y-4 pt-10">
              <div className="aspect-square overflow-hidden rounded-sm shadow-xl border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/33072063/pexels-photo-33072063.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Photographer capturing a wedding"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
                <img
                  src="https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Wedding photo albums"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </TiltCard3D>

          {/* 3D Floating Floating Badges */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 px-6 py-4 rounded-sm text-center shadow-2xl z-20 hover:scale-105 transition-transform"
            style={{ transform: "translateZ(30px)" }}
          >
            <p className="font-serif text-3xl sm:text-4xl leading-none font-bold">8+</p>
            <p className="text-[10px] uppercase tracking-widest font-bold mt-1">Years of Fine Art</p>
          </div>

          <div
            className="hidden sm:flex absolute -top-5 -left-5 bg-ink-900/90 border border-gold-400/40 text-gold-300 px-4 py-2 rounded-full text-xs font-mono shadow-xl backdrop-blur-md items-center gap-2 z-20"
            style={{ transform: "translateZ(25px)" }}
          >
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Based in Bhopal · Pan-India Coverage</span>
          </div>
        </div>

        {/* Right Side: Philosophy & Stats */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Award className="w-3 h-3 text-gold-400" />
            <span>Authentic Storytelling</span>
          </div>

          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal tracking-tight">
            Stories Told Through <span className="italic text-gold-300">Light, Depth & Emotion</span>
          </h2>

          <div className="space-y-5 text-sm sm:text-base text-ink-300 leading-relaxed font-light mt-6">
            <p>
              Sachin Video Mixing Lab was founded in 2018 with a single belief — that every wedding, every ceremony, and every fleeting glance deserves to be preserved in royal cinematic splendor.
            </p>
            <p>
              Our signature style blends intimate candid documentary coverage with fine-art editorial portraiture. We don't just stage moments — we anticipate them, frame them with multi-camera depth, and grade them with Hollywood-grade color fidelity.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
            {STUDIO_STATS.map((stat) => (
              <div key={stat.label} className="text-left">
                <p className="font-serif text-3xl sm:text-4xl text-gold-300 font-semibold">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-ink-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
