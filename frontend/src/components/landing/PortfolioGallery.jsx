import { useState, useMemo } from "react";
import Lightbox from "@/components/common/Lightbox";
import { ZoomIn, Eye } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

function PortfolioGallery({ photos, categories, id }) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(
    () => (filter === "All" ? photos : photos.filter((p) => p.category === filter)),
    [filter, photos]
  );

  const images = filtered.map((p) => p.url);

  return (
    <div id={id} className="relative">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-widest rounded-full transition-all duration-300 font-medium cursor-pointer ${
              filter === cat
                ? "bg-gold-400 text-ink-950 font-bold shadow-lg shadow-gold-500/20 scale-105"
                : "border border-white/10 text-ink-300 hover:border-gold-400/40 hover:text-gold-300 bg-ink-900/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Balanced Fine-Art Editorial Photography Grid (Zero Gaps, Perfectly Aligned) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((photo, i) => (
          <TiltCard3D
            key={`${photo.url}-${i}`}
            maxTilt={6}
            scale={1.03}
            className="overflow-hidden rounded-sm bg-ink-900/90 border border-white/10 hover:border-gold-400/60 group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 aspect-[4/5] relative"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative w-full h-full">
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300" />

              {/* 3D Floating Quick View Overlay */}
              <div
                className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="flex justify-end">
                  <span className="w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-gold-300 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-gold-300 px-2.5 py-1 rounded bg-black/70 border border-gold-400/30 inline-block mb-1.5 backdrop-blur-md">
                    {photo.category}
                  </span>
                  <p className="text-xs text-white font-serif line-clamp-1 drop-shadow">
                    {photo.alt}
                  </p>
                </div>
              </div>
            </div>
          </TiltCard3D>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          title={filtered[lightboxIndex]?.alt}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + images.length) % images.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % images.length)}
        />
      )}
    </div>
  );
}

export default PortfolioGallery;
