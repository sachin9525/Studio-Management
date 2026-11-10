import { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Check,
  Sparkles,
  Pencil,
  Trash2,
  X,
  IndianRupee,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { PACKAGES } from '@/data/demoContent';

const parsePrice = (val, fallback = 49000) => {
  if (typeof val === 'number') return Number.isFinite(val) && val > 0 ? val : fallback;
  if (!val) return fallback;
  const cleaned = String(val).replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const formatPrice = (val, fallback = 49000) => parsePrice(val, fallback).toLocaleString('en-IN');

const initialPackages = PACKAGES.map((pkg, idx) => ({
  id: `pkg-${idx + 1}`,
  name: pkg.name,
  tagline: pkg.tagline,
  price: parsePrice(pkg.price, idx === 0 ? 49000 : idx === 1 ? 89000 : 149000),
  features: pkg.features || [
    'Traditional & Candid Photography',
    'Cinematic 4K Highlights Film',
    'Full Event Video Coverage',
    'Premium Coffee Table Album (40 Pages)',
    'Drone Aerial Coverage',
    'Online Private Cloud Gallery (1 Year)',
  ],
  isFeatured: pkg.highlighted || idx === 1,
  isPublished: true,
}));

function AdminPackages() {
  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_packages_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => ({
            ...p,
            price: parsePrice(p.price, idx === 0 ? 49000 : idx === 1 ? 89000 : 149000),
          }));
        }
      }
      return initialPackages;
    } catch {
      return initialPackages;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: 150000,
    featuresText: '',
    isFeatured: false,
    isPublished: true,
  });

  const savePackages = (items) => {
    setPackages(items);
    try {
      localStorage.setItem('svml_admin_packages_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePublish = (id) => {
    const updated = packages.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p));
    savePackages(updated);
  };

  const handleToggleFeatured = (id) => {
    const updated = packages.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
    savePackages(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package tier?')) {
      const updated = packages.filter((p) => p.id !== id);
      savePackages(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      tagline: 'Complete cinematic wedding coverage with drone and heritage coffee table book',
      price: 125000,
      featuresText: [
        'Lead Candid & Traditional Photographers',
        'Cinematic 4K Highlights & Teaser',
        'Drone Aerial Cinema Coverage',
        '40-Page Handcrafted Archival Leather Album',
        'Full Length Documentary Ceremony Edit',
        'Private Cloud Gallery with 1-Year Access',
      ].join('\n'),
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      tagline: pkg.tagline || '',
      price: parsePrice(pkg.price),
      featuresText: (pkg.features || []).join('\n'),
      isFeatured: Boolean(pkg.isFeatured),
      isPublished: Boolean(pkg.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const features = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPackage) {
      const updated = packages.map((p) =>
        p.id === editingPackage.id
          ? {
            ...p,
            name: formData.name,
            tagline: formData.tagline,
            price: Number(formData.price),
            features,
            isFeatured: formData.isFeatured,
            isPublished: formData.isPublished,
          }
          : p
      );
      savePackages(updated);
    } else {
      const newPkg = {
        id: `pkg-${Date.now()}`,
        name: formData.name,
        tagline: formData.tagline,
        price: Number(formData.price),
        features,
        isFeatured: formData.isFeatured,
        isPublished: formData.isPublished,
      };
      savePackages([...packages, newPkg]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Pricing Packages Showcase">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Tier & Deliverables Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Pricing Packages</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Configure the wedding and event photography package tiers displayed on the public landing page with deliverable checklists.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Package</span>
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      {(() => {
        const validPrices = packages.map((p) => parsePrice(p.price)).filter((p) => p > 0);
        const startingPrice = validPrices.length ? Math.min(...validPrices) : 49000;
        const premiumPrice = validPrices.length ? Math.max(...validPrices) : 149000;

        return (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[
              ['Active Tiers', packages.length, `${packages.filter((p) => p.isPublished).length} Published online`],
              ['Starting Price', `₹${startingPrice.toLocaleString('en-IN')}`, 'Introductory package'],
              ['Premium Tier', `₹${premiumPrice.toLocaleString('en-IN')}`, 'Royal Luxury tier'],
              ['Featured Tier', packages.find((p) => p.isFeatured)?.name || 'Signature', 'Most Booked Tier'],
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
        );
      })()}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`group relative rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 ${
              pkg.isFeatured
                ? 'bg-gradient-to-b from-amber-500/15 via-white/95 to-white/90 dark:via-black/50 dark:to-black/60 border-2 border-gold-500/40 shadow-xl shadow-gold-500/10'
                : 'bg-white/90 dark:bg-black/45 border border-black/10 dark:border-white/15 hover:border-gold-500/30'
            }`}
          >
            {pkg.isFeatured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-[10px] uppercase font-mono tracking-widest px-4 py-1 rounded-full shadow-lg shadow-gold-500/30 flex items-center gap-1.5 z-10">
                <Star className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-serif text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                  {pkg.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md ${
                    pkg.isPublished
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      : 'bg-black/70 text-stone-300 border-white/10'
                  }`}
                >
                  {pkg.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-400 mb-6 font-medium leading-relaxed">{pkg.tagline}</p>

              <div className="mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-400 block mb-1">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-3xl sm:text-4xl text-gold-700 dark:text-gold-300 font-bold tabular-nums">
                    ₹{formatPrice(pkg.price)}
                  </span>
                  <span className="text-xs font-mono text-ink-500">/ event</span>
                </div>
              </div>

              {/* Deliverable Checklist */}
              <div className="space-y-3 mb-6">
                <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500">Deliverables Included:</p>
                {(pkg.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(pkg.id)}
                  className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                    pkg.isPublished
                      ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {pkg.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleToggleFeatured(pkg.id)}
                  className={`rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                    pkg.isFeatured
                      ? 'border-gold-500/40 bg-gold-500/15 text-gold-800 dark:text-gold-300 shadow-2xs'
                      : 'border-black/10 dark:border-white/10 text-ink-500 hover:text-gold-700 dark:hover:text-gold-300'
                  }`}
                >
                  {pkg.isFeatured ? '★ Pinned' : '☆ Pin'}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(pkg)}
                  className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                  title="Edit Package"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Glassy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/10 dark:border-white/10">
              <h3 className="font-serif text-2xl text-ink-50 font-normal">
                {editingPackage ? 'Edit Package Tier' : 'Add New Pricing Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Package Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Heritage Bespoke"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Complete cinematic coverage with drone and coffee table book"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Package Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                  Deliverables Checklist (1 item per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Traditional Photography&#10;Candid Coverage&#10;Cinematic Highlights&#10;Drone Aerial Footage&#10;Premium Album"
                  className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 p-4 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded-sm bg-white dark:bg-ink-950 border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-ink-100 font-medium">Publish Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded-sm bg-white dark:bg-ink-950 border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-gold-700 dark:text-gold-300 font-bold">Highlight as Most Popular</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full px-5 py-2 text-xs font-semibold text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-gold-500/25 transition-all cursor-pointer"
                >
                  {editingPackage ? 'Update Package' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPackages;
