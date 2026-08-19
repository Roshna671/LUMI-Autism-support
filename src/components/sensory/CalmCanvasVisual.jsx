import React, { useRef, useEffect, useState } from 'react';

export default function CalmCanvasVisual({ type = 'glitter', height = 240, title = 'Swirling Glitter' }) {
  const canvasRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let heightPx = (canvas.height = height);

    // Particle objects
    let particles = [];
    const particleCount = type === 'glitter' ? 60 : type === 'bubbles' ? 25 : 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * heightPx,
        radius: Math.random() * (type === 'bubbles' ? 18 : 6) + 3,
        dx: (Math.random() - 0.5) * (type === 'water' ? 0.8 : 1.5),
        dy: (Math.random() - 0.5) * (type === 'water' ? 0.8 : 1.5),
        color:
          type === 'glitter'
            ? `hsla(${Math.random() * 60 + 40}, 100%, 75%, 0.8)`
            : type === 'bubbles'
            ? `hsla(${Math.random() * 60 + 180}, 90%, 80%, 0.6)`
            : type === 'water'
            ? `hsla(${Math.random() * 40 + 190}, 90%, 70%, 0.7)`
            : `hsla(${Math.random() * 120 + 260}, 85%, 75%, 0.7)`,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, heightPx);

      if (type === 'water') {
        // Gradient water background
        const grad = ctx.createLinearGradient(0, 0, width, heightPx);
        grad.addColorStop(0, '#0284C7');
        grad.addColorStop(1, '#0369A1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, heightPx);
      } else if (type === 'glitter') {
        const grad = ctx.createLinearGradient(0, 0, width, heightPx);
        grad.addColorStop(0, '#4C1D95');
        grad.addColorStop(1, '#701A75');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, heightPx);
      } else if (type === 'bubbles') {
        const grad = ctx.createLinearGradient(0, 0, width, heightPx);
        grad.addColorStop(0, '#0284C7');
        grad.addColorStop(1, '#6D28D9');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, heightPx);
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, heightPx);
        grad.addColorStop(0, '#D97706');
        grad.addColorStop(1, '#BE185D');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, heightPx);
      }

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > heightPx) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (type === 'glitter') {
          // Sparkle shine lines
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.radius - 2, p.y);
          ctx.lineTo(p.x + p.radius + 2, p.y);
          ctx.moveTo(p.x, p.y - p.radius - 2);
          ctx.lineTo(p.x, p.y + p.radius + 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, height]);

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white/90 group cursor-pointer"
      style={{ height: `${height}px` }}
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
        <span className="text-xs font-black uppercase tracking-wider text-cyan-300">INTERACTIVE CALM</span>
        <h4 className="font-black text-2xl" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          {title}
        </h4>
      </div>
    </div>
  );
}
