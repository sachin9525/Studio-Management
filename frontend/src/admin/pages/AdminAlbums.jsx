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

  const handleOpenEditModal = (alb) => {
    setEditingAlbum(alb);
    setFormData({
      title: alb.title,
      subtitle: alb.subtitle,
      cover: alb.cover,
      count: alb.count,
      date: alb.date,
      isPublished: alb.isPublished,
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
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Photo Book & Story Catalog
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Photo Albums</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Curate the premium wedding books and digital albums displayed in the public album gallery.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Photo Album</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Total Albums</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">{albums.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">{albums.filter((a) => a.isPublished).length} Published</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Total Photos</span>
          <p className="font-sans font-bold text-3xl text-gold-400 tabular-nums">
            {albums.reduce((a, b) => a + (Number(b.count) || 0), 0)}
          </p>
          <p className="text-[10px] text-ink-500 mt-1">High-res frames</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Avg Size</span>
          <p className="font-sans font-bold text-3xl text-ink-50 tabular-nums">
            {Math.round(albums.reduce((a, b) => a + (Number(b.count) || 0), 0) / (albums.length || 1))} Photos
          </p>
          <p className="text-[10px] text-ink-500 mt-1">Per story book</p>
        </div>
        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/20 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-gold-400 block mb-1 font-semibold">Delivery</span>
          <p className="font-serif text-3xl text-gold-300">Ultra-HD</p>
          <p className="text-[10px] text-gold-400/80 mt-1">Print & Cloud Ready</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-sm bg-ink-900/90 border border-white/5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search albums by couple or title…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-950/80 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-ink-950/80 border border-white/10 rounded-sm px-3 py-2 text-xs text-ink-200 focus:outline-none focus:border-gold-400"
        >
          <option value="all">All Albums</option>
          <option value="published">Published Only</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="group bg-ink-900/80 border border-white/5 rounded-sm overflow-hidden hover:border-gold-400/30 transition-all duration-300 flex flex-col hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-950">
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/70 backdrop-blur-md border border-white/20 text-gold-300 flex items-center gap-1.5">
                  <Images className="w-3 h-3 text-gold-400" />
                  {album.count} Photos
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1 border backdrop-blur-md ${
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
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/80 text-gold-300 border border-gold-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
                title="Browse Album"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl text-ink-50 font-medium group-hover:text-gold-300 transition-colors">
                  {album.title}
                </h3>
                <p className="text-xs text-ink-400 mt-1">{album.subtitle}</p>

                <div className="flex items-center gap-2 text-[11px] text-ink-500 mt-3 pt-3 border-t border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>{new Date(album.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleTogglePublish(album.id)}
                  className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    album.isPublished
                      ? 'text-ink-400 hover:text-amber-400'
                      : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                  }`}
                >
                  {album.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(album)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
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

      {/* Album Preview Lightbox Modal */}
      {previewAlbum && (
        <div
          className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setPreviewAlbum(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-ink-900 border border-gold-400/30 rounded-sm overflow-hidden flex flex-col shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-ink-950/80">
              <div>
                <h3 className="font-serif text-xl text-ink-50">{previewAlbum.title}</h3>
                <p className="text-xs text-gold-400">{previewAlbum.subtitle} · {previewAlbum.count} Master Photographs</p>
              </div>
              <button onClick={() => setPreviewAlbum(null)} className="p-2 text-ink-400 hover:text-ink-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center">
              <img src={previewAlbum.cover} alt={previewAlbum.title} className="max-h-[65vh] w-auto object-contain rounded-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-ink-900 border border-gold-400/30 rounded-sm p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <h3 className="font-serif text-2xl text-ink-50">
                {editingAlbum ? 'Edit Photo Album' : 'Create New Photo Album'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Album Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Wedding — Ananya & Aditya"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Subtitle / Location</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Rambagh Palace, Jaipur"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Photo Count</label>
                  <input
                    type="number"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Event Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-ink-950 border border-white/10 rounded-sm px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
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

