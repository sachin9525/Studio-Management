import { useState, useMemo } from 'react';
import {
  Folder,
  Plus,
  Search,
  Eye,
  Trash2,
  Pencil,
  Sparkles,
  Images,
  Calendar,
  X,
  Camera,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';
import { ALBUMS } from '@/data/demoContent';

const initialAlbums = ALBUMS.map((alb, idx) => ({
  id: `alb-${idx + 1}`,
  title: alb.title,
  subtitle: alb.subtitle,
  cover: alb.cover,
  count: alb.count || 48 + idx * 24,
  date: '2025-11-15',
  isPublished: true,
  featured: idx === 0,
}));

function AdminAlbums() {
  const [albums, setAlbums] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_albums_items');
      return saved ? JSON.parse(saved) : initialAlbums;
    } catch {
      return initialAlbums;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewAlbum, setPreviewAlbum] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cover: '',
    count: 60,
    date: new Date().toISOString().split('T')[0],
    isPublished: true,
  });

  const saveAlbums = (items) => {
    setAlbums(items);
    try {
      localStorage.setItem('svml_admin_albums_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && alb.isPublished) ||
        (statusFilter === 'draft' && !alb.isPublished);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        alb.title.toLowerCase().includes(q) ||
        alb.subtitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [albums, statusFilter, searchQuery]);

  const handleTogglePublish = (id) => {
    const updated = albums.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a));
    saveAlbums(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      const updated = albums.filter((a) => a.id !== id);
      saveAlbums(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingAlbum(null);
    setFormData({
      title: '',
      subtitle: '',
      cover: 'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=900',
      count: 75,
      date: new Date().toISOString().split('T')[0],
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title,
      subtitle: album.subtitle,
      cover: album.cover,
      count: album.count,
      date: album.date,
      isPublished: album.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.cover) return;

    if (editingAlbum) {
      const updated = albums.map((a) => (a.id === editingAlbum.id ? { ...a, ...formData } : a));
      saveAlbums(updated);
    } else {
      const newAlb = {
        ...formData,
        id: `alb-${Date.now()}`,
      };
      saveAlbums([newAlb, ...albums]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Albums Showcase">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Photo Book & Story Catalog
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Photo Albums</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Curate the premium wedding books and digital albums displayed in the public album gallery.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Photo Album</span>
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Albums', albums.length, `${albums.filter((a) => a.isPublished).length} Published`],
          ['Total Photos', albums.reduce((a, b) => a + (Number(b.count) || 0), 0), 'High-res frames'],
          ['Avg Size', `${Math.round(albums.reduce((a, b) => a + (Number(b.count) || 0), 0) / (albums.length || 1))} Photos`, 'Per story book'],
          ['Format Standard', 'Ultra-HD Print', 'Cloud & Print Ready'],
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

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search albums by couple or title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 px-4 py-2 text-xs text-ink-50 font-semibold focus:outline-none focus:border-gold-500/60 shadow-2xs cursor-pointer"
        >
          <option value="all">ALL ALBUMS</option>
          <option value="published">PUBLISHED ONLY</option>
          <option value="draft">DRAFTS</option>
        </select>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

            <div>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-950 m-2.5 rounded-[22px]">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 flex items-center gap-1.5 shadow-md">
                    <Images className="w-3 h-3 text-gold-400" />
                    {album.count} Photos
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 border backdrop-blur-md shadow-md ${
                      album.isPublished
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-black/70 text-stone-300 border-white/10'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${album.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`} />
                    {album.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* View Overlay Button */}
                <button
                  onClick={() => setPreviewAlbum(album)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/70 text-gold-300 border border-gold-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl cursor-pointer backdrop-blur-md"
                  title="Browse Album"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ink-50 font-normal group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors">
                  {album.title}
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 font-medium">{album.subtitle}</p>

                <div className="flex items-center gap-2 text-[11px] text-ink-600 dark:text-ink-400 mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                  <span>{new Date(album.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => handleTogglePublish(album.id)}
                className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                  album.isPublished
                    ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                }`}
              >
                {album.isPublished ? 'Unpublish' : 'Publish Live'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(album)}
                  className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                  title="Edit Album"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(album.id)}
                  className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                  title="Delete Album"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Album Preview Lightbox Modal */}
      {previewAlbum && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setPreviewAlbum(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-ink-50">{previewAlbum.title}</h3>
                <p className="text-xs text-gold-700 dark:text-gold-300 font-medium">
                  {previewAlbum.subtitle} · {previewAlbum.count} Master Photographs
                </p>
              </div>
              <button
                onClick={() => setPreviewAlbum(null)}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-ink-500 hover:text-ink-950 dark:hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-black/40 flex items-center justify-center">
              <img src={previewAlbum.cover} alt={previewAlbum.title} className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Glassy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-[28px] border border-black/15 dark:border-white/20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/10 dark:border-white/10">
              <h3 className="font-serif text-2xl text-ink-50 font-normal">
                {editingAlbum ? 'Edit Photo Album' : 'Create New Photo Album'}
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
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Album Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Wedding — Ananya & Aditya"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Subtitle / Location</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Rambagh Palace, Jaipur"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Photo Count</label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Event Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
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
                  {editingAlbum ? 'Update Album' : 'Save Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminAlbums;
