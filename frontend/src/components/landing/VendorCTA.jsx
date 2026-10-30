import Button from "@/components/common/Button";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
function VendorCTA() {
  return <section className="relative py-28 md:py-36 overflow-hidden bg-ink-950">
    {
      /* Background image */
    }
    <div className="absolute inset-0">
      <img
        src={"https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=1920"}
        alt="Photographer at work"
        className="w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/80 to-ink-950" />
    </div>
    <div className="relative container-max text-center">
      <span className="eyebrow text-gold-300 mb-6 inline-block">
        <Sparkles className="inline w-4 h-4 mr-1.5" />
        {"For Photography Studios"}
      </span>
      <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto text-balance leading-tight mb-6">
        {"Want a professional photography website"}
        <span className="italic text-gold-300"> like this one?</span>
      </h2>
      <p className="text-base md:text-lg text-ink-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">{"Create your studio portfolio, upload wedding albums and videos, showcase your services, and receive client inquiries \u2014 all from your own personalised studio website on the SVML platform."}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button to="/vendor/register" variant="gold" size="lg">
          {"Register as Vendor"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button to="/vendor/register" variant="outline" size="lg">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          {"View Demo Dashboard"}
        </Button>
      </div>
      {
        /* Feature pills */
      }
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16 max-w-3xl mx-auto">{[
        "Your own studio URL",
        "Unlimited albums & videos",
        "Client inquiry management",
        "Custom packages & pricing"
      ].map((feat) => <div key={feat} className="flex items-center gap-2 text-xs text-ink-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
        {feat}
      </div>)}</div>
    </div>
  </section>;
}
export {
  VendorCTA as default
};
