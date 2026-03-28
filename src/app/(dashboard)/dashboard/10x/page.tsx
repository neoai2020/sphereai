"use client";

import { 
  Zap, 
  Share2, 
  Target, 
  BarChart3, 
  Facebook, 
  Sparkles, 
  FileText, 
  Link as LinkIcon, 
  Globe, 
  ArrowRight,
  Info,
  Users,
  Clock,
  MessageSquare,
  ShieldCheck,
  MousePointer2,
  ChevronRight,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import { createClient } from "@/lib/supabase/client";
import { VideoPlaceholder } from "@/components/dashboard/video-placeholder";

type TenXProjectRow = {
  id: string;
  name: string;
  product_name: string;
  slug: string;
};

export default function TenXPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const [projects, setProjects] = useState<TenXProjectRow[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  /** Empty string = manual entry; otherwise a project id */
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const PROGRESS_STEPS = [
    "Analyzing Prompt...",
    "Building Marketing Angles...",
    "Crafting Post Copy...",
    "Applying Final Touches...",
    "Almost Ready!",
  ];

  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
  });

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCheckingAccess(false);
        return;
      }

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("has_10x")
        .eq("user_id", user.id)
        .single();
      
      const hasAccess = sub?.has_10x || user.user_metadata?.plan === 'infinite';
      setIsSubscribed(hasAccess);
      if (hasAccess) {
        setProjectsLoading(true);
        const { data: rows } = await supabase
          .from("projects")
          .select("id, name, product_name, slug")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });
        setProjects((rows as TenXProjectRow[]) || []);
        setProjectsLoading(false);
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, []);

  const features = [
    {
      title: "10 Unique Posts",
      description: "10 different hooks & angles per link",
      icon: Share2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "High-Converting Copy",
      description: "Optimized for clicks & engagement",
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Ready to Post",
      description: "Copy-paste directly into Facebook",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const tips = [
    {
      title: "Where to Share",
      icon: Users,
      items: [
        { label: "Niche Facebook Groups", content: "Find groups with 10K–100K members related to your product. Avoid spammy mega-groups." },
        { label: "Your Profile & Stories", content: "Post on your personal profile too. Facebook's algorithm favors personal accounts." },
        { label: "Facebook Pages You Manage", content: "If you have a page, post there and boost the best-performing posts." },
        { label: "Comment Sections", content: "Reply to relevant viral posts with your take and a subtle link. High-traffic comments = free visibility." },
      ]
    },
    {
      title: "When & How to Post",
      icon: Clock,
      items: [
        { label: "Best times", content: "9–11 AM and 7–9 PM in your audience's timezone. Tuesday–Thursday perform best." },
        { label: "Space them out", content: "Post 1–2 per day across different groups. Never spam the same group twice in a day." },
        { label: "Engage immediately", content: "Reply to every comment within the first hour. Facebook rewards fast engagement with more reach." },
        { label: "Use all 10 angles", content: "Different posts resonate with different people. The curiosity angle might flop where storytelling goes viral." },
      ]
    }
  ];

  async function handleGenerate() {
    if (!selectedProjectId && (!form.name || !form.url)) {
      setError("Please provide both a link name and a promotional link, or pick a website from the list.");
      return;
    }

    setError("");
    setLoading(true);
    setProgressStep(0);
    setPosts([]);

    // Animate progress steps
    let step = 0;
    progressRef.current = setInterval(() => {
      step++;
      if (step < PROGRESS_STEPS.length - 1) {
        setProgressStep(step);
      }
    }, 1800);

    try {
      const body = selectedProjectId
        ? { projectId: selectedProjectId }
        : {
            productName: form.name,
            productDescription:
              form.description ||
              `Promotional link for ${form.name}. The target landing page URL is ${form.url}. Generate 10 high-converting Facebook posts to drive traffic.`,
            productLink: form.url,
          };

      const res = await fetch("/api/ai/10x", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data: { posts?: string[]; linkUsed?: string; error?: string };
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Server returned non-JSON response:", text);
        throw new Error(`Server Error: ${text.slice(0, 100) || "Invalid response from server"}`);
      }

      if (res.ok) {
        if (!data.posts || !Array.isArray(data.posts) || data.posts.length === 0) {
          throw new Error("AI service didn't return any posts — please try a more detailed name or description.");
        }
        const linkForReplace =
          (typeof data.linkUsed === "string" && data.linkUsed) || form.url || "";
        const processedPosts = data.posts.map((p: string) =>
          p.replace(/\[YOUR LINK HERE\]/g, linkForReplace)
        );
        setTimeout(() => {
          setPosts(processedPosts);
          setLoading(false);
          setProgressStep(0);
          if (progressRef.current) clearInterval(progressRef.current);
        }, 600);
      } else {
        setError(data.error || "Generation failed. Please try again.");
        setLoading(false);
        if (progressRef.current) clearInterval(progressRef.current);
      }
    } catch (err: any) {
      console.error("10X Error:", err);
      setError(err?.message || "Failed to connect to AI service.");
      setLoading(false);
      if (progressRef.current) clearInterval(progressRef.current);
    }
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  if (checkingAccess) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Checking Permissions...</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <RestrictedContent 
        title="10X Mode Locked"
        description="Upgrade to the 10x plan to unlock unlimited Facebook post generation and advanced marketing tools."
        onUpgrade={() => window.location.href = "/activate"}
        icon={Zap}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
              10X Facebook Post Generator
            </h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                10X Mode Active
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
          Generate 10 unique, high-converting Facebook posts from a single link — each with a different angle to maximize reach and clicks.
        </p>
      </div>

      {/* Training Video */}
      <VideoPlaceholder 
        title="10X Facebook Strategy — Full Walkthrough"
        subtitle="Video training coming soon"
      />

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center`}>
              <f.icon size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Generator Card */}
      <div className="relative">
        <div className={`bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden`}>
          <div className="p-8 md:p-10 space-y-10">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Facebook className="text-white fill-white" size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Generate 10 Facebook Posts</h2>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
                Premium
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-5 border border-red-100 rounded-2xl flex items-center gap-3 font-bold">
                <Info size={18} />
                {error}
              </div>
            )}

            {/* Source: existing website vs manual */}
            <div className="space-y-3">
              <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">
                Use your generated website
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                disabled={projectsLoading}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="">Enter link and details manually</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name || p.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 font-medium ml-1">
                {selectedProjectId
                  ? "AI will use your Site Forge data and landing page copy to write posts. The link will be your product URL if set, otherwise your public site URL."
                  : projects.length === 0 && !projectsLoading
                    ? "No websites yet — create one in Site Forge, or use manual entry below."
                    : "Or leave this on “manual” and fill in the fields below."}
              </p>
            </div>

            {!selectedProjectId && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Link Name/Goal</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. My Website, My New Product, eBook Launch"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Promotional Link</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                        <LinkIcon size={20} />
                      </div>
                      <input
                        type="url"
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://example.com/product"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Product Description (Optional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Briefly describe the product, its key benefits, or the target audience to get better AI results..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium h-32 resize-none"
                  />
                </div>
              </>
            )}

            {/* Generate Button */}
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-indigo-500/10"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin text-white/50" />
              ) : (
                <Sparkles size={20} className="text-white/80 fill-white/20" />
              )}
              {loading ? "AI Crafting your posts..." : "Generate 10 Intelligent Posts"}
            </button>

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">
                    {PROGRESS_STEPS[progressStep]}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {Math.round(((progressStep + 1) / PROGRESS_STEPS.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between">
                  {PROGRESS_STEPS.map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i <= progressStep ? "bg-indigo-500 scale-110" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Generated Posts Section */}
      {posts.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-black text-gray-900">Your AI-Generated Content Suite</h2>
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">10 Results Ready</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                        {i + 1}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Angle {i + 1}</span>
                   </div>
                   <button 
                    onClick={() => handleCopy(post, i)}
                    className={`p-2.5 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
                      copiedIndex === i 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white"
                    }`}
                   >
                     {copiedIndex === i ? <Check size={16} /> : <Copy size={16} />}
                     {copiedIndex === i ? "Copied" : "Copy Post"}
                   </button>
                </div>
                <div className="prose prose-sm max-w-none">
                   <p className="text-gray-700 font-medium whitespace-pre-wrap leading-relaxed italic">
                     {post}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips Section */}
      <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm space-y-12">
        <div className="flex items-center gap-4 text-indigo-600">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Info size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pro Tips: How to Go Viral on Facebook</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {tips.map((tip, i) => (
            <div key={i} className="space-y-8">
              <div className="flex items-center gap-3 text-indigo-600 border-b border-gray-50 pb-4">
                <tip.icon size={22} className="stroke-[2.5px]" />
                <h3 className="font-black uppercase tracking-[0.2em] text-sm">{tip.title}</h3>
              </div>
              <ul className="space-y-6">
                {tip.items.map((item, j) => (
                  <li key={j} className="space-y-1.5 pl-2 border-l-2 border-indigo-100">
                    <span className="block font-black text-gray-900 text-sm">{item.label}</span>
                    <span className="block text-sm text-gray-500 font-medium leading-relaxed">{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Golden Rule Callout */}
        <div className="bg-indigo-900 rounded-[32px] p-8 md:p-10 text-white flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center flex-shrink-0 border border-white/10">
            <MessageSquare className="text-white" size={32} />
          </div>
          <div className="space-y-3 relative z-10">
            <h4 className="text-xl font-bold text-white uppercase tracking-wider">The Golden Rule of Facebook Groups</h4>
            <p className="text-indigo-100 font-medium leading-relaxed">
              Contribute value to the group FIRST. Comment on other people&apos;s posts, answer questions, and be helpful for a few days before sharing your own link posts. Group admins are more likely to approve your posts, and members are more likely to engage with someone they recognize. A warm audience converts <span className="text-emerald-400 font-bold italic">5–10x better</span> than cold posting.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
