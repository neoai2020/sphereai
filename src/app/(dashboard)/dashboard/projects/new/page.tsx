"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
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
  Play,
  Zap,
  Globe,

  ChevronRight
} from "lucide-react";
import type { PageType } from "@/types/database";

type ProjectType = "affiliate" | "service";
const PAGE_TYPES: PageType[] = ["landing", "about", "faq", "blog", "reviews"];

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [remainingInfo, setRemainingInfo] = useState({ used: 0, remaining: 5, limit: 5 });
  const [generationProgress, setGenerationProgress] = useState<Record<string, "pending" | "processing" | "done" | "error">>({
    landing: "pending",
    about: "pending",
    faq: "pending",
    blog: "pending",
    reviews: "pending",
  });
  
  const router = useRouter();
  const supabase = createClient();

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
        setRemainingInfo(data);
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

      if (remainingInfo.remaining <= 0) {
        setError("Daily generation limit reached. Try again tomorrow.");
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

      // Step-by-Step Generation (Site-by-Site)
      for (const type of PAGE_TYPES) {
        setGenerationProgress(prev => ({ ...prev, [type]: "processing" }));
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: project.id, pageType: type }),
          });
          if (!res.ok) throw new Error(`Failed to generate ${type}`);
          setGenerationProgress(prev => ({ ...prev, [type]: "done" }));
        } catch (err) {
          setGenerationProgress(prev => ({ ...prev, [type]: "error" }));
        }
      }

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

      {/* Explanatory Video Section (New) */}
      {step === 1 && (
        <div className="mb-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-1">
           <div className="aspect-video bg-gray-100 rounded-[22px] overflow-hidden relative group cursor-pointer border border-gray-50">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                alt="SiteForge Explainer" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl border-4 border-brand-50">
                  <Play size={40} className="text-brand-600 fill-brand-600 ml-1.5" />
                </div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <p className="text-white font-black text-3xl mb-1 drop-shadow-md">What is SiteForge?</p>
                <p className="text-white/90 text-sm drop-shadow-sm font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand-400" /> Watch the 2-minute guide to AI Search supremacy.
                </p>
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
                         <textarea 
                           value={form.productDescription} 
                           onChange={(e) => updateField("productDescription", e.target.value)}
                           rows={3} 
                           className="w-full bg-white px-5 py-3.5 rounded-xl border border-brand-100/50 text-sm text-gray-600 font-medium outline-none focus:ring-2 focus:ring-brand-500/5 transition-all resize-none" 
                           placeholder="Product Description"
                         />
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
                    <textarea
                      value={form.productDescription}
                      onChange={(e) => updateField("productDescription", e.target.value)}
                      rows={5}
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-medium transition-all resize-none"
                      placeholder="Be as detailed as possible. The AI uses this to write all 5 pages..."
                    />
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

          {/* Step 3: SEO & Audience (Updated with AI Suggest) */}
          {step === 3 && (
            <div className="space-y-10">
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Plan with Site Forge</h2>
                <p className="text-gray-500 font-medium">SiteForge AI is planning your SEO strategy.</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center py-10 gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 flex items-center justify-center shadow-2xl animate-pulse">
                      <Sparkles size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand-600 font-black text-lg">
                    <Loader2 className="animate-spin" size={20} />
                    Planning with SiteForge AI...
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Analyzing your product for optimal SEO keywords</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col items-center mb-4">
                    <button
                       onClick={suggestSEO}
                       disabled={loading}
                       className="group relative flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles size={24} className="text-brand-300" />
                      Re-generate Keywords
                      <div className="absolute inset-x-0 -bottom-1 h-1 bg-brand-900/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>

                  <div className="relative group">
                    <label className="flex items-center gap-2 text-sm font-black text-gray-800 uppercase tracking-widest mb-3">
                      <Globe size={16} className="text-brand-600" /> SEO Keywords
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.keywords}
                        onChange={(e) => updateField("keywords", e.target.value)}
                        className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/20 outline-none text-lg font-bold shadow-inner"
                        placeholder="AI, automation, productivity..."
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-[10px] uppercase tracking-tighter">comma separated</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-10 border-t border-gray-50">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-8 py-4 text-gray-500 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  onClick={() => setStep(4)} 
                  disabled={!form.keywords}
                  className="px-10 py-5 bg-brand-600 text-white rounded-2xl font-black hover:bg-brand-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-brand-200"
                >
                  Next Step <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Launch (Updated with Progress Bar) */}
          {step === 4 && (
            <div className="space-y-10 text-center">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Final Blueprint</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-6 rounded-3xl bg-gray-50 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Structure</span>
                  <span className="font-bold text-gray-900">5-Page AI Site</span>
                </div>
                <div className="p-6 rounded-3xl bg-gray-50 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Hosting</span>
                  <span className="font-bold text-gray-900">sphere.ai/software/...</span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-10 py-10">
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-full max-w-lg h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200/50">
                       <div 
                         className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-1000 shadow-lg" 
                         style={{ width: `${progressPercentage}%` }}
                       />
                     </div>
                     <div className="flex items-center gap-2 text-brand-600 font-black text-lg">
                       <Loader2 className="animate-spin" size={20} />
                       {Math.round(progressPercentage)}% Generated
                     </div>
                   </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {PAGE_TYPES.map((type) => (
                        <div 
                          key={type} 
                          className={`p-4 rounded-2xl border transition-all ${
                            generationProgress[type] === "done" 
                              ? "bg-green-50 border-green-100 text-green-700 shadow-sm font-black"
                              : generationProgress[type] === "processing"
                              ? "bg-brand-50 border-brand-100 text-brand-700 animate-pulse border-2 font-black"
                              : "bg-gray-50 border-gray-100 text-gray-400 font-black"
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                             {generationProgress[type] === "done" ? <CheckCircle2 size={18} /> : 
                              generationProgress[type] === "processing" ? <Loader2 size={18} className="animate-spin" /> : 
                              <Clock size={18} />}
                          </div>
                          <span className="text-[10px] uppercase tracking-tighter">{type}</span>
                        </div>
                      ))}
                    </div>

                   <div className="p-8 bg-brand-950 text-white rounded-[2rem] shadow-2xl relative overflow-hidden">
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mb-6">
                          <Globe className="text-brand-400 animate-bounce" size={24} />
                        </div>
                        <p className="text-xl font-black mb-2 animate-pulse">Launching your AI Assets...</p>
                        <p className="text-brand-300 font-bold text-sm max-w-xs mx-auto">
                           Initialing AI SEO engines. This will only take about 90 seconds.
                        </p>
                      </div>
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl opacity-50" />
                   </div>
                </div>
              ) : (
                <div className="p-10 bg-brand-50 border border-brand-100 rounded-[2.5rem] text-center max-w-2xl mx-auto">
                  <div className="flex flex-col items-center mb-6">
                    <span className="text-[10px] font-black text-brand-700 uppercase tracking-[0.3em] mb-4">Resource Allocation</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900">{remainingInfo.remaining}</span>
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">left today</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-brand-200 rounded-full overflow-hidden mb-6 shadow-inner">
                    <div 
                      className="h-full bg-brand-600 transition-all duration-1000" 
                      style={{ width: `${(remainingInfo.used / remainingInfo.limit) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-brand-700 font-black flex items-center justify-center gap-2">
                    <AlertCircle size={16} />
                    Pro Tip: Use SiteForge suggestions for best results.
                  </p>
                </div>
              )}

              {!loading && (
                <div className="flex justify-between pt-10 border-t border-gray-50">
                   <button onClick={() => setStep(3)} className="flex items-center gap-2 px-8 py-4 text-gray-500 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">
                     <ArrowLeft size={18} /> Back
                   </button>
                   <button 
                     onClick={handleSubmit} 
                     disabled={loading || remainingInfo.remaining <= 0}
                     className="px-12 py-6 bg-gray-900 text-white rounded-[2rem] font-black hover:bg-black disabled:opacity-50 transition-all active:scale-95 flex items-center gap-4 text-xl shadow-2xl"
                   >
                     <Sparkles size={28} className="text-brand-400" />
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
