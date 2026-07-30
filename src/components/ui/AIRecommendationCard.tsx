'use client';

import React, { useState } from 'react';
import { TableItem, AIRecommendationResult } from '@/lib/types';
import { recommendTables } from '@/lib/aiEngine';
import { Sparkles, Heart, Volume2, Eye, GlassWater, Users, CheckCircle } from 'lucide-react';

interface AIRecommendationCardProps {
  tables: TableItem[];
  onApplyRecommendation: (result: AIRecommendationResult) => void;
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  tables,
  onApplyRecommendation
}) => {
  const [guestCount, setGuestCount] = useState(2);
  const [vibe, setVibe] = useState<'romantic' | 'quiet' | 'window' | 'party' | 'bar' | 'family'>('romantic');
  const [lastResult, setLastResult] = useState<AIRecommendationResult | null>(null);

  const handleRecommend = () => {
    const res = recommendTables(tables, guestCount, vibe);
    setLastResult(res);
    onApplyRecommendation(res);
  };

  const vibeOptions = [
    { id: 'romantic', label: 'Romantic Date', icon: Heart, desc: 'Dim lighting & cozy atmosphere' },
    { id: 'window', label: 'Panorama View', icon: Eye, desc: 'Skyline view & natural light' },
    { id: 'quiet', label: 'Quiet Corner', icon: Volume2, desc: 'Private & low-noise seating' },
    { id: 'bar', label: 'Cocktail Bar View', icon: GlassWater, desc: 'Near mixologist counter' },
    { id: 'family', label: 'Family Celebration', icon: Users, desc: 'Spacious booth or large table' }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 p-5 rounded-2xl shadow-xl space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            AI Table Concierge <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">SMART</span>
          </h3>
          <p className="text-xs text-slate-300">Tell us your preferred vibe, and our AI will pick the perfect table for you.</p>
        </div>
      </div>

      {/* Guest Count Selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-300">Party Size:</label>
        <div className="flex gap-1.5">
          {[2, 4, 6, 8, 10].map((num) => (
            <button
              key={num}
              onClick={() => setGuestCount(num)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                guestCount === num
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {vibeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = vibe === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setVibe(opt.id as any)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-xs">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{opt.label}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{opt.desc}</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleRecommend}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" /> Find Best Matching Tables
      </button>

      {/* Last Result Reasoning Box */}
      {lastResult && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 flex items-start gap-2.5 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-white">AI Concierge Pick:</div>
            <div className="mt-0.5">{lastResult.reason}</div>
          </div>
        </div>
      )}
    </div>
  );
};
