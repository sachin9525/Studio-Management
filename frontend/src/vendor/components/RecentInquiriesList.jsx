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
      className="rounded-sm border border-white/5 bg-ink-800 p-6 lg:col-span-2"
      aria-labelledby="recent-inquiries-title"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 id="recent-inquiries-title" className="font-serif text-xl text-ink-50">
          Recent Inquiries
        </h3>
        <Link
          to="/vendor/dashboard/inquiries"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
        >
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-ink-500">Loading inquiries…</p>
      ) : inquiries.length ? (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry._id}
              className="flex items-center justify-between gap-4 rounded-sm border border-white/5 bg-ink-900 p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/20 font-serif text-gold-400">
                  {inquiry.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-100">{inquiry.name}</p>
                  <p className="text-xs text-ink-500">
                    {inquiry.eventType} · {formatDate(inquiry.eventDate || inquiry.createdAt)}
                  </p>
                </div>
              </div>
              <VendorInquiryStatusBadge status={inquiry.status} />
            </article>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Mail className="mx-auto mb-3 h-8 w-8 text-ink-500" />
          <p className="text-sm text-ink-300">No inquiries have been assigned to your studio yet.</p>
          <p className="mt-1 text-xs text-ink-500">
            The platform admin can assign inquiries from the Client Inquiries page.
          </p>
        </div>
      )}
    </section>
  );
}

export default RecentInquiriesList;

