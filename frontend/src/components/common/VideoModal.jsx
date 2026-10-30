import { X } from "lucide-react";
function VideoModal({ youtubeId, title, onClose }) {
  return <div
    className="fixed inset-0 z-[100] bg-ink-950/95 backdrop-blur-md animate-fade-in flex items-center justify-center p-4"
    onClick={onClose}
  ><div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
    <div className="flex items-center justify-between mb-3 text-ink-200">
      <span className="text-xs uppercase tracking-widest text-gold-400">{title}</span>
      <button
        onClick={onClose}
        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400 hover:text-gold-400 transition-colors"
        aria-label="Close"
      ><X className="w-5 h-5" /></button>
    </div>
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl"><iframe
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
      title={title}
      className="absolute inset-0 w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    /></div>
  </div></div>;
}
export {
  VideoModal as default
};
