"use client";

import { Lock, Rocket, ArrowRight, Sparkles, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

interface PremiumOverlayProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onUpgrade?: () => void;
}

export function PremiumOverlay({
  title = "Premium Feature",
  description = "Upgrade to Premium to unlock all specialized power tools.",
  buttonText = "Upgrade to Premium",
  onUpgrade,
}: PremiumOverlayProps) {
  return (
    <div className="absolute inset-x-0 inset-y-[-2rem] z-20 flex items-center justify-center p-6 bg-white/60 backdrop-blur-xl rounded-[40px] transition-all duration-700 border border-white">
      <div className="relative bg-white/80 p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] text-center max-w-2xl w-full mx-auto transform transition-all duration-500 hover:scale-[1.01]">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 space-y-10">
          {/* Header matching the Tool Card style */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Lock className="text-white fill-white/10" size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic text-left">
                {title}
              </h2>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
              Premium
            </div>
          </div>

          <div className="space-y-6 max-w-lg mx-auto">
            <p className="text-lg text-gray-500 font-medium leading-relaxed px-4">
              {description}
            </p>
          
            <button
              onClick={onUpgrade}
              className="group relative w-full h-16 inline-flex items-center justify-center gap-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all shadow-xl shadow-indigo-500/20 overflow-hidden uppercase tracking-widest"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {buttonText}
              <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-8 pt-2">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <ShieldCheck size={16} className="text-emerald-500" />
                Risk-free
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                <Clock size={16} className="text-indigo-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
