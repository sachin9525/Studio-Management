import { useState } from "react";
import { VIDEOS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import VideoModal from "@/components/common/VideoModal";
import { Play, Film, Sparkles } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

function VideoSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="videos" className="section-pad bg-ink-950 bg-grain relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Film className="w-3 h-3 text-gold-400" />
            <span>4K Master Cine Showcase</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal">
            Wedding Films in <span className="italic text-gold-300">Motion</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-300 font-light max-w-xl mx-auto">
            Cinematic wedding documentaries, highlight reels, and emotional teasers — captured with Hollywood color science and live soundscapes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video, i) => (
            <TiltCard3D
              key={video.id}
              maxTilt={10}
              scale={1.03}
              className="group cursor-pointer rounded-sm overflow-hidden bg-ink-900/90 border border-white/10 hover:border-gold-400/50 shadow-xl hover:shadow-2xl hover:shadow-gold-500/15 transition-all duration-300"
              onClick={() => setActiveVideo(i)}
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30" />

                {/* 3D Floating Play Button */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-gold-400 bg-gold-400/20 backdrop-blur-md flex items-center justify-center text-gold-300 shadow-2xl group-hover:scale-115 group-hover:bg-gold-400 group-hover:text-ink-950 transition-all duration-300">
                    <Play className="w-6 h-6 ml-1 fill-current" />
                  </div>
                </div>

                {/* 3D Category Pill */}
                <div
                  className="absolute top-3 left-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="text-[10px] uppercase tracking-widest font-mono text-gold-300 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-400/30">
                    {video.category}
                  </span>
                </div>

                {/* 4K DCI Badge */}
                <div
                  className="absolute top-3 right-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-400/30">
                    4K DCI · 60FPS
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                  {video.title}
                </h3>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {activeVideo !== null && (
        <VideoModal
          youtubeId={VIDEOS[activeVideo].youtubeId}
          title={VIDEOS[activeVideo].title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
}

export default VideoSection;
