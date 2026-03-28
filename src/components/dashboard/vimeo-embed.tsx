"use client";

import Script from "next/script";
import { cn } from "@/lib/utils";
import { buildVimeoEmbedSrc } from "@/lib/vimeo-embed-url";

const VIMEO_PLAYER_JS = "https://player.vimeo.com/api/player.js";

/** `full` = same white card as the main dashboard hero. `inner` = inner frame only (inside another card). */
export type VimeoShell = "full" | "inner";

type VimeoEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  /** Default `full` — dashboard-style white card, light borders, no black outer ring. */
  shell?: VimeoShell;
};

const OUTER =
  "rounded-3xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-200/50";
const INNER = "overflow-hidden rounded-[22px] border border-gray-100";

export function VimeoEmbed({
  videoId,
  title,
  className,
  shell = "full",
}: VimeoEmbedProps) {
  const src = buildVimeoEmbedSrc(videoId);

  const frame = (
    <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full"
        frameBorder={0}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
        allowFullScreen
      />
    </div>
  );

  const inner = <div className={INNER}>{frame}</div>;

  const shellNode =
    shell === "inner" ? (
      <div className={cn(className)}>{inner}</div>
    ) : (
      <div className={cn(OUTER, className)}>{inner}</div>
    );

  return (
    <>
      {shellNode}
      <Script src={VIMEO_PLAYER_JS} strategy="lazyOnload" />
    </>
  );
}
