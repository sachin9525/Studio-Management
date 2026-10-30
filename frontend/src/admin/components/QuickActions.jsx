import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function QuickActions({ stats }) {
  const actions = [
    { label: 'Review Vendor Requests', to: '/admin/dashboard/vendors', count: stats?.pendingVendors ?? 0 },
    { label: 'Manage Demo Content', to: '/admin/dashboard/portfolio' },
    { label: 'View Inquiries', to: '/admin/dashboard/inquiries', count: stats?.newInquiries ?? 0 },
  ];

  return (
    <section className="bg-ink-800 rounded-sm p-6 border border-white/5">
      <h3 className="font-serif text-xl text-ink-50 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center justify-between p-4 rounded-sm bg-ink-900 border border-white/5 hover:border-gold-400/30 transition-colors group"
          >
            <span className="text-sm text-ink-200 group-hover:text-gold-300 transition-colors">
              {action.label}
            </span>
            <div className="flex items-center gap-2">
              {action.count > 0 && (
                <span className="text-[10px] bg-gold-400/10 text-gold-400 px-2 py-1 rounded-full">
                  {action.count}
                </span>
              )}
              <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-gold-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;

