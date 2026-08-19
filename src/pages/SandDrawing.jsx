import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';
import { playBubblePop, playButton } from '../utils/sounds';

// ── 1. NEON COLOR PALETTE ──
const NEON_COLORS = [
  { name: 'Pink', hex: '#FF2BD6', glow: '#FF2BD6', border: '#FF70E4' },
  { name: 'Yellow', hex: '#FFF500', glow: '#FFF500', border: '#FFFA66' },
  { name: 'Cyan', hex: '#00E5FF', glow: '#00E5FF', border: '#66F0FF' },
  { name: 'Purple', hex: '#8A2BFF', glow: '#8A2BFF', border: '#B870FF' },
  { name: 'Green', hex: '#39FF14', glow: '#39FF14', border: '#7CFF66' },
  { name: 'Orange', hex: '#FF6A00', glow: '#FF6A00', border: '#FF9E54' }
];

// ── 2. NEON VECTOR STAMPS DEFINITIONS ──
const NEON_STAMPS = [
  { id: 'star', label: 'Neon Star', color: '#FFF500', glow: '#FFF500', stroke: '#FF9D2E' },
  { id: 'heart', label: 'Neon Heart', color: '#FF2BD6', glow: '#FF2BD6', stroke: '#99007A' },
  { id: 'flower', label: 'Neon Flower', color: '#00E5FF', glow: '#00E5FF', stroke: '#FF2BD6' },
  { id: 'butterfly', label: 'Neon Butterfly', color: '#8A2BFF', glow: '#8A2BFF', stroke: '#00E5FF' }
];

