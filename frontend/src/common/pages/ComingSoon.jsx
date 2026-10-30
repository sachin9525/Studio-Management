import DashboardLayout from "@/components/common/DashboardLayout";
import { Construction } from "lucide-react";
function ComingSoon({ title, role, navItems }) {
  return <DashboardLayout navItems={navItems} title={title} role={role}><div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-20 h-20 rounded-full bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-6"><Construction className="w-10 h-10 text-gold-400" /></div>
    <h2 className="font-serif text-3xl text-ink-50 mb-3">{title}</h2>
    <p className="text-ink-400 max-w-md">This section is part of the full platform and will be available as the product evolves. The dashboard framework and navigation are fully in place.</p>
  </div></DashboardLayout>;
}
export {
  ComingSoon as default
};
