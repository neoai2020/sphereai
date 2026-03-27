import { Play } from "lucide-react";

/** Neutral 16:9 video slot — no image, no overlay copy (dashboard hero). */
export function PlainVideoPlaceholder() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-1">
      <div
        className="aspect-video rounded-[22px] overflow-hidden relative flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-100 group cursor-pointer"
        data-plain-video-placeholder
        role="img"
        aria-label="Video placeholder"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-md border border-gray-200/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Play
            size={32}
            className="text-gray-500 fill-gray-500 ml-0.5 sm:ml-1"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
