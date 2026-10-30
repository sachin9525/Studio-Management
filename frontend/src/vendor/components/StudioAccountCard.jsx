import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

function StudioAccountCard({ studioName, vendor = {}, profile = {} }) {
  return (
    <section className="rounded-sm border border-white/5 bg-ink-800 p-6" aria-labelledby="studio-account-title">
      <h3 id="studio-account-title" className="mb-5 font-serif text-xl text-ink-50">
        Studio Account
      </h3>
      <dl className="space-y-4">
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-500">Studio</dt>
          <dd className="mt-1 text-sm text-ink-200">{studioName}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-500">Location</dt>
          <dd className="mt-1 text-sm text-ink-200">
            {[vendor.city, vendor.state].filter(Boolean).join(', ') || 'Not added yet'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-500">Account status</dt>
          <dd className="mt-1 capitalize text-sm text-green-400">
            {vendor.status || profile?.status || 'Active'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-ink-500">Member since</dt>
          <dd className="mt-1 text-sm text-ink-200">{formatDate(vendor.createdAt)}</dd>
        </div>
      </dl>
      <Link
        to="/vendor/dashboard/profile"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-gold-400/30 bg-gold-400/10 py-3 text-xs uppercase tracking-widest text-gold-400 transition-colors hover:bg-gold-400/20"
      >
        Manage Studio Profile <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}

export default StudioAccountCard;

