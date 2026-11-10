import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  Camera,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  Server,
  FileText,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-ink-950 text-ink-100 transition-colors duration-500 overflow-x-hidden">
      
      {/* ─── Standard Platform Navigation Bar (Identical Width & Layout) ─── */}
      <Navbar />

      {/* ─── Ambient Stage Lighting ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-gold-400/15 via-gold-500/5 to-transparent blur-[140px] rounded-full pointer-events-none" />

      {/* ─── Main Content Canvas (Exact Width of Nav: container-max) ─── */}
      <main className="relative z-20 w-full container-max pt-32 pb-20 flex-1">
        
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[11px] font-sans font-bold tracking-[0.2em] uppercase mb-4 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>LEGAL DISCLOSURE</span>
          </div>

          <h1 className="heading-serif text-4xl sm:text-5xl md:text-6xl text-ink-50 mb-4">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-ink-400 max-w-2xl mx-auto leading-relaxed mb-6">
            How SVML (Sachin Video Mixing Lab) collects, protects, and governs client and vendor data across our luxury photography and cinematography platform.
          </p>

          <div className="inline-flex items-center gap-4 text-xs font-mono text-ink-500 border-t border-b border-white/10 dark:border-white/10 py-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Last Updated: November 2026
            </span>
            <span>·</span>
            <span>Effective: Immediate</span>
          </div>
        </div>

        {/* Legal Document Card (Matches 100% of container-max Width) */}
        <article className="w-full rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 md:p-14 bg-ink-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.4)] space-y-10 text-xs sm:text-sm font-sans leading-relaxed text-ink-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                1. Information We Collect
              </h2>
            </div>
            <p>
              SVML (&ldquo;Sachin Video Mixing Lab&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) collects personal information that you voluntarily provide when using our platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Client Inquiries:</strong> When submitting an inquiry through our public catalog or package selector, we collect your full name, email address, phone number, event type (e.g. Wedding, Pre-Wedding, Cinematic Film), event date, venue location, and budget specifications.
              </li>
              <li>
                <strong className="text-ink-100">Vendor Studio Accounts:</strong> When a studio or photographer registers, we collect the studio business name, owner details, contact phone, operating address, city, state, portfolio links, and authentication credentials.
              </li>
              <li>
                <strong className="text-ink-100">Technical Telemetry:</strong> Standard browser telemetry including IP address, browser type, device information, and page interaction timestamps.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                2. Photography & Cinematography Media Rights
              </h2>
            </div>
            <p>
              Our platform is dedicated to luxury wedding films and photography collections:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Original Studio Ownership:</strong> All photographs, 4K film reels, teaser trailers, and albums hosted on SVML remain the intellectual and creative property of their respective creators and registered studios.
              </li>
              <li>
                <strong className="text-ink-100">No Third-Party Reselling:</strong> We do not sell, rent, commercialize, or license client photos or wedding footage to third-party advertising brokers or stock photography libraries.
              </li>
              <li>
                <strong className="text-ink-100">Client Consent:</strong> Photographers publishing client images must possess client consent in accordance with their independent shoot contracts.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                3. Data Security & Storage Architecture
              </h2>
            </div>
            <p>
              We implement comprehensive security protocols to safeguard your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Encryption:</strong> Data in transit is protected using modern TLS/HTTPS encryption. User authentication passwords are encrypted using salted one-way hashing algorithms.
              </li>
              <li>
                <strong className="text-ink-100">Session Tokens:</strong> Platform access tokens (JWT) are stored securely in browser storage and expire automatically to prevent unauthorized account access.
              </li>
              <li>
                <strong className="text-ink-100">Access Control:</strong> Administrative and vendor dashboards are strictly governed by role-based access control (RBAC).
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                4. Your Rights & Data Choices
              </h2>
            </div>
            <p>
              Under applicable Indian privacy and digital data protection laws, you retain full ownership of your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Access & Correction:</strong> You may request a review or correction of any inquiries or studio details stored under your name.
              </li>
              <li>
                <strong className="text-ink-100">Takedown & Erasure:</strong> Couples or individuals whose imagery appears in public showcases may submit an immediate takedown request by contacting our studio desk.
              </li>
            </ul>
          </section>

          {/* Section 5: Contact */}
          <section className="space-y-3 border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                5. Privacy Grievance Officer & Contact
              </h2>
            </div>
            <p>
              For privacy concerns, data erasure requests, or questions regarding this policy, please reach out to our administration office:
            </p>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <p className="font-bold text-ink-50">SVML Privacy & Legal Compliance Desk</p>
              <p className="flex items-center gap-2 text-ink-300">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>42 MP Nagar, Bhopal, Madhya Pradesh 462011, India</span>
              </p>
              <p className="flex items-center gap-2 text-ink-300">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <a href="mailto:hello@svml.studio" className="text-gold-400 hover:underline">
                  hello@svml.studio
                </a>
              </p>
            </div>
          </section>

          {/* Cross Link to Terms */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Terms of Service &rarr;</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-sans font-bold tracking-wider uppercase bg-gold-400 hover:bg-gold-300 text-ink-950 transition-all shadow-md active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </article>
      </main>

      {/* ─── Standard Platform Footer (Identical Width & Styling) ─── */}
      <Footer />
    </div>
  );
}
