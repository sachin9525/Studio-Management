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

  const spanClass = (span) => {
    if (span === "tall") return "row-span-2";
    if (span === "wide") return "col-span-2";
    return "";
  };

  return (
    <div id={id} className="relative">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 text-xs uppercase tracking-widest rounded-full transition-all duration-300 font-medium ${
              filter === cat
                ? "bg-gold-400 text-ink-950 font-bold shadow-lg shadow-gold-500/20 scale-105"
                : "border border-white/10 text-ink-300 hover:border-gold-400/40 hover:text-gold-300 bg-ink-900/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Interactive Masonry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4">
        {filtered.map((photo, i) => (
          <TiltCard3D
            key={`${photo.url}-${i}`}
            maxTilt={7}
            scale={1.03}
            className={`overflow-hidden rounded-sm bg-ink-900 border border-white/10 group cursor-pointer shadow-lg hover:shadow-2xl hover:border-gold-400/50 ${spanClass(
              photo.span
            )}`}
            onClick={() => setLightboxIndex(i)}
          >
            <div className="relative w-full h-full">
              <img
                src={photo.url}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />

              {/* 3D Floating Quick View Overlay */}
              <div
                className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="flex justify-end">
                  <span className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-gold-300 px-2 py-0.5 rounded bg-black/60 border border-white/10 inline-block mb-1">
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
