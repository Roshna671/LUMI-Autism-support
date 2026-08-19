import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Pause, Play, Maximize2, Repeat, Volume2, Sparkles } from 'lucide-react';
import PageContainer from '../PageContainer';
import CompanionMascot from '../CompanionMascot';
import { soundManager } from '../../utils/soundManager';

const SENSORY_THUMBNAILS = [
  { id: 'going-ball', title: 'Going Ball Run ⚽', subtitle: 'Satisfying Run', icon: '⚽', color: 'from-blue-400 to-indigo-600' },
  { id: 'ripples', title: 'Water Ripples 🌊', subtitle: 'Ocean Surface', icon: '🌊', color: 'from-cyan-400 to-blue-500' },
  { id: 'bubbles', title: 'Bubble World 🫧', subtitle: 'Shimmer Bubbles', icon: '🫧', color: 'from-purple-400 to-pink-500' },
  { id: 'sand', title: 'Kinetic Sand 🏖️', subtitle: 'Soft Sand Flow', icon: '🏖️', color: 'from-amber-400 to-orange-500' },
  { id: 'glitter', title: 'Glitter Bottle ✨', subtitle: 'Golden Dust', icon: '✨', color: 'from-pink-400 to-yellow-400' },
  { id: 'clouds', title: 'Cloud Drift ☁️', subtitle: 'Peaceful Sky', icon: '☁️', color: 'from-sky-400 to-indigo-400' }
];

export default function SensoryCalm({ onBack }) {
  const [activeExp, setActiveExp] = useState('going-ball');
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef(null);

  // Infinite Canvas Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let frame = 0;

    const render = () => {
      if (isPlaying) frame++;
      const width = (canvas.width = canvas.parentElement.clientWidth);
      const height = (canvas.height = canvas.parentElement.clientHeight);

      ctx.clearRect(0, 0, width, height);

      if (activeExp === 'going-ball') {
        // Dreamy Sky Background Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
        skyGrad.addColorStop(0, '#C4B5FD');
        skyGrad.addColorStop(0.5, '#F9A8D4');
        skyGrad.addColorStop(1, '#93C5FD');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // 3D Perspective Track
        const horizonY = height * 0.35;
        const trackTopW = width * 0.3;
        const trackTopX = (width - trackTopW) / 2;

        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.moveTo(trackTopX, horizonY);
        ctx.lineTo(trackTopX + trackTopW, horizonY);
        ctx.lineTo(width * 0.9, height);
        ctx.lineTo(width * 0.1, height);
        ctx.closePath();
        ctx.fill();

        // Yellow Edge Stripes
        ctx.fillStyle = '#FFD84D';
        ctx.beginPath();
        ctx.moveTo(trackTopX, horizonY);
        ctx.lineTo(trackTopX + 15, horizonY);
        ctx.lineTo(width * 0.15, height);
        ctx.lineTo(width * 0.1, height);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(trackTopX + trackTopW - 15, horizonY);
        ctx.lineTo(trackTopX + trackTopW, horizonY);
        ctx.lineTo(width * 0.9, height);
        ctx.lineTo(width * 0.85, height);
        ctx.closePath();
        ctx.fill();

        // Moving Track Markings
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -frame * 2.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, horizonY);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Reflective Silver Metallic Sphere
        const ballX = width / 2 + Math.sin(frame * 0.03) * 35;
        const ballY = height * 0.7;
        const ballR = 40;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(ballX, ballY + ballR * 0.7, ballR * 0.8, ballR * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Metallic Shading
        const ballGrad = ctx.createRadialGradient(
          ballX - ballR * 0.3,
          ballY - ballR * 0.3,
          ballR * 0.1,
          ballX,
          ballY,
          ballR
        );
        ballGrad.addColorStop(0, '#FFFFFF');
        ballGrad.addColorStop(0.3, '#E2E8F0');
        ballGrad.addColorStop(0.7, '#64748B');
        ballGrad.addColorStop(1, '#1E293B');

        ctx.beginPath();
        ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2);
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
      } else {
        // Water / Ripple / Canvas simulation fallback
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 15; i++) {
          const r = ((frame * 2 + i * 40) % 200) + 10;
          ctx.strokeStyle = `rgba(255,255,255,${1 - r / 210})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc((width / 15) * (i + 0.5), height / 2 + Math.sin(frame * 0.05 + i) * 30, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeExp, isPlaying]);

  return (
    <PageContainer>
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-6 z-20">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} /> ← Back to World
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 text-[#45208F] font-black text-xs uppercase tracking-wider border border-white">
          <span>Sensory Calm Zone ✨ Relax • Focus • Self-regulate</span>
        </div>
      </div>

      {/* Main Video / Game Simulation Container (Image 1 Bottom Left Layout) */}
      <div className="relative w-full h-[420px] rounded-[36px] bg-white/40 backdrop-blur-2xl border-4 border-white shadow-2xl overflow-hidden mb-6 z-10 flex flex-col justify-between p-4">
        
        {/* Top Video Overlay HUD */}
        <div className="relative z-20 flex items-center justify-between w-full">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-white/80 hover:bg-white text-[#45208F] shadow-md transition-transform hover:scale-105"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <span className="px-4 py-1.5 rounded-full bg-white/80 text-[#45208F] font-black text-sm shadow-md" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {SENSORY_THUMBNAILS.find((t) => t.id === activeExp)?.title || 'Going Ball Satisfying Run'}
          </span>

          <div className="flex items-center gap-2">
            <button className="p-3 rounded-full bg-white/80 hover:bg-white text-[#45208F] shadow-md">
              <Repeat size={18} />
            </button>
            <button className="p-3 rounded-full bg-white/80 hover:bg-white text-[#45208F] shadow-md">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>

        {/* Canvas Simulation */}
        <div className="absolute inset-0 z-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Bottom Loop Badge */}
        <div className="relative z-20 flex justify-between items-center w-full px-2">
          <span className="text-xs font-black text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
            Going Ball Satisfying Run
          </span>
          <span className="text-xs font-black text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
            ∞ Loop
          </span>
        </div>
      </div>

      {/* Carousel of Sensory Tiles (Image 1 Bottom Left) */}
      <div className="w-full z-10">
        <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED] block mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
          SENSORY EXPERIENCES
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SENSORY_THUMBNAILS.map((tile) => {
            const isSelected = activeExp === tile.id;
            return (
              <div
                key={tile.id}
                onClick={() => {
                  soundManager.playPop();
                  setActiveExp(tile.id);
                }}
                className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-white border-[#FF5FA2] shadow-2xl scale-105 ring-4 ring-pink-300'
                    : 'bg-white/70 hover:bg-white border-white text-[#45208F] shadow-md hover:-translate-y-1'
                }`}
              >
                <div className="text-3xl my-2">{tile.icon}</div>
                <div>
                  <h5 className="font-black text-sm text-[#45208F] leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {tile.title}
                  </h5>
                  <span className="text-[10px] font-bold text-purple-800 block mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {tile.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </PageContainer>
  );
}
