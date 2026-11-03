import { useState } from 'react';
import {
  Film,
  Sparkles,
  Sliders,
  BookOpen,
  Compass,
  Zap,
  Play,
  Volume2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import TiltCard3D from '@/components/3d/TiltCard3D';

export default function BentoExperience3D() {
  const [sliderPos, setSliderPos] = useState(55);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-ink-950">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Next-Gen Cinematic Production</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal tracking-tight">
            The Studio Experience in <span className="italic text-gold-300">3D Depth & Light</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-ink-300 font-light max-w-xl mx-auto">
            Every ritual, emotion, and celebration captured with ultra-high dynamic range, artisan color grading, and generational heirloom craftsmanship.
          </p>
        </div>

        {/* 3D Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cinematic Film Studio (Large 2-column) */}
          <TiltCard3D
            maxTilt={8}
            className="md:col-span-2 rounded-sm bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-ink-950 border border-white/10 hover:border-gold-400/40 p-6 sm:p-8 overflow-hidden group shadow-2xl"
          >
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[340px]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                      Hollywood Cinema Standard
                    </span>
                    <h3 className="font-serif text-2xl text-ink-50 font-medium">
                      Multi-Camera Master Film Production
                    </h3>
                  </div>
                </div>

                {/* Live Audio Visualizer */}
                <div
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-gold-300 font-mono"
                  title="Toggle Visualizer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                  <div className="flex items-end gap-0.5 h-3">
                    {[12, 18, 8, 22, 14, 20, 10, 16].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 bg-gold-400 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'animate-pulse' : 'h-1'
                        }`}
                        style={{
                          height: isPlayingAudio ? `${h}px` : '3px',
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span>Master Dolby Audio</span>
                </div>
              </div>

              {/* Interactive Video Preview Mockup with 3D Popout */}
              <div
                className="relative rounded-sm overflow-hidden aspect-[16/8] sm:aspect-[16/7] border border-white/10 bg-black/80 my-4 group-hover:scale-[1.01] transition-transform duration-500"
                style={{ transform: 'translateZ(25px)' }}
              >
                <img
                  src="https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Cinematic wedding film preview"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Central Play Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gold-400/90 text-ink-950 flex items-center justify-center pl-1 shadow-2xl shadow-gold-400/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current" />
                  </div>
                </div>

                {/* Telemetry Overlays */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-gold-300 uppercase tracking-widest bg-black/70 px-2.5 py-1 rounded-sm border border-white/10">
                  REC ● 4K DCI · 24.00 FPS · PRORES 422 HQ
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-ink-100">
                  <span className="font-serif italic text-gold-300">"Rituals of Udaipur" — Featured Film</span>
                  <span className="font-mono text-[10px] text-ink-400">03:42 / 08:15</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs text-ink-300">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3-Axis Gimbal Stability
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Directional Wireless Lavs
                  </span>
                </div>
                <span className="text-gold-400 font-medium hover:text-gold-300 transition-colors inline-flex items-center gap-1">
                  Watch Films <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 2: Interactive Color Grade Studio */}
          <TiltCard3D
            maxTilt={12}
            className="rounded-sm bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-ink-950 border border-white/10 hover:border-gold-400/40 p-6 sm:p-7 overflow-hidden group shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                Color Grading Mastery
              </span>
              <h3 className="font-serif text-2xl text-ink-50 font-medium mt-1">
                Before / After LUT Grading
              </h3>
              <p className="text-xs text-ink-300 mt-2">
                Drag the interactive slider to reveal our signature warm champagne & filmic contrast grade.
              </p>

              {/* Before/After Split Preview */}
              <div
                className="relative rounded-sm overflow-hidden aspect-[4/3] mt-5 border border-white/10 bg-black select-none"
                style={{ transform: 'translateZ(20px)' }}
              >
                {/* Before (LOG Flat) */}
                <img
                  src="https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Flat camera log"
                  className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-75 brightness-95"
                />
                <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest font-mono bg-black/80 px-2 py-0.5 rounded text-ink-300 border border-white/10">
                  Flat Log
                </span>

                {/* After (SVML Grade) */}
                <div
                  className="absolute inset-y-0 right-0 overflow-hidden"
                  style={{ left: `${sliderPos}%` }}
                >
                  <img
                    src="https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Graded cinematic wedding"
                    className="absolute top-0 right-0 w-full h-full object-cover max-w-none"
                    style={{ width: `${100 / (1 - sliderPos / 100)}%` }}
                  />
                  <span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest font-mono bg-gold-400 text-ink-950 font-bold px-2 py-0.5 rounded shadow">
                    SVML Grade
                  </span>
                </div>

                {/* Split Handle */}
                <div
                  className="absolute inset-y-0 w-1 bg-gold-400 cursor-ew-resize flex items-center justify-center shadow-[0_0_12px_rgba(216,179,106,0.8)]"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-5 h-5 rounded-full bg-gold-400 text-ink-950 flex items-center justify-center text-[10px] shadow-lg">
                    ⇄
                  </div>
                </div>

                <input
                  type="range"
                  min="10"
                  max="90"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
                  aria-label="Color grade comparison slider"
                />
              </div>
            </div>

            <p className="text-[11px] text-ink-400 mt-4 text-center">
              DaVinci Resolve Studio color suite with custom 3D LUTs.
            </p>
          </TiltCard3D>

          {/* Card 3: Artisan Heirloom Albums */}
          <TiltCard3D
            maxTilt={12}
            className="rounded-sm bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-ink-950 border border-white/10 hover:border-gold-400/40 p-6 sm:p-7 overflow-hidden group shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                Generational Heirlooms
              </span>
              <h3 className="font-serif text-2xl text-ink-50 font-medium mt-1">
                Italian Leather Photo Books
              </h3>
              <p className="text-xs text-ink-300 mt-2">
                Hand-bound with archival metallic papers, embossed gold calligraphy, and layflat 180° panorama binding.
              </p>

              <div
                className="relative mt-5 rounded-sm overflow-hidden aspect-[4/3] bg-black border border-white/10 group-hover:scale-105 transition-transform duration-500"
                style={{ transform: 'translateZ(20px)' }}
              >
                <img
                  src="https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Luxury leather wedding album"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-serif text-lg font-medium">The Imperial Collection</p>
                  <p className="text-[10px] uppercase tracking-wider text-gold-300 font-mono">
                    300 GSM Archival Silk Paper
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-ink-300">
              <span>Lifetime Durability Guarantee</span>
              <span className="text-gold-400 font-medium">Explore Samples →</span>
            </div>
          </TiltCard3D>

          {/* Card 4: Aerial 4K Drone Fleet */}
          <TiltCard3D
            maxTilt={12}
            className="rounded-sm bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-ink-950 border border-white/10 hover:border-gold-400/40 p-6 sm:p-7 overflow-hidden group shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                Cinematic Perspectives
              </span>
              <h3 className="font-serif text-2xl text-ink-50 font-medium mt-1">
                4K Drone Telemetry & Scale
              </h3>
              <p className="text-xs text-ink-300 mt-2">
                Certified DGCA pilots capturing royal palaces, grand baraat entries, and sunset portraits from the sky.
              </p>

              {/* Drone HUD Interface */}
              <div
                className="relative mt-5 rounded-sm overflow-hidden aspect-[4/3] bg-black border border-white/10"
                style={{ transform: 'translateZ(20px)' }}
              >
                <img
                  src="https://images.pexels.com/photos/32404924/pexels-photo-32404924.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Aerial drone photography of palace wedding"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                {/* Flight HUD Marks */}
                <div className="absolute inset-4 border border-gold-400/30 rounded pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[8px] font-mono text-gold-300">
                    <span>ALT: 118M</span>
                    <span>SPD: 34KM/H</span>
                  </div>
                  <div className="self-center w-8 h-8 rounded-full border border-dashed border-gold-400/60 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-gold-400" />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-gold-300">
                    <span>GPS: 23.2599° N</span>
                    <span>BAT: 94%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-ink-300">
              <span>Licensed DGCA Flight Ops</span>
              <span className="text-gold-400 font-medium">View Aerials →</span>
            </div>
          </TiltCard3D>

          {/* Card 5: Ultra-Fast 24H Teaser Delivery */}
          <TiltCard3D
            maxTilt={12}
            className="rounded-sm bg-gradient-to-br from-ink-900/90 via-ink-900/60 to-ink-950 border border-white/10 hover:border-gold-400/40 p-6 sm:p-7 overflow-hidden group shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-sm bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                Instant Celebration Sharing
              </span>
              <h3 className="font-serif text-2xl text-ink-50 font-medium mt-1">
                24-Hour Social Reel Delivery
              </h3>
              <p className="text-xs text-ink-300 mt-2">
                Don't wait months to share your happiness. Get a 60-second 4K vertical teaser for Instagram & WhatsApp the very next morning.
              </p>

              {/* Reel Mockup */}
              <div
                className="relative mt-5 rounded-sm overflow-hidden aspect-[4/3] bg-gradient-to-b from-ink-950 to-black border border-white/10 flex items-center justify-center p-4"
                style={{ transform: 'translateZ(20px)' }}
              >
                <div className="w-32 aspect-[9/16] rounded-md border border-gold-400/40 overflow-hidden shadow-2xl relative">
                  <img
                    src="https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Vertical Instagram Reel"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-[9px] text-white">
                    <span className="text-gold-300 font-bold">#SVMLMoments</span>
                    <span className="text-[8px] text-ink-400">Viral 60s Cut</span>
                  </div>
                </div>

                <div className="ml-4 space-y-2 text-left">
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <p className="text-[10px] text-gold-400 font-semibold">9:00 AM Next Day</p>
                    <p className="text-[9px] text-ink-300">Teaser delivered</p>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <p className="text-[10px] text-emerald-400 font-semibold">100% Mobile Ready</p>
                    <p className="text-[9px] text-ink-300">Optimized for Reels</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-ink-300">
              <span>Standard in Signature & Imperial</span>
              <span className="text-gold-400 font-medium">Learn More →</span>
            </div>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
}

