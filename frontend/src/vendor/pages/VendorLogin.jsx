import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Camera, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
function VendorLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: error2 } = await signIn(form.email, form.password);
    setLoading(false);
    if (error2) {
      setError(error2);
    } else {
      navigate("/vendor/dashboard");
    }
  };
  const inputClass = "w-full bg-ink-900 border border-white/10 rounded-sm px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-gold-400 transition-colors";
  const labelClass = "block text-[10px] uppercase tracking-widest text-ink-400 mb-2";
  return <div className="min-h-screen bg-ink-950 bg-grain flex flex-col">
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
    <div className="flex-1 flex items-center justify-center px-6 py-12"><div className="w-full max-w-md">
      <div className="text-center mb-10">
        <span className="eyebrow text-gold-400">Vendor Portal</span>
        <h1 className="heading-serif text-4xl md:text-5xl mt-4 mb-3">Welcome back</h1>
        <p className="text-ink-400 text-sm">Sign in to manage your studio portfolio.</p>
      </div>
      {error && <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3 text-sm text-red-400">
        <AlertCircle className="w-5 h-5 shrink-0" />
        {error}
      </div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="jane@studio.com" />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} className={inputClass} placeholder="Your password" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-ink-950 font-sans uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:from-gold-300 hover:to-gold-400 transition-all disabled:opacity-50"
        >{loading ? <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {" Signing in..."}
        </> : <>
          {"Sign In "}
          <ArrowRight className="w-4 h-4" />
        </>}</button>
      </form>
      <p className="text-center text-sm text-ink-500 mt-6">
        {"New to SVML?"}
        {" "}
        <Link to="/vendor/register" className="text-gold-400 hover:text-gold-300 transition-colors">Create an account</Link>
      </p>
      <div className="mt-10 pt-6 border-t border-white/5 text-center"><Link to="/admin/login" className="text-xs text-ink-600 hover:text-ink-400 transition-colors uppercase tracking-widest">{"Admin Login \u2192"}</Link></div>
    </div></div>
  </div>;
}
export {
  VendorLogin as default
};
