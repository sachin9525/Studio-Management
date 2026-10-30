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

const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none transition-colors';

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
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save service.');
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      category: service.category || 'Weddings',
      description: service.description || '',
      startingPrice: String(parsePrice(service.startingPrice)),
      duration: service.duration || 'Full Day (8-10 Hours)',
    });
    setShowAddForm(true);
    setSaved(false);
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
        (srv.description && srv.description.toLowerCase().includes(q));
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Service Offerings
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Studio Services</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Manage your photography, videography, and drone services listed on your studio profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadServices}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-gold-500/10"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? 'Close Form' : 'Add Service'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadServices} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Service successfully saved and published on your profile.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Total Offerings</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{services.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">Active in catalog</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Starting Rate</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 leading-none">
            {minPrice > 0 ? formatPrice(minPrice) : '₹0'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Base service fee</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Average Offering</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">
            {avgPrice > 0 ? formatPrice(avgPrice) : '₹0'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Average rate</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Categories</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-300 leading-none">{uniqueCategories || 1}</p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">Specializations</p>
        </div>
      </div>

      {/* Add / Edit Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-sm border border-gold-400/30 bg-ink-900/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-scale-in">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit Service Offering' : 'Add New Service Offering'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Service Name *</span>
              <input required maxLength={100} value={form.name} onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))} className={inputClass} placeholder="e.g. Traditional & Candid Wedding Photography" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Category *</span>
              <select value={form.category} onChange={(e) => setForm((curr) => ({ ...curr, category: e.target.value }))} className={inputClass}>
                <option value="Weddings">Weddings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Cinematic Films">Cinematic Films</option>
                <option value="Celebrations">Celebrations</option>
                <option value="Drone Coverage">Drone Coverage</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Starting Price (₹) *</span>
              <input required type="number" min="0" step="1" value={form.startingPrice} onChange={(e) => setForm((curr) => ({ ...curr, startingPrice: e.target.value }))} className={inputClass} placeholder="45000" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Duration & Crew Details</span>
              <input maxLength={120} value={form.duration} onChange={(e) => setForm((curr) => ({ ...curr, duration: e.target.value }))} className={inputClass} placeholder="e.g. Full Day Coverage (8-10 Hours) · 2 Lead Photographers" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Service Description</span>
              <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm((curr) => ({ ...curr, description: e.target.value }))} className={inputClass} placeholder="Describe the artistic style, equipment used, and what clients receive." />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-white/5 pt-4">
            <button type="button" onClick={resetForm} className="px-3.5 py-2 rounded-sm border border-white/10 text-xs text-ink-400 hover:text-ink-200">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-md shadow-gold-500/10">
              {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              <span>{saving ? 'Saving…' : editingId ? 'Update Service' : 'Save Service'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-400 text-ink-950 shadow-md shadow-gold-400/20 font-semibold'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-sm bg-ink-950/70 border border-white/10 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-50">Active Services</h3>
        <span className="text-xs text-ink-500">{filteredServices.length} offerings displayed</span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-500">Loading services catalog…</div>
      ) : filteredServices.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const numericPrice = parsePrice(service.startingPrice);
            return (
              <article
                key={service._id}
                className="relative flex flex-col rounded-sm border border-white/5 bg-ink-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-gold-400/30 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[9px] uppercase tracking-wider font-semibold">
                    <Tag className="w-2.5 h-2.5" />
                    {service.category || 'Weddings'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Live
                  </span>
                </div>

                <h4 className="font-serif text-xl text-ink-50 font-normal group-hover:text-gold-200 transition-colors">
                  {service.name}
                </h4>

                <p className="text-xs text-ink-400 mt-2 min-h-[36px] line-clamp-2">
                  {service.description || 'Professional photography and cinematography coverage.'}
                </p>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {service.duration && (
                    <div className="flex items-center gap-1.5 text-xs text-ink-300">
                      <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span className="truncate">{service.duration}</span>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-ink-500">Starting Rate</span>
                    <span className="font-serif text-2xl text-gold-400 font-medium">
                      {formatPrice(numericPrice)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => editService(service)}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-300 hover:text-gold-300 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === service._id}
                    onClick={() => deleteService(service)}
                    className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-white/10 bg-ink-900/60 px-5 py-16 text-center">
          <Briefcase className="mx-auto mb-3 h-10 w-10 text-gold-400/50" />
          <h4 className="font-serif text-lg text-ink-100">No Services Found</h4>
          <p className="mt-1 text-xs text-ink-400 max-w-sm mx-auto">
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
