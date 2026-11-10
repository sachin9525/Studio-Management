import { useState } from "react";
import { ALBUMS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import Lightbox from "@/components/common/Lightbox";
import { Calendar, MapPin, ArrowRight, BookOpen, Eye, Sparkles } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

function AlbumSection() {
  const [openAlbum, setOpenAlbum] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openGallery = (albumIndex) => {
    setOpenAlbum(albumIndex);
    setPhotoIndex(0);
  };

  return (
    <section id="albums" className="section-pad bg-ink-950 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <BookOpen className="w-3 h-3 text-gold-400" />
            <span>Artisan Printed Stories</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal">
            Heirlooms in <span className="italic text-gold-300">Fine Print</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-300 font-light max-w-xl mx-auto">
            Each bespoke wedding album is designed page by page, printed on 300 GSM archival silk paper, and bound in genuine Italian leather.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALBUMS.map((album, i) => (
            <TiltCard3D
              key={album.id}
              maxTilt={10}
              scale={1.03}
              className="group cursor-pointer rounded-sm overflow-hidden bg-white dark:bg-ink-900 border border-black/10 dark:border-white/10 hover:border-gold-400/60 shadow-lg hover:shadow-2xl hover:shadow-gold-500/15 transition-all duration-300 flex flex-col justify-between"
              onClick={() => openGallery(i)}
            >
              {/* Photo Cover Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-black">
                <img
                  src={album.cover}
                  alt={`${album.couple} wedding`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* 3D Spread Badge */}
                <div
                  className="absolute top-3 right-3"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-widest font-mono font-bold bg-black/85 backdrop-blur-md border border-white/20 text-[#f0d38b] shadow-lg flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#f0d38b]" />
                    <span>{album.images.length} Spreads</span>
                  </span>
                </div>

                {/* 3D Center Eye Preview Button */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ transform: "translateZ(25px)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-black/85 border border-[#d8b36a]/80 text-[#f0d38b] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5 text-[#f0d38b]" />
                  </div>
                </div>
              </div>

              {/* Card Content Body - 100% Crisp Contrast in Both Themes */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-ink-900 border-t border-black/5 dark:border-white/5">
                <div>
                  <h3 className="font-serif text-2xl text-ink-50 font-medium group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
                    {album.couple}
                  </h3>

                  <div className="flex flex-col gap-1.5 mt-3 text-ink-400 dark:text-ink-300 text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                      <span>{album.date}</span>
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                      <span>{album.location}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-gold-600 dark:text-gold-400 group-hover:translate-x-0.5 transition-transform">
                  <span className="uppercase tracking-widest text-[11px] font-bold">Explore Album</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>

      {openAlbum !== null && (
        <Lightbox
          images={ALBUMS[openAlbum].images}
          index={photoIndex}
          title={`${ALBUMS[openAlbum].couple} · ${ALBUMS[openAlbum].location}`}
          onClose={() => setOpenAlbum(null)}
          onPrev={() => setPhotoIndex((i) => (i - 1 + ALBUMS[openAlbum].images.length) % ALBUMS[openAlbum].images.length)}
          onNext={() => setPhotoIndex((i) => (i + 1) % ALBUMS[openAlbum].images.length)}
        />
      )}
    </section>
  );
}

export default AlbumSection;
