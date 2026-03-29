"use client";

import { VimeoEmbed, type VimeoAspect } from "@/components/dashboard/vimeo-embed";

/**
 * Same chrome as Training → premium videos: white card, header row, Premium pill, inner Vimeo shell.
 */
export function PremiumTrainingEmbed({
  title,
  videoId,
  aspect = "video",
}: {
  title: string;
  videoId: string;
  aspect?: VimeoAspect;
}) {
  return (
    <div className="w-full rounded-[32px] overflow-hidden border border-gray-100 shadow-sm bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900 min-w-0">{title}</h2>
        <span className="shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
          Premium
        </span>
      </div>
      <div className="p-1 bg-white">
        <div className="rounded-[20px] overflow-hidden border border-gray-100">
          <VimeoEmbed videoId={videoId} title={title} shell="inner" aspect={aspect} />
        </div>
      </div>
    </div>
  );
}
