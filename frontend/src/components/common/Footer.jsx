import { Camera, Instagram, Facebook, Youtube, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/data/demoContent";
import { Link } from "react-router-dom";
function Footer() {
  return <footer className="bg-ink-950 border-t border-white/5 bg-grain"><div className="container-max py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {
        /* Brand */
      }
      <div className="lg:col-span-1">
        <div className="flex items-center gap-2.5 mb-5">
          <Camera className="w-6 h-6 text-gold-400" />
          <span className="font-serif text-xl tracking-wide text-ink-50">
            {"SVML"}
            <span className="text-gold-400">.</span>
          </span>
        </div>
        <p className="text-sm text-ink-400 leading-relaxed mb-6 max-w-xs">{"A premium wedding and event photography studio capturing timeless stories across India. This is a demo showcase for the SVML \u2014 Sachin Video Mixing Lab platform."}</p>
        <div className="flex items-center gap-3">{[
          { Icon: Instagram, label: "Instagram" },
          { Icon: Facebook, label: "Facebook" },
          { Icon: Youtube, label: "YouTube" },
          { Icon: MessageCircle, label: "WhatsApp" }
        ].map(({ Icon, label }) => <a
          key={label}
          href="#"
          aria-label={label}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-ink-300 hover:border-gold-400 hover:text-gold-400 transition-all duration-300"
        ><Icon className="w-4 h-4" /></a>)}</div>
      </div>
      {
        /* Quick links */
      }
      <div>
        <h4 className="eyebrow mb-5">Quick Links</h4>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">{NAV_LINKS.slice(0, 8).map((link) => <li key={link.label}><a
          href={link.href}
          className="text-sm text-ink-400 hover:text-gold-400 transition-colors"
        >{link.label}</a></li>)}</ul>
      </div>
      {
        /* Services */
      }
      <div>
        <h4 className="eyebrow mb-5">Services</h4>
        <ul className="space-y-2.5">{[
          "Wedding Photography",
          "Pre-Wedding Shoot",
          "Wedding Videography",
          "Birthday Coverage",
          "Corporate Events",
          "Album Designing"
        ].map((s) => <li key={s}><a href="#services" className="text-sm text-ink-400 hover:text-gold-400 transition-colors">{s}</a></li>)}</ul>
      </div>
      {
        /* Contact */
      }
      <div>
        <h4 className="eyebrow mb-5">Contact</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-sm text-ink-400">
            <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
            <span>42 MP Nagar, Bhopal, Madhya Pradesh 462011</span>
          </li>
          <li className="flex items-center gap-3 text-sm text-ink-400">
            <Phone className="w-4 h-4 text-gold-400 shrink-0" />
            <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors">+91 98765 43210</a>
          </li>
          <li className="flex items-center gap-3 text-sm text-ink-400">
            <Mail className="w-4 h-4 text-gold-400 shrink-0" />
            <a href="mailto:hello@svml.studio" className="hover:text-gold-400 transition-colors">hello@svml.studio</a>
          </li>
        </ul>
        <Link
          to="/vendor/register"
          className="inline-block mt-6 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
        >{"Join as Vendor \u2192"}</Link>
      </div>
    </div>
    <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-xs text-ink-500">
        {"\xA9 "}
        {(/* @__PURE__ */ new Date()).getFullYear()}
        {" SVML \u2014 Sachin Video Mixing Lab."}
      </p>
      <div className="flex items-center gap-6">
        <a href="#" className="text-xs text-ink-500 hover:text-gold-400 transition-colors">Privacy</a>
        <a href="#" className="text-xs text-ink-500 hover:text-gold-400 transition-colors">Terms</a>
        <Link to="/admin/login" className="text-xs text-ink-500 hover:text-gold-400 transition-colors">Admin</Link>
      </div>
    </div>
  </div></footer>;
}
export {
  Footer as default
};
