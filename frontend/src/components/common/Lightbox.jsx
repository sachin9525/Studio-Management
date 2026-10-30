import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
function Lightbox({ images, index, onClose, onPrev, onNext, title }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape")
        onClose();
      if (e.key === "ArrowLeft")
        onPrev();
      if (e.key === "ArrowRight")
        onNext();
    },
    [onClose, onPrev, onNext]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);
  return <div
    className="fixed inset-0 z-[100] bg-ink-950/95 backdrop-blur-md animate-fade-in flex flex-col"
    onClick={onClose}
  >
    {
      /* Top bar */
    }
    <div className="flex items-center justify-between px-6 py-5 text-ink-200" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs uppercase tracking-widest text-gold-400">{title ? title : `${index + 1} / ${images.length}`}</span>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
        aria-label="Close"
      ><X className="w-5 h-5" /></button>
    </div>
    {
      /* Image area */
    }
    <div className="flex-1 flex items-center justify-center px-4 md:px-20 pb-8 relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onPrev}
        className="absolute left-2 md:left-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-ink-200 hover:border-gold-400 hover:text-gold-400 transition-colors z-10"
        aria-label="Previous"
      ><ChevronLeft className="w-6 h-6" /></button>
      <img
        src={images[index]}
        alt={`Photo ${index + 1}`}
        className="max-w-full max-h-full object-contain animate-scale-in"
      />
      <button
        onClick={onNext}
        className="absolute right-2 md:right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-ink-200 hover:border-gold-400 hover:text-gold-400 transition-colors z-10"
        aria-label="Next"
      ><ChevronRight className="w-6 h-6" /></button>
    </div>
    {
      /* Thumbnails */
    }
    {images.length > 1 && <div className="px-4 pb-6"><div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">{images.map((img, i) => <button
      key={i}
      onClick={(e) => {
        e.stopPropagation();
        if (i !== index) {
          const diff = i - index;
          if (diff > 0)
            for (let j = 0; j < diff; j++)
              onNext();
          else
            for (let j = 0; j < Math.abs(diff); j++)
              onPrev();
        }
      }}
      className={`shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${i === index ? "border-gold-400 opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
    ><img src={img} alt="" className="w-full h-full object-cover" /></button>)}</div></div>}
  </div>;
}
export {
  Lightbox as default
};
