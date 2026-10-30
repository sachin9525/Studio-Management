import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, FolderHeart, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { VendorLayout, SelectedMediaPreviews } from '@/vendor/components';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';

const blankProject = {
  title: '', eventType: '', eventDate: '', location: '', description: '', isPublished: false,
};
const inputClass = 'w-full rounded-sm border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none';
const formatDate = (date) => date
  ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Date not set';

function VendorProjects() {
  const { session } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(blankProject);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/vendor/projects', { token: session.token });
      setProjects(data.projects);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const resetForm = () => {
    setForm(blankProject);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setEditingId('');
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const payload = new FormData();
    Object.entries({ ...form, eventDate: form.eventDate || '' }).forEach(([key, value]) => {
      payload.append(key, String(value));
    });
    files.forEach((file) => payload.append('files', file));
    try {
      const data = await apiRequest(editingId ? `/vendor/projects/${editingId}` : '/vendor/projects', {
        method: editingId ? 'PATCH' : 'POST',
        token: session.token,
        body: payload,
      });
      if (editingId) {
        setProjects((current) => current.map((project) => project._id === editingId ? data.project : project));
      } else {
        setProjects((current) => [data.project, ...current]);
      }
      resetForm();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save project.');
    } finally {
      setSaving(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      eventType: project.eventType,
      eventDate: project.eventDate ? new Date(project.eventDate).toISOString().slice(0, 10) : '',
      location: project.location || '',
      description: project.description || '',
      isPublished: project.isPublished,
    });
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSaved(false);
  };

  const togglePublished = async (project) => {
    setUpdatingId(project._id);
    setError('');
    try {
      const data = await apiRequest(`/vendor/projects/${project._id}`, {
        method: 'PATCH',
        token: session.token,
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      setProjects((current) => current.map((item) => item._id === project._id ? data.project : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update project visibility.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setUpdatingId(project._id);
    setError('');
    try {
      await apiRequest(`/vendor/projects/${project._id}`, { method: 'DELETE', token: session.token });
      setProjects((current) => current.filter((item) => item._id !== project._id));
      if (editingId === project._id) resetForm();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete project.');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteMedia = async (projectId, mediaId) => {
    setUpdatingId(projectId);
    setError('');
    try {
      const data = await apiRequest(`/vendor/projects/${projectId}/media/${mediaId}`, {
        method: 'DELETE',
        token: session.token,
      });
      setProjects((current) => current.map((project) => project._id === projectId ? data.project : project));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to remove uploaded media.');
    } finally {
      setUpdatingId('');
    }
  };

  const publishedCount = projects.filter((project) => project.isPublished).length;

  return <VendorLayout title="Wedding Projects">
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="mb-1 font-serif text-3xl text-ink-50">Wedding Projects</h2>
        <p className="text-sm text-ink-400">Build and manage your studio portfolio.</p>
      </div>
      <button type="button" onClick={loadProjects} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/40 hover:text-gold-300 disabled:opacity-50">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
      </button>
    </div>

    {error && <p role="alert" className="mb-5 rounded-sm border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">{error}</p>}
    {saved && <p role="status" className="mb-5 rounded-sm border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">Project saved.</p>}

    <form onSubmit={handleSubmit} className="mb-8 max-w-4xl rounded-sm border border-white/5 bg-ink-800 p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink-50">{editingId ? 'Edit project' : 'Add a project'}</h3>
        {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-100"><X className="h-4 w-4" /> Cancel</button>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Project title</span>
          <input required maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Aarav & Meera Wedding" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Event type</span>
          <input required maxLength={100} value={form.eventType} onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))} className={inputClass} placeholder="Wedding Photography" />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Event date</span>
          <input type="date" value={form.eventDate} onChange={(event) => setForm((current) => ({ ...current, eventDate: event.target.value }))} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Location</span>
          <input maxLength={160} value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className={inputClass} placeholder="Bhopal, Madhya Pradesh" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Upload images or videos</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            onChange={(event) => setFiles(Array.from(event.target.files || []))}
            className={`${inputClass} file:mr-4 file:rounded-sm file:border-0 file:bg-gold-400/10 file:px-3 file:py-2 file:text-xs file:text-gold-300`}
          />
          <span className="mt-2 block text-xs text-ink-500">Choose up to 20 files, 100 MB each. Preview your images and videos below before saving.</span>
          {files.length > 0 && <span className="mt-2 block text-xs text-ink-400">{files.length} file{files.length === 1 ? '' : 's'} selected</span>}
          <SelectedMediaPreviews files={files} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block text-[10px] uppercase tracking-widest text-ink-400">Description</span>
          <textarea maxLength={2000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} placeholder="Share a few details about this project." />
        </label>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-ink-300">
        <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} className="h-4 w-4 accent-yellow-500" />
        Publish this project in my portfolio
      </label>
      <button type="submit" disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold-400 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-ink-950 hover:bg-gold-300 disabled:opacity-50">
        {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add project'}
      </button>
    </form>

    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-serif text-xl text-ink-50">Your portfolio</h3>
      <span className="text-xs text-ink-500">{publishedCount} published · {projects.length} total</span>
    </div>
    {loading ? <p className="py-12 text-center text-sm text-ink-500">Loading projects…</p> : projects.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => <article key={project._id} className="overflow-hidden rounded-sm border border-white/5 bg-ink-800">
        <div className="relative flex aspect-[16/10] items-center justify-center bg-ink-900 text-gold-400">
          {project.media?.some((item) => item.mimeType.startsWith('image/')) ? <img src={project.media.find((item) => item.mimeType.startsWith('image/')).url} alt={project.title} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} className="absolute inset-0 h-full w-full object-cover" /> : <FolderHeart className="h-10 w-10 opacity-60" />}
          <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-widest ${project.isPublished ? 'border-green-400/30 bg-ink-950/80 text-green-400' : 'border-white/10 bg-ink-950/80 text-ink-400'}`}>{project.isPublished ? 'Published' : 'Draft'}</span>
        </div>
        <div className="p-5">
          <p className="text-[10px] uppercase tracking-widest text-gold-400">{project.eventType}</p>
          <h4 className="mt-1 truncate font-serif text-xl text-ink-50">{project.title}</h4>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(project.eventDate)}</span>
            {project.location && <span>{project.location}</span>}
          </div>
          {project.description && <p className="mt-3 line-clamp-3 text-sm text-ink-400">{project.description}</p>}
          {project.media?.length > 0 && <div className="mt-4 grid grid-cols-3 gap-2">
            {project.media.map((item) => <div key={item._id} className="group relative aspect-square overflow-hidden rounded-sm bg-ink-900">
              {item.mimeType.startsWith('video/') ? <video src={item.url} controls preload="metadata" className="h-full w-full object-cover" /> : <a href={item.url} target="_blank" rel="noreferrer" aria-label={`View ${item.originalName}`}><img src={item.url} alt={item.originalName} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" /></a>}
              <button type="button" disabled={updatingId === project._id} onClick={() => deleteMedia(project._id, item._id)} aria-label={`Remove ${item.originalName}`} className="absolute right-1 top-1 rounded-full bg-ink-950/80 p-1.5 text-red-300 hover:bg-red-500/30 disabled:opacity-50"><X className="h-3.5 w-3.5" /></button>
            </div>)}
          </div>}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
            <button type="button" disabled={updatingId === project._id} onClick={() => editProject(project)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:border-gold-400/30 hover:text-gold-300 disabled:opacity-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
            <button type="button" disabled={updatingId === project._id} onClick={() => togglePublished(project)} className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 px-3 py-2 text-xs text-ink-300 hover:text-gold-300 disabled:opacity-50">{project.isPublished ? 'Unpublish' : 'Publish'} <ArrowUpRight className="h-3.5 w-3.5" /></button>
            <button type="button" disabled={updatingId === project._id} onClick={() => deleteProject(project)} className="ml-auto inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          </div>
        </div>
      </article>)}
    </div> : <div className="rounded-sm border border-white/5 bg-ink-800 px-5 py-14 text-center">
      <FolderHeart className="mx-auto mb-3 h-8 w-8 text-ink-500" />
      <p className="text-sm text-ink-300">No wedding projects added yet.</p>
      <p className="mt-1 text-xs text-ink-500">Add a project above to start building your portfolio.</p>
    </div>}
  </VendorLayout>;
}

export default VendorProjects;
