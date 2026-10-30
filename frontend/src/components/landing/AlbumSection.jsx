import { useState } from "react";
import { ALBUMS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import Lightbox from "@/components/common/Lightbox";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
function AlbumSection() {
  const [openAlbum, setOpenAlbum] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const openGallery = (albumIndex) => {
    setOpenAlbum(albumIndex);
    setPhotoIndex(0);
  };
  return <section id="albums" className="section-pad bg-ink-900">
    <div className="container-max">
      <SectionHeading
        eyebrow="Wedding Albums"
        title="Heirlooms in print"
        subtitle={"A glimpse of our designed wedding albums \u2014 each one a complete story, printed and bound to last generations."}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{ALBUMS.map((album, i) => <article
        key={album.id}
        className="group cursor-pointer animate-fade-up"
        style={{ animationDelay: `${i * 80}ms` }}
        onClick={() => openGallery(i)}
      ><div className="relative aspect-[4/5] overflow-hidden rounded-sm">
        <img
          src={album.cover}
          alt={`${album.couple} wedding`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-gold-300 transition-colors">{album.couple}</h3>
          <div className="flex flex-col gap-1.5 text-ink-300 text-xs">
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              {album.date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              {album.location}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] uppercase tracking-widest">Open Album</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div></article>)}</div>
    </div>
    {openAlbum !== null && <Lightbox
      images={ALBUMS[openAlbum].images}
      index={photoIndex}
      title={`${ALBUMS[openAlbum].couple} \xB7 ${ALBUMS[openAlbum].location}`}
      onClose={() => setOpenAlbum(null)}
      onPrev={() => setPhotoIndex((i) => (i - 1 + ALBUMS[openAlbum].images.length) % ALBUMS[openAlbum].images.length)}
      onNext={() => setPhotoIndex((i) => (i + 1) % ALBUMS[openAlbum].images.length)}
    />}
  </section>;
}
export {
  AlbumSection as default
};
