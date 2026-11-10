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

const inputClass =
  'w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2.5 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

const textareaClass =
  'w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-3 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner transition-colors';

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

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

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
    const featuresList =
      typeof form.features === 'string'
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Service Tiers & Bundles
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Studio Packages</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Configure luxury pricing tiers and deliverables visible to couples booking your studio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={loadPackages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 dark:border-white/15 bg-white/80 dark:bg-white/5 text-xs text-ink-50 font-medium hover:bg-gold-500/10 hover:border-gold-500/40 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
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
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? 'Close Form' : 'Add Package'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <span>{error}</span>
          <button type="button" onClick={loadPackages} className="underline underline-offset-4 cursor-pointer">Try again</button>
        </div>
      )}

      {saved && (
        <div role="status" className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Package successfully saved and updated online.</span>
        </div>
      )}

      {/* 4 Glassy Stat Capsules */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Active Tiers', packages.length, `${publishedCount} Published Live`],
          ['Starting Price', minPrice > 0 ? formatPrice(minPrice) : '₹0', 'Base Package'],
          ['Premium Tier', maxPrice > 0 ? formatPrice(maxPrice) : '₹0', 'Luxury Experience'],
          ['Featured Badge', featuredPkg?.name || 'Signature', 'Top Recommended'],
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
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/15 text-ink-600 dark:text-ink-300">
                {subtext}
              </span>
            </div>
            <div className="relative z-10">
              <p className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors truncate">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-[28px] border border-black/10 dark:border-white/15 bg-white/95 dark:bg-black/60 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-6 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-700 dark:text-gold-300">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-ink-50 font-normal">{editingId ? 'Edit Package Tier' : 'Create New Package Tier'}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">Configure pricing, summary, and itemized deliverables</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-full text-ink-400 hover:text-ink-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 relative z-10">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Package Name *</span>
              <input
                required
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm((curr) => ({ ...curr, name: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Signature Wedding Experience"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Starting Price (₹) *</span>
              <input
                required
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm((curr) => ({ ...curr, price: e.target.value }))}
                className={inputClass}
                placeholder="89000"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Short Tagline</span>
              <input
                maxLength={180}
                value={form.tagline}
                onChange={(e) => setForm((curr) => ({ ...curr, tagline: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Complete cinematic and candid storytelling for your special day."
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[10px] font-mono uppercase tracking-widest text-ink-500 dark:text-ink-400 font-bold">Deliverables & Features Included (One per line)</span>
              <textarea
                rows={5}
                maxLength={4000}
                value={form.features}
                onChange={(e) => setForm((curr) => ({ ...curr, features: e.target.value }))}
                className={textareaClass}
                placeholder={'Candid + Traditional Photography\n2 Professional Lead Photographers\nFull-Day Wedding Coverage\n4K Cinematic Teaser + Highlights Film\nPremium Leather Photo Album'}
              />
              <span className="mt-2 block text-[11px] text-ink-500 dark:text-ink-400">Each line will appear as a styled checklist item with a gold checkmark.</span>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 dark:border-white/10 pt-5 relative z-10">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex cursor-pointer items-center gap-3 text-xs text-ink-50 font-medium">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((curr) => ({ ...curr, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded-full border-black/20 bg-transparent text-gold-500 focus:ring-gold-500 cursor-pointer"
                />
                <span>Mark as Most Popular (Highlighted)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-xs text-ink-50 font-medium">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((curr) => ({ ...curr, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded-full border-black/20 bg-transparent text-gold-500 focus:ring-gold-500 cursor-pointer"
                />
                <span>Publish Tier Live on Studio Profile</span>
              </label>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-full border border-black/15 dark:border-white/15 text-xs font-semibold text-ink-500 dark:text-ink-400 hover:text-ink-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-950 hover:brightness-110 disabled:opacity-50 shadow-lg shadow-gold-500/25 cursor-pointer"
              >
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{saving ? 'Saving…' : editingId ? 'Update Tier' : 'Save Package'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Package Tier Cards Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-2xl text-ink-50 font-normal">Configured Packages</h3>
        <span className="text-xs font-mono font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest">{publishedCount} published · {packages.length} total</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-ink-500 dark:text-ink-400 font-mono">Loading package catalog…</div>
      ) : packages.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((studioPackage) => {
            const isFeatured = !!studioPackage.isFeatured;
            const isPublished = studioPackage.isPublished !== false;
            const numericPrice = parsePrice(studioPackage.price);
            const features = Array.isArray(studioPackage.features) ? studioPackage.features : [];

            return (
              <article
                key={studioPackage._id}
                className={`group relative rounded-[28px] overflow-hidden border p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                  isFeatured
                    ? 'border-gold-500/50 bg-gradient-to-b from-gold-500/10 via-white/95 dark:via-black/55 to-white/90 dark:to-black/45 shadow-[0_25px_60px_rgba(234,179,8,0.12)]'
                    : 'border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                }`}
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                {isFeatured && (
                  <div className="absolute top-4 right-5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-950 shadow-md shadow-gold-500/30 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-ink-950" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="mb-4 pr-16">
                    <h4 className="font-serif text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                      {studioPackage.name}
                    </h4>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 min-h-[32px] line-clamp-2 leading-relaxed">
                      {studioPackage.tagline || 'Tailored photography and video coverage.'}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 block mb-1">
                      Starting Investment
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl sm:text-4xl text-gold-700 dark:text-gold-300 font-normal tracking-tight">
                        {formatPrice(numericPrice)}
                      </span>
                      <span className="text-xs text-ink-500 dark:text-ink-400 font-mono">/ event</span>
                    </div>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="mb-6 flex-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 block mb-3">
                      Deliverables Included:
                    </span>
                    <ul className="space-y-3">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-600 dark:text-ink-300">
                          <Check className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {!features.length && (
                        <li className="text-xs text-ink-400 dark:text-ink-500 italic">No itemized deliverables configured.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Action Controls Footer */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={updatingId === studioPackage._id}
                      onClick={() => editPackage(studioPackage)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all cursor-pointer"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === studioPackage._id}
                      onClick={() => updatePackage(studioPackage, { isFeatured: !isFeatured })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Star className="h-3 w-3" />
                      <span>{isFeatured ? 'Unstar' : 'Feature'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === studioPackage._id}
                      onClick={() => updatePackage(studioPackage, { isPublished: !isPublished })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/10 hover:bg-gold-500/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-ink-50 hover:text-gold-700 dark:hover:text-gold-300 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={updatingId === studioPackage._id}
                    onClick={() => deletePackage(studioPackage)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Delete package"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-black/15 dark:border-white/15 bg-white/60 dark:bg-black/30 p-12 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-gold-500/60" />
          <h4 className="font-serif text-lg text-ink-50 font-normal">No Studio Packages Yet</h4>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400 max-w-sm mx-auto">
            Click &ldquo;Add Package&rdquo; above to create your wedding photography and cinematography packages.
          </p>
        </div>
      )}
    </VendorLayout>
  );
}

export default VendorPackages;