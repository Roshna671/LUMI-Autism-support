import React, { useState } from 'react';
import { Lock, X, Check, KeyRound } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

export default function ParentLockModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('math');

  if (!isOpen) return null;

  const num1 = 5, num2 = 3, expectedMath = 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playTap();
    if (mode === 'math') {
      if (parseInt(mathAnswer, 10) === expectedMath) {
        soundManager.playFanfare();
        onSuccess(); onClose(); setMathAnswer(''); setError('');
      } else { soundManager.playPop(); setError('Incorrect! Please try again.'); }
    } else {
      if (pin === '1234' || pin.length === 4) {
        soundManager.playFanfare();
        onSuccess(); onClose(); setPin(''); setError('');
      } else { setError('Enter 4 digits to unlock.'); }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-3xl relative animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #1A0845, #2D1065)',
          border: '2px solid rgba(167,139,250,0.4)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.3)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#C4B5FD' }}
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #9333EA)', boxShadow: '0 4px 16px rgba(109,40,217,0.5)' }}
          >
            <Lock size={28} className="text-white" />
          </div>
          <h3 className="font-black text-white" style={{ fontSize: '20px', fontFamily: "'Baloo 2', sans-serif" }}>
            Grown-Up Verification
          </h3>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#C4B5FD' }}>
            Solve this quick check to switch to Parent Portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'math' ? (
            <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(167,139,250,0.3)' }}>
              <label className="block text-sm font-bold mb-2" style={{ color: '#E9D5FF' }}>
                What is {num1} + {num2} ?
              </label>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Enter total"
                autoFocus
                className="w-full text-center font-black py-3 px-4 rounded-xl"
                style={{
                  fontSize: '24px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '2px solid rgba(167,139,250,0.5)',
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
            </div>
          ) : (
            <div className="p-4 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(167,139,250,0.3)' }}>
              <label className="block text-sm font-bold mb-2" style={{ color: '#E9D5FF' }}>
                Enter 4-Digit Parent PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full text-center font-black py-3 px-4 rounded-xl tracking-widest"
                style={{
                  fontSize: '24px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '2px solid rgba(167,139,250,0.5)',
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {error && (
            <p className="text-xs font-bold text-center" style={{ color: '#FCA5A5' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full btn-lumi-purple"
            style={{ justifyContent: 'center', width: '100%', borderRadius: '16px', padding: '14px' }}
          >
            <Check size={18} /> Unlock Parent Dashboard
          </button>
        </form>

        <div className="mt-4 pt-3 flex justify-between text-xs" style={{ borderTop: '1px solid rgba(167,139,250,0.2)' }}>
          <button
            type="button"
            onClick={() => setMode(mode === 'math' ? 'pin' : 'math')}
            className="flex items-center gap-1 font-bold"
            style={{ color: '#A78BFA' }}
          >
            <KeyRound size={13} /> Use {mode === 'math' ? 'PIN' : 'Math Question'}
          </button>
          <span style={{ color: '#7C6BB5' }}>Default PIN: 1234</span>
        </div>
      </div>
    </div>
  );
}
