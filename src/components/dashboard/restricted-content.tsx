"use client";

import { Lock } from "lucide-react";

interface RestrictedContentProps {
  title: string;
  description: string;
  onUpgrade?: () => void;
  icon?: any;
}

export function RestrictedContent({
  title,
  description,
  icon: Icon = Lock,
}: RestrictedContentProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50/30 rounded-[32px] border border-slate-100/50">
      
      <div className="relative max-w-md w-full bg-white p-12 rounded-[40px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] text-center space-y-8">
        
        {/* Icon */}
        <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icon className="text-white fill-white/10" size={28} />
            </div>
        </div>

        {/* Badge */}
        <div className="flex justify-center">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Required</span>
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
            {title}
          </h2>
          <p className="text-base text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
            {description}
          </p>
        </div>

        {/* Minimal Footer */}
        <div className="pt-4 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Premium Feature Only</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
