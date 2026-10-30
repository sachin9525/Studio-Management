function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  id
}) {
  const isCenter = align === "center";
  return <div
    id={id}
    className={`flex flex-col gap-4 ${isCenter ? "items-center text-center" : "items-start text-left"} mb-14`}
  >
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <div className={`flex flex-col gap-5 ${isCenter ? "items-center" : "items-start"}`}>
      <div className="gold-line" />
      <h2
        className={`heading-serif text-4xl md:text-5xl lg:text-6xl text-balance max-w-3xl ${light ? "text-ink-900" : ""}`}
      >{title}</h2>
    </div>
    {subtitle && <p
      className={`max-w-2xl text-sm md:text-base leading-relaxed ${light ? "text-ink-500" : "text-ink-300"}`}
    >{subtitle}</p>}
  </div>;
}
export {
  SectionHeading as default
};
