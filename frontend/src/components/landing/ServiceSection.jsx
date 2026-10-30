import { SERVICES } from "@/data/demoContent";
import SectionHeading from "@/components/common/SectionHeading";
import { ArrowUpRight } from "lucide-react";
function ServiceSection() {
  return <section id="services" className="section-pad bg-ink-900"><div className="container-max">
    <SectionHeading
      eyebrow="What We Offer"
      title="Services crafted for every celebration"
      subtitle="From the first mehndi to the final farewell, we offer complete photography and cinematography coverage for weddings and events of every scale."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{SERVICES.map((service, i) => <article
      key={service.id}
      className="group relative overflow-hidden rounded-sm bg-ink-800 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${i * 50}ms` }}
    >
      <div className="aspect-[4/5] overflow-hidden"><img
        src={service.image}
        alt={service.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="font-serif text-2xl text-white mb-2 group-hover:text-gold-300 transition-colors">{service.name}</h3>
        <p className="text-sm text-ink-300 leading-relaxed max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500 overflow-hidden">{service.description}</p>
        <div className="flex items-center gap-2 mt-4 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-[10px] uppercase tracking-widest">View Details</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </article>)}</div>
  </div></section>;
}
export {
  ServiceSection as default
};
