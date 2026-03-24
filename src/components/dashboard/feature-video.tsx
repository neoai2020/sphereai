"use client";

import { Play } from "lucide-react";

export function FeatureVideo() {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group cursor-pointer">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]" />
      
      <div className="flex flex-col items-center gap-4 text-center z-10 px-6">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
          <Play className="text-purple-400 fill-purple-400/20" size={32} />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-1">Video Demo Coming Soon</h4>
          <p className="text-sm text-slate-400 max-w-xs">
            We're preparing a detailed walkthrough of these premium features. Stay tuned!
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-slate-700/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-slate-700/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-slate-700/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-slate-700/50 rounded-br-lg" />
    </div>
  );
}
