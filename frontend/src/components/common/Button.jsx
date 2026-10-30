import { Link } from "react-router-dom";
const base = "inline-flex items-center justify-center font-sans uppercase tracking-widest transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-gold-400 text-ink-950 hover:bg-gold-300 shadow-lg shadow-gold-500/10",
  gold: "bg-gradient-to-r from-gold-400 to-gold-500 text-ink-950 hover:from-gold-300 hover:to-gold-400 shadow-lg shadow-gold-500/20",
  outline: "border border-ink-300/40 text-ink-50 hover:border-gold-400 hover:text-gold-400 backdrop-blur-sm",
  ghost: "text-ink-100 hover:text-gold-400"
};
const sizes = {
  sm: "text-[10px] px-4 py-2.5",
  md: "text-xs px-6 py-3",
  lg: "text-xs px-8 py-4"
};
function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  href,
  onClick,
  className = "",
  type = "button",
  ariaLabel,
  disabled = false
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>{children}</Link>;
  }
  if (href) {
    return <a href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>{children}</a>;
  }
  return <button type={type} className={classes} onClick={onClick} aria-label={ariaLabel} disabled={disabled}>{children}</button>;
}
export {
  Button as default
};
