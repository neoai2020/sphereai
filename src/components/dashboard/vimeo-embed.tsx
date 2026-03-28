"use client";

import Script from "next/script";
import { cn } from "@/lib/utils";

const VIMEO_PLAYER_JS = "https://player.vimeo.com/api/player.js";

type VimeoEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  /** Dashboard hero card vs training block vs bare */
  variant?: "dashboard" | "training" | "none";
};

export function VimeoEmbed({
  videoId,
  title,
  className,
  variant = "none",
}: VimeoEmbedProps) {
  const src = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&byline=0&portrait=0`;

  const frame = (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full"
        frameBorder={0}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
        allowFullScreen
      />
    </div>
  );

  const shell =
    variant === "dashboard" ? (
      <div
        className={cn(
          "rounded-3xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-200/50",
          className
        )}
      >
        <div className="overflow-hidden rounded-[22px] border border-gray-100">
          {frame}
        </div>
      </div>
    ) : variant === "training" ? (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-sm",
          className
        )}
      >
        {frame}
      </div>
    ) : (
      <div className={className}>{frame}</div>
    );

  return (
    <>
      {shell}
      <Script src={VIMEO_PLAYER_JS} strategy="lazyOnload" />
    </>
  );
}
