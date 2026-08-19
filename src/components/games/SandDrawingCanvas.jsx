import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';

const NEON_COLORS = [
  { id: 'pink', hex: '#FF2BD6', name: 'Neon Pink' },
  { id: 'yellow', hex: '#FFF500', name: 'Neon Yellow' },
  { id: 'cyan', hex: '#00E5FF', name: 'Neon Cyan' },
  { id: 'purple', hex: '#8A2BFF', name: 'Neon Purple' },
  { id: 'green', hex: '#39FF14', name: 'Neon Green' },
  { id: 'orange', hex: '#FF6A00', name: 'Neon Orange' }
];

const STAMPS = [
  { id: 'star-stamp', label: 'Star Stamp', symbol: '⭐', color: '#FFF500' },
  { id: 'heart-stamp', label: 'Heart Stamp', symbol: '💖', color: '#FF2BD6' },
  { id: 'flower-stamp', label: 'Flower Stamp', symbol: '🌸', color: '#00E5FF' },
  { id: 'butterfly-stamp', label: 'Butterfly Stamp', symbol: '🦋', color: '#8A2BFF' }
];

export default function SandDrawingCanvas({ onBack }) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [selectedStamp, setSelectedStamp] = useState(null);

  const selectedColorRef = useRef(selectedColor);
  const selectedStampRef = useRef(selectedStamp);

  useEffect(() => { selectedColorRef.current = selectedColor; }, [selectedColor]);
  useEffect(() => { selectedStampRef.current = selectedStamp; }, [selectedStamp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight || 500;
    drawBlackSandBase(ctx, canvas.width, canvas.height);
  }, []);

  const drawBlackSandBase = (ctx, width, height) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#07070D');
    grad.addColorStop(0.5, '#0A0A12');
    grad.addColorStop(1, '#0D0D17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(138, 43, 255, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }
  };

  const drawStrokeSegment = (ctx, x1, y1, x2, y2, color) => {
    // Outer Glow
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color.hex;
    ctx.lineWidth = 18;
    ctx.globalAlpha = 0.28;
    ctx.shadowColor = color.hex;
    ctx.shadowBlur = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // Thin Core (8px)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color.hex;
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = color.hex;
    ctx.shadowBlur = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.restore();
  };

  const drawNeonStarOnCanvas = (ctx, cx, cy, radius = 32) => {
    ctx.save();
    ctx.shadowColor = '#FFF500';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#FFF500';

    const points = 5;
    const inset = 0.45;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * inset;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FF9D2E';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  };

  const drawNeonHeartOnCanvas = (ctx, cx, cy, size = 28) => {
    ctx.save();
    ctx.shadowColor = '#FF2BD6';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#FF2BD6';
    ctx.strokeStyle = '#99007A';
    ctx.lineWidth = 3;

    ctx.beginPath();
    const topY = cy - size * 0.4;
    ctx.moveTo(cx, cy + size * 0.7);
    ctx.bezierCurveTo(cx - size * 1.2, cy + size * 0.1, cx - size * 1.2, topY, cx, topY + size * 0.3);
    ctx.bezierCurveTo(cx + size * 1.2, topY, cx + size * 1.2, cy + size * 0.1, cx, cy + size * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}

    if (selectedStampRef.current) {
      soundManager.playPop();
      if (selectedStampRef.current.id === 'star-stamp') drawNeonStarOnCanvas(ctx, x, y, 32);
      else drawNeonHeartOnCanvas(ctx, x, y, 28);
    } else {
      isDrawingRef.current = true;
      lastPointRef.current = { x, y };
      drawStrokeSegment(ctx, x, y, x, y, selectedColorRef.current);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || selectedStampRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const prevX = lastPointRef.current.x;
    const prevY = lastPointRef.current.y;

    const dist = Math.hypot(currentX - prevX, currentY - prevY);
    const steps = Math.max(1, Math.ceil(dist / 3));
    let startX = prevX;
    let startY = prevY;

    for (let i = 1; i <= steps; i++) {
      const nextX = prevX + ((currentX - prevX) * i) / steps;
      const nextY = prevY + ((currentY - prevY) * i) / steps;

      drawStrokeSegment(ctx, startX, startY, nextX, nextY, selectedColorRef.current);

      startX = nextX;
      startY = nextY;
    }

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = (e) => {
    isDrawingRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  const handleClearSand = () => {
    soundManager.playPop();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawBlackSandBase(ctx, canvas.width, canvas.height);
  };

  return (
    <div className="relative min-h-screen w-full select-none text-white p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-[#171062] via-[#21147D] to-[#3820A8]">
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={() => { soundManager.playTap(); if (onBack) onBack(); }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-black text-xs flex items-center gap-2 border border-white/40 shadow-md"
        >
          <ArrowLeft size={18} />
          <span>← BACK TO WORLD</span>
        </button>

        <div className="px-5 py-2 bg-[#8A2BFF] text-white rounded-full font-black text-sm shadow-lg border-2 border-white flex items-center gap-2">
          <span>✨</span>
          <span>NEON BLACK SANDBOX</span>
        </div>

        <button
          onClick={handleClearSand}
          className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white font-black text-xs rounded-full shadow-md border-2 border-[#8A2BFF] flex items-center gap-1.5"
        >
          <RotateCcw size={16} />
          <span>REFILL SAND</span>
        </button>
      </div>

      <div className="relative z-10 my-2 flex-1 w-full max-w-none rounded-[36px] border-4 border-[#8A2BFF] shadow-[0_20px_50px_rgba(138,43,255,0.4)] overflow-hidden bg-[#07070D]">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none' }}
          className="w-full h-full block cursor-crosshair"
        />
        <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
          <LumiMascot state="cheering" size="sm" speechText="Draw with glowing neon sand! ✨" />
        </div>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto w-full bg-[#0D0D17]/90 backdrop-blur-2xl p-3 rounded-full border-4 border-[#8A2BFF]/60 shadow-2xl flex items-center justify-around">
        <div className="flex items-center gap-2">
          {NEON_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedColor(c); setSelectedStamp(null); }}
              className={`w-9 h-9 rounded-full border-2 transition-transform ${selectedColor.id === c.id && !selectedStamp ? 'scale-125 border-white shadow-lg' : 'border-transparent'}`}
              style={{ backgroundColor: c.hex, boxShadow: `0 0 12px ${c.hex}` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
