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
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Social Proof & Client Love
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-50 font-normal">Testimonials Wall</h2>
          <p className="text-sm text-ink-400 mt-1 max-w-2xl">
            Curate and approve couple reviews and feedback displayed on the public landing page testimonial slider.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-medium text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-gold-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Total Reviews</span>
          <p className="font-serif text-3xl text-ink-50">{testimonials.length}</p>
          <p className="text-[10px] text-emerald-400 mt-1">{testimonials.filter((t) => t.isPublished).length} Active online</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Client Rating</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="font-serif text-3xl text-gold-400 font-semibold">5.0</p>
            <div className="flex text-gold-400 text-xs">★★★★★</div>
          </div>
          <p className="text-[10px] text-ink-500 mt-1">100% 5-Star rating</p>
        </div>
        <div className="p-5 rounded-sm bg-ink-900/70 border border-white/5 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-ink-500 block mb-1">Client Trust</span>
          <p className="font-serif text-3xl text-ink-50">Verified</p>
          <p className="text-[10px] text-ink-500 mt-1">Authentic couples</p>
        </div>
        <div className="p-5 rounded-sm bg-gradient-to-br from-gold-400/10 via-ink-900/80 to-ink-900 border border-gold-400/20 backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-gold-400 block mb-1 font-semibold">Satisfaction</span>
          <p className="font-serif text-3xl text-gold-300">99.8%</p>
          <p className="text-[10px] text-gold-400/80 mt-1">Net Promoter Score</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-sm bg-ink-900/90 border border-white/5 mb-6 flex items-center justify-between gap-4 backdrop-blur-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search reviews by couple, location, or words…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-950/80 border border-white/10 rounded-sm pl-9 pr-8 py-2 text-xs text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t) => (
          <div
            key={t.id}
            className="bg-ink-900/80 border border-white/5 rounded-sm p-6 flex flex-col justify-between hover:border-gold-400/30 transition-all duration-300 hover:shadow-2xl relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-gold-400 text-sm">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold ${
                    t.isPublished
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-ink-950 text-ink-500 border border-white/10'
                  }`}
                >
                  {t.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>

              <Quote className="w-8 h-8 text-gold-400/20 mb-2" />
              <p className="text-xs text-ink-200 leading-relaxed italic mb-6">"{t.quote}"</p>
            </div>

            <div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gold-400/20 border border-gold-400/30 shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-100 truncate">{t.name}</p>
                  <p className="text-[10px] text-gold-400 truncate">{t.event}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                <button
                  onClick={() => handleTogglePublish(t.id)}
                  className={`px-3 py-1 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                    t.isPublished ? 'text-ink-400 hover:text-amber-400' : 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                  }`}
                >
                  {t.isPublished ? 'Unpublish' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    className="p-1.5 rounded-sm text-ink-400 hover:text-gold-300 hover:bg-white/5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
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
                {editingTestimonial ? 'Edit Client Review' : 'Add Client Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Couple / Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sanya & Varun"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Event / City</label>
                <input
                  type="text"
                  value={formData.event}
                  onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                  placeholder="e.g. Destination Wedding, Goa"
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Review / Feedback *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Client words..."
                  className="w-full bg-ink-950 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-ink-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-ink-400 mb-1.5">Client Photo URL</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
