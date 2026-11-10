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
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && item.isPublished) ||
        (statusFilter === 'draft' && !item.isPublished);

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchCategory && matchStatus && matchSearch;
    });
  }, [items, activeCategory, statusFilter, searchQuery]);

  const handleTogglePublish = (id) => {
    const updated = items.map((it) => (it.id === id ? { ...it, isPublished: !it.isPublished } : it));
    saveItems(updated);
  };

  const handleToggleFeatured = (id) => {
    const updated = items.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it));
    saveItems(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this showcase item?')) {
      const updated = items.filter((it) => it.id !== id);
      saveItems(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      client: '',
      category: 'Wedding',
      location: '',
      date: new Date().toISOString().split('T')[0],
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Interactive Showcase Manager
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Platform Portfolio</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Live client visual showcase displayed across the public landing page. Add high-resolution shoots, filter by shoot types, and manage live visibility.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Showcase Shoot</span>
          </button>
        </div>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Shoots', stats.total, `${stats.published} published online`],
          ['Weddings', stats.wedding, 'Traditional & Destination'],
          ['Pre-Weddings', stats.preWedding, 'Couples & Outdoor'],
          ['Live Impressions', stats.totalViews.toLocaleString('en-IN'), 'Public Visits'],
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

      {/* Filter Pills and Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
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
              <span className="ml-1.5 text-[10px] opacity-75 font-mono">
                ({cat === 'All' ? items.length : items.filter((it) => it.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Right Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
            <input
              type="text"
              placeholder="Search shoots, couples, cities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-8 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2 text-xs text-ink-50 font-semibold focus:outline-none focus:border-gold-500/60 shadow-2xs cursor-pointer"
          >
            <option value="all">ALL STATUS</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFTS</option>
          </select>
        </div>
      </div>

      {/* Portfolio Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center rounded-[28px] border border-black/10 dark:border-white/15 bg-white/80 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <FolderHeart className="w-10 h-10 text-ink-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl text-ink-50 mb-1">No Portfolio Shoots Found</h3>
          <p className="text-xs text-ink-500 max-w-md mx-auto mb-4 font-medium">
            No shoots match your current category or search filter. Try clearing your filters or create a new showcase shoot.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="rounded-full px-5 py-2 border border-gold-400/40 text-gold-700 dark:text-gold-300 text-xs font-mono uppercase tracking-widest font-bold hover:bg-gold-400/10 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

              <div>
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 shadow-md">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold bg-gold-400 text-ink-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Published Indicator */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 border backdrop-blur-md shadow-md ${
                        item.isPublished
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                          : 'bg-black/70 text-stone-300 border-white/10'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                        }`}
                      />
                      {item.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  {/* Lightbox Quick View Hover Overlay Button */}
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 text-gold-300 border border-gold-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer backdrop-blur-md"
                    title="View full resolution"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Card Meta Content */}
                <div className="px-5 py-3">
                  <h3 className="font-serif text-xl sm:text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-500 dark:text-ink-400 font-medium mt-1">{item.client}</p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-ink-600 dark:text-ink-400 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(item.id)}
                    className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                      item.isPublished
                        ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {item.isPublished ? 'Unpublish' : 'Publish Live'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(item.id)}
                    className={`rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                      item.featured
                        ? 'border-gold-500/40 bg-gold-500/15 text-gold-800 dark:text-gold-300 shadow-2xs'
                        : 'border-black/10 dark:border-white/10 text-ink-500 hover:text-gold-700 dark:hover:text-gold-300'
                    }`}
                    title="Pin to top of public homepage"
                  >
                    {item.featured ? '★ Featured' : '☆ Pin'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                    title="Edit project details"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Image Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-ink-50">{previewItem.title}</h3>
                <p className="text-xs text-gold-700 dark:text-gold-300 font-medium">
                  {previewItem.category} · {previewItem.client} · {previewItem.location}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-black/40 flex items-center justify-center">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Glassy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in my-8">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/10 dark:border-white/10">
              <h3 className="font-serif text-2xl text-ink-50 font-normal">
                {editingItem ? 'Edit Showcase Shoot' : 'Add New Showcase Shoot'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                    Shoot Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Palace Wedding"
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                    Client / Couple Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Rohan & Tanya"
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Udaipur, RJ"
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">
                  High-Res Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              {formData.image && (
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/40">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded-sm bg-white dark:bg-ink-950 border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-ink-100 font-medium">Publish Immediately to Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded-sm bg-white dark:bg-ink-950 border-black/20 dark:border-white/20 text-gold-500 focus:ring-gold-400 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-gold-700 dark:text-gold-300 font-bold">Pin as Featured Hero Shoot</span>
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
