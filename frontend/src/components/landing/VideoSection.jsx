import { useState } from "react";
import { VIDEOS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import VideoModal from "@/components/common/VideoModal";
import { Play } from "lucide-react";
function VideoSection() {
  const [activeVideo, setActiveVideo] = useState(null);
  return <section id="videos" className="section-pad bg-ink-950 bg-grain">
    <div className="container-max">
      <SectionHeading
        eyebrow="Video Gallery"
        title="Wedding films in motion"
        subtitle={"Cinematic wedding films, highlight reels and pre-wedding stories \u2014 because some moments are best felt in motion."}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{VIDEOS.map((video, i) => <article
        key={video.id}
        className="group cursor-pointer animate-fade-up"
        style={{ animationDelay: `${i * 60}ms` }}
        onClick={() => setActiveVideo(i)}
      >
        <div className="relative aspect-video overflow-hidden rounded-sm">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink-950/30 group-hover:bg-ink-950/50 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 rounded-full border-2 border-gold-400/80 flex items-center justify-center text-gold-400 backdrop-blur-sm group-hover:scale-110 group-hover:bg-gold-400 group-hover:text-ink-950 transition-all duration-500"><Play className="w-6 h-6 ml-0.5 fill-current" /></div></div>
          <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-gold-300 bg-ink-950/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold-400/20">{video.category}</span>
        </div>
        <h3 className="font-serif text-xl text-ink-50 mt-4 group-hover:text-gold-300 transition-colors">{video.title}</h3>
      </article>)}</div>
    </div>
    {activeVideo !== null && <VideoModal
      youtubeId={VIDEOS[activeVideo].youtubeId}
      title={VIDEOS[activeVideo].title}
      onClose={() => setActiveVideo(null)}
    />}
  </section>;
}
export {
  VideoSection as default
};
