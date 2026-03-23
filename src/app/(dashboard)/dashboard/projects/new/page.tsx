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
  AlertCircle
} from "lucide-react";

type ProjectType = "affiliate" | "service";

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState("");
  const [remainingInfo, setRemainingInfo] = useState({ used: 0, remaining: 5, limit: 5 });
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    projectType: "service" as ProjectType,
    name: "",
    productName: "",
    productDescription: "",
    productUrl: "",
    keywords: "",
    targetAudience: "",
  });

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
          target_audience: form.targetAudience,
          status: "draft",
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (!generateRes.ok) {
        const errData = await generateRes.json();
        setError(errData.error || "Generation failed");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Select your project type and let AI build your 5-page optimized website
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 max-w-xl mx-auto px-4 relative">
        {/* Background Connector Line */}
        <div className="absolute left-8 right-8 top-5 h-0.5 bg-gray-100 -z-0" />
        <div 
          className="absolute left-8 top-5 h-0.5 bg-brand-600 transition-all duration-500 -z-0" 
          style={{ width: `${Math.max(0, (step - 1) * 33.33)}%`, maxWidth: 'calc(100% - 64px)' }}
        />
        
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                step >= s ? "bg-brand-600 text-white ring-4 ring-brand-50" : "bg-gray-100 text-gray-400"
              }`}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 border-b border-red-100 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="p-8">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-8">What are you building?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => { updateField("projectType", "affiliate"); setStep(2); }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                    form.projectType === "affiliate" ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-brand-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <LinkIcon className="text-brand-600" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Affiliate Link</h3>
                  <p className="text-sm text-gray-500">I have a product link and want an AI site to promote it.</p>
                </button>
                <button
                  onClick={() => { updateField("projectType", "service"); setStep(2); }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                    form.projectType === "service" ? "border-brand-600 bg-brand-50" : "border-gray-100 hover:border-brand-200"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Service / Business</h3>
                  <p className="text-sm text-gray-500">I have a service and want to describe it from scratch.</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data Input */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                  {form.projectType === "affiliate" ? "Product Link" : "Basic Details"}
                </h2>
              </div>
              
              {form.projectType === "affiliate" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product / Affiliate URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.productUrl}
                        onChange={(e) => updateField("productUrl", e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                        placeholder="https://example.com/product"
                      />
                      <button 
                        onClick={handleScrape} 
                        disabled={scraping || !form.productUrl}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                      >
                        {scraping ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        Scrape
                      </button>
                    </div>
                  </div>
                  {(form.productName || form.productDescription) && (
                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Extracted Info</p>
                      <input 
                        type="text" 
                        value={form.productName} 
                        onChange={(e) => updateField("productName", e.target.value)}
                        className="w-full bg-white px-3 py-2 rounded border border-green-200 text-sm font-bold" 
                        placeholder="Product Name"
                      />
                      <textarea 
                        value={form.productDescription} 
                        onChange={(e) => updateField("productDescription", e.target.value)}
                        rows={3} 
                        className="w-full bg-white px-3 py-2 rounded border border-green-200 text-sm" 
                        placeholder="Product Description"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="My Marketing Project"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Name</label>
                    <input
                      type="text"
                      value={form.productName}
                      onChange={(e) => updateField("productName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="e.g. Acme Consulting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={form.productDescription}
                      onChange={(e) => updateField("productDescription", e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="Describe your service in detail..."
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold">
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={!form.productName || !form.productDescription}
                  className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: SEO & Audience */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-bold text-gray-900">SEO & Audience</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) => updateField("keywords", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="AI, automation, productivity..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
                <textarea
                  value={form.targetAudience}
                  onChange={(e) => updateField("targetAudience", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Who is this for? e.g. Freelancers looking to save time..."
                />
              </div>
              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold">
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  onClick={() => setStep(4)} 
                  disabled={!form.keywords || !form.targetAudience}
                  className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                >
                  Review <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-8 text-center">
              <h2 className="text-xl font-bold text-gray-900">Final Review</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center border-b pb-4">
                  <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Project Type</span>
                  <span className="font-bold text-lg capitalize">{form.projectType}</span>
                </div>
                <div className="flex flex-col items-center border-b pb-4">
                  <span className="text-gray-500 text-xs uppercase tracking-wider mb-1">Product Name</span>
                  <span className="font-bold text-lg">{form.productName}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-xs uppercase tracking-wider mb-2">Description Hint</span>
                  <p className="text-sm text-gray-700 line-clamp-3 bg-gray-50 p-4 rounded-xl max-w-lg">
                    {form.productDescription}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-brand-50 border border-brand-100 rounded-2xl text-center">
                <div className="flex flex-col items-center mb-3">
                  <span className="text-sm font-bold text-brand-900">Daily Generation Limit</span>
                  <span className="text-xs font-bold text-brand-600 mt-1">{remainingInfo.used} / {remainingInfo.limit}</span>
                </div>
                <div className="w-full max-w-md mx-auto h-2 bg-brand-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-600 transition-all duration-500" 
                    style={{ width: `${(remainingInfo.used / remainingInfo.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-brand-700 mt-3 flex items-center justify-center gap-1.5">
                  <AlertCircle size={12} />
                  You have {remainingInfo.remaining} generations left today.
                </p>
              </div>

              <div className="flex justify-between pt-6">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold">
                  <ArrowLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading || remainingInfo.remaining <= 0}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black disabled:opacity-50 flex items-center gap-3 text-lg transition-transform hover:scale-105"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="text-brand-400" />}
                  {loading ? "Generating..." : "Generate 5 Pages"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-10 text-center space-y-4 animate-pulse">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-bold border border-brand-100">
            <CheckCircle2 size={16} />
            Step 4/4: Initializing AI Engines
          </div>
          <p className="text-gray-500 max-w-sm mx-auto">
            Our AI is currently writing your landing page, about section, FAQs, blog articles, and reviews. 
            <strong> Please don&apos;t refresh.</strong>
          </p>
        </div>
      )}
    </div>
  );
}
