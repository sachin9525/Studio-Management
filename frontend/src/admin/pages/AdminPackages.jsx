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

const parsePrice = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return 85000;
  const cleaned = String(val).replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 85000 : parsed;
};

const formatPrice = (val) => parsePrice(val).toLocaleString('en-IN');

const initialPackages = PACKAGES.map((pkg, idx) => ({
  id: `pkg-${idx + 1}`,
  name: pkg.name,
  tagline: pkg.tagline,
  price: parsePrice(pkg.price || (idx === 0 ? 85000 : idx === 1 ? 149000 : 249000)),
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
        return parsed.map((p) => ({ ...p, price: parsePrice(p.price) }));
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
      tagline: '',
      price: 125000,
      featuresText: 'Traditional & Candid Photography\nCinematic Highlights Film\nDrone Cinematography\nPremium Leather Photo Album',
      isFeatured: false,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      tagline: pkg.tagline,
      price: pkg.price,
      featuresText: (pkg.features || []).join('\n'),
      isFeatured: pkg.isFeatured,
      isPublished: pkg.isPublished,
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
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Tier & Deliverables Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Pricing Packages</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Configure the wedding and event photography package tiers displayed on the public landing page with deliverable checklists.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Package</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Active Tiers</span>
          <p className="font-serif text-3xl text-ink-50">{packages.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">{packages.filter((p) => p.isPublished).length} Published online</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Starting Price</span>
          <p className="font-serif text-3xl text-gold-400">
            ₹{Math.min(...packages.map((p) => parsePrice(p.price))).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Introductory package</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Premium Tier</span>
          <p className="font-serif text-3xl text-ink-50">
            ₹{Math.max(...packages.map((p) => parsePrice(p.price))).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Royal Luxury tier</p>
        </div>
        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/20 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-gold-400 block mb-1 font-semibold">Featured Badge</span>
          <p className="font-serif text-3xl text-gold-300">
            {packages.find((p) => p.isFeatured)?.name || 'Gold'}
          </p>
          <p className="text-[10px] text-gold-400/80 mt-1">Most Booked Tier</p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-sm p-6 flex flex-col justify-between transition-all duration-300 relative ${
              pkg.isFeatured
                ? 'bg-gradient-to-b from-gold-400/15 via-ink-900 to-ink-900 border-2 border-gold-400/50 shadow-2xl shadow-gold-500/10 scale-[1.02]'
                : 'bg-ink-900/80 border border-white/5 hover:border-gold-400/30'
            }`}
          >
            {pkg.isFeatured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-serif text-2xl text-ink-50 font-medium">{pkg.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold ${
                    pkg.isPublished
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-ink-950 text-ink-500 border border-white/10'
                  }`}
                >
                  {pkg.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-ink-400 mb-5">{pkg.tagline}</p>

              <div className="mb-6 pb-6 border-b border-white/10">
                <span className="text-xs text-ink-500 uppercase tracking-widest block mb-1">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl text-gold-300 font-semibold">
                    ₹{formatPrice(pkg.price)}
                  </span>
                  <span className="text-xs text-ink-500">/ event</span>
                </div>
              </div>

              {/* Deliverable Checklist */}
              <div className="space-y-3 mb-6">
                <p className="text-[10px] uppercase tracking-widest text-ink-400 font-semibold">Deliverables Included:</p>
                {(pkg.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-200">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(pkg.id)}
                  className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    pkg.isPublished ? 'text-ink-400 hover:text-amber-400' : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                  }`}
                >
                  {pkg.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleToggleFeatured(pkg.id)}
                  className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider ${
                    pkg.isFeatured ? 'text-gold-400 font-bold' : 'text-ink-500 hover:text-gold-300'
                  }`}
                >
                  {pkg.isFeatured ? '★ Pinned' : '☆ Pin'}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(pkg)}
                  className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-1.5 rounded-sm text-ink-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-ink-900 border border-gold-400/30 rounded-sm p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <h3 className="font-serif text-2xl text-ink-50">
                {editingPackage ? 'Edit Package Tier' : 'Add New Pricing Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Package Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Heritage Bespoke"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Complete cinematic coverage with drone and coffee table book"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Package Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                  Deliverables Checklist (1 item per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Traditional Photography&#10;Candid Coverage&#10;Cinematic Highlights&#10;Drone Aerial Footage&#10;Premium Album"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-ink-950 border-white/20 text-gold-400 focus:ring-gold-400 w-4 h-4"
                  />
                  <span className="text-xs text-ink-200">Publish Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-ink-950 border-white/20 text-gold-400 focus:ring-gold-400 w-4 h-4"
                  />
                  <span className="text-xs text-gold-400 font-medium">Highlight as Most Popular</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-xs text-ink-400 hover:text-ink-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-sm bg-gold-400 text-ink-950 text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-lg"
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