export default function SandDrawing() {
  const navigate = useNavigate();
  const { soundEnabled, speakText, reducedMotion } = useApp();

  const canvasRef = useRef(null);

  // Stable Drawing State Refs to avoid state re-render resets
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const [selectedColor, setSelectedColor] = useState(NEON_COLORS[0]);
  const [selectedStamp, setSelectedStamp] = useState(null); // null = brush mode
  const [brushSize] = useState(8); // THIN BRUSH CORE REQUIREMENT: 8px default
  const [showClearModal, setShowClearModal] = useState(false);
  const [stampParticles, setStampParticles] = useState([]);

  const selectedColorRef = useRef(selectedColor);
  const selectedStampRef = useRef(selectedStamp);
  const brushSizeRef = useRef(brushSize);

  useEffect(() => { selectedColorRef.current = selectedColor; }, [selectedColor]);
  useEffect(() => { selectedStampRef.current = selectedStamp; }, [selectedStamp]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);

  // Speak voice prompt ONCE on activity load (Silent UI during drawing/selection)
  useEffect(() => {
    speakText('Draw something magical in the sand!');
  }, []);

  // Helper: Draw Deep Black Sand Base Texture (#07070D to #0D0D17)
  const drawBlackSandBase = (ctx, width, height) => {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#07070D');
    grad.addColorStop(0.5, '#0A0A12');
    grad.addColorStop(1, '#0D0D17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle dark sand specks
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const opacity = Math.random() * 0.08 + 0.02;
      ctx.fillStyle = Math.random() > 0.5 ? `rgba(138, 43, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, y, Math.random() * 2 + 1, Math.random() * 2 + 1);
    }
  };

  // ── CANVAS RESIZE HANDLER (Fills 90–95% of desktop viewport) ──
  const setupCanvasDimensions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    // Responsive Canvas Height: ~calc(100vh - 130px) on Desktop
    const availableHeight = Math.max(480, window.innerHeight - 140);
    const availableWidth = container.clientWidth;

    if (canvas.width !== availableWidth || canvas.height !== availableHeight) {
      canvas.width = availableWidth;
      canvas.height = availableHeight;
      drawBlackSandBase(ctx, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    setupCanvasDimensions();
    window.addEventListener('resize', setupCanvasDimensions);
    return () => window.removeEventListener('resize', setupCanvasDimensions);
  }, []);

  // ── TWO-PASS CONTINUOUS NEON STROKE SEGMENT RENDERER (Thin 8px core) ──
  const drawStrokeSegment = (ctx, x1, y1, x2, y2, color, size) => {
    // PASS 1: Outer Neon Halo / Glow (Color glow, opacity ~0.25)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color.hex;
    ctx.lineWidth = size * 2.2; // ~17.6px halo
    ctx.globalAlpha = 0.28;
    ctx.shadowColor = color.glow;
    ctx.shadowBlur = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // PASS 2: Thin Bright Neon Core (Matching neon color, NOT oversized white tube!)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color.hex; // Uses selected neon color!
    ctx.lineWidth = size; // ~8px core
    ctx.globalAlpha = 0.95;
    ctx.shadowColor = color.glow;
    ctx.shadowBlur = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Slight soft center highlight
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(2, size * 0.3); // Thin 2.4px center highlight
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.restore();
  };

  // ── HIGH-VISIBILITY VECTOR SVG CANVAS STAMP DRAWING FUNCTIONS ──
  const drawNeonStarOnCanvas = (ctx, cx, cy, radius = 32) => {
    ctx.save();
    // Glowing Halo
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

    // Stroke outline
    ctx.strokeStyle = '#FF9D2E';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Lighter center star highlight
    ctx.fillStyle = '#FFFFB3';
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? radius * 0.5 : radius * 0.22;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawNeonHeartOnCanvas = (ctx, cx, cy, size = 30) => {
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

    // Lighter highlight
    ctx.fillStyle = '#FFA6EA';
    ctx.beginPath();
    ctx.arc(cx - size * 0.35, topY + size * 0.3, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawNeonFlowerOnCanvas = (ctx, cx, cy, radius = 28) => {
    ctx.save();
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 22;
    ctx.fillStyle = '#00E5FF';

    // 5 Petals
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5;
      const px = cx + radius * 0.65 * Math.cos(angle);
      const py = cy + radius * 0.65 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center Core
    ctx.shadowColor = '#FF2BD6';
    ctx.fillStyle = '#FF2BD6';
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  const drawNeonButterflyOnCanvas = (ctx, cx, cy, size = 30) => {
    ctx.save();
    ctx.shadowColor = '#8A2BFF';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#8A2BFF';

    // Left Wing
    ctx.beginPath();
    ctx.ellipse(cx - size * 0.6, cy - size * 0.2, size * 0.55, size * 0.4, -Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(cx - size * 0.5, cy + size * 0.3, size * 0.4, size * 0.3, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.ellipse(cx + size * 0.6, cy - size * 0.2, size * 0.55, size * 0.4, Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(cx + size * 0.5, cy + size * 0.3, size * 0.4, size * 0.3, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Body & Antennae
    ctx.fillStyle = '#00E5FF';
    ctx.shadowColor = '#00E5FF';
    ctx.beginPath();
    ctx.ellipse(cx, cy, size * 0.12, size * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // ── POINTER DOWN HANDLER ──
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    if (selectedStampRef.current) {
      // --- VECTOR STAMP PLACEMENT ---
      playBubblePop(soundEnabled);

      const stamp = selectedStampRef.current;
      if (stamp.id === 'star') drawNeonStarOnCanvas(ctx, x, y, 32);
      else if (stamp.id === 'heart') drawNeonHeartOnCanvas(ctx, x, y, 28);
      else if (stamp.id === 'flower') drawNeonFlowerOnCanvas(ctx, x, y, 28);
      else if (stamp.id === 'butterfly') drawNeonButterflyOnCanvas(ctx, x, y, 28);

      // Particle Burst
      if (!reducedMotion) {
        const particleId = Math.random().toString();
        setStampParticles((prev) => [...prev, { id: particleId, x, y, color: stamp.color }]);
        setTimeout(() => {
          setStampParticles((prev) => prev.filter((p) => p.id !== particleId));
        }, 600);
      }
    } else {
      // --- CONTINUOUS DRAWING START ---
      isDrawingRef.current = true;
      lastPointRef.current = { x, y };
      drawStrokeSegment(ctx, x, y, x, y, selectedColorRef.current, brushSizeRef.current);
    }
  };

  // ── POINTER MOVE HANDLER (Interpolated linear path compensation) ──
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

    const distance = Math.hypot(currentX - prevX, currentY - prevY);

    // Linear interpolation for fast movement compensation (step every 3px)
    const steps = Math.max(1, Math.ceil(distance / 3));
    let startX = prevX;
    let startY = prevY;

    for (let i = 1; i <= steps; i++) {
      const nextX = prevX + ((currentX - prevX) * i) / steps;
      const nextY = prevY + ((currentY - prevY) * i) / steps;

      drawStrokeSegment(ctx, startX, startY, nextX, nextY, selectedColorRef.current, brushSizeRef.current);

      startX = nextX;
      startY = nextY;
    }

    lastPointRef.current = { x: currentX, y: currentY };
  };

  // Pointer Up & Cancel
  const handlePointerUp = (e) => {
    isDrawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Clear Canvas Handler
  const handleConfirmClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawBlackSandBase(ctx, canvas.width, canvas.height);
    }
    setShowClearModal(false);
    playButton(soundEnabled);
  };

  return (
    <MagicalBackground>
      <TopBar />

      {/* ── FULL-WIDTH CANVAS LAYOUT (Occupy 90–95% Screen Area, 20px Margins) ── */}
      <main className="w-[calc(100vw-40px)] mx-auto px-0 pt-2 pb-5 flex flex-col items-center select-none max-w-none">

        {/* ── COMPACT TOOLBAR (Colors, Stamps, Reset Sand) ── */}
        <div className="w-full p-3 rounded-2xl bg-[#0D0D17]/90 backdrop-blur-2xl border-2 border-[#8A2BFF]/50 flex flex-wrap items-center justify-between gap-3 mb-3 shadow-[0_10px_30px_rgba(138,43,255,0.3)]">

          {/* Left: Exit & Activity Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playButton(soundEnabled);
                navigate('/activities');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white font-extrabold text-xs hover:bg-white/20 transition-all border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Activities</span>
            </button>
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#FF2BD6] via-[#8A2BFF] to-[#00E5FF] text-white font-black text-xs uppercase tracking-wider border border-white/40">
              ✨ Neon Black Sand Sandbox
            </span>
          </div>

          {/* Center: NEON COLORS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-purple-200 uppercase tracking-wide mr-1 hidden sm:inline">
              Color:
            </span>
            <div className="flex items-center gap-2">
              {NEON_COLORS.map((color) => {
                const isSelected = selectedColor.hex === color.hex && !selectedStamp;
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      playButton(soundEnabled);
                      setSelectedColor(color);
                      setSelectedStamp(null);
                    }}
                    title={color.name}
                    style={{
                      borderColor: color.border,
                      boxShadow: isSelected ? `0 0 18px ${color.glow}, inset 0 0 8px #FFFFFF` : `0 0 6px ${color.glow}44`
                    }}
                    className={`w-8 h-8 rounded-full bg-[#07070D] border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                      isSelected ? 'scale-125 border-white z-10' : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Right: NEON VECTOR STAMPS SELECTOR */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-purple-200 uppercase tracking-wide mr-1 hidden sm:inline">
              Stamps:
            </span>
            {NEON_STAMPS.map((stamp) => {
              const isSelected = selectedStamp?.id === stamp.id;
              return (
                <button
                  key={stamp.id}
                  onClick={() => {
                    playButton(soundEnabled);
                    setSelectedStamp(stamp);
                  }}
                  title={stamp.label}
                  style={{
                    boxShadow: isSelected ? `0 0 16px ${stamp.color}` : 'none'
                  }}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#171062] border-white text-white scale-110'
                      : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {/* SVG Icon Representation */}
                  {stamp.id === 'star' && <span className="text-yellow-300 drop-shadow-[0_0_6px_#FFF500]">⭐</span>}
                  {stamp.id === 'heart' && <span className="text-pink-400 drop-shadow-[0_0_6px_#FF2BD6]">💖</span>}
                  {stamp.id === 'flower' && <span className="text-cyan-300 drop-shadow-[0_0_6px_#00E5FF]">🌸</span>}
                  {stamp.id === 'butterfly' && <span className="text-purple-300 drop-shadow-[0_0_6px_#8A2BFF]">🦋</span>}
                </button>
              );
            })}
          </div>

          {/* Right: RESET SAND BUTTON */}
          <button
            onClick={() => {
              playButton(soundEnabled);
              setShowClearModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/40 text-white font-extrabold text-xs hover:bg-black/60 transition-all border-2 border-[#8A2BFF] shadow-[0_0_12px_rgba(138,43,255,0.4)]"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Reset Sand</span>
          </button>
        </div>

        {/* ── LARGE BLACK MAGIC SAND BOARD (Width 100%, Height calc(100vh-130px)) ── */}
        <div
          className="w-full rounded-[28px] overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(138,43,255,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #8A2BFF 0%, #00E5FF 50%, #FF2BD6 100%)',
            padding: '3px'
          }}
        >
          <div className="w-full rounded-[25px] overflow-hidden bg-[#07070D] relative">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ touchAction: 'none' }}
              className="w-full block cursor-crosshair"
            />

            {/* Neon Stamp Particle Bursts */}
            {!reducedMotion && stampParticles.map((s) => (
              <div key={s.id} className="absolute pointer-events-none z-30" style={{ top: s.y, left: s.x }}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((deg * Math.PI) / 180) * 45,
                      y: Math.sin((deg * Math.PI) / 180) * 45,
                      opacity: 0,
                      scale: 0.2
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute w-3 h-3 rounded-full shadow-lg"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}` }}
                  />
                ))}
              </div>
            ))}

            {/* LUMI MASCOT (Positioned in Bottom Right, Outside Main Center Drawing Path) */}
            <div className="absolute bottom-3 right-3 z-30 pointer-events-auto filter drop-shadow-[0_0_15px_rgba(255,216,61,0.6)]">
              <LumiCharacter
                expression="happy"
                size="sm"
                message="Draw something magical! ✨"
              />
            </div>
          </div>
        </div>

        {/* ── RESET CONFIRMATION MODAL ── */}
        <AnimatePresence>
          {showClearModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="w-full max-w-sm p-6 rounded-[32px] bg-[#0D0D17] border-3 border-[#8A2BFF] text-center text-white shadow-[0_20px_50px_rgba(138,43,255,0.5)] relative"
              >
                <div className="w-14 h-14 rounded-full bg-[#8A2BFF]/30 border-2 border-[#8A2BFF] flex items-center justify-center mx-auto mb-4 text-[#00E5FF]">
                  <RotateCcw className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-black text-white mb-2">Clear Magical Sand?</h3>
                <p className="text-sm font-bold text-purple-200 mb-6">
                  Smooth out your glowing neon drawing to start a new artwork!
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      playButton(soundEnabled);
                      setShowClearModal(false);
                    }}
                    className="flex-1 py-3 rounded-full bg-white/10 text-white font-extrabold text-sm hover:bg-white/20 transition-all border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmClear}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#FF2BD6] to-[#8A2BFF] text-white font-black text-sm shadow-lg border border-white/40 hover:scale-105 transition-all"
                  >
                    Clear Sand
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </MagicalBackground>
  );
}
