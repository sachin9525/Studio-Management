import { useRef } from 'react';

export default function TiltCard3D({
  children,
  className = '',
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      const rotX = -normY * maxTilt;
      const rotY = normX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;

      if (glare && glareRef.current) {
        glareRef.current.style.opacity = '0.85';
        glareRef.current.style.background = `radial-gradient(circle 240px at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(216, 179, 106, 0.22) 0%, transparent 75%)`;
      }
    });
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out';
    }
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out';
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative transform-gpu will-change-transform ${className}`}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Specular Glare Overlay */}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-30 rounded-inherit transition-opacity duration-300"
          style={{
            opacity: 0,
            mixBlendMode: 'overlay',
          }}
        />
      )}
      {children}
    </div>
  );
}
