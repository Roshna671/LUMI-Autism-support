import React from 'react';
import { Download, Share2, FileText, CheckCircle2, User, Calendar, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

export default function TherapyReport({ profile = { name: 'Aarav', age: 4, condition: 'Both' } }) {
  
  const handlePrintPDF = () => {
    soundManager.playFanfare();
    window.print();
  };

  return (
    <div className="min-h-full w-full text-white p-4 sm:p-6 flex flex-col gap-4 select-none">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900">Clinical Therapy Summary Report</h2>
          <p className="text-xs text-slate-500 font-semibold">Generated for Speech & Developmental Therapist Review</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Download Clinical PDF
          </button>
        </div>
      </div>

      {/* Report Document Content (Printable Layout) */}
      <div className="flex-1 my-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 overflow-y-auto text-xs">
        
        {/* Child Patient Info Header */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">{profile.name} (Age {profile.age})</h3>
            <p className="text-slate-500 font-bold">Primary Focus: {profile.condition} Adaptive Support</p>
          </div>
          <div className="text-right">
            <span className="font-extrabold text-purple-700">LUMI Clinical ID: #LM-8942</span>
            <p className="text-slate-400 font-semibold">Date: August 2026</p>
          </div>
        </div>

        {/* Clinical Summary Section */}
        <div>
          <h4 className="font-black text-sm text-slate-900 mb-1">1. Executive Summary & Progress</h4>
          <p className="text-slate-600 leading-relaxed font-semibold">
            During the past 14 days, {profile.name} engaged in 28 home therapy sessions spanning Eye Contact Hold, Speech Sound Pacing, and Sensory Regulation. Eye contact hold duration increased by <strong>+1.8 seconds (150% gain)</strong>, showing significant improvement in visual tracking stability.
          </p>
        </div>

        {/* Analytics Snapshot */}
        <div className="grid grid-cols-3 gap-2.5 p-3 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="text-center">
            <span className="text-slate-500 font-bold block text-[10px]">Eye Contact Avg</span>
            <strong className="text-sm font-black text-purple-900">4.2s Hold</strong>
          </div>
          <div className="text-center border-x border-purple-200">
            <span className="text-slate-500 font-bold block text-[10px]">Speech Accuracy</span>
            <strong className="text-sm font-black text-teal-900">89% Match</strong>
          </div>
          <div className="text-center">
            <span className="text-slate-500 font-bold block text-[10px]">Sensory Calming</span>
            <strong className="text-sm font-black text-amber-900">92% Regulated</strong>
          </div>
        </div>

        {/* Speech Recordings Log */}
        <div>
          <h4 className="font-black text-sm text-slate-900 mb-2">2. Speech Audio Recordings Log</h4>
          <div className="space-y-2">
            {[
              { word: 'Ba Sound Practice', date: 'Aug 14', score: '3 Stars (Excellent)' },
              { word: 'Ma Sound Practice', date: 'Aug 13', score: '2 Stars (Great)' },
              { word: 'Water Paced Word', date: 'Aug 12', score: '3 Stars (Excellent)' }
            ].map((rec, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between font-bold">
                <span className="text-slate-800">{rec.word}</span>
                <span className="text-slate-400">{rec.date}</span>
                <span className="text-emerald-700">{rec.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Therapist Notes Section */}
        <div>
          <h4 className="font-black text-sm text-slate-900 mb-1">3. Therapist Clinical Notes</h4>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-slate-800">
            "Aarav shows exceptional responsiveness to positive reinforcement and visual firefly cues. Recommend continuing 5-minute eye-contact hold sessions twice daily."
          </div>
        </div>
      </div>
    </div>
  );
}
