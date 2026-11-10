import { Film } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 select-none animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Glowing outer rotating aperture ring */}
        <div className="w-16 h-16 rounded-full border border-gold-400/20 border-t-gold-400 animate-spin" />
        {/* Pulsing camera aperture icon */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 animate-pulse">
          <Film className="w-4 h-4" />
        </div>
      </div>
      <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-gold-400/80">
        Loading Scene...
      </p>
    </div>
  );
}

