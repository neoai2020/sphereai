"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Zap, Plus, Languages, ArrowLeft, Sparkles } from "lucide-react";
import { VideoPlaceholder } from "@/components/dashboard/video-placeholder";
import { InfiniteClient } from "./InfiniteClient";

export interface InfiniteHubProject {
  id: string;
  name: string;
  product_name: string;
  slug: string;
  project_type: string;
  available_languages?: string[];
}

const TRANSLATE_STATS = [
  { label: "Daily Generations", value: "∞", color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Active Websites", value: "∞", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Marketing Messages", value: "∞", color: "text-emerald-600", bg: "bg-emerald-50" },
] as const;

export function InfiniteHub({ projects }: { projects: InfiniteHubProject[] }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"choose" | "translate">("choose");

  if (phase === "choose") {
    return (
      <div className="space-y-6">
        <p className="text-lg font-black text-gray-400 uppercase tracking-widest text-center leading-relaxed">
          Choose how you want to use Infinite
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/projects/new")}
            className="group text-left bg-white border border-gray-100 p-8 md:p-10 rounded-[32px] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-6 group-hover:scale-105 transition-transform">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Generate unlimited website</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              Open Site Forge and create as many AI-optimized sites as you want — no daily cap on
              Infinite.
            </p>
            <span className="inline-flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
              <Plus size={18} />
              Go to Site Forge
            </span>
          </button>

          <button
            type="button"
            onClick={() => setPhase("translate")}
            className="group text-left bg-white border border-gray-100 p-8 md:p-10 rounded-[32px] shadow-sm hover:shadow-md hover:border-indigo-200 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-6 group-hover:scale-105 transition-transform">
              <Languages size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Translate one of your websites</h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              Pick a site you already built and add languages with one click — same layout, localized
              copy.
            </p>
            <span className="inline-flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
              <Globe size={18} />
              Continue to translation
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <button
        type="button"
        onClick={() => setPhase("choose")}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 rounded-lg px-1 -ml-1"
      >
        <ArrowLeft size={18} />
        Back to Infinite options
      </button>

      <VideoPlaceholder
        title="Infinite Plan — Full Strategy Walkthrough"
        subtitle="Video training coming soon"
      />

      <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-8 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Your Infinite limits</h2>
              <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mt-1">
                No daily cap on generation or translation
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRANSLATE_STATS.map((stat, i) => (
            <div
              key={i}
              className={`${stat.bg} p-10 rounded-[32px] text-center space-y-2 border border-white/50 backdrop-blur-sm`}
            >
              <p className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-8 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-black text-gray-900">Your Websites — translate</h2>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-200 transition-colors w-fit"
          >
            <Plus size={16} /> Generate New
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium mb-4">
              No websites yet. Generate one first, then come back to translate.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
            >
              <Plus size={16} /> Open Site Forge
            </Link>
          </div>
        ) : (
          <InfiniteClient projects={projects} />
        )}
      </div>
    </div>
  );
}
