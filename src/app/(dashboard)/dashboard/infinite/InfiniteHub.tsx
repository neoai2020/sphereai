"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Globe,
  Zap,
  Plus,
  Languages,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
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

export function InfiniteHub({ projects }: { projects: InfiniteHubProject[] }) {
  const router = useRouter();
  const [phase, setPhase] = useState<"choose" | "translate">("choose");

  if (phase === "choose") {
    return (
      <div className="space-y-8">
        <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
          Choose how you want to use Infinite
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard/projects/new")}
            className="group text-left rounded-[32px] border-2 border-gray-100 bg-white p-8 md:p-10 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-6 group-hover:scale-105 transition-transform">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Generate unlimited website
            </h2>
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
            className="group text-left rounded-[32px] border-2 border-gray-100 bg-white p-8 md:p-10 shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-6 group-hover:scale-105 transition-transform">
              <Languages size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Translate one of your websites
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-6">
              Pick a site you already built and add languages with one click — same layout, localized
              copy.
            </p>
            <span className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest">
              <Globe size={18} />
              Continue to translation
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* translate flow — previous full page content below the header */
  return (
    <div className="space-y-10">
      <button
        type="button"
        onClick={() => setPhase("choose")}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Infinite options
      </button>

      <VideoPlaceholder
        title="Infinite Plan — Full Strategy Walkthrough"
        subtitle="Video training coming soon"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Daily Generations", value: "∞", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Websites", value: "∞", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Marketing Messages", value: "∞", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Your Websites — translate</h2>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors w-fit"
          >
            <Plus size={16} /> Generate New
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium mb-4">No websites yet. Generate one first, then come back to translate.</p>
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
