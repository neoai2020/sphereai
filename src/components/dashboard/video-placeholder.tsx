"use client";

import { Play } from "lucide-react";

interface VideoPlaceholderProps {
  title?: string;
  subtitle?: string;
}

export function VideoPlaceholder({ 
  title = "Training Video",
  subtitle = "Walkthrough coming soon"
}: VideoPlaceholderProps) {
  return (
    <div className="w-full rounded-[32px] overflow-hidden border border-gray-100 shadow-sm bg-white">
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center gap-4 group cursor-pointer">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 via-transparent to-purple-600/10" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        {/* Play button */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
          <Play size={32} className="text-white fill-white ml-1" />
        </div>

        {/* Labels */}
        <div className="relative z-10 text-center space-y-1">
          <p className="text-white font-black text-lg tracking-tight">{title}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black text-white/70 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
