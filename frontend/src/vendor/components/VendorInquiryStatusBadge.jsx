const statusColors = {
  new: 'bg-gold-400/10 text-gold-400 border-gold-400/20',
  contacted: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  booked: 'bg-green-400/10 text-green-400 border-green-400/20',
};

function VendorInquiryStatusBadge({ status }) {
  const colorClass = statusColors[status?.toLowerCase()] || statusColors.new;
  return (
    <span className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-widest ${colorClass}`}>
      {status}
    </span>
  );
}

export default VendorInquiryStatusBadge;

