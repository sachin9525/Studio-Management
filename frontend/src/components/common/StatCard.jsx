function StatCard({ label, value, icon, trend, accent }) {
  return (
    <div
      className={`relative rounded-sm p-2.5 sm:p-3 border transition-all duration-300 hover:scale-[1.01] ${
        accent
          ? "bg-gradient-to-br from-gold-400/10 to-ink-800 border-gold-400/30"
          : "bg-ink-800 border-white/5 hover:border-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
            accent ? "bg-gold-400/20 text-gold-400" : "bg-white/5 text-ink-300"
          }`}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-[8px] uppercase tracking-widest text-green-400 font-medium">
            {trend}
          </span>
        )}
      </div>
      <p className="font-serif text-xl sm:text-2xl text-ink-50 mb-0.5 leading-none">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-ink-400 font-medium truncate">{label}</p>
    </div>
  );
}

export {
  StatCard as default
};
