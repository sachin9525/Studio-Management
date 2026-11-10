import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankService = {
  name: '',
  category: 'Weddings',
  description: '',
  startingPrice: '',
  duration: 'Full Day (8-10 Hours)',
};

const inputClass = 'w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none transition-colors shadow-inner';

const parsePrice = (val) => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const formatPrice = (val) => {
  const num = parsePrice(val);
  return '₹' + num.toLocaleString('en-IN');
};

const CATEGORIES = ['All', 'Weddings', 'Pre-Wedding', 'Cinematic Films', 'Celebrations', 'Drone Coverage'];

function VendorServices() {
  const { session } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(blankService);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadServices = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/services', { token: session.token });
      setServices(data.services || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const resetForm = () => {
    setForm(blankService);
    setEditingId('');
    setShowAddForm(false);
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const numericPrice = parsePrice(form.startingPrice);
    const payload = {
      ...form,
      startingPrice: numericPrice,
    };
    try {
      const data = await apiRequest(editingId ? `/vendor/services/${editingId}` : '/vendor/services', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: JSON.stringify(payload),
      });
      if (editingId) {
        setServices((current) => current.map((s) => (s._id === editingId ? data.service : s)));
      } else {
        setServices((current) => [data.service, ...current]);
      }
      setSaved(true);
      resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save service.');
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setForm({
      name: service.name,
      category: service.category || 'Weddings',
      description: service.description || '',
      startingPrice: service.startingPrice || '',
      duration: service.duration || 'Full Day (8-10 Hours)',
    });
    setEditingId(service._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    setUpdatingId(service._id);
    setError('');
    try {
      await apiRequest(`/vendor/services/${service._id}`, { method: 'DELETE', token: session.token });
      setServices((current) => current.filter((s) => s._id !== service._id));
      if (editingId === service._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete service.');
    } finally {
      setUpdatingId('');
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchCategory = activeCategory === 'All' || srv.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        srv.name.toLowerCase().includes(q) ||
        (srv.description && srv.description.toLowerCase().includes(q)) ||
        (srv.category && srv.category.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const prices = services.map((s) => parsePrice(s.startingPrice)).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  const uniqueCategories = new Set(services.map((s) => s.category).filter(Boolean)).size;

  return (
    <VendorLayout title="Studio Services">
      {/* Top Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Service Offerings
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio Services</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Manage your photography, videography, and drone services listed on your studio profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadServices}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-semibold bg-white/80 dark:bg-black/30 text-ink-700 dark:text-ink-300 hover:border-gold-500/40 hover:text-gold-700 dark:hover:text-gold-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              if (showAddForm) resetForm();
              else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? 'Close Form' : 'Add Service'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-600 dark:text-red-300 shadow-xs">
          <span>{error}</span>
          <button type="button" onClick={loadServices} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Service successfully saved and published on your profile.</span>
        </div>
      )}

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Offerings', services.length, 'Active in catalog'],
          ['Starting Rate', minPrice > 0 ? formatPrice(minPrice) : '₹0', 'Base service fee'],
          ['Average Offering', avgPrice > 0 ? formatPrice(avgPrice) : '₹0', 'Average rate'],
          ['Categories', uniqueCategories || 1, 'Specializations'],
        ].map(([label, value, subtext], idx) => (
          <div
            key={label}
            className="relative rounded-[24px] p-4 sm:p-5 border bg-white/90 dark:bg-black/45 backdrop-blur-2xl border-black/10 dark:border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:-translate-y-0.5 transition-all"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-gold-400/30 text-gold-700 dark:text-gold-300 flex items-center justify-center font-bold text-xs shadow-2xs">
                {idx + 1}
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300 truncate max-w-[120px]">
                {subtext}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums truncate">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              <h3 className="font-serif text-2xl text-ink-50 font-normal">{editingId ? 'Edit Service Offering' : 'Add New Service Offering'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 relative z-10">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Service Name *</span>
              <input required maxLength={100} value={form.name} onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))} className={inputClass} placeholder="e.g. Traditional & Candid Wedding Photography" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Category *</span>
              <select value={form.category} onChange={(e) => setForm((curr) => ({ ...curr, category: e.target.value }))} className={inputClass}>
                <option value="Weddings">Weddings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Cinematic Films">Cinematic Films</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Drone Coverage">Drone Coverage</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Starting Price (₹) *</span>
              <input required type="number" min="0" step="1" value={form.startingPrice} onChange={(e) => setForm((curr) => ({ ...curr, startingPrice: e.target.value }))} className={inputClass} placeholder="45000" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Duration & Crew Details</span>
              <input maxLength={120} value={form.duration} onChange={(e) => setForm((curr) => ({ ...curr, duration: e.target.value }))} className={inputClass} placeholder="e.g. Full Day Coverage (8-10 Hours) · 2 Lead Photographers" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Service Description</span>
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))} className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 p-4 text-xs text-ink-50 placeholder:text-ink-400 focus:border-gold-500 focus:outline-none shadow-inner" placeholder="Describe the artistic style, equipment used, and what clients receive." />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-black/10 dark:border-white/10 pt-4 relative z-10">
            <button type="button" onClick={resetForm} className="rounded-full px-4 py-2 text-xs font-semibold text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 shadow-lg shadow-gold-500/25 disabled:opacity-50 cursor-pointer">
              {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{saving ? 'Saving…' : editingId ? 'Update Service' : 'Save Service'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all cursor-pointer shadow-2xs ${
                activeCategory === cat
                  ? 'bg-gold-500/15 dark:bg-white/15 border border-gold-500/35 dark:border-white/20 text-gold-900 dark:text-gold-300 shadow-xs'
                  : 'bg-black/[0.03] dark:bg-white/5 border border-black/10 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-ink-500 dark:text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono font-semibold text-ink-500 animate-pulse">Loading services catalog…</div>
      ) : filteredServices.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const numericPrice = parsePrice(service.startingPrice);
            return (
              <article
                key={service._id}
                className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-wider font-bold shadow-2xs">
                      <Tag className="w-3 h-3" />
                      {service.category || 'Weddings'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                      <CheckCircle2 className="w-3 h-3" />
                      Live
                    </span>
                  </div>

                  <h4 className="font-serif text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                    {service.name}
                  </h4>

                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-2 min-h-[36px] line-clamp-2 font-medium leading-relaxed">
                    {service.description || 'Professional photography and cinematography coverage.'}
                  </p>

                  <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
                    {service.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-ink-600 dark:text-ink-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                        <span className="truncate">{service.duration}</span>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-400">Starting Rate</span>
                      <span className="font-serif text-3xl text-gold-700 dark:text-gold-300 font-bold tabular-nums">
                        {formatPrice(numericPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => editService(service)}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                    title="Edit Service"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === service._id}
                    onClick={() => deleteService(service)}
                    className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/30 px-6 py-20 text-center backdrop-blur-xl">
          <Briefcase className="mx-auto mb-3 h-10 w-10 text-ink-400 opacity-60" />
          <h4 className="font-serif text-xl text-ink-50">No Services Found</h4>
          <p className="mt-1 text-xs text-ink-500 max-w-sm mx-auto font-medium">
            {searchQuery || activeCategory !== 'All'
              ? 'Try adjusting your search or category filter.'
              : 'Add your photography and videography services above.'}
          </p>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorServices;
