"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { VimeoEmbed } from "@/components/dashboard/vimeo-embed";
import { ProductFaqSection } from "@/components/dashboard/product-faq-section";
import {
  GETTING_STARTED_VIMEO_ID,
  SITE_FORGE_VIMEO_ID,
  LOGO_GENERATOR_VIMEO_ID,
  TEN_X_TRAINING_VIMEO_ID,
  AUTOMATION_TRAINING_VIMEO_ID,
  INFINITE_TRAINING_VIMEO_ID,
  DFY_TRAINING_VIMEO_ID,
} from "@/lib/vimeo-config";
import type { VimeoAspect } from "@/components/dashboard/vimeo-embed";
import { GraduationCap, CheckCircle2, PlayCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Step 1: Project Setup",
    description:
      "Connect your product or affiliate link and let the AI analyze your target audience and keywords.",
  },
  {
    title: "Step 2: Content Generation",
    description:
      "SphereAI generates 5 specialized pages (Landing, About, FAQ, Blog, Reviews) with full Schema Markup.",
  },
  {
    title: "Step 3: Customization",
    description: "Review and edit the generated content to match your brand voice and specific requirements.",
  },
];

const coreVideoBlocks = [
  { title: "1 — Getting Started", videoId: GETTING_STARTED_VIMEO_ID, aspect: "video" as const },
  { title: "2 — Site Forge", videoId: SITE_FORGE_VIMEO_ID, aspect: "video" as const },
  { title: "3 — Logo Generator", videoId: LOGO_GENERATOR_VIMEO_ID, aspect: "video" as const },
] as const;

const premiumVideoBlocks = [
  { title: "4 — 10X Mode", videoId: TEN_X_TRAINING_VIMEO_ID, aspect: "4-3" as const },
  { title: "5 — Automation", videoId: AUTOMATION_TRAINING_VIMEO_ID, aspect: "4-3" as const },
  { title: "6 — Infinite", videoId: INFINITE_TRAINING_VIMEO_ID, aspect: "video" as const },
  { title: "7 — DFY", videoId: DFY_TRAINING_VIMEO_ID, aspect: "4-3" as const },
] as const;

type ModalVideo = { videoId: string; title: string; aspect: VimeoAspect };

export default function TrainingClient() {
  const [tab, setTab] = useState<"videos" | "faqs">("videos");
  const [modalVideo, setModalVideo] = useState<ModalVideo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!modalVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalVideo(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalVideo]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      <div
        className="pointer-events-none absolute -top-4 -left-4 w-[min(380px,85vw)] h-[380px] bg-indigo-500/[0.06] rounded-full blur-[100px]"
        aria-hidden
      />
      <div className="relative z-10 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training & Resources</h1>
        <p className="text-gray-500 mt-1">
          Master the art of AI search optimization with our step-by-step guides
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setTab("videos")}
          className={cn(
            "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            tab === "videos" ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
          )}
        >
          Training videos
        </button>
        <button
          type="button"
          onClick={() => setTab("faqs")}
          className={cn(
            "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            tab === "faqs" ? "bg-white text-gray-900 shadow-md" : "text-gray-500 hover:text-gray-700"
          )}
        >
          FAQs
        </button>
      </div>

      {tab === "videos" && (
        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-start">
            {coreVideoBlocks.map((block) => (
              <div
                key={block.title}
                className="flex flex-col min-w-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">{block.title}</h2>
                </div>
                <div className="p-1 bg-white">
                  <div className="relative rounded-[20px] overflow-hidden border border-gray-100">
                    <div className="pointer-events-none select-none">
                      <VimeoEmbed
                        videoId={block.videoId}
                        title={`${block.title} preview`}
                        shell="inner"
                        aspect={block.aspect}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setModalVideo({
                          videoId: block.videoId,
                          title: block.title,
                          aspect: block.aspect,
                        })
                      }
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                      aria-label={`Open ${block.title} full screen`}
                    >
                      <PlayCircle
                        className="w-14 h-14 md:w-16 md:h-16 text-white drop-shadow-lg"
                        strokeWidth={1.25}
                        fill="rgba(255,255,255,0.15)"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow">
                        Watch full size
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-indigo-600" />
              Premium features
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-2xl">
              Walkthroughs for 10X, Automation, Infinite, and Done-For-You. Same player controls as the core lessons above.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {premiumVideoBlocks.map((block) => (
                <div
                  key={block.title}
                  className="flex flex-col min-w-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-gray-900 min-w-0 truncate">{block.title}</h2>
                    <span className="shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Premium
                    </span>
                  </div>
                  <div className="p-1 bg-white">
                    <div className="relative rounded-[20px] overflow-hidden border border-gray-100">
                      <div className="pointer-events-none select-none">
                        <VimeoEmbed
                          videoId={block.videoId}
                          title={`${block.title} preview`}
                          shell="inner"
                          aspect={block.aspect}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setModalVideo({
                            videoId: block.videoId,
                            title: block.title,
                            aspect: block.aspect,
                          })
                        }
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                        aria-label={`Open ${block.title} full screen`}
                      >
                        <PlayCircle
                          className="w-14 h-14 md:w-16 md:h-16 text-white drop-shadow-lg"
                          strokeWidth={1.25}
                          fill="rgba(255,255,255,0.15)"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow">
                          Watch full size
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <GraduationCap size={20} className="text-brand-600" />
              The SphereAI Workflow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="bg-white rounded-xl border border-gray-200 p-6 flex gap-5 h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                    <span className="text-brand-700 font-bold">{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-8">
            <h3 className="text-brand-900 font-bold text-lg mb-4">Pro Tips for AI Ranking</h3>
            <ul className="space-y-4">
              {[
                "Always include the product FAQ—it has the highest citation rate for AI assistants.",
                "Use natural, conversational keywords that people use when talking to AI (e.g., 'What is the best...')",
                "Keep your product description factual and detailed—the more info the AI has, the better it generates.",
              ].map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-brand-800">
                  <CheckCircle2 size={18} className="text-brand-600 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "faqs" && (
        <div className="relative z-10 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <ProductFaqSection />
        </div>
      )}

      {mounted &&
        modalVideo &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-video-modal-title"
            onClick={() => setModalVideo(null)}
          >
            <div
              className="relative w-full max-w-6xl max-h-[min(90vh,900px)] flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 text-white shrink-0">
                <h2 id="training-video-modal-title" className="text-lg md:text-xl font-bold truncate pr-4">
                  {modalVideo.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalVideo(null)}
                  className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close video"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                <VimeoEmbed
                  key={modalVideo.videoId}
                  videoId={modalVideo.videoId}
                  title={modalVideo.title}
                  shell="full"
                  aspect={modalVideo.aspect}
                  className="!shadow-none"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
