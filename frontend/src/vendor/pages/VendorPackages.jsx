import { useCallback, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { VendorLayout } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankPackage = { name: '', tagline: '', price: '', features: '', isFeatured: false, isPublished: true };
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

function VendorPackages() {
  const { session } = useAuth();
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(blankPackage);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadPackages = useCallback(async () => {
    if (!session?.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/packages', { token: session.token });
      setPackages(data.packages || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load packages.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const resetForm = () => {
    setForm(blankPackage);
    setEditingId('');
    setShowAddForm(false);
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const numericPrice = parsePrice(form.price);
    const featuresList = typeof form.features === 'string'
      ? form.features.split('\n').map((f) => f.trim()).filter(Boolean)
      : form.features;

    const payload = {
      ...form,
      price: numericPrice,
      features: featuresList,
    };

    try {
      const data = await apiRequest(editingId ? `/vendor/packages/${editingId}` : '/vendor/packages', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: JSON.stringify(payload),
      });
      if (editingId) {
        setPackages((current) => current.map((item) => (item._id === editingId ? data.package : item)));
      } else {
        setPackages((current) => [data.package, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save package.');
    } finally {
      setSaving(false);
    }
  };

  const editPackage = (studioPackage) => {
    setEditingId(studioPackage._id);
    setForm({
      name: studioPackage.name,
      tagline: studioPackage.tagline || '',
      price: String(parsePrice(studioPackage.price)),
      features: Array.isArray(studioPackage.features) ? studioPackage.features.join('\n') : '',
      isFeatured: !!studioPackage.isFeatured,
      isPublished: studioPackage.isPublished !== false,
    });
    setShowAddForm(true);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePackage = async (studioPackage, changes) => {
    setUpdatingId(studioPackage._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/packages/${studioPackage._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify(changes),
      });
      setPackages((current) => current.map((item) => (item._id === studioPackage._id ? data.package : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update package.');
    } finally {
      setUpdatingId('');
    }
  };

  const deletePackage = async (studioPackage) => {
    if (!window.confirm(`Delete "${studioPackage.name}"? This cannot be undone.`)) return;
    setUpdatingId(studioPackage._id);
    setError('');
    try {
      await apiRequest(`/vendor/packages/${studioPackage._id}`, { method: 'DELETE', token: session.token });
      setPackages((current) => current.filter((item) => item._id !== studioPackage._id));
      if (editingId === studioPackage._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete package.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = packages.filter((item) => item.isPublished).length;
  const prices = packages.map((p) => parsePrice(p.price)).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const featuredPkg = packages.find((p) => p.isFeatured) || packages[0];

  return (
    <VendorLayout title="Pricing Packages">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold-400" />
              Package Catalog
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-50 mb-1">Studio Packages</h2>
          <p className="text-xs sm:text-sm text-ink-400">
            Configure pricing tiers and deliverables visible to couples booking your studio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadPackages}
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
            <span>{showAddForm ? 'Close Form' : 'Add Package'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <span>{error}</span>
          <button type="button" onClick={loadPackages} className="underline underline-offset-4">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-sm border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Package successfully saved and updated online.</span>
        </div>
      )}

      {/* Symmetrical Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-8">
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Active Tiers</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">{packages.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{publishedCount} published online</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Starting Price</span>
          <p className="font-serif text-2xl sm:text-3xl text-gold-400 leading-none">
            {minPrice > 0 ? formatPrice(minPrice) : '₹0'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Base package</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-ink-900/80 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1 font-medium">Premium Tier</span>
          <p className="font-serif text-2xl sm:text-3xl text-ink-50 leading-none">
            {maxPrice > 0 ? formatPrice(maxPrice) : '₹0'}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Luxury tier</p>
        </div>
        <div className="p-3.5 sm:p-4 rounded-sm bg-gradient-to-br from-gold-400/15 via-ink-900/90 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">Featured Badge</span>
          <p className="font-serif text-xl sm:text-2xl text-gold-300 leading-none truncate">
            {featuredPkg?.name || 'Signature'}
          </p>
          <p className="text-[10px] text-gold-400/80 mt-1 font-medium">Most Booked Tier</p>
        </div>
      </div>

      {/* Collapsible / Floating Add & Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-sm border border-gold-400/30 bg-ink-900/95 backdrop-blur-xl p-5 sm:p-6 shadow-2xl animate-scale-in">
          <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gold-400" />
              <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit Package Tier' : 'Create New Package Tier'}</h3>
            </div>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Package Name *</span>
              <input required maxLength={80} value={form.name} onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))} className={inputClass} placeholder="e.g. Signature Wedding Experience" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Starting Price (₹) *</span>
              <input required type="number" min="0" step="1" value={form.price} onChange={(e) => setForm((curr) => ({ ...curr, price: e.target.value }))} className={inputClass} placeholder="89000" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Short Tagline</span>
              <input maxLength={180} value={form.tagline} onChange={(e) => setForm((curr) => ({ ...curr, tagline: e.target.value }))} className={inputClass} placeholder="e.g. Complete cinematic and candid storytelling for your special day." />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-ink-400 font-medium">Deliverables & Features Included (One per line)</span>
              <textarea rows={4} maxLength={4000} value={form.features} onChange={(e) => setForm((curr) => ({ ...curr, features: e.target.value }))} className={inputClass} placeholder={'Candid + Traditional Photography\n2 Professional Lead Photographers\nFull-Day Wedding Coverage\n4K Cinematic Teaser + Highlights Film\nPremium Leather Photo Album'} />
              <span className="mt-1.5 block text-[11px] text-ink-500">Each line will appear as a styled checklist item with a gold checkmark.</span>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-white/5 pt-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((curr) => ({ ...curr, isFeatured: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-yellow-500" />
              <span>Mark as Most Popular (Highlighted)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink-300">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-ink-900 accent-yellow-500" />
              <span>Publish Tier Live on Studio Profile</span>
            </label>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={resetForm} className="px-3.5 py-2 rounded-sm border border-white/10 text-xs text-ink-400 hover:text-ink-200">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 px-4 py-2 text-xs font-medium uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-md shadow-gold-500/10">
                {editingId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Tier' : 'Save Package'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Package Tier Cards Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ink-50">Configured Packages</h3>
        <span className="text-xs text-ink-500">{publishedCount} published · {packages.length} total</span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-ink-500">Loading package catalog…</div>
      ) : packages.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((studioPackage) => {
            const isFeatured = !!studioPackage.isFeatured;
            const isPublished = studioPackage.isPublished !== false;
            const numericPrice = parsePrice(studioPackage.price);
            const features = Array.isArray(studioPackage.features) ? studioPackage.features : [];

            return (
              <article
                key={studioPackage._id}
                className={`relative flex flex-col rounded-sm border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  isFeatured
                    ? 'border-gold-400/50 bg-gradient-to-b from-gold-400/15 via-ink-900/90 to-ink-900 shadow-xl shadow-gold-500/5'
                    : 'border-white/5 bg-ink-900/80 hover:border-white/20'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-ink-950 shadow-md shadow-gold-400/20 flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-ink-950" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-serif text-2xl text-ink-50 font-normal">{studioPackage.name}</h4>
                    <p className="mt-1 text-xs text-ink-400 min-h-[32px] line-clamp-2">
                      {studioPackage.tagline || 'Tailored photography and video coverage.'}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${
                      isPublished
                        ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-400'
                        : 'border-white/10 bg-white/5 text-ink-500'
                    }`}
                  >
                    {isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                <div className="mb-5 pb-5 border-b border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-ink-500 block mb-1">Starting From</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl sm:text-4xl text-gold-400 font-medium">
                      {formatPrice(numericPrice)}
                    </span>
                    <span className="text-xs text-ink-500">/ event</span>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-3 font-semibold">
                    Deliverables Included:
                  </span>
                  <ul className="space-y-2.5">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-300">
                        <Check className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {!features.length && (
                      <li className="text-xs text-ink-500 italic">No features listed.</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4 mt-auto">
                  <button
                    type="button"
                    disabled={updatingId === studioPackage._id}
                    onClick={() => editPackage(studioPackage)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-2.5 py-1.5 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 transition-colors disabled:opacity-50"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === studioPackage._id}
                    onClick={() => updatePackage(studioPackage, { isFeatured: !isFeatured })}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-2.5 py-1.5 text-xs text-ink-300 hover:text-gold-300 transition-colors disabled:opacity-50"
                  >
                    <Star className="h-3 w-3" />
                    <span>{isFeatured ? 'Unfeature' : 'Feature'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === studioPackage._id}
                    onClick={() => updatePackage(studioPackage, { isPublished: !isPublished })}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-2.5 py-1.5 text-xs text-ink-300 hover:text-gold-300 transition-colors disabled:opacity-50"
                  >
                    <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === studioPackage._id}
                    onClick={() => deletePackage(studioPackage)}
                    className="ml-auto inline-flex items-center gap-1 rounded-sm px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-white/10 bg-ink-900/60 px-5 py-16 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-gold-400/50" />
          <h4 className="font-serif text-lg text-ink-100">No Studio Packages Yet</h4>
          <p className="mt-1 text-xs text-ink-400 max-w-sm mx-auto">
            Click &ldquo;Add Package&rdquo; above to create your wedding photography and cinematography packages.
          </p>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorPackages;
