const statusColors = {
  new: 'border-gold-400/20 bg-gold-400/10 text-gold-300',
  contacted: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  booked: 'border-green-400/20 bg-green-400/10 text-green-300',
};

function InquiryStatusBadge({ status }) {
  const colorClass = statusColors[status?.toLowerCase()] || 'border-white/10 bg-white/5 text-ink-400';
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${colorClass}`}>
      {status}
    </span>
  );
}

export default InquiryStatusBadge;

