import { useState, useMemo } from "react";
import Lightbox from "@/components/common/Lightbox";
import { ZoomIn } from "lucide-react";
function PortfolioGallery({ photos, categories, id }) {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const filtered = useMemo(
    () => filter === "All" ? photos : photos.filter((p) => p.category === filter),
    [filter, photos]
  );
  const images = filtered.map((p) => p.url);
  const spanClass = (span) => {
    if (span === "tall")
      return "row-span-2";
    if (span === "wide")
      return "col-span-2";
    return "";
  };
  return <div id={id}>
    {
      /* Filters */
    }
    <div className="flex flex-wrap justify-center gap-2 mb-12">{["All", ...categories].map((cat) => <button
      key={cat}
      onClick={() => setFilter(cat)}
      className={`px-5 py-2.5 text-[10px] uppercase tracking-widest rounded-full border transition-all duration-300 ${filter === cat ? "border-gold-400 text-gold-400 bg-gold-400/5" : "border-white/10 text-ink-400 hover:border-ink-300 hover:text-ink-100"}`}
    >{cat}</button>)}</div>
    {
      /* Masonry grid */
    }
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-3">{filtered.map((photo, i) => <button
      key={`${photo.url}-${i}`}
      onClick={() => setLightboxIndex(i)}
      className={`group relative overflow-hidden rounded-sm bg-ink-800 ${spanClass(photo.span)}`}
    >
      <img
        src={photo.url}
        alt={photo.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-colors duration-500 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
        <div className="w-12 h-12 rounded-full border border-gold-400 flex items-center justify-center text-gold-400"><ZoomIn className="w-5 h-5" /></div>
        <span className="text-[10px] uppercase tracking-widest text-gold-300">{photo.category}</span>
      </div>
    </button>)}</div>
    {lightboxIndex !== null && <Lightbox
      images={images}
      index={lightboxIndex}
      title={filtered[lightboxIndex]?.alt}
      onClose={() => setLightboxIndex(null)}
      onPrev={() => setLightboxIndex((i) => (i - 1 + images.length) % images.length)}
      onNext={() => setLightboxIndex((i) => (i + 1) % images.length)}
    />}
  </div>;
}
export {
  PortfolioGallery as default
};
