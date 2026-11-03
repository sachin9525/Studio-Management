import { useState, useMemo } from 'react';
import {
  Star,
  Plus,
  Search,
  Pencil,
  Trash2,
  Sparkles,
  Quote,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '@/admin/components';

const defaultTestimonials = [
  {
    id: 'tst-1',
    name: 'Priya & Rohan',
    event: 'Jaipur Destination Wedding',
    quote: 'The team captured our wedding with such poetry and precision. Every ritual, look, and emotion looks cinematic!',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublished: true,
  },
  {
    id: 'tst-2',
    name: 'Meera & Kabir',
    event: 'Udaipur Palace Celebration',
    quote: 'Our pre-wedding and wedding film felt like a dream. Absolutely exceptional cinematography and warm team.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/32327732/pexels-photo-32327732.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublished: true,
  },
  {
    id: 'tst-3',
    name: 'Ananya & Siddharth',
    event: 'Royal Heritage Sangeet',
    quote: 'From drone footage to heartfelt candid moments, SVML delivered an heirloom we will treasure for generations.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=300',
    isPublished: true,
  },
];

function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState(() => {
    try {
      const saved = localStorage.getItem('svml_admin_testimonials_items');
      return saved ? JSON.parse(saved) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    event: '',
    quote: '',
    rating: 5,
    avatar: '',
    isPublished: true,
  });

  const saveTestimonials = (items) => {
    setTestimonials(items);
    try {
      localStorage.setItem('svml_admin_testimonials_items', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTestimonials = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return testimonials;
    return testimonials.filter(
      (t) => t.name.toLowerCase().includes(q) || t.event.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q)
    );
  }, [testimonials, searchQuery]);

  const handleTogglePublish = (id) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, isPublished: !t.isPublished } : t));
    saveTestimonials(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      saveTestimonials(updated);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: '',
      event: '',
      quote: '',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/15490147/pexels-photo-15490147.jpeg?auto=compress&cs=tinysrgb&w=300',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTestimonial(t);
    setFormData({
      name: t.name,
      event: t.event,
      quote: t.quote,
      rating: t.rating,
      avatar: t.avatar,
      isPublished: t.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;

    if (editingTestimonial) {
      const updated = testimonials.map((t) => (t.id === editingTestimonial.id ? { ...t, ...formData } : t));
      saveTestimonials(updated);
    } else {
      const newTst = {
        ...formData,
        id: `tst-${Date.now()}`,
      };
      saveTestimonials([newTst, ...testimonials]);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout title="Client Testimonials Review">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/25 text-gold-700 dark:text-gold-300 text-[10px] uppercase font-mono tracking-widest font-bold flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" />
              Social Proof & Client Love
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal tracking-tight">Testimonials Wall</h2>
          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 mt-1 max-w-2xl font-medium">
            Curate and approve couple reviews and feedback displayed on the public landing page testimonial slider.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-gold-500/25 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* 4 Glassy Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          ['Total Reviews', testimonials.length, `${testimonials.filter((t) => t.isPublished).length} Active online`],
          ['Client Rating', '5.0 ★', '100% 5-Star Reviews'],
          ['Client Trust', 'Verified', 'Authentic couples'],
          ['Satisfaction', '99.8%', 'Net Promoter Score'],
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

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400" />
          <input
            type="text"
            placeholder="Search reviews by couple, location, or words…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white/90 dark:bg-black/40 pl-10 pr-4 py-2 text-xs text-ink-50 placeholder:text-ink-400 focus:outline-none focus:border-gold-500/60 shadow-inner"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t) => (
          <div
            key={t.id}
            className="group relative rounded-[28px] overflow-hidden border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-500 dark:text-gold-400 text-sm tracking-widest">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md ${
                    t.isPublished
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                      : 'bg-black/70 text-stone-300 border-white/10'
                  }`}
                >
                  {t.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>

              <Quote className="w-8 h-8 text-gold-500/20 mb-2" />
              <p className="text-xs text-ink-600 dark:text-ink-300 leading-relaxed italic mb-6 font-medium">"{t.quote}"</p>
            </div>

            <div>
              <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gold-400/20 border border-gold-400/30 shrink-0 shadow-2xs">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-50 truncate">{t.name}</p>
                  <p className="text-[10px] text-gold-700 dark:text-gold-300 font-medium truncate">{t.event}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-black/5 dark:border-white/5 text-xs">
                <button
                  onClick={() => handleTogglePublish(t.id)}
                  className={`rounded-full px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer border ${
                    t.isPublished
                      ? 'border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-amber-700 dark:hover:text-amber-300'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {t.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    className="p-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-ink-600 dark:text-ink-400 hover:text-gold-700 dark:hover:text-gold-300 hover:border-gold-500/30 transition-all cursor-pointer"
                    title="Edit Review"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/15 transition-all cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                {editingTestimonial ? 'Edit Client Review' : 'Add Client Review'}
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
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Couple / Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sanya & Varun"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Event / City</label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="e.g. Destination Wedding, Goa"
                  className="w-full rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 px-4 py-2.5 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Review / Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Client words..."
                  className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-black/50 p-4 text-xs text-ink-50 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono font-bold tracking-widest text-ink-500 mb-1.5">Client Photo URL</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
                  {editingTestimonial ? 'Update Review' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminTestimonials;
