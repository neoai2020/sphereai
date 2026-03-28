"use client";

import { useState } from "react";
import { VimeoEmbed } from "@/components/dashboard/vimeo-embed";
import { FaqAccordion } from "@/components/dashboard/faq-accordion";
import {
  GETTING_STARTED_VIMEO_ID,
  SITE_FORGE_VIMEO_ID,
  LOGO_GENERATOR_VIMEO_ID,
} from "@/lib/vimeo-config";
import { SPHEREAI_FAQS } from "@/data/sphereai-faqs";
import { GraduationCap, CheckCircle2 } from "lucide-react";
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

const videoBlocks = [
  { title: "1 — Getting Started", videoId: GETTING_STARTED_VIMEO_ID },
  { title: "2 — Site Forge", videoId: SITE_FORGE_VIMEO_ID },
  { title: "3 — Logo Generator", videoId: LOGO_GENERATOR_VIMEO_ID },
] as const;

export default function TrainingClient() {
  const [tab, setTab] = useState<"videos" | "faqs">("videos");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training & Resources</h1>
        <p className="text-gray-500 mt-1">
          Master the art of AI search optimization with our step-by-step guides
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-2xl w-fit">
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
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 items-start">
            {videoBlocks.map((block) => (
              <div
                key={block.title}
                className="flex flex-col min-w-0 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">{block.title}</h2>
                </div>
                <div className="p-2 bg-black">
                  <VimeoEmbed videoId={block.videoId} title={block.title} variant="none" />
                </div>
              </div>
            ))}
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
        </>
      )}

      {tab === "faqs" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 mt-1">
              Same answers as Support — covering Site Forge, Asset Vault, premium tools, and billing
              help.
            </p>
          </div>
          <FaqAccordion items={SPHEREAI_FAQS} defaultOpenIndex={null} variant="compact" />
        </div>
      )}
    </div>
  );
}
