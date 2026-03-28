"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { generateSlug, cn } from "@/lib/utils";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  Briefcase,
  Search,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  ChevronRight,
  Infinity,
} from "lucide-react";
import type { PageType } from "@/types/database";
import { VimeoEmbed } from "@/components/dashboard/vimeo-embed";
import { SITE_FORGE_VIMEO_ID } from "@/lib/vimeo-config";

type ProjectType = "affiliate" | "service";
const PAGE_TYPES: PageType[] = ["landing", "about", "faq", "blog", "reviews"];

const ACTION_MESSAGES: Record<string, string> = {
  landing: "Crafting your Landing Page",
  about: "Writing your About Page",
  faq: "Building FAQ Content",
  blog: "Generating Blog Article",
  reviews: "Creating Reviews Page",
};

function formatNextSlotAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [error, setError] = useState("");
  const [remainingInfo, setRemainingInfo] = useState({
    used: 0,
    remaining: 5,
    limit: 5,
    windowHours: 24,
    nextSlotAt: null as string | null,
    unlimited: false,
  });
  const [generationProgress, setGenerationProgress] = useState<Record<string, "pending" | "processing" | "done" | "error">>({
    landing: "pending",
    about: "pending",
    faq: "pending",
    blog: "pending",
    reviews: "pending",
  });
  
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState({
    projectType: "service" as ProjectType,
    name: "",
    productName: "",
    productDescription: "",
    productUrl: "",
    keywords: "",
  });

  // Auto-trigger SEO suggestion when entering step 3
  const [seoTriggered, setSeoTriggered] = useState(false);
  useEffect(() => {
    if (step === 3 && !seoTriggered && form.productName && form.productDescription) {
      setSeoTriggered(true);
      suggestSEO();
    }
  }, [step]);

  useEffect(() => {
    fetchRemaining();
  }, []);

  async function fetchRemaining() {
    try {
      const res = await fetch("/api/generations/remaining");
      if (res.ok) {
        const data = await res.json();
        if (data.unlimited === true) {
          setRemainingInfo({
            unlimited: true,
            used: 0,
            remaining: 999999,
            limit: 5,
            windowHours: data.windowHours ?? 24,
            nextSlotAt: null,
          });
        } else {
          setRemainingInfo({
            unlimited: false,
            used: data.used ?? 0,
            remaining: data.remaining ?? 5,
            limit: data.limit ?? 5,
            windowHours: data.windowHours ?? 24,
            nextSlotAt: data.nextSlotAt ?? null,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch remaining generations:", err);
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleScrape() {
    if (!form.productUrl) return;
    setError("");
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.productUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({
          ...prev,
          name: data.productName || prev.name,
          productName: data.productName || prev.productName,
          productDescription: data.productDescription || prev.productDescription,
          keywords: data.keywords ? data.keywords.join(", ") : prev.keywords,
        }));
      } else {
        setError("Scraping failed. Please enter details manually.");
      }
    } catch (err) {
      setError("Failed to connect to scraping service.");
    } finally {
      setScraping(false);
    }
  }

  async function generateDescription() {
    if (!form.productName) return;
    setGeneratingDescription(true);
    setError("");
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: form.productName }),
      });
      const data = await res.json();
      if (res.ok) {
        updateField("productDescription", data.description);
      } else {
        setError(data.error || "Failed to generate description.");
      }
    } catch {
      setError("Failed to connect to AI service.");
    } finally {
      setGeneratingDescription(false);
    }
  }

  async function suggestSEO() {
    if (!form.productName || !form.productDescription) {
      setError("Please provide product details first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productName: form.productName, 
          productDescription: form.productDescription 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm(prev => ({
          ...prev,
          keywords: data.keywords.join(", "),
        }));
      } else {
        setError(data.error || "AI Suggestion failed.");
      }
    } catch (err) {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please sign in again");
        setLoading(false);
        return;
      }

      if (!remainingInfo.unlimited && remainingInfo.remaining <= 0) {
        setError(
          `Site Forge limit reached (${remainingInfo.limit} full sites per ${remainingInfo.windowHours} hours on our servers).`
        );
        setLoading(false);
        return;
      }

      const slug = generateSlug(form.name || form.productName) + "-" + Date.now().toString(36);

      const { data: project, error: insertError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: form.name || form.productName,
          slug,
          product_name: form.productName,
          product_description: form.productDescription,
          product_url: form.productUrl || null,
          project_type: form.projectType,
          keywords: form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          target_audience: "",
          status: "draft",
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      // Parallel Generation (Faster!)
      setGenerationProgress({
        landing: "processing",
        about: "processing",
        faq: "processing",
        blog: "processing",
        reviews: "processing",
      });

      try {
        await Promise.all(
          PAGE_TYPES.map(async (type) => {
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ projectId: project.id, pageType: type }),
            });
            const data = await res.json().catch(() => ({} as { error?: string }));
            if (res.status === 429) {
              const lim = new Error(
                data.error ||
                  `Site Forge limit reached (${remainingInfo.limit} full sites per ${remainingInfo.windowHours} hours).`
              ) as Error & { isLimit?: boolean };
              lim.isLimit = true;
              throw lim;
            }
            if (!res.ok) {
              throw new Error(data.error || `Failed to generate ${type}`);
            }
            setGenerationProgress((prev) => ({ ...prev, [type]: "done" }));
          })
        );
      } catch (genErr: unknown) {
        const err = genErr as Error & { isLimit?: boolean };
        setError(err.message || "Generation failed.");
        setGenerationProgress((prev) => {
          const next = { ...prev };
          for (const t of PAGE_TYPES) {
            if (next[t] === "processing") next[t] = "error";
          }
          return next;
        });
        await fetchRemaining();
        setLoading(false);
        return;
      }

      await fetchRemaining();
      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const generationStatusSummary = Object.values(generationProgress);
  const completedCount = generationStatusSummary.filter(s => s === "done").length;
  const progressPercentage = (completedCount / PAGE_TYPES.length) * 100;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm border border-brand-200">
          <Zap size={14} className="fill-brand-600" /> Introducing SiteForge
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Build Your AI Empire</h1>
        <p className="text-gray-500 mt-3 text-xl font-medium max-w-2xl mx-auto">
          Describe your offer, and SiteForge will build a complete, SEO-optimized business in minutes.
        </p>
      </div>

      {/* Site Forge walkthrough (step 1) */}
      {step === 1 && (
        <div className="mb-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-1">
          <div className="overflow-hidden rounded-[22px] border border-gray-100">
            <div className="px-5 pt-5 pb-3 border-b border-gray-100">
              <p className="text-gray-900 font-black text-lg">What is SiteForge?</p>
              <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
                Watch the walkthrough to build your AI-optimized site.
              </p>
            </div>
            <div className="p-1 bg-white">
              <VimeoEmbed
                videoId={SITE_FORGE_VIMEO_ID}
                title="2 — Site Forge"
                shell="inner"
              />
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto px-4 relative">
        <div className="absolute left-8 right-8 top-5 h-1 bg-gray-100 -z-0 rounded-full" />
        <div 
          className="absolute left-8 top-5 h-1 bg-brand-600 transition-all duration-700 -z-0 rounded-full shadow-lg shadow-brand-500/20" 
          style={{ width: `${Math.max(0, (step - 1) * 33.33)}%`, maxWidth: 'calc(100% - 64px)' }}
        />
        
        {[
          { s: 1, label: "Identity" },
          { s: 2, label: "Core Data" },
          { s: 3, label: "SEO Plan" },
          { s: 4, label: "Launch" }
        ].map((item) => (
          <div key={item.s} className="relative z-10 flex flex-col items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black transition-all shadow-md ${
                step >= item.s ? "bg-brand-600 text-white ring-4 ring-brand-50" : "bg-white text-gray-300 border border-gray-200"
              }`}
            >
              {item.s}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${step >= item.s ? "text-brand-700" : "text-gray-400"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Generation limiter — all steps; server-tracked rolling 24h window */}
      <div className="mb-8 max-w-2xl mx-auto px-4">
        <div
          className={cn(
            "rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-6",
            remainingInfo.unlimited
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm shadow-emerald-100/50"
              : "border-gray-200 bg-white shadow-sm"
          )}
        >
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] mb-2",
                remainingInfo.unlimited ? "text-emerald-700/80" : "text-gray-500"
              )}
            >
              {remainingInfo.unlimited ? "Your plan" : "Daily generation limit"}
            </p>
            {remainingInfo.unlimited ? (
              <div className="flex items-center gap-4">
                <span
                  className="text-5xl sm:text-6xl font-black text-emerald-700 leading-none tabular-nums"
                  aria-label="Infinite generations"
                >
                  ∞
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Infinity className="w-6 h-6 text-emerald-700" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-950">Infinite</p>
                    <p className="text-xs text-emerald-800 font-semibold leading-snug">
                      Unlimited Site Forge builds — no daily cap.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl sm:text-5xl font-black text-brand-600 tabular-nums">
                    {remainingInfo.remaining}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-gray-300">/</span>
                  <span className="text-4xl sm:text-5xl font-black text-gray-900 tabular-nums">
                    {remainingInfo.limit}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-600 ml-1">
                    full sites left today
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed max-w-lg">
                  <strong className="text-gray-700">5 generations per day</strong> on a{" "}
                  <strong className="text-gray-700">rolling 24-hour window</strong> (not midnight). When
                  you use a slot, it frees again <strong>24 hours</strong> after that build. Counted on
                  our servers — not your browser or cookies.
                </p>
                {remainingInfo.remaining <= 0 && formatNextSlotAt(remainingInfo.nextSlotAt) && (
                  <p className="text-xs text-amber-800 font-semibold mt-2 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Next slot after{" "}
                      <span className="font-black">{formatNextSlotAt(remainingInfo.nextSlotAt)}</span>
                    </span>
                  </p>
                )}
              </>
            )}
          </div>
          {!remainingInfo.unlimited && (
            <div className="w-full sm:w-40 shrink-0 flex flex-col justify-center gap-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-gray-400">
                <span>Used</span>
                <span className="text-gray-700">
                  {remainingInfo.used} / {remainingInfo.limit}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (remainingInfo.used / Math.max(1, remainingInfo.limit)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide text-center sm:text-left">
                Resets every 24h
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-5 border-b border-red-100 flex items-center gap-3 font-bold">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="p-10">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Select Your Path</h2>
                <p className="text-gray-500 font-medium">How should SiteForge build your business?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => { updateField("projectType", "affiliate"); setStep(2); }}
                  className={`group p-6 rounded-2xl border text-left transition-all hover:bg-white ${
                    form.projectType === "affiliate" ? "border-brand-500 bg-brand-50/50 shadow-sm shadow-brand-500/10" : "border-gray-100 bg-white hover:border-brand-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <LinkIcon className="text-brand-600" size={24} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1.5 flex items-center justify-between">
                    Affiliate Empire <ChevronRight size={16} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">I have a product link (e.g. Amazon, ClickBank) and want an optimized promotional engine.</p>
                </button>
                <button
                  onClick={() => { updateField("projectType", "service"); setStep(2); }}
                  className={`group p-6 rounded-2xl border text-left transition-all hover:bg-white ${
                    form.projectType === "service" ? "border-purple-500 bg-purple-50/50 shadow-sm shadow-purple-500/10" : "border-gray-100 bg-white hover:border-purple-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-1.5 flex items-center justify-between">
                    Agency / Soloist <ChevronRight size={16} className="text-purple-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">I have a service and want description-based AI sites that convert like crazy.</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data Input */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  {form.projectType === "affiliate" ? "Product Blueprint" : "Project Specs"}
                </h2>
                <p className="text-gray-400 text-sm font-medium">Feed the AI the core information it needs.</p>
              </div>
              
              {form.projectType === "affiliate" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Product / Affiliate URL</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={form.productUrl}
                        onChange={(e) => updateField("productUrl", e.target.value)}
                        className="flex-1 px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-medium transition-all"
                        placeholder="https://example.com/product"
                      />
                      <button 
                        onClick={handleScrape} 
                        disabled={scraping || !form.productUrl}
                        className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 text-sm"
                      >
                        {scraping ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        Scrape
                      </button>
                    </div>
                  </div>
                  {(form.productName || form.productDescription) && (
                    <div className="p-6 bg-brand-50/30 border border-brand-100/50 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">AI Extracted Data</span>
                      </div>
                      <div className="space-y-3">
                         <input 
                           type="text" 
                           value={form.productName} 
                           onChange={(e) => updateField("productName", e.target.value)}
                           className="w-full bg-white px-5 py-3.5 rounded-xl border border-brand-100/50 text-base font-black text-gray-900 outline-none focus:ring-2 focus:ring-brand-500/5 transition-all" 
                           placeholder="Product Name"
                         />
                         <div className="relative">
                           <textarea
                             value={form.productDescription}
                             onChange={(e) => updateField("productDescription", e.target.value)}
                             rows={3}
                             className="w-full bg-white px-5 py-3.5 pb-12 rounded-xl border border-brand-100/50 text-sm text-gray-600 font-medium outline-none focus:ring-2 focus:ring-brand-500/5 transition-all resize-none"
                             placeholder="Product Description"
                           />
                           <button
                             type="button"
                             onClick={generateDescription}
                             disabled={generatingDescription || !form.productName}
                             className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95"
                           >
                             {generatingDescription ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                             {generatingDescription ? "Generating..." : "Generate with AI"}
                           </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Project Title</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-black transition-all"
                      placeholder="My Professional Agency"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Service Name</label>
                    <input
                      type="text"
                      value={form.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-black transition-all"
                      placeholder="e.g. Acme Marketing"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Full Business Description</label>
                    <div className="relative">
                      <textarea
                        value={form.productDescription}
                        onChange={(e) => updateField("productDescription", e.target.value)}
                        rows={5}
                        className="w-full px-5 py-3.5 pb-12 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-medium transition-all resize-none"
                        placeholder="Be as detailed as possible. The AI uses this to write all 5 pages..."
                      />
                      <button
                        type="button"
                        onClick={generateDescription}
                        disabled={generatingDescription || !form.productName}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95"
                      >
                        {generatingDescription ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {generatingDescription ? "Generating..." : "Generate with AI"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
 
              <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 text-gray-400 font-black hover:text-gray-900 transition-colors uppercase tracking-[0.2em] text-[10px]">
                  <ArrowLeft size={16} /> Back
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!form.productName || !form.productDescription}
                  className="px-10 py-3.5 bg-brand-600 text-white rounded-xl font-black hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-brand-500/10 text-sm"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: SEO & Audience */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-1.5">SEO Plan</h2>
                <p className="text-gray-400 text-sm font-medium">Review and edit your AI-generated keywords.</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <Loader2 size={20} className="text-brand-600 animate-spin" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Generating keywords...</p>
                  <p className="text-[11px] text-gray-400">Analyzing your product for optimal SEO</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                      <Globe size={13} className="text-brand-500" /> SEO Keywords
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.keywords}
                        onChange={(e) => updateField("keywords", e.target.value)}
                        className="w-full px-5 py-3.5 pr-36 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-sm font-medium transition-all"
                        placeholder="AI, automation, productivity..."
                      />
                      <button
                        onClick={suggestSEO}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95"
                      >
                        <Sparkles size={12} />
                        Re-generate
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Comma separated</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-50">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 text-gray-400 font-black hover:text-gray-900 transition-colors uppercase tracking-[0.2em] text-[10px]">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!form.keywords}
                  className="px-10 py-3.5 bg-brand-600 text-white rounded-xl font-black hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 text-sm"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Launch */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 mb-1.5">Final Blueprint</h2>
                <p className="text-gray-400 text-sm font-medium">Ready to build your 5-page AI site.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Structure</span>
                  <span className="font-bold text-gray-900 text-sm">5-Page AI Site</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Hosting</span>
                  <span className="font-bold text-gray-900 text-sm">sphere.ai/software/...</span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6 py-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                      <span className="text-[10px] font-black text-brand-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 transition-all duration-700 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {PAGE_TYPES.map((type) => (
                      <div
                        key={type}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          generationProgress[type] === "done"
                            ? "bg-green-50 border-green-100 text-green-700"
                            : generationProgress[type] === "processing"
                            ? "bg-brand-50 border-brand-200 text-brand-700 animate-pulse"
                            : "bg-gray-50 border-gray-100 text-gray-400"
                        }`}
                      >
                        <div className="flex justify-center mb-1.5">
                          {generationProgress[type] === "done" ? <CheckCircle2 size={14} /> :
                           generationProgress[type] === "processing" ? <Loader2 size={14} className="animate-spin" /> :
                           <Clock size={14} />}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tight">{type}</span>
                      </div>
                    ))}
                  </div>

                  {(() => {
                    const processing = PAGE_TYPES.filter(t => generationProgress[t] === "processing");
                    const done = PAGE_TYPES.filter(t => generationProgress[t] === "done");
                    const dynamicMessage = processing.length > 0
                      ? processing.map(t => ACTION_MESSAGES[t]).join(" · ")
                      : done.length === PAGE_TYPES.length
                      ? "All pages ready! Redirecting..."
                      : "Finalizing your site...";
                    const subMessage = done.length > 0
                      ? `${done.length} of ${PAGE_TYPES.length} pages complete`
                      : "Starting up AI engines...";
                    return (
                      <div className="p-5 bg-gray-900 text-white rounded-2xl flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Globe className="text-brand-400 animate-bounce" size={18} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black leading-tight">{dynamicMessage}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{subMessage}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}

              {!loading && (
                <div className="flex justify-between pt-6 border-t border-gray-50">
                  <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-3 text-gray-400 font-black hover:text-gray-900 transition-colors uppercase tracking-[0.2em] text-[10px]">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || (!remainingInfo.unlimited && remainingInfo.remaining <= 0)}
                    className="px-10 py-3.5 bg-gray-900 text-white rounded-xl font-black hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 text-sm"
                  >
                    <Sparkles size={16} className="text-brand-400" />
                    Build with SiteForge
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Clock({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
