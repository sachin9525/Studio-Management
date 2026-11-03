import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Canvas3DScene({ className = '', interactive = true, particleCount = 80 }) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Damping mouse rotation
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left - width / 2;
      const clientY = e.clientY - rect.top - height / 2;
      mouse.targetX = clientX * 0.0006;
      mouse.targetY = clientY * 0.0006;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 3D Particles
    const fov = 450;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 700,
        z: Math.random() * 800 - 200,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 0.8,
        baseAlpha: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Floating Golden Bokeh Orbs
    const bokehOrbs = [
      { x: -width * 0.25, y: -height * 0.15, z: 100, radius: 140, hue: 42, drift: 0.001 },
      { x: width * 0.3, y: height * 0.2, z: 250, radius: 200, hue: 38, drift: 0.0015 },
      { x: 0, y: -height * 0.25, z: 400, radius: 170, hue: 45, drift: 0.0008 },
    ];

    let rotX = 0;
    let rotY = 0;
    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth lerp mouse rotation
      rotX += (mouse.targetY - rotX) * 0.05;
      rotY += (mouse.targetX - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Render Ambient 3D Bokeh Lights
      bokehOrbs.forEach((orb, i) => {
        const floatX = orb.x + Math.sin(time * 0.5 + i) * 35;
        const floatY = orb.y + Math.cos(time * 0.4 + i) * 25;
        const scale = fov / (fov + orb.z);
        const projX = floatX * scale + width / 2;
        const projY = floatY * scale + height / 2;
        const projR = Math.max(10, orb.radius * scale);

        const grad = ctx.createRadialGradient(projX, projY, 0, projX, projY, projR);
        if (isDark) {
          grad.addColorStop(0, `rgba(216, 179, 106, 0.14)`);
          grad.addColorStop(0.5, `rgba(189, 145, 72, 0.05)`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, `rgba(160, 110, 26, 0.09)`);
          grad.addColorStop(0.5, `rgba(189, 135, 40, 0.03)`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(projX, projY, projR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Project & sort particles
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Velocity & wrap around bounds
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -450) p.x = 450;
        if (p.x > 450) p.x = -450;
        if (p.y < -350) p.y = 350;
        if (p.y > 350) p.y = -350;
        if (p.z < -200) p.z = 600;
        if (p.z > 600) p.z = -200;

        // 3D Matrix Rotation (Y axis then X axis)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective Projection
        const scale = fov / (fov + z2);
        const projX = x1 * scale + width / 2;
        const projY = y1 * scale + height / 2;

        if (scale > 0 && projX >= -50 && projX <= width + 50 && projY >= -50 && projY <= height + 50) {
          projected.push({
            p,
            projX,
            projY,
            z: z2,
            scale,
            alpha: Math.max(0.1, Math.min(1, p.baseAlpha + Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.2)),
          });
        }
      }

      // Sort by depth (back to front)
      projected.sort((a, b) => b.z - a.z);

      // Draw 3D Constellation Connections
      const maxDist = 95;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.projX - b.projX;
          const dy = a.projY - b.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16 * Math.min(a.alpha, b.alpha);
            ctx.strokeStyle = isDark
              ? `rgba(216, 179, 106, ${lineAlpha})`
              : `rgba(133, 77, 14, ${lineAlpha * 0.9})`;
            ctx.lineWidth = Math.min(a.scale, b.scale) * 0.9;
            ctx.beginPath();
            ctx.moveTo(a.projX, a.projY);
            ctx.lineTo(b.projX, b.projY);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Particle Points
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const radius = Math.max(0.8, item.p.size * item.scale);

        ctx.beginPath();
        ctx.arc(item.projX, item.projY, radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = `rgba(240, 211, 139, ${item.alpha})`;
          ctx.shadowColor = 'rgba(216, 179, 106, 0.4)';
          ctx.shadowBlur = radius * 3;
        } else {
          ctx.fillStyle = `rgba(133, 77, 14, ${item.alpha * 0.85})`;
          ctx.shadowColor = 'rgba(133, 77, 14, 0.25)';
          ctx.shadowBlur = radius * 2;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, particleCount, isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

