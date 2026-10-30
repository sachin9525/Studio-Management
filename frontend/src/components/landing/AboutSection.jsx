import { STUDIO_STATS } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
function AboutSection() {
  return <section id="about" className="section-pad bg-ink-950 bg-grain"><div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
    {
      /* Images */
    }
    <div className="relative order-2 lg:order-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-sm"><img
            src={"https://images.pexels.com/photos/23384885/pexels-photo-23384885.jpeg?auto=compress&cs=tinysrgb&w=700"}
            alt="Photographer with camera and album"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          /></div>
          <div className="aspect-square overflow-hidden rounded-sm"><img
            src={"https://images.pexels.com/photos/16313526/pexels-photo-16313526.jpeg?auto=compress&cs=tinysrgb&w=700"}
            alt="Photo editing setup"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          /></div>
        </div>
        <div className="space-y-4 pt-10">
          <div className="aspect-square overflow-hidden rounded-sm"><img
            src={"https://images.pexels.com/photos/33072063/pexels-photo-33072063.jpeg?auto=compress&cs=tinysrgb&w=700"}
            alt="Photographer capturing a wedding"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          /></div>
          <div className="aspect-[3/4] overflow-hidden rounded-sm"><img
            src={"https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&w=700"}
            alt="Wedding photo albums"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          /></div>
        </div>
      </div>
      {
        /* Floating badge */
      }
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0 bg-gold-400 text-ink-950 px-6 py-4 rounded-sm text-center shadow-xl">
        <p className="font-serif text-3xl leading-none">8+</p>
        <p className="text-[10px] uppercase tracking-widest mt-1">Years of Art</p>
      </div>
    </div>
    {
      /* Text */
    }
    <div className="order-1 lg:order-2">
      <SectionHeading
        eyebrow="About The Studio"
        title={"Stories told through light & emotion"}
        align="left"
      />
      <div className="space-y-5 text-ink-300 leading-relaxed">
        <p>{"Sachin Video Mixing Lab was founded in 2018 with a single belief \u2014 that every wedding, every celebration, and every fleeting glance deserves to be remembered exactly as it felt. We are a team of photographers, cinematographers and album artists based in Bhopal, travelling across India to document love stories."}</p>
        <p>{"Our approach blends candid documentary coverage with timeless portraiture. We do not stage moments \u2014 we find them, frame them, and preserve them. From the henna on a bride's hands to the tear in a father's eye, nothing is missed."}</p>
      </div>
      {
        /* Stats */
      }
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-10 border-t border-white/5">{STUDIO_STATS.map((stat) => <div key={stat.label} className="text-center sm:text-left">
        <p className="font-serif text-4xl md:text-5xl text-gold-400">{stat.value}</p>
        <p className="text-[11px] uppercase tracking-widest text-ink-400 mt-2">{stat.label}</p>
      </div>)}</div>
    </div>
  </div></section>;
}
export {
  AboutSection as default
};
