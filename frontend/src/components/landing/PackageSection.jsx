import { useEffect, useState } from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import { Check, Star } from "lucide-react";
import { apiRequest } from "@/utils/api";

const priceFormat = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function PackageSection() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    apiRequest("/packages")
      .then((data) => {
        if (isCurrent) setPackages(data.packages || []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError instanceof Error ? requestError.message : "Unable to load packages.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  return <section id="packages" className="section-pad bg-ink-900"><div className="container-max">
    <SectionHeading
      eyebrow="Packages"
      title="Choose your coverage"
      subtitle={"Transparent pricing for every kind of celebration. Every package is customisable \u2014 speak to us for a tailored quote."}
    />
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading packages…</p> : error ? <p role="alert" className="py-12 text-center text-sm text-red-300">{error}</p> : packages.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">{packages.map((pkg, i) => <div
      key={pkg._id}
      className={`relative rounded-sm p-8 transition-all duration-500 animate-fade-up ${pkg.isFeatured ? "bg-gradient-to-b from-gold-400/10 to-ink-800 border border-gold-400/40 md:-translate-y-4 shadow-2xl shadow-gold-500/10" : "bg-ink-800 border border-white/5 hover:border-white/10"}`}
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {pkg.isFeatured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gold-400 text-ink-950 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold">
        <Star className="w-3 h-3 fill-current" />
        {"Most Popular"}
      </div>}
      <h3 className="font-serif text-3xl text-ink-50 mb-1">{pkg.name}</h3>
      <p className="text-xs text-ink-400 mb-6">{pkg.tagline}</p>
      {pkg.vendorName && <p className="-mt-4 mb-5 text-[10px] uppercase tracking-widest text-ink-500">{pkg.vendorName}</p>}
      <div className="flex items-baseline gap-1 mb-8">
        <span className="font-serif text-4xl text-gold-400">{priceFormat.format(pkg.price)}</span>
        <span className="text-xs text-ink-500">onwards</span>
      </div>
      <ul className="space-y-3.5 mb-8">{(pkg.features || []).map((feature, featureIndex) => <li key={`${pkg._id}-${featureIndex}`} className="flex items-start gap-3 text-sm text-ink-300">
        <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
        {feature}
      </li>)}</ul>
      <Button
        href={`/?packageId=${encodeURIComponent(pkg._id)}#contact`}
        variant={pkg.isFeatured ? "gold" : "outline"}
        size="md"
        className="w-full"
      >Enquire Now</Button>
    </div>)}</div> : <p className="py-12 text-center text-sm text-ink-500">No packages are currently published. Please check back soon.</p>}
    {packages.length > 0 && <p className="text-center text-xs text-ink-500 mt-10">Contact the studio for a tailored quote or package customisation.</p>}
  </div></section>;
}
export {
  PackageSection as default
};
