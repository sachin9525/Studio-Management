function StatCard({ label, value, icon, trend, accent }) {
  return (
    <div
      className={`relative rounded-sm p-6 border transition-all duration-300 hover:scale-[1.02] ${
        accent
          ? 'bg-gradient-to-br from-gold-400/10 to-ink-800 border-gold-400/30'
          : 'bg-ink-800 border-white/5 hover:border-white/10'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            accent ? 'bg-gold-400/20 text-gold-400' : 'bg-white/5 text-ink-300'
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] uppercase tracking-widest text-green-400">
            {trend}
          </span>
        )}
      </div>
      <p className="font-serif text-4xl text-ink-50 mb-1">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-ink-400">{label}</p>
    </div>
  );
}

export default StatCard;

