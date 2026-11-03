import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import VendorInquiryStatusBadge from './VendorInquiryStatusBadge';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Date not set';

function RecentInquiriesList({ inquiries = [], loading = false }) {
  return (
    <section
      className="relative rounded-[28px] border border-black/10 dark:border-white/15 bg-white/90 dark:bg-black/45 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:col-span-2 overflow-hidden"
      aria-labelledby="recent-inquiries-title"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="mb-6 flex items-center justify-between relative z-10">
        <div>
          <h3 id="recent-inquiries-title" className="font-serif text-2xl text-ink-50 font-normal">
            Recent Client Inquiries
          </h3>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 font-medium">Direct shoot and wedding coverage inquiries for your studio.</p>
        </div>
        <Link
          to="/vendor/dashboard/inquiries"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-300 hover:border-gold-500/30 transition-all font-bold shadow-2xs"
        >
          <span>View All</span> <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono font-bold text-ink-500 animate-pulse">Loading studio inquiries…</div>
      ) : inquiries.length ? (
        <div className="space-y-3 relative z-10">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry._id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 transition-all hover:border-gold-500/30 hover:bg-gold-500/[0.03] shadow-2xs"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 font-serif text-gold-700 dark:text-gold-300 font-bold text-sm shadow-2xs">
                  {inquiry.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-50 font-semibold">{inquiry.name}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 font-medium">
                    {inquiry.eventType} · <span className="text-ink-500 font-mono">{formatDate(inquiry.eventDate || inquiry.createdAt)}</span>
                  </p>
                </div>
              </div>
              <VendorInquiryStatusBadge status={inquiry.status} />
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-black/[0.01] dark:bg-white/[0.01]">
          <Mail className="mx-auto mb-3 h-8 w-8 text-ink-400 opacity-60" />
          <p className="text-sm text-ink-50 font-semibold">No inquiries received yet.</p>
          <p className="mt-1 text-xs text-ink-500 max-w-sm mx-auto font-medium">
            Once clients submit inquiry forms on your public packages or catalog, they will appear here in real-time.
          </p>
        </div>
      )}
    </section>
  );
}

export default RecentInquiriesList;
