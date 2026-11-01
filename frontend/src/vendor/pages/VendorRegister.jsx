import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Camera, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
function VendorRegister() {
  const { signUpVendor } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    studioName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: ""
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: error2 } = await signUpVendor(form);
    setLoading(false);
    if (error2) {
      setError(error2);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/vendor/login"), 3e3);
    }
  };
  const inputClass = "w-full bg-ink-900 border border-white/10 rounded-sm px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-gold-400 transition-colors";
  const labelClass = "block text-[10px] uppercase tracking-widest text-ink-400 mb-2";
  return <div className="min-h-screen bg-ink-950 bg-grain flex flex-col">
    {
      /* Top bar */
    }
    <div className="container-max py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2.5">
        <Camera className="w-6 h-6 text-gold-400" />
        <span className="font-serif text-xl text-ink-50">
          {"SVML"}
          <span className="text-gold-400">.</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {"Back to Home"}
        </Link>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center px-6 py-12"><div className="w-full max-w-2xl">{success ? <div className="text-center animate-scale-in">
      <CheckCircle2 className="w-16 h-16 text-gold-400 mx-auto mb-6" />
      <h1 className="font-serif text-3xl text-ink-50 mb-3">Welcome to SVML</h1>
      <p className="text-ink-400 mb-2">Your studio account has been created successfully.</p>
      <p className="text-sm text-ink-500">Redirecting you to sign in...</p>
    </div> : <>
      <div className="text-center mb-10">
        <span className="eyebrow text-gold-400">Join The Platform</span>
        <h1 className="heading-serif text-4xl md:text-5xl mt-4 mb-3">Create your studio account</h1>
        <p className="text-ink-400 text-sm">Get your own professional photography website and start receiving client inquiries.</p>
      </div>
      {error && <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3 text-sm text-red-400">
        <AlertCircle className="w-5 h-5 shrink-0" />
        {error}
      </div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="ownerName">Owner Name</label>
            <input id="ownerName" name="ownerName" type="text" required value={form.ownerName} onChange={handleChange} className={inputClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label className={labelClass} htmlFor="studioName">Studio Name</label>
            <input id="studioName" name="studioName" type="text" required value={form.studioName} onChange={handleChange} className={inputClass} placeholder="Jane Photography" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="jane@studio.com" />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="+91 98765 43210" />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className={inputClass} placeholder="Min 6 characters" />
        </div>
        <div>
          <label className={labelClass} htmlFor="address">Address</label>
          <input id="address" name="address" type="text" required value={form.address} onChange={handleChange} className={inputClass} placeholder="Street address" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="city">City</label>
            <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} className={inputClass} placeholder="Bhopal" />
          </div>
          <div>
            <label className={labelClass} htmlFor="state">State</label>
            <input id="state" name="state" type="text" required value={form.state} onChange={handleChange} className={inputClass} placeholder="Madhya Pradesh" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-ink-950 font-sans uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:from-gold-300 hover:to-gold-400 transition-all disabled:opacity-50"
        >{loading ? <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {" Creating account..."}
        </> : <>
          {"Create Studio Account "}
          <ArrowRight className="w-4 h-4" />
        </>}</button>
      </form>
      <p className="text-center text-sm text-ink-500 mt-6">
        {"Already have an account?"}
        {" "}
        <Link to="/vendor/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign in</Link>
      </p>
    </>}</div></div>
  </div>;
}
export {
  VendorRegister as default
};
