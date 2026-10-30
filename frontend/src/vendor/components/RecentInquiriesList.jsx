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
      className="rounded-sm border border-white/5 bg-ink-900/80 backdrop-blur-md p-6 lg:col-span-2"
      aria-labelledby="recent-inquiries-title"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 id="recent-inquiries-title" className="font-serif text-xl text-ink-50">
            Recent Client Inquiries
          </h3>
          <p className="text-xs text-ink-400 mt-0.5">Direct shoot and wedding coverage inquiries for your studio.</p>
        </div>
        <Link
          to="/vendor/dashboard/inquiries"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors font-medium"
        >
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-ink-500">Loading inquiries…</div>
      ) : inquiries.length ? (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry._id}
              className="flex items-center justify-between gap-4 rounded-sm border border-white/5 bg-ink-800/60 p-4 transition-all hover:border-gold-400/30"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 font-serif text-gold-300 font-semibold shadow-inner">
                  {inquiry.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-100 font-medium">{inquiry.name}</p>
                  <p className="text-xs text-ink-400">
                    {inquiry.eventType} · <span className="text-ink-500">{formatDate(inquiry.eventDate || inquiry.createdAt)}</span>
                  </p>
                </div>
              </div>
              <VendorInquiryStatusBadge status={inquiry.status} />
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-dashed border-white/5 rounded-sm bg-ink-950/30">
          <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
          <p className="text-sm text-ink-300 font-medium">No inquiries received yet.</p>
          <p className="mt-1 text-xs text-ink-500 max-w-sm mx-auto">
            Once clients submit inquiry forms on your public packages or catalog, they will appear here in real-time.
          </p>
        </div>
      )}
    </section>
  );
}

export default RecentInquiriesList;
