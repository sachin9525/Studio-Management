import { useState, useMemo } from 'react';
import {
  FolderHeart,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Pencil,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Tag,
  SlidersHorizontal,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import {
  WEDDING_PORTFOLIO,
  PREWEDDING_PORTFOLIO,
  EVENT_PORTFOLIO,
} from '@/data/demoContent';

// Helper to normalize demo content items into portfolio shape
const initialItems = [
  ...WEDDING_PORTFOLIO.map((p, i) => ({
    id: `w-${i + 1}`,
    title: p.title || 'Royal Jaipur Wedding',
    client: p.caption || 'Aditya & Ananya',
    category: 'Wedding',
    location: p.location || 'Jaipur, Rajasthan',
    date: '2025-11-20',
    image: p.url,
    isPublished: true,
    featured: i === 0,
    views: 1240 + i * 230,
  })),
  ...PREWEDDING_PORTFOLIO.map((p, i) => ({
    id: `pw-${i + 1}`,
    title: p.title || 'Udaipur Lakes Sunset',
    client: p.caption || 'Kabir & Meera',
    category: 'Pre-Wedding',
    location: p.location || 'Udaipur, Rajasthan',
    date: '2025-10-14',
    image: p.url,
    isPublished: true,
    featured: false,
    views: 890 + i * 140,
  })),
  ...EVENT_PORTFOLIO.map((p, i) => ({
    id: `ev-${i + 1}`,
    title: p.title || 'Grand Sangeet Night',
    client: p.caption || 'Singhania Family',
    category: 'Event',
    location: p.location || 'Mumbai, Maharashtra',
    date: '2025-09-05',
    image: p.url,
    isPublished: true,
    featured: false,
    views: 650 + i * 110,
  })),
];

function AdminPortfolio() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_portfolio_items');
      return saved ? JSON.parse(saved) : initialItems;
    } catch {
      return initialItems;
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'Wedding',
    location: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    isPublished: true,
    featured: false,
  });

  const saveItems = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem('svml_admin_portfolio_items', JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Wedding', 'Pre-Wedding', 'Event'];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.isPublished) ||
        (statusFilter === 'draft' && !item.isPublished);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [items, activeCategory, statusFilter, searchQuery]);

  // Actions
  const handleTogglePublish = (id) => {
    const updated = items.map((it) => (it.id === id ? { ...it, isPublished: !it.isPublished } : it));
    saveItems(updated);
  };

  const handleToggleFeatured = (id) => {
    const updated = items.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it));
    saveItems(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio project?')) {
      const updated = items.filter((it) => it.id !== id);
      saveItems(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      client: '',
      category: activeCategory === 'All' ? 'Wedding' : activeCategory,
      location: '',
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900',
      isPublished: true,
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      client: item.client,
      category: item.category,
      location: item.location,
      date: item.date,
      image: item.image,
      isPublished: item.isPublished,
      featured: item.featured,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;

    if (editingItem) {
      const updated = items.map((it) => (it.id === editingItem.id ? { ...it, ...formData } : it));
      saveItems(updated);
    } else {
      const newItem = {
        ...formData,
        id: `p-${Date.now()}`,
        views: 1,
      };
      saveItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: items.length,
      wedding: items.filter((it) => it.category === 'Wedding').length,
      preWedding: items.filter((it) => it.category === 'Pre-Wedding').length,
      published: items.filter((it) => it.isPublished).length,
      totalViews: items.reduce((acc, it) => acc + (it.views || 0), 0),
    };
  }, [items]);

  return (
    <AdminLayout title="Portfolio Showcase">
      {/* Top Header & Page Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Interactive Showcase Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Platform Portfolio</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Live client visual showcase displayed across the public landing page. Add high-resolution shoots, filter by shoot types, and manage live visibility.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showcase Shoot</span>
          </button>
        </div>
      </div>

      {/* Live Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-gold-400/30 transition-all">
          <div className="flex items-center justify-between text-ink-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">Total Shoots</span>
            <FolderHeart className="w-4 h-4 text-gold-400" />
          </div>
          <p className="font-serif text-3xl text-ink-50 font-medium">{stats.total}</p>
          <div className="mt-2 text-[10px] text-ink-500 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{stats.published}</span> published online
          </div>
        </div>

        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-gold-400/30 transition-all">
          <div className="flex items-center justify-between text-ink-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">Weddings</span>
            <span className="text-xs text-gold-400">💍</span>
          </div>
          <p className="font-serif text-3xl text-ink-50 font-medium">{stats.wedding}</p>
          <p className="mt-2 text-[10px] text-ink-500">Traditional & Destination</p>
        </div>

        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md relative overflow-hidden group hover:border-gold-400/30 transition-all">
          <div className="flex items-center justify-between text-ink-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest">Pre-Weddings</span>
            <span className="text-xs text-gold-400">✨</span>
          </div>
          <p className="font-serif text-3xl text-ink-50 font-medium">{stats.preWedding}</p>
          <p className="mt-2 text-[10px] text-ink-500">Couples & Outdoor</p>
        </div>

        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/20 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-gold-400 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Live Impressions</span>
            <Eye className="w-4 h-4" />
          </div>
          <p className="font-serif text-3xl text-gold-300 font-medium">{stats.totalViews.toLocaleString('en-IN')}</p>
          <p className="mt-2 text-[10px] text-gold-400/80">Public Portfolio Visits</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-sm bg-ink-900/90 border border-white/5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-lg">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-400 text-ink-950 shadow-md font-semibold'
                  : 'text-ink-400 hover:text-ink-100 hover:bg-white/5'
              }`}
            >
              {cat}
              <span className="ml-1.5 text-[10px] opacity-75">
                ({cat === 'All' ? items.length : items.filter((it) => it.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Right Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Search shoots, couples, cities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink-950/80 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-ink-950/80 border border-white/10 rounded-sm px-3 py-2 text-xs text-ink-200 focus:outline-none focus:border-gold-400 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Portfolio Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-sm bg-ink-900/30">
          <FolderHeart className="w-10 h-10 text-ink-600 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-ink-200 mb-1">No Portfolio Shoots Found</h3>
          <p className="text-xs text-ink-500 max-w-md mx-auto mb-4">
            No shoots match your current category or search filter. Try clearing your filters or create a new showcase shoot.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="px-3.5 py-1.5 rounded-sm border border-gold-400/30 text-gold-400 text-xs uppercase tracking-widest hover:bg-gold-400/10 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-ink-900/80 border border-white/5 rounded-sm overflow-hidden hover:border-gold-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-black/30" />

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-ink-950/80 backdrop-blur-md border border-white/10 text-gold-300">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold bg-gold-400 text-ink-950 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>

                {/* Published Indicator */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1 border backdrop-blur-md ${
                      item.isPublished
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                        : 'bg-ink-900/80 text-ink-400 border-white/10'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-ink-500'
                      }`}
                    />
                    {item.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* Lightbox Quick View Hover Overlay Button */}
                <button
                  onClick={() => setPreviewItem(item)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-ink-950/80 text-gold-400 border border-gold-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
                  title="View full resolution"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-300 font-medium mt-0.5">{item.client}</p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-ink-500 mt-3 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-ink-500" />
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(item.id)}
                      className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                        item.isPublished
                          ? 'text-ink-400 hover:text-amber-400 hover:bg-white/5'
                          : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-400/20'
                      }`}
                    >
                      {item.isPublished ? 'Unpublish' : 'Publish Live'}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider transition-colors ${
                        item.featured
                          ? 'text-gold-400 font-bold'
                          : 'text-ink-500 hover:text-gold-400 hover:bg-white/5'
                      }`}
                      title="Pin to top of public homepage"
                    >
                      {item.featured ? '★ Featured' : '☆ Pin'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                      title="Edit project details"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-sm text-ink-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Image Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-ink-900 border border-gold-400/30 rounded-sm overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-ink-950/80">
              <div>
                <h3 className="font-serif text-xl text-ink-50">{previewItem.title}</h3>
                <p className="text-xs text-gold-400">
                  {previewItem.category} · {previewItem.client} · {previewItem.location}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-sm text-ink-400 hover:text-ink-50 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 bg-black flex items-center justify-center">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="max-h-[70vh] w-auto object-contain rounded-sm shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-ink-900 border border-gold-400/30 rounded-sm p-6 shadow-2xl animate-scale-in my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <h3 className="font-serif text-2xl text-ink-50">
                {editingItem ? 'Edit Showcase Shoot' : 'Add New Showcase Shoot'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-sm text-ink-400 hover:text-ink-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                    Shoot Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Palace Wedding"
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                    Client / Couple Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Rohan & Tanya"
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Udaipur, RJ"
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">
                  High-Res Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              {formData.image && (
                <div className="aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/10 bg-black/40">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-ink-950 border-white/20 text-gold-400 focus:ring-gold-400 w-4 h-4"
                  />
                  <span className="text-xs text-ink-200">Publish Immediately to Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-ink-950 border-white/20 text-gold-400 focus:ring-gold-400 w-4 h-4"
                  />
                  <span className="text-xs text-gold-400 font-medium">Pin as Featured Hero Shoot</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-sm text-xs text-ink-400 hover:text-ink-100 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-sm bg-gold-400 text-ink-950 text-xs font-semibold uppercase tracking-wider hover:bg-gold-300 transition-colors shadow-lg"
                >
                  {editingItem ? 'Update Shoot' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminPortfolio;

