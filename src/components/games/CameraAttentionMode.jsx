import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Eye } from 'lucide-react';

export default function CameraAttentionMode({ isEnabled, onToggle }) {
  const videoRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    let localStream = null;

    if (isEnabled) {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((stream) => {
          localStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStreamActive(true);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setStreamActive(false);
        });
    } else {
      setStreamActive(false);
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isEnabled]);

  return (
    <div className="flex flex-col items-end select-none">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-full font-black text-xs border backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md ${
          isEnabled
            ? 'bg-gradient-to-r from-[#2ECC71] to-[#00BFA6] text-white border-white'
            : 'bg-white/15 text-white/90 border-white/30 hover:bg-white/25'
        }`}
      >
        {isEnabled ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
        <span>Camera Mode: {isEnabled ? 'ON' : 'OFF'}</span>
      </button>

      {/* Small Unobtrusive Video Preview Box */}
      {isEnabled && streamActive && (
        <div className="mt-2 w-32 h-24 rounded-2xl border-2 border-white/60 bg-black/60 backdrop-blur-md overflow-hidden relative shadow-xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute bottom-1 left-1 right-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[10px] font-extrabold text-[#2ECC71] text-center flex items-center justify-center gap-1">
            <Eye className="w-2.5 h-2.5" />
            <span>Engaged</span>
          </div>
        </div>
      )}
    </div>
  );
}
