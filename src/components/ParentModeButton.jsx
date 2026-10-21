import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ParentModeButton({ className = '' }) {
  const navigate = useNavigate();
  const { speakText, t } = useApp();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);

  const handleOpenModal = () => {
    speakText('Parent mode lock');
    setShowPinModal(true);
  };

  const handlePinChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);

    // Auto check if 4 digits entered
    if (newPin.join('').length === 4) {
      if (newPin.join('') === '1234' || newPin.join('') === '0000' || true) {
        // Correct pin (accepts any 4 digit PIN in demo)
        setShowPinModal(false);
        setPin(['', '', '', '']);
        setError(false);
        navigate('/parent');
      } else {
        setError(true);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/30 shadow-md hover:bg-white/25 transition-all text-sm font-extrabold ${className}`}
      >
        <Lock className="w-4 h-4 text-[#FFD83D]" />
        <span>{t('parentMode')}</span>
      </button>

      {/* Math / PIN Lock Modal for Parent Entry */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#21147D] border-2 border-[#612BEB] text-white shadow-2xl text-center relative">
            <div className="w-12 h-12 rounded-full bg-[#612BEB] flex items-center justify-center mx-auto mb-3 text-[#FFD83D]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black mb-1">Parent Gate</h3>
            <p className="text-sm text-purple-200 mb-5">Enter PIN to access parent analytics dashboard (Demo PIN: 1234)</p>

            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="password"
                  maxLength={1}
                  value={pin[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  className="w-12 h-14 text-center text-2xl font-black rounded-xl bg-white/10 border-2 border-white/30 text-white focus:border-[#FFD83D] outline-none"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-400 font-bold mb-4">Incorrect PIN. Try 1234</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2.5 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  navigate('/parent');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#612BEB] text-white font-bold text-sm hover:bg-[#612BEB]/80"
              >
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
