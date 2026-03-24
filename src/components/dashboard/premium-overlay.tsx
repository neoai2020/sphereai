"use client";

import { Lock, Rocket, ArrowRight } from "lucide-react";
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
}: PremiumOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-white/30 backdrop-blur-[2px] rounded-3xl">
      <div className="relative bg-white p-6 md:p-8 rounded-[32px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] text-center max-w-[300px] mx-auto transform transition-all duration-500 hover:scale-[1.01]">
        {/* Subtle decorative background */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-50 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-900/30">
            <Lock className="text-white" size={16} />
          </div>
          
          <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight leading-tight">
            {title}
          </h2>
          
          <p className="text-[12px] text-slate-500 mb-6 font-medium leading-relaxed">
            {description}
          </p>
        
        <Link
          href="/dashboard/settings"
          className="group relative w-full h-10 inline-flex items-center justify-center gap-2 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {buttonText}
          <Rocket size={12} className="group-hover:rotate-12 transition-transform" />
        </Link>

        <p className="mt-4 text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
          Risk-free • Cancel anytime
        </p>
        </div>
      </div>
    </div>
  );
}
