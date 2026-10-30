import { useEffect, useState } from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/utils/api";
const EVENT_TYPES = [
  "Wedding Photography",
  "Pre-Wedding Shoot",
  "Wedding Videography",
  "Birthday Photography",
  "Engagement Photography",
  "Anniversary Event",
  "Corporate Event",
  "Other Function"
];
const defaultSettings = {
  contactEmail: "hello@svml.studio",
  bookingEmail: "bookings@svml.studio",
  phone: "+91 98765 43210",
  whatsappNumber: "919876543210",
  streetAddress: "42 MP Nagar",
  city: "Bhopal",
  state: "Madhya Pradesh",
  postalCode: "462011",
  businessHours: "Mon–Sat, 10am–7pm"
};
function ContactSection() {
  const packageId = new URLSearchParams(window.location.search).get("packageId") || "";
  const [studioSettings, setStudioSettings] = useState(defaultSettings);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    eventLocation: "",
    budget: "",
    message: ""
  });
  useEffect(() => {
    apiRequest("/settings/public")
      .then((settings) => setStudioSettings((current) => ({ ...current, ...settings })))
      .catch(() => {});
  }, []);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await apiRequest("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          packageId: packageId || undefined,
          eventDate: form.eventDate || undefined,
          studioSlug: window.location.pathname.match(/^\/studio\/([^/]+)/)?.[1],
        })
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", eventType: "", eventDate: "", eventLocation: "", budget: "", message: "" });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send your inquiry.");
    } finally {
      setSubmitting(false);
    }
  };
  const inputClass = "w-full bg-ink-800 border border-white/10 rounded-sm px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400 transition-colors";
  const labelClass = "block text-[10px] uppercase tracking-widest text-ink-400 mb-2";
  return <section id="contact" className="section-pad bg-ink-900"><div className="container-max">
    <SectionHeading
      eyebrow="Get In Touch"
      title="Let's capture your story"
      subtitle="Tell us about your celebration and we will get back to you within 24 hours with availability and a tailored quote."
    />
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {
        /* Contact info */
      }
      <div className="lg:col-span-2 space-y-8">
        {[
          {
            Icon: MapPin,
            title: "Visit The Studio",
            lines: [[studioSettings.streetAddress, studioSettings.city].filter(Boolean).join(", "), [studioSettings.state, studioSettings.postalCode].filter(Boolean).join(" ")].filter(Boolean)
          },
          {
            Icon: Phone,
            title: "Call Us",
            lines: [studioSettings.phone, studioSettings.businessHours].filter(Boolean)
          },
          {
            Icon: Mail,
            title: "Email Us",
            lines: [studioSettings.contactEmail, studioSettings.bookingEmail].filter(Boolean)
          }
        ].map(({ Icon, title, lines }) => <div key={title} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-gold-400" /></div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold-400 mb-2">{title}</h3>
            {lines.map((line) => <p key={line} className="text-sm text-ink-300">{line}</p>)}
          </div>
        </div>)}
        {
          /* Quick action buttons */
        }
        <div className="flex flex-wrap gap-3 pt-4">
          <a
            href={`https://wa.me/${studioSettings.whatsappNumber.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs uppercase tracking-widest hover:bg-green-500/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {"WhatsApp"}
          </a>
          <a
            href={`tel:${studioSettings.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink-800 border border-white/10 text-ink-200 text-xs uppercase tracking-widest hover:border-gold-400 hover:text-gold-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {"Call"}
          </a>
        </div>
      </div>
      {
        /* Form */
      }
      <div className="lg:col-span-3 bg-ink-800/50 rounded-sm p-6 md:p-8 border border-white/5">{submitted ? <div className="flex flex-col items-center justify-center py-16 text-center animate-scale-in">
        <CheckCircle2 className="w-16 h-16 text-gold-400 mb-4" />
        <h3 className="font-serif text-2xl text-ink-50 mb-2">Inquiry Sent</h3>
        <p className="text-sm text-ink-400 max-w-sm">Thank you for reaching out. Our team will contact you within 24 hours to discuss your celebration.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-6 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300">Send another inquiry</button>
      </div> : <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p role="alert" className="rounded-sm border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">{error}</p>}
        {packageId && <p className="rounded-sm border border-gold-400/20 bg-gold-400/5 p-3 text-sm text-gold-300">Your enquiry will be sent to the studio offering this package.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="jane@example.com"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              required
              value={form.eventType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select event type</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="eventDate">Event Date</label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="eventLocation">Event Location</label>
            <input
              id="eventLocation"
              name="eventLocation"
              type="text"
              value={form.eventLocation}
              onChange={handleChange}
              className={inputClass}
              placeholder="City / Venue"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="budget">Budget Range</label>
            <select
              id="budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select budget</option>
              <option value="under-50k">{"Under \u20B950,000"}</option>
              <option value="50k-1l">{"\u20B950,000 \u2013 \u20B91,00,000"}</option>
              <option value="1l-2l">{"\u20B91,00,000 \u2013 \u20B92,00,000"}</option>
              <option value="above-2l">{"Above \u20B92,00,000"}</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            className={inputClass}
            placeholder="Tell us about your celebration..."
          />
        </div>
        <Button type="submit" variant="gold" size="md" className="w-full" disabled={submitting}>
          {submitting ? "Sending..." : "Send Inquiry"}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </form>}</div>
    </div>
  </div></section>;
}
export {
  ContactSection as default
};
