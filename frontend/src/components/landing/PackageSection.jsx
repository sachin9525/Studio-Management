import { useEffect, useState } from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import { Check, Star, Sparkles, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/utils/api";
import TiltCard3D from "@/components/3d/TiltCard3D";

const priceFormat = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const FALLBACK_PACKAGES = [
  {
    _id: "pkg-essential",
    name: "Essential Collection",
    tagline: "Intimate ceremonies & timeless portraiture",
    price: 49000,
    isFeatured: false,
    features: [
      "1 Senior Candid Photographer",
      "1 Traditional Master Videographer",
      "Full Day Coverage (Up to 8 Hours)",
      "300+ Color Graded Digital Photos",
      "4K Cinematic Highlights Film (3–5 Mins)",
      "High-Res Online Cloud Gallery"
    ]
  },
  {
    _id: "pkg-signature",
    name: "Signature Imperial",
    tagline: "Our most booked luxury wedding experience",
    price: 95000,
    isFeatured: true,
    features: [
      "2 Senior Candid Photographers + 1 Director",
      "2 Cinematic Videographers (Multi-Cam Setup)",
      "Licensed DGCA 4K Drone Aerial Coverage",
      "600+ Master Graded Heirlooms",
      "Full Wedding Documentary (25–40 Mins)",
      "24-Hour Express Social Reel for WhatsApp",
      "1 Handcrafted Leather Layflat Album (40 Pages)"
    ]
  },
  {
    _id: "pkg-royal",
    name: "Royal Heritage Legacy",
    tagline: "Grand multi-day destination weddings",
    price: 165000,
    isFeatured: false,
    features: [
      "Complete 3-Day Wedding & Pre-Wedding Team",
      "4 Photographers + 3 Cinematographers + Drone",
      "Pre-Wedding Shoot in Exotic Location Included",
      "Next-Day Same-Day-Edit (SDE) Teaser",
      "Dolby Mastered Audio & DaVinci Color Grade",
      "2 Imperial Handcrafted Albums + Parents Mini Books",
      "Archival Wooden Gift Box with Custom Engraved USB"
    ]
  }
];

function PackageSection() {
  const [packages, setPackages] = useState(FALLBACK_PACKAGES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    apiRequest("/packages")
      .then((data) => {
        if (isCurrent && data.packages && data.packages.length > 0) {
          setPackages(data.packages);
        }
      })
      .catch(() => {
        // Silently preserve luxurious fallback packages
      });
    return () => { isCurrent = false; };
  }, []);

  return (
    <section id="packages" className="section-pad bg-ink-950 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-gold-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-max relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="heading-serif text-3xl sm:text-4xl md:text-5xl text-ink-50 font-normal">
            Signature Coverage <span className="italic text-gold-300">Packages</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-300 font-light max-w-xl mx-auto">
            Clear, all-inclusive pricing crafted for intimate ceremonies and royal destination celebrations alike.
          </p>
        </div>

        {/* 3D Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg, i) => (
            <TiltCard3D
              key={pkg._id}
              maxTilt={pkg.isFeatured ? 10 : 8}
              scale={pkg.isFeatured ? 1.04 : 1.02}
              className={`rounded-sm p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative shadow-lg ${
                pkg.isFeatured
                  ? "bg-gradient-to-b from-gold-400/15 via-white dark:via-ink-900 to-white dark:to-ink-900 border-2 border-gold-400/70 shadow-2xl shadow-gold-500/20 md:-translate-y-4"
                  : "bg-white dark:bg-ink-900/80 border border-black/10 dark:border-white/10 hover:border-gold-400/40"
              }`}
            >
              {/* Featured Badge */}
              {pkg.isFeatured && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink-50 font-medium mb-1.5">
                  {pkg.name}
                </h3>
                <p className="text-xs text-ink-300 mb-6 font-light leading-relaxed">
                  {pkg.tagline}
                </p>

                <div className="flex items-baseline gap-1.5 mb-8 pb-6 border-b border-black/5 dark:border-white/5">
                  <span className="font-serif text-3xl sm:text-4xl text-gold-300 font-semibold">
                    {priceFormat.format(Number(pkg.price) || 49000)}
                  </span>
                  <span className="text-xs text-ink-400 font-mono">/ event onwards</span>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {(pkg.features || []).map((feature, featureIndex) => (
                    <li
                      key={`${pkg._id}-${featureIndex}`}
                      className="flex items-start gap-3 text-xs sm:text-sm text-ink-200"
                    >
                      <div className="p-0.5 rounded-full bg-gold-400/15 text-gold-400 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Button
                  href={`/?packageId=${encodeURIComponent(pkg._id)}#contact`}
                  variant={pkg.isFeatured ? "gold" : "outline"}
                  size="md"
                  className="w-full font-semibold shadow-lg"
                >
                  Book Package
                </Button>
                <p className="text-center text-[10px] text-ink-400 mt-2.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Custom add-ons & dates flexible
                </p>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PackageSection;
