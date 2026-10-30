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
    <section className="bg-ink-900/80 rounded-sm p-6 border border-white/5 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-2xl text-ink-50 font-normal">Command Center</h3>
          <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Access
          </span>
        </div>
        <p className="text-xs text-ink-400 mb-5">
          Priority administrative workflows and live queue shortcuts
        </p>

        <div className="space-y-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex items-center justify-between p-3.5 rounded-sm bg-ink-950/60 border border-white/5 hover:border-gold-400/40 hover:bg-gold-400/[0.03] transition-all duration-200 group hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-ink-900 border border-white/5 group-hover:border-gold-400/30 group-hover:bg-gold-400/10 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <span className="text-xs font-medium text-ink-100 group-hover:text-gold-300 transition-colors block">
                    {action.label}
                  </span>
                  <span className="text-[10px] text-ink-500">{action.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {action.count !== undefined && action.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      action.highlight
                        ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40 animate-pulse'
                        : 'bg-white/5 text-ink-400'
                    }`}
                  >
                    {action.count} new
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-ink-500 group-hover:text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickActions;
