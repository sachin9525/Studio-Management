import { useState, useRef } from 'react';
import { Camera, Sparkles, Film, Disc } from 'lucide-react';

export default function CameraLens3D({ className = '' }) {
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [apertureOpen, setApertureOpen] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCoords({ x, y });
  };

  const rotX = -coords.y * 18;
  const rotY = coords.x * 18;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setApertureOpen(true)}
      onMouseLeave={() => {
        setApertureOpen(false);
        setCoords({ x: 0, y: 0 });
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* 3D Master Rotating Stage */}
      <div
        className="relative flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Outer Golden Aura */}
        <div
          className="absolute -inset-10 rounded-full bg-gradient-to-tr from-amber-500/25 via-gold-400/20 to-amber-600/25 blur-3xl pointer-events-none opacity-85"
          style={{ transform: 'translateZ(-50px)' }}
        />

        {/* Outer Ring 1: Dark Titanium Millimeter F-Stop Ring */}
        <div
          className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-full border-2 border-gold-400/50 flex items-center justify-center shadow-2xl backdrop-blur-xl group cursor-pointer"
          style={{
            transform: 'translateZ(10px)',
            background: 'radial-gradient(circle at 30% 30%, #2c2824 0%, #171513 60%, #0d0c0b 100%)',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.85), inset 0 0 45px rgba(216, 179, 106, 0.2)',
          }}
        >
          {/* Rotating Focus Marks */}
          <div
            className="absolute inset-2.5 rounded-full border border-dashed border-gold-400/30 animate-[spin_45s_linear_infinite]"
            style={{ animationDirection: 'reverse' }}
          />

          {/* Focal Ticks and Measurements */}
          <div className="absolute top-3 text-[9px] uppercase tracking-widest text-gold-300 font-mono font-bold drop-shadow">
            ✦ F/1.2 CINE PRIME ✦
          </div>
          <div className="absolute bottom-3 text-[9px] uppercase tracking-widest text-stone-400 font-mono">
            85MM T1.5 · Ø 82MM
          </div>
          <div className="absolute left-3 text-[9px] uppercase tracking-widest text-stone-400 font-mono -rotate-90">
            AUTO FOCUS
          </div>
          <div className="absolute right-3 text-[9px] uppercase tracking-widest text-gold-300 font-mono rotate-90 font-bold">
            SVML OPTICS
          </div>

          {/* Inner Ring 2: Anodized Metallic Bezel with Depth */}
          <div
            className="w-56 h-56 sm:w-68 sm:h-68 md:w-76 md:h-76 rounded-full border border-gold-400/50 p-4 flex items-center justify-center relative overflow-hidden"
            style={{
              transform: 'translateZ(30px)',
              background: 'radial-gradient(circle at 40% 40%, #1f1c19 0%, #100f0e 65%, #050505 100%)',
              boxShadow: 'inset 0 0 35px rgba(0, 0, 0, 0.95), 0 10px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Optical Glass Flare Effect */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none transition-transform duration-300"
              style={{
                background: `radial-gradient(circle at ${50 + coords.x * 30}% ${50 + coords.y * 30
                  }%, rgba(216, 179, 106, 0.4) 0%, rgba(99, 102, 241, 0.18) 45%, transparent 70%)`,
                transform: `translate(${coords.x * 12}px, ${coords.y * 12}px)`,
              }}
            />

            {/* Aperture Iris Core */}
            <div
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-gold-400/60 bg-black/95 flex items-center justify-center overflow-hidden transition-all duration-700"
              style={{
                transform: 'translateZ(45px)',
                boxShadow: 'inset 0 0 30px rgba(216, 179, 106, 0.35)',
              }}
            >
              {/* Glass Lens Core with Camera Icon */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gold-400/70 flex items-center justify-center transition-all duration-500 ${apertureOpen ? 'scale-110 shadow-lg shadow-gold-400/40' : 'scale-95'
                  }`}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(216, 179, 106, 0.35) 0%, #1a1715 65%, #080707 100%)',
                }}
              >
                <Camera className="w-9 h-9 text-gold-300 drop-shadow-[0_0_12px_rgba(216,179,106,0.7)] animate-pulse" />
              </div>

              {/* Shimmer light pass */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* 3D Floating Holographic HUD Badges (Always crisp dark glass with gold text) */}
        {/* Badge 1: Top-Left */}
        <div
          className="absolute -top-6 -left-6 sm:-left-12 px-3.5 py-1.5 rounded-full border border-gold-400/50 text-gold-300 text-[10px] uppercase tracking-widest font-mono font-bold shadow-2xl backdrop-blur-xl flex items-center gap-1.5 transition-transform duration-300"
          style={{
            transform: `translateZ(60px) translate(${coords.x * -10}px, ${coords.y * -10}px)`,
            backgroundColor: 'rgba(18, 16, 14, 0.92)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>12-Bit 4K Cinema RAW</span>
        </div>

        {/* Badge 2: Bottom-Right */}
        <div
          className="absolute -bottom-6 -right-6 sm:-right-10 px-3.5 py-1.5 rounded-full border border-gold-400/50 text-gold-300 text-[10px] uppercase tracking-widest font-mono font-bold shadow-2xl backdrop-blur-xl flex items-center gap-1.5 transition-transform duration-300"
          style={{
            transform: `translateZ(70px) translate(${coords.x * 12}px, ${coords.y * 12}px)`,
            backgroundColor: 'rgba(18, 16, 14, 0.92)',
          }}
        >
          <Film className="w-3.5 h-3.5 text-gold-400" />
          <span>120 FPS Ultra Slow-Mo</span>
        </div>

        {/* Badge 3: Top-Right */}
        <div
          className="hidden sm:flex absolute top-8 -right-14 px-3 py-1 rounded-sm border border-gold-400/30 text-stone-300 text-[9px] uppercase tracking-widest font-mono shadow-xl backdrop-blur-md items-center gap-1.5"
          style={{
            transform: `translateZ(40px) translate(${coords.x * 8}px, ${coords.y * -8}px)`,
            backgroundColor: 'rgba(14, 13, 12, 0.92)',
          }}
        >
          <Disc className="w-3 h-3 text-gold-400 animate-spin" />
          <span>Dual Native ISO</span>
        </div>
      </div>
    </div>
  );
}
