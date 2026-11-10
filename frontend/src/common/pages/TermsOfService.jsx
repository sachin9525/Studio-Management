import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  Camera,
  ArrowLeft,
  Scale,
  FileCheck,
  Building,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Clock
} from "lucide-react";

export default function TermsOfService() {
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
            <Scale className="w-3.5 h-3.5 text-gold-400" />
            <span>TERMS & CONDITIONS</span>
          </div>

          <h1 className="heading-serif text-4xl sm:text-5xl md:text-6xl text-ink-50 mb-4">
            Terms of Service
          </h1>

          <p className="text-sm sm:text-base text-ink-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Standard terms and conditions governing access, studio portfolio publishing, and client bookings on the SVML (Sachin Video Mixing Lab) platform.
          </p>

          <div className="inline-flex items-center gap-4 text-xs font-mono text-ink-500 border-t border-b border-white/10 dark:border-white/10 py-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Last Updated: November 2026
            </span>
            <span>·</span>
            <span>Jurisdiction: Bhopal, India</span>
          </div>
        </div>

        {/* Legal Document Card (Matches 100% of container-max Width) */}
        <article className="w-full rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 md:p-14 bg-ink-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.4)] space-y-10 text-xs sm:text-sm font-sans leading-relaxed text-ink-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                1. Acceptance of Terms
              </h2>
            </div>
            <p>
              By accessing, browsing, registering on, or transacting through the SVML platform (&ldquo;Platform&rdquo;, operated by Sachin Video Mixing Lab), you agree to comply with and be legally bound by these Terms of Service. If you do not agree with any provision, please discontinue using the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <Building className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                2. Studio & Vendor Partner Obligations
              </h2>
            </div>
            <p>
              Photographers, cinematographers, and studio operators registering on SVML agree to the following mandatory standards:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Authentic Imagery:</strong> Vendors explicitly warrant that all portfolio images, wedding teaser videos, and package descriptions uploaded are original works shot and edited by their studio. Uploading watermarked, stolen, or copyrighted material from other artists is strictly prohibited.
              </li>
              <li>
                <strong className="text-ink-100">Verification & Approval:</strong> Newly registered studios remain in a pending state until verified by platform administrators. SVML reserves the right to reject or suspend accounts that fail quality or credential checks.
              </li>
              <li>
                <strong className="text-ink-100">Professional Conduct:</strong> Vendors must respond to client inquiries routed through the platform in a timely, professional manner.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                3. Client Bookings & Financial Transactions
              </h2>
            </div>
            <p>
              SVML operates as an administrative discovery, showcase, and lead routing platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>
                <strong className="text-ink-100">Direct Studio Contracts:</strong> Booking agreements, shoot schedules, advance payments, and deliverables are negotiated and contracted directly between the client and the respective studio.
              </li>
              <li>
                <strong className="text-ink-100">Deliverable Timelines:</strong> Raw footage delivery, album printing, and final 4K cinema master edits are governed by the specific studio contract agreed upon with the client.
              </li>
              <li>
                <strong className="text-ink-100">Disputes:</strong> While SVML verifies studio identity, we are not a party to bilateral booking disputes or refund claims between clients and independent studios.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                4. Intellectual Property
              </h2>
            </div>
            <p>
              The platform code, UI design, branding, and logos are owned by Sachin Video Mixing Lab. All photography and cinema content hosted on vendor pages remain the copyrighted property of their respective creators. No content may be downloaded, reproduced, or scraped without prior written consent.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
                5. Suspension & Account Termination
              </h2>
            </div>
            <p>
              SVML reserves the right to suspend, terminate, or restrict platform access to any vendor or user who:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-ink-400">
              <li>Violates copyright, privacy, or client confidentiality rights.</li>
              <li>Engages in fraudulent pricing or misrepresentation of studio deliverables.</li>
              <li>Attempts unauthorized security bypass, DDoS, or malicious injection.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-white/10 pt-8">
            <h2 className="heading-serif text-xl sm:text-2xl text-ink-50">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts located in Bhopal, Madhya Pradesh.
            </p>
          </section>

          {/* Cross Link to Privacy */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/privacy"
              className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read Privacy Policy &rarr;</span>
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
