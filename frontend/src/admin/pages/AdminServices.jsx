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
      category: activeCategory === 'All' ? 'Weddings' : activeCategory,
      description: '',
      image: 'https://images.pexels.com/photos/4128977/pexels-photo-4128977.jpeg?auto=compress&cs=tinysrgb&w=900',
      price: 45000,
      duration: 'Full Day (8-10 Hours)',
      crew: '2 Lead Photographers',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv) => {
    setEditingService(srv);
    setFormData({
      name: srv.name,
      category: srv.category,
      description: srv.description,
      image: srv.image,
      price: srv.price,
      duration: srv.duration,
      crew: srv.crew,
      isActive: srv.isActive,
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
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Service Catalog Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Platform Services</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Configure the core photography and cinematography offerings showcased on the landing page and available for vendor inquiries.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500 block mb-1 font-semibold">Total Offerings</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">{services.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1 font-medium">{services.filter((s) => s.isActive).length} active online</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500 block mb-1 font-semibold">Starting Price</span>
          <p className="font-sans font-bold text-3xl text-gold-600 dark:text-gold-400 tabular-nums">
            ₹{Math.min(...services.map((s) => s.price || 35000)).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1 font-medium">Base rate</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-400 dark:text-ink-500 block mb-1 font-semibold">Avg Package</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">
            ₹{Math.round(services.reduce((a, b) => a + (b.price || 0), 0) / (services.length || 1)).toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1 font-medium">Platform average</p>
        </div>
        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/30 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-gold-600 dark:text-gold-400 block mb-1 font-bold">Active Coverage</span>
          <p className="font-sans font-bold text-3xl text-gold-600 dark:text-gold-400 tabular-nums">100% Verified</p>
          <p className="text-[10px] text-gold-600/90 dark:text-gold-400/80 mt-1 font-semibold">Studio Certified</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-sm bg-ink-900/90 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-400 text-ink-950 font-semibold shadow-md'
                  : 'bg-ink-800/60 text-ink-300 hover:text-ink-50 hover:bg-ink-800 border border-ink-600/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search service by name or description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-950/80 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group bg-ink-900/80 border border-white/5 rounded-sm overflow-hidden hover:border-gold-400/30 transition-all duration-300 flex flex-col hover:shadow-2xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-ink-950">
              <img
                src={srv.image}
                alt={srv.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300">
                  {srv.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1 border backdrop-blur-md ${
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
                Starting at <span className="text-gold-300 font-semibold">₹{Number(srv.price || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-ink-400 mt-2 line-clamp-2 leading-relaxed">{srv.description}</p>

                <div className="space-y-1.5 mt-4 pt-3 border-t border-white/5 text-[11px] text-ink-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{srv.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-gold-400" />
                    <span>{srv.crew}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleToggleActive(srv.id)}
                  className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    srv.isActive
                      ? 'text-ink-400 hover:text-amber-400'
                      : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                  }`}
                >
                  {srv.isActive ? 'Disable' : 'Enable Live'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(srv)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                {editingService ? 'Edit Platform Service' : 'Add New Service Offering'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Drone Cinematography & Teasers"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Celebrations">Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive service description for client brochure..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
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

