import { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Pencil,
  Trash2,
  Sparkles,
  Check,
  X,
  Clock,
  Layers,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { SERVICES } from '@/data/demoContent';

const initialServices = SERVICES.map((s, idx) => ({
  id: s.id || `srv-${idx + 1}`,
  name: s.name,
  description: s.description,
  image: s.image,
  category: idx < 2 ? 'Weddings' : idx < 4 ? 'Pre-Wedding' : 'Celebrations',
  price: 35000 + idx * 15000,
  duration: idx % 2 === 0 ? 'Full Day (8-10 Hours)' : 'Half Day (4-5 Hours)',
  crew: idx < 2 ? '4 Photographers + 2 Cinematographers' : '2 Lead Photographers',
  isActive: true,
}));

function AdminServices() {
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_services_items');
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Weddings',
    description: '',
    image: '',
    price: 45000,
    duration: 'Full Day (8-10 Hours)',
    crew: '2 Lead Photographers',
    isActive: true,
  });

  const saveServices = (items) => {
    setServices(items);
    try {
      localStorage.setItem('svml_admin_services_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Weddings', 'Pre-Wedding', 'Celebrations'];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchCat = activeCategory === 'All' || srv.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const handleToggleActive = (id) => {
    const updated = services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    saveServices(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updated = services.filter((s) => s.id !== id);
      saveServices(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Weddings',
      description: '',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
      price: 45000,
      duration: 'Full Day (8-10 Hours)',
      crew: '2 Lead Photographers',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      image: service.image,
      price: service.price,
      duration: service.duration,
      crew: service.crew,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.image) return;

    if (editingService) {
      const updated = services.map((s) => (s.id === editingService.id ? { ...s, ...formData } : s));
      saveServices(updated);
    } else {
      const newSrv = {
        ...formData,
        id: `srv-${Date.now()}`,
      };
      saveServices([...services, newSrv]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Platform Services Showcase">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Service Catalog Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Platform Services</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Configure the core photography and cinematography offerings showcased on the landing page and available for client inquiries.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Offerings', services.length, `${services.filter((s) => s.isActive).length} active online`],
          ['Starting Price', `₹${Math.min(...services.map((s) => s.price || 35000)).toLocaleString('en-IN')}`, 'Base rate'],
          ['Avg Package', `₹${Math.round(services.reduce((a, b) => a + (b.price || 0), 0) / (services.length || 1)).toLocaleString('en-IN')}`, 'Platform average'],
          ['Studio Verified', '100% Coverage', 'Quality Inspected'],
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
              <p className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors tabular-nums">
                {value}
              </p>
              <p className="mt-1 text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 dark:text-ink-400">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
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

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search service by title or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Ambient Warm Orb on Hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 shadow-md">
                    {srv.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 border backdrop-blur-md shadow-md ${
                      srv.isActive
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-black/70 text-stone-300 border-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${srv.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
                    {srv.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white font-serif text-lg font-medium drop-shadow-md">
                  Starting at <span className="text-gold-300 font-bold">₹{Number(srv.price || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="px-5 py-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                  {srv.description}
                </p>

                <div className="space-y-1.5 mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-[11px] text-ink-600 dark:text-ink-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                    <span>{srv.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                    <span>{srv.crew}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => handleToggleActive(srv.id)}
                className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest font-bold transition-colors cursor-pointer border ${
                  srv.isActive
                    ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}
              >
                {srv.isActive ? 'Disable' : 'Enable Live'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(srv)}
                  className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                  title="Edit Service"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                  title="Delete Service"
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
                {editingService ? 'Edit Platform Service' : 'Add New Service Offering'}
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
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Drone Cinematography & Teasers"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Celebrations">Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive service description for client brochure..."
                  className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 p-4 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
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
                  {editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminServices;
