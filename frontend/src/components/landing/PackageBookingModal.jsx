import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Calendar,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import { apiRequest } from "@/utils/api";
import { useTheme } from "@/context/ThemeContext";

const priceFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function PackageBookingModal({ pkg, onClose }) {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("919876543210");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    eventLocation: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch live studio WhatsApp number from public settings
  useEffect(() => {
    let isCurrent = true;
    apiRequest("/settings/public")
      .then((settings) => {
        if (isCurrent && settings?.whatsappNumber) {
          setWhatsappNumber(String(settings.whatsappNumber).replace(/\D/g, ""));
        }
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, []);

  // Lock body scroll while modal is open & listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!pkg || !mounted) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formattedPrice = priceFormat.format(Number(pkg.price) || 49000);

  // Pre-formatted WhatsApp Message
  const getWhatsAppMessage = () => {
    const dateText = form.eventDate ? `on *${form.eventDate}*` : "";
    const locText = form.eventLocation ? `in *${form.eventLocation}*` : "";
    const nameText = form.name ? `My name is *${form.name}*.` : "";
    return encodeURIComponent(
      `Namaste SVML Studio! 📸\n\nI am interested in booking the *${pkg.name}* (${formattedPrice}) package for our wedding celebration ${dateText} ${locText}.\n${nameText}\n\nPlease let me know if this date is available for booking consultation.`
    );
  };

  // Submit Inquiry to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    const rawDigits = form.phone.replace(/\D/g, "");
    if (rawDigits.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          eventType: "Wedding Photography",
          eventDate: form.eventDate || undefined,
          eventLocation: form.eventLocation.trim() || undefined,
          budget: formattedPrice,
          packageName: pkg.name,
          packageId: pkg._id,
          message: form.message.trim() || `Inquiry for ${pkg.name} package`,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit inquiry. Please try again or book via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  // Trigger WhatsApp and silently save inquiry
  const handleWhatsAppBooking = () => {
    if (form.name.trim() && form.phone.trim()) {
      apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || "whatsapp-lead@svml.studio",
          eventType: "Wedding Photography",
          eventDate: form.eventDate || undefined,
          eventLocation: form.eventLocation.trim() || undefined,
          budget: formattedPrice,
          packageName: pkg.name,
          packageId: pkg._id,
          message: `Direct WhatsApp booking inquiry: ${form.message || "Date check"}`,
        }),
      }).catch(() => {});
    }

    const waUrl = `https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const modalElement = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto select-none"
      style={{ isolation: "isolate" }}
    >
      {/* Dark Translucent Luxury Backdrop — dims entire screen and blurs background */}
      <div
        className="fixed inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card — 100% Solid Background, Zero Stacking Conflict */}
      <div
        className="relative w-full max-w-lg md:max-w-xl max-h-[92vh] rounded-[28px] border border-black/15 dark:border-white/15 p-5 sm:p-7 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.6)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.95)] z-10 overflow-y-auto no-scrollbar text-neutral-900 dark:text-ink-50 my-auto animate-scale-in"
        style={{
          backgroundColor: isDark ? "#141210" : "#ffffff",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Soft Ambient Gold Highlight */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Circular Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 flex items-center justify-center text-neutral-700 dark:text-ink-300 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer z-20"
          aria-label="Close booking modal"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="py-6 sm:py-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-white font-medium mb-2">
              Inquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-ink-300 max-w-md mx-auto leading-relaxed mb-6 font-light">
              Thank you, <span className="font-bold text-neutral-900 dark:text-white">{form.name}</span>. We have locked your inquiry for the <span className="text-amber-700 dark:text-amber-300 font-semibold">{pkg.name}</span> package. Our lead cinematographer will connect with you within 24 hours.
            </p>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-md mx-auto mb-6 text-left">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Next Step: Date Availability Check</span>
              </div>
              <p className="text-xs text-neutral-700 dark:text-ink-300">
                Want instant priority confirmation? Chat with our studio director directly on WhatsApp with your date details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Now</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-black/15 dark:border-white/15 bg-black/[0.04] dark:bg-white/5 text-neutral-800 dark:text-ink-200 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                Back to Site
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div>
            {/* Header / Package Badge */}
            <div className="mb-5 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-[10px] uppercase font-mono font-bold tracking-widest mb-2">
                <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Package Inquiry Desk</span>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 dark:text-ink-50 font-normal">
                  {pkg.name}
                </h3>
                <span className="font-serif text-xl sm:text-2xl text-amber-700 dark:text-amber-300 font-bold">
                  {formattedPrice}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-ink-400 mt-1 font-light">
                {pkg.tagline}
              </p>
            </div>

            {/* Selected Perks Preview Pills */}
            <div className="flex flex-wrap gap-1.5 mb-5 pb-3 border-b border-black/10 dark:border-white/10">
              {(pkg.features || []).slice(0, 3).map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/5 text-[10px] text-neutral-700 dark:text-ink-300 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {feat}
                </span>
              ))}
              {(pkg.features || []).length > 3 && (
                <span className="px-2 py-1 text-[10px] text-neutral-500 dark:text-ink-400 font-medium">
                  +{pkg.features.length - 3} more perks included
                </span>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* Email Address */}
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="priya@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                    Wedding / Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      name="eventDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.eventDate}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                  Event Destination / City
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="eventLocation"
                    value={form.eventLocation}
                    onChange={handleChange}
                    placeholder="e.g. Udaipur Palace / Jaipur / Delhi"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Message / Special Note */}
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-neutral-500 dark:text-ink-400 mb-1">
                  Notes / Questions (Optional)
                </label>
                <textarea
                  name="message"
                  rows={2}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Need drone coverage for Sangeet & Reception..."
                  className="w-full px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/5 text-xs text-neutral-900 dark:text-ink-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  <Send className={`w-3.5 h-3.5 ${submitting ? "animate-pulse" : ""}`} />
                  <span>{submitting ? "Sending Request…" : "Confirm Booking Request"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider transition-all shadow-2xs cursor-pointer active:scale-95"
                  title="Directly connect with studio on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Book via WhatsApp</span>
                </button>
              </div>

              <p className="text-center text-[10px] text-neutral-500 dark:text-ink-400 flex items-center justify-center gap-1.5 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero advance obligation · Date availability confirmed within 24h</span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalElement, document.body) : null;
}
