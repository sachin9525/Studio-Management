import { useState, useRef } from 'react';

export default function TiltCard3D({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  onClick,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    const rotX = -normY * maxTilt;
    const rotY = normX * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlareStyle({
        opacity: 0.85,
        background: `radial-gradient(circle 240px at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(216, 179, 106, 0.22) 0%, transparent 75%)`,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
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
        transform,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out',
        ...style,
      }}
      {...props}
    >
      {/* Dynamic Specular Glare Overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-inherit transition-opacity duration-300"
          style={{
            ...glareStyle,
            mixBlendMode: 'overlay',
          }}
        />
      )}
      {children}
    </div>
  );
}

