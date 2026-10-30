const statusColors = {
  approved: 'bg-green-400/10 text-green-400 border-green-400/20',
  pending: 'bg-gold-400/10 text-gold-400 border-gold-400/20',
  suspended: 'bg-red-400/10 text-red-400 border-red-400/20',
};

function VendorStatusBadge({ status }) {
  const colorClass = statusColors[status?.toLowerCase()] || 'bg-white/5 text-ink-300 border-white/10';
  return (
    <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border ${colorClass}`}>
      {status}
    </span>
  );
}

export default VendorStatusBadge;

