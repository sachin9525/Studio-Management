import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, LayoutGrid, Mail, Star, Sparkles, Layers } from 'lucide-react';

function QuickActions({ stats }) {
  const actions = [
    {
      label: 'Review Vendor Applications',
      desc: 'Verify studio credentials',
      to: '/admin/dashboard/vendors',
      icon: <Users className="w-4 h-4 text-gold-400" />,
      count: stats?.pendingVendors ?? 0,
      highlight: (stats?.pendingVendors ?? 0) > 0,
    },
    {
      label: 'Manage Portfolio Shoots',
      desc: 'Curate landing page shoots',
      to: '/admin/dashboard/portfolio',
      icon: <LayoutGrid className="w-4 h-4 text-gold-400" />,
    },
    {
      label: 'Client Inquiries Desk',
      desc: 'Assign leads to studios',
      to: '/admin/dashboard/inquiries',
      icon: <Mail className="w-4 h-4 text-gold-400" />,
      count: stats?.newInquiries ?? 0,
      highlight: (stats?.newInquiries ?? 0) > 0,
    },
    {
      label: 'Service Offerings',
      desc: 'Photography catalog',
      to: '/admin/dashboard/services',
      icon: <Layers className="w-4 h-4 text-gold-400" />,
    },
  ];

  return (
    <section className="bg-white/90 dark:bg-black/45 rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 backdrop-blur-2xl flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Soft Glass Ambient Highlights */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/10 dark:bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-2xl sm:text-3xl text-ink-50 font-normal">Command Center</h3>
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold-700 dark:text-gold-400 font-bold flex items-center gap-1 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20 shadow-2xs">
            <Sparkles className="w-3 h-3 text-gold-600 dark:text-gold-400" /> Quick Access
          </span>
        </div>
        <p className="text-xs text-ink-500 dark:text-ink-400 mb-5 font-medium">
          Priority administrative workflows and live queue shortcuts
        </p>

        <div className="space-y-2.5">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 hover:border-gold-500/40 hover:bg-gold-500/[0.06] transition-all duration-200 group hover:translate-x-1 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 group-hover:border-gold-500/30 group-hover:bg-gold-500/10 transition-colors shrink-0 shadow-2xs">
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-ink-50 group-hover:text-gold-700 dark:group-hover:text-gold-300 transition-colors block truncate">
                    {action.label}
                  </span>
                  <span className="text-[10px] text-ink-500 dark:text-ink-400 font-medium truncate block">{action.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {action.count !== undefined && action.count > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      action.highlight
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs animate-pulse'
                        : 'bg-black/5 dark:bg-white/10 text-ink-600 dark:text-ink-300 border border-black/10 dark:border-white/10'
                    }`}
                  >
                    {action.count} new
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-ink-400 dark:text-ink-400 group-hover:text-gold-600 dark:group-hover:text-gold-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickActions;
