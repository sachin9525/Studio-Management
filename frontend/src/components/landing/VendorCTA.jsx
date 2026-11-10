import Button from "@/components/common/Button";
import { ArrowRight, LayoutDashboard, Sparkles, CheckCircle2, Shield } from "lucide-react";
import TiltCard3D from "@/components/3d/TiltCard3D";

function VendorCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-ink-950">
      {/* Background Image with Cinematic Darkness */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/33975526/pexels-photo-33975526.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Photographer at work"
          className="w-full h-full object-cover opacity-15 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-950/85 to-ink-950" />
      </div>

      <div className="relative container-max text-center z-10">
        <TiltCard3D
          maxTilt={6}
          className="rounded-sm p-8 sm:p-14 bg-gradient-to-br from-gold-400/10 via-ink-900/90 to-ink-950 border border-gold-400/40 shadow-2xl max-w-4xl mx-auto backdrop-blur-xl relative overflow-hidden"
        >
          {/* Ambient Golden Core Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-400/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>For Professional Photography & Film Studios</span>
            </div>

            <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink-50 font-normal leading-tight mb-5">
              Launch Your Own Luxury Studio Platform <span className="italic text-gold-300">on SVML</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-ink-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              Publish 4K films, curate luxury photo albums, offer custom pricing tiers, and receive verified bride & groom leads — all from your personalized studio portal.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/vendor/register" variant="gold" size="lg" className="shadow-xl shadow-gold-500/20 group">
                <span>Join Platform as Studio</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button to="/vendor/login" variant="outline" size="lg">
                <LayoutDashboard className="w-4 h-4 mr-2 text-gold-400" />
                <span>Vendor Sign In</span>
              </Button>
            </div>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-xs text-ink-300">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Custom Studio URL</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct Lead Inbox</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4K Media Hosting</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>0% Commission</span>
              </div>
            </div>
          </div>
        </TiltCard3D>
      </div>
    </section>
  );
}

export default VendorCTA;
