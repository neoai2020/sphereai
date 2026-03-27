"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Palette, Save, Loader2, Check, Globe, Upload, X, Image as ImageIcon, Link as LinkIcon, RefreshCw, ChevronDown, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

// ─── Style Presets ────────────────────────────────────────────────────────────

const STYLE_PRESETS = [
  { id: "clean",    name: "Clean",    colors: ["#FFFFFF", "#4F46E5", "#F3F4F6"], themeId: "1", primary: "#4F46E5" },
  { id: "minimal",  name: "Minimal",  colors: ["#FAFAFA", "#1F2937", "#E5E7EB"], themeId: "2", primary: "#1F2937" },
  { id: "royal",    name: "Royal",    colors: ["#FAF5FF", "#7C3AED", "#EDE9FE"], themeId: "3", primary: "#7C3AED" },
  { id: "dark",     name: "Dark",     colors: ["#0F172A", "#6366F1", "#1E293B"], themeId: "4", primary: "#6366F1" },
  { id: "soft",     name: "Soft",     colors: ["#FFF7ED", "#F97316", "#FED7AA"], themeId: "5", primary: "#F97316" },
  { id: "ocean",    name: "Ocean",    colors: ["#EFF6FF", "#3B82F6", "#BFDBFE"], themeId: "1", primary: "#3B82F6" },
  { id: "forest",   name: "Forest",   colors: ["#F0FDF4", "#10B981", "#A7F3D0"], themeId: "1", primary: "#10B981" },
  { id: "sunset",   name: "Sunset",   colors: ["#FFF1F2", "#EC4899", "#FBCFE8"], themeId: "5", primary: "#EC4899" },
  { id: "midnight", name: "Midnight", colors: ["#0D0D1A", "#818CF8", "#1E1B4B"], themeId: "4", primary: "#818CF8" },
  { id: "bold",     name: "Bold",     colors: ["#111111", "#EF4444", "#1F1F1F"], themeId: "4", primary: "#EF4444" },
  { id: "warm",     name: "Warm",     colors: ["#FFFBEB", "#D97706", "#FDE68A"], themeId: "5", primary: "#D97706" },
  { id: "slate",    name: "Slate",    colors: ["#F8FAFC", "#475569", "#CBD5E1"], themeId: "2", primary: "#475569" },
  { id: "arctic",   name: "Arctic",   colors: ["#F0F9FF", "#0EA5E9", "#BAE6FD"], themeId: "1", primary: "#0EA5E9" },
  { id: "ember",    name: "Ember",    colors: ["#FFF7ED", "#DC2626", "#FECACA"], themeId: "5", primary: "#DC2626" },
  { id: "neon",     name: "Neon",     colors: ["#050505", "#00FF87", "#0D0D0D"], themeId: "4", primary: "#00FF87" },
];

const PAGE_TABS = [
  { id: "landing", label: "Landing" },
  { id: "about",   label: "About" },
  { id: "faq",     label: "FAQ" },
  { id: "blog",    label: "Blog" },
  { id: "reviews", label: "Reviews" },
];

// ─── Templates ────────────────────────────────────────────────────────────────

type TplBlock =
  | "hero-split" | "hero-center" | "hero-dark" | "hero-minimal" | "hero-magazine"
  | "features-3col" | "features-2col" | "features-list"
  | "benefits-split" | "stats-bar" | "cta-dark" | "cta-light"
  | "text-block" | "text-2col" | "cards-3col" | "cards-2col"
  | "list-rows" | "faq-numbered" | "faq-side"
  | "review-hero" | "review-list" | "review-stats" | "review-masonry"
  | "values-3col" | "banner-accent";

const PAGE_TEMPLATES: Record<string, Array<{ tplId: number; name: string; blocks: TplBlock[] }>> = {
  landing: [
    { tplId: 1, name: "Split Hero",  blocks: ["hero-split",    "features-3col", "benefits-split", "stats-bar",  "cta-dark"  ] },
    { tplId: 2, name: "Centered",    blocks: ["hero-center",   "features-2col", "stats-bar",      "cta-light"               ] },
    { tplId: 3, name: "Bold Dark",   blocks: ["hero-dark",     "features-3col", "cta-dark"                                  ] },
    { tplId: 4, name: "Minimal",     blocks: ["hero-minimal",  "features-list", "cta-light"                                 ] },
    { tplId: 5, name: "Magazine",    blocks: ["hero-magazine", "features-2col", "benefits-split", "stats-bar"               ] },
  ],
  about: [
    { tplId: 1, name: "Story",        blocks: ["text-block",   "cards-2col",  "values-3col"  ] },
    { tplId: 2, name: "Bold Mission", blocks: ["banner-accent","features-3col","text-2col"   ] },
    { tplId: 3, name: "Values First", blocks: ["hero-minimal", "values-3col", "text-block"   ] },
    { tplId: 4, name: "Split",        blocks: ["text-2col",    "text-2col",   "text-2col"    ] },
    { tplId: 5, name: "Minimal",      blocks: ["hero-minimal", "text-block",  "text-block"   ] },
  ],
  faq: [
    { tplId: 1, name: "Accordion",    blocks: ["hero-center",  "list-rows",   "cta-light"    ] },
    { tplId: 2, name: "Two Column",   blocks: ["hero-center",  "cards-2col"                  ] },
    { tplId: 3, name: "Numbered",     blocks: ["hero-minimal", "faq-numbered"                ] },
    { tplId: 4, name: "Bold Q",       blocks: ["banner-accent","list-rows"                   ] },
    { tplId: 5, name: "Side by Side", blocks: ["hero-minimal", "faq-side"                    ] },
  ],
  blog: [
    { tplId: 1, name: "Article",      blocks: ["hero-magazine","text-block",  "text-block"   ] },
    { tplId: 2, name: "Magazine",     blocks: ["hero-magazine","text-2col",   "text-2col"    ] },
    { tplId: 3, name: "Minimal",      blocks: ["hero-minimal", "text-block",  "text-block"   ] },
    { tplId: 4, name: "Bold",         blocks: ["hero-dark",    "faq-numbered"                ] },
    { tplId: 5, name: "Cards",        blocks: ["hero-minimal", "cards-2col",  "cards-2col"   ] },
  ],
  reviews: [
    { tplId: 1, name: "Cards Grid",   blocks: ["hero-center",  "cards-3col",  "cta-dark"     ] },
    { tplId: 2, name: "Featured",     blocks: ["review-hero",  "cards-2col"                  ] },
    { tplId: 3, name: "List",         blocks: ["hero-minimal", "review-list"                 ] },
    { tplId: 4, name: "Stats",        blocks: ["hero-minimal", "review-stats","cards-2col"   ] },
    { tplId: 5, name: "Masonry",      blocks: ["hero-minimal", "review-masonry"              ] },
  ],
};

// ─── Mini block renderer for thumbnails ──────────────────────────────────────

function MiniBlock({ type, c }: { type: TplBlock; c: string }) {
  const a = c + "30", b = c + "18";
  switch (type) {
    case "hero-split":     return <div className="flex gap-0.5 h-6"><div className="flex-1 flex flex-col gap-0.5 justify-center"><div className="h-1 rounded w-3/4" style={{background:a}}/><div className="h-0.5 rounded bg-gray-100 w-full"/><div className="h-1 rounded w-1/3 mt-0.5" style={{background:c}}/></div><div className="w-2/5 rounded" style={{background:b}}/></div>;
    case "hero-center":    return <div className="h-6 flex flex-col items-center justify-center gap-0.5"><div className="h-1 rounded w-1/2" style={{background:a}}/><div className="h-0.5 rounded w-2/3 bg-gray-100"/><div className="h-1 rounded w-1/4 mt-0.5" style={{background:c}}/></div>;
    case "hero-dark":      return <div className="h-7 rounded bg-gray-900 flex items-end p-1 gap-1"><div className="flex-1"><div className="h-1.5 rounded w-1/2 mb-0.5" style={{background:c}}/><div className="h-0.5 rounded w-3/4 bg-gray-700"/></div></div>;
    case "hero-minimal":   return <div className="h-5 flex flex-col justify-center gap-0.5"><div className="h-1 rounded w-2/3" style={{background:a}}/><div className="h-0.5 rounded w-full bg-gray-100"/></div>;
    case "hero-magazine":  return <div className="h-7 rounded flex items-center justify-center" style={{background:b}}><div className="h-1.5 rounded w-10" style={{background:c}}/></div>;
    case "features-3col":  return <div className="flex gap-0.5 h-6">{[0,1,2].map(i=><div key={i} className="flex-1 rounded border border-gray-100 p-0.5 bg-white"><div className="w-2 h-2 rounded mb-0.5" style={{background:b}}/><div className="h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "features-2col":  return <div className="flex gap-0.5 h-6">{[0,1].map(i=><div key={i} className="flex-1 rounded border border-gray-100 p-0.5 bg-white"><div className="w-3 h-3 rounded mb-0.5" style={{background:b}}/><div className="h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "features-list":  return <div className="space-y-0.5 h-6">{[0,1,2].map(i=><div key={i} className="flex items-center gap-0.5 h-1.5"><div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{background:b}}/><div className="flex-1 h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "benefits-split": return <div className="flex gap-0.5 h-6"><div className="w-2/5 rounded" style={{background:b}}/><div className="flex-1 flex flex-col justify-center gap-0.5">{[0,1,2].map(i=><div key={i} className="flex gap-0.5 items-center"><div className="w-1 h-1 rounded-full shrink-0" style={{background:c}}/><div className="flex-1 h-0.5 rounded bg-gray-100"/></div>)}</div></div>;
    case "stats-bar":      return <div className="flex gap-0.5 h-5 justify-around">{[0,1,2,3].map(i=><div key={i} className="flex flex-col items-center gap-0.5"><div className="h-1.5 w-5 rounded" style={{background:b}}/><div className="h-0.5 w-4 rounded bg-gray-100"/></div>)}</div>;
    case "cta-dark":       return <div className="h-5 rounded bg-gray-900 flex items-center justify-center"><div className="h-1.5 w-8 rounded bg-white/20"/></div>;
    case "cta-light":      return <div className="h-5 rounded flex items-center justify-center" style={{background:b}}><div className="h-1.5 w-8 rounded" style={{background:c}}/></div>;
    case "text-block":     return <div className="h-6 rounded border border-gray-100 bg-white p-1 flex flex-col gap-0.5 justify-center">{[100,75,60].map((w,i)=><div key={i} className="h-0.5 rounded bg-gray-100" style={{width:`${w}%`}}/>)}</div>;
    case "text-2col":      return <div className="flex gap-0.5 h-6">{[0,1].map(i=><div key={i} className="flex-1 flex flex-col gap-0.5 justify-center">{[0,1,2].map(j=><div key={j} className="h-0.5 rounded bg-gray-100"/>)}</div>)}</div>;
    case "cards-3col":     return <div className="flex gap-0.5 h-7">{[0,1,2].map(i=><div key={i} className="flex-1 rounded border border-gray-100 bg-white p-0.5 flex flex-col gap-0.5"><div className="h-0.5 rounded bg-gray-100"/><div className="h-0.5 rounded bg-gray-100 w-3/4"/><div className="h-2 w-3 rounded-full bg-gray-100 mt-0.5"/></div>)}</div>;
    case "cards-2col":     return <div className="flex gap-0.5 h-7">{[0,1].map(i=><div key={i} className="flex-1 rounded border border-gray-100 bg-white p-0.5"><div className="w-3 h-3 rounded mb-0.5" style={{background:b}}/><div className="h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "list-rows":      return <div className="space-y-0.5 h-7">{[0,1,2,3].map(i=><div key={i} className="h-1 rounded bg-gray-50 border border-gray-100 flex items-center px-0.5 gap-0.5"><div className="flex-1 h-0.5 rounded bg-gray-200"/><div className="w-1 h-1 rounded-sm bg-gray-200"/></div>)}</div>;
    case "faq-numbered":   return <div className="space-y-0.5 h-7">{[1,2,3].map(i=><div key={i} className="flex gap-0.5 items-center"><div className="text-[5px] font-black w-2 shrink-0" style={{color:c}}>0{i}</div><div className="flex-1 h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "faq-side":       return <div className="space-y-0.5 h-7">{[0,1,2].map(i=><div key={i} className="flex gap-0.5 h-1.5"><div className="w-2/5 h-full rounded bg-gray-100"/><div className="flex-1 h-full rounded bg-gray-50"/></div>)}</div>;
    case "review-hero":    return <div className="h-7 rounded flex items-center p-1 gap-0.5" style={{background:b}}><div className="w-3 h-3 rounded-full bg-white/60 shrink-0"/><div className="flex-1 h-0.5 rounded bg-white/40"/></div>;
    case "review-list":    return <div className="space-y-0.5 h-7">{[0,1,2].map(i=><div key={i} className="flex gap-0.5 items-center h-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-100 shrink-0"/><div className="flex-1 h-0.5 rounded bg-gray-100"/></div>)}</div>;
    case "review-stats":   return <div className="space-y-0.5 h-7">{[5,4,3].map(n=><div key={n} className="flex items-center gap-0.5 h-1.5"><div className="text-[5px] text-gray-400 w-2 shrink-0">{n}★</div><div className="flex-1 h-1 rounded bg-gray-100 overflow-hidden"><div className="h-full rounded" style={{background:c, width:n===5?"80%":n===4?"15%":"5%"}}/></div></div>)}</div>;
    case "review-masonry": return <div className="flex gap-0.5 h-7"><div className="w-1/2 rounded border border-gray-100 bg-white"/><div className="flex-1 flex flex-col gap-0.5"><div className="flex-1 rounded border border-gray-100 bg-white"/><div className="flex-1 rounded border border-gray-100 bg-white"/></div></div>;
    case "values-3col":    return <div className="flex gap-0.5 h-6">{[0,1,2].map(i=><div key={i} className="flex-1 rounded p-0.5" style={{background:b}}><div className="w-2 h-2 rounded mb-0.5" style={{background:c}}/><div className="h-0.5 rounded bg-gray-200"/></div>)}</div>;
    case "banner-accent":  return <div className="h-6 rounded flex items-center px-1.5" style={{background:c}}><div className="h-1.5 w-1/2 rounded bg-white/40"/></div>;
    default:               return <div className="h-3 rounded bg-gray-100"/>;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CustomizerProps {
  project: Project & {
    theme_id?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    site_logo?: string;
    custom_images?: Record<string, string>;
    product_url?: string | null;
    selected_templates?: Record<string, number>;
  };
}

export function SiteCustomizer({ project }: CustomizerProps) {
  const router = useRouter();
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [errorMsg,   setErrorMsg]   = useState<string | null>(null);
  const [origin,     setOrigin]     = useState("");
  const [activePage, setActivePage] = useState("landing");
  const [config, setConfig] = useState({
    theme_id:           project.theme_id           || "1",
    primary_color:      project.primary_color      || "#4F46E5",
    secondary_color:    project.secondary_color    || "#10B981",
    font_family:        project.font_family        || "Inter",
    site_logo:          project.site_logo          || "",
    custom_images:      (project.custom_images     || {}) as Record<string, string>,
    name:               project.name               || "",
    product_url:        project.product_url        || "",
    selected_templates: (project.selected_templates || { landing: 1, about: 1, faq: 1, blog: 1, reviews: 1 }) as Record<string, number>,
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const iframeRef    = useRef<HTMLIFrameElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  function buildPreviewUrl(cfg: typeof config, page: string) {
    const pageSlug  = page === "landing" ? "" : `/${page}`;
    const activeTpl = cfg.selected_templates[page] ?? 1;
    const params    = new URLSearchParams({
      __theme: cfg.theme_id,
      __color: cfg.primary_color,
      __url:   cfg.product_url,
      __tpl:   String(activeTpl),
    });
    return `/software/user/${project.id}${pageSlug}?${params}`;
  }

  function updatePreview(cfg: typeof config, page: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (iframeRef.current) iframeRef.current.src = buildPreviewUrl(cfg, page);
    }, 300);
  }

  function updateConfig(partial: Partial<typeof config>) {
    setConfig(prev => {
      const next = { ...prev, ...partial };
      updatePreview(next, activePage);
      return next;
    });
  }

  function handlePageChange(page: string) {
    setActivePage(page);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (iframeRef.current) iframeRef.current.src = buildPreviewUrl(config, page);
  }

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const base64 = await fileToBase64(file);
    setConfig(prev => ({ ...prev, site_logo: base64 }));
  }, []);

  const handleHeroUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const base64 = await fileToBase64(file);
    setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: base64 } }));
  }, []);

  async function handleSave() {
    setLoading(true); setSuccess(false); setErrorMsg(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
        // Notify any open tabs of the public website to reload
        try {
          new BroadcastChannel("site-updates").postMessage({ projectId: project.id });
        } catch {}
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body.error || `Error ${res.status}`);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
    }
    finally { setLoading(false); }
  }

  const templates  = PAGE_TEMPLATES[activePage] || [];
  const pageSlug   = activePage === "landing" ? "" : `/${activePage}`;
  const addressUrl = `/software/user/${project.id}${pageSlug}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">

      {/* ══ HEADER ROW ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 border-b border-gray-100 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
            <Palette size={24} className="text-brand-600" />
          </div>
          <div>
            <p className="text-lg font-black text-gray-900 leading-none tracking-tight">Design Architect</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" /> Live Editing Platform
            </p>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-100/50 p-1.5 rounded-2xl">
          {PAGE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handlePageChange(tab.id)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap",
                activePage === tab.id
                  ? "bg-white text-gray-950 shadow-md ring-1 ring-black/5 scale-[1.02]"
                  : "text-gray-400 hover:text-gray-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ ALWAYS VISIBLE CORE SETTINGS ═══════════════════════════════════════ */}
      <div className="px-8 py-10 border-b border-gray-100 bg-gray-50/20">
        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
        
        <div className="flex items-center gap-3 mb-8">
           <div className="bg-gray-900 text-white p-1.5 rounded-lg shadow-lg">
              <Globe size={14} />
           </div>
           <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Core Site Configuration</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Site Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Brand Name</label>
            <input
              type="text" value={config.name}
              onChange={e => updateConfig({ name: e.target.value })}
              placeholder="Your Business Name"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-100 outline-none focus:border-brand-500 text-sm font-black text-gray-950 shadow-sm transition-all focus:ring-4 focus:ring-brand-500/5"
            />
          </div>

          {/* CTA Link */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <LinkIcon size={10} /> Link Destination
            </label>
            <input
              type="url" value={config.product_url}
              onChange={e => updateConfig({ product_url: e.target.value })}
              placeholder="https://your-product.com"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-gray-100 outline-none focus:border-brand-500 text-sm font-bold text-gray-950 shadow-sm transition-all focus:ring-4 focus:ring-brand-500/5"
            />
          </div>

          {/* Logo */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Primary Logo</label>
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-50 shadow-sm group/logo">
              <div
                onClick={() => logoInputRef.current?.click()}
                className="w-12 h-12 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group-hover/logo:border-brand-500 transition-all"
              >
                {config.site_logo
                  ? <img src={config.site_logo} className="w-full h-full object-contain p-2" alt="logo" />
                  : <Upload size={16} className="text-gray-300" />}
              </div>
              <div className="flex flex-col gap-1">
                 <button onClick={() => logoInputRef.current?.click()} className="text-[10px] font-black text-gray-400 hover:text-brand-600 uppercase tracking-widest text-left">Upload</button>
                 {config.site_logo && (
                    <button onClick={() => updateConfig({ site_logo: "" })} className="text-[9px] font-bold text-red-400 hover:text-red-600 transition-colors text-left uppercase">Clear</button>
                 )}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Media</label>
            {config.custom_images?.hero ? (
              <div className="relative group/asset">
                <img src={config.custom_images.hero} className="w-full h-14 object-cover rounded-2xl border border-gray-100 shadow-sm" alt="hero" />
                <button
                  onClick={() => setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: "" } }))}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/asset:opacity-100 transition-all scale-75 group-hover/asset:scale-100"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => heroInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-dashed border-gray-200 text-[10px] font-black text-gray-400 hover:border-brand-500 hover:text-brand-600 hover:bg-white bg-gray-50/10 transition-all h-14 shadow-inner"
              >
                <ImageIcon size={14} /> UPDATE COVER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ STYLE & TONE ROW ══════════════════════════════════════════════════ */}
      <div className="px-8 py-10 border-b border-gray-50 bg-white">
        <div className="flex items-center justify-between mb-8">
           <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Elite Color Palettes</p>
              <p className="text-xs text-gray-400 font-medium italic">Hand-crafted styles for modern conversion</p>
           </div>
           <div className="h-px flex-1 bg-gray-50 mx-8" />
        </div>

        <div className="flex flex-wrap gap-4">
          {STYLE_PRESETS.map(preset => {
            const isActive = config.theme_id === preset.themeId && config.primary_color === preset.primary;
            return (
              <button
                key={preset.id}
                onClick={() => updateConfig({ theme_id: preset.themeId, primary_color: preset.primary })}
                className={cn(
                  "flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all w-24 sm:w-28",
                  isActive
                    ? "border-brand-500 bg-white shadow-xl shadow-brand-500/10 scale-105 z-10 ring-4 ring-brand-500/5 font-black text-gray-950"
                    : "border-transparent bg-gray-50 overflow-hidden opacity-60 hover:opacity-100 hover:bg-white hover:border-gray-100 hover:scale-105"
                )}
              >
                <div className="flex w-full h-12 rounded-xl overflow-hidden shadow-inner font-bold">
                  {preset.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isActive ? "text-gray-950" : "text-gray-400"
                )}>
                  {preset.name}
                </span>
              </button>
            );
          })}

          {/* Custom color */}
          <div className="flex flex-col items-center gap-3 p-3 rounded-2xl border-2 border-transparent bg-gray-50 w-24 sm:w-28 opacity-60 hover:opacity-100 hover:bg-white hover:border-gray-100 transition-all hover:scale-105">
            <div className="w-full h-12 rounded-xl overflow-hidden shadow-inner relative">
              <input
                type="color"
                value={config.primary_color}
                onChange={e => updateConfig({ primary_color: e.target.value })}
                className="absolute inset-0 w-full h-full cursor-pointer border-none scale-150"
                title="Custom color"
              />
            </div>
            <span className="text-[10px] font-mono text-gray-400 font-bold">{config.primary_color}</span>
          </div>
        </div>
      </div>

      {/* ══ TEMPLATES ROW ════════════════════════════════════════════════════ */}
      <div className="px-8 py-12 bg-gray-50/30 border-b border-gray-100">
        <div className="flex items-center justify-between mb-10">
           <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Structural Layouts</p>
              <p className="text-xs text-gray-400 font-medium italic">Optimized for {activePage} content</p>
           </div>
           <div className="h-px flex-1 bg-gray-200/50 mx-8" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {templates.map(tpl => {
            const isSelected = config.selected_templates[activePage] === tpl.tplId;
            return (
              <button
                key={tpl.tplId}
                onClick={() => {
                  updateConfig({ 
                    selected_templates: { ...config.selected_templates, [activePage]: tpl.tplId } 
                  });
                }}
                className={cn(
                  "group/tpl flex flex-col rounded-2xl border-2 overflow-hidden transition-all h-full",
                  isSelected
                    ? "border-gray-950 bg-white shadow-2xl scale-[1.02] z-10"
                    : "border-transparent bg-white hover:border-gray-200 hover:shadow-xl opacity-70 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "p-5 space-y-2 flex-1",
                  isSelected ? "bg-white" : "bg-gray-50/50"
                )}>
                  {tpl.blocks.map((b, i) => <MiniBlock key={i} type={b} c={config.primary_color} />)}
                </div>
                <div className={cn(
                  "px-5 py-3 flex items-center justify-between border-t",
                  isSelected ? "bg-gray-950 border-gray-950" : "bg-white border-gray-50"
                )}>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isSelected ? "text-white" : "text-gray-400"
                  )}>
                    {tpl.name}
                  </span>
                  {isSelected && <CheckCircle2 size={12} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ FULL-WIDTH PREVIEW + CONTROLS ════════════════════════════════════ */}
      <div className="flex flex-col bg-white" style={{ height: "850px" }}>
        {/* Preview status bar with SAVE button moved here */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Preview</span>
              <div className="h-4 w-px bg-gray-200" />
              <span className="text-xs font-black text-gray-950 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full capitalize">
                {activePage}
              </span>
            </div>
            
            <button
              onClick={() => { if (iframeRef.current) iframeRef.current.src = buildPreviewUrl(config, activePage); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-gray-400 hover:text-gray-900 transition-all"
            >
              <RefreshCw size={14} /> FORCE REFRESH
            </button>
          </div>

          {/* Moved Save Changes here */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2.5 px-10 py-3.5 rounded-2xl bg-gray-950 text-white text-sm font-black hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-black/20"
            >
              {loading   ? <><Loader2 size={16} className="animate-spin" /> SYNCING…</>
               : success ? <><CheckCircle2 size={16} className="text-emerald-400" /> CHANGES DEPLOYED</>
               :           <><Save size={16} /> SAVE & PUBLISH</>}
            </button>
            {errorMsg && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                ✕ {errorMsg}
              </span>
            )}
          </div>
        </div>

        {/* Browser chrome */}
        <div className="px-8 pt-6 pb-0 bg-gray-50/50 shrink-0">
          <div className="bg-white rounded-t-[2.5rem] border border-b-0 border-gray-100 px-8 py-4 flex items-center gap-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.06)]">
            <div className="flex gap-2.5">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400/20 border border-red-400/30" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/20 border border-yellow-400/30" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400/20 border border-green-400/30" />
            </div>
            <div className="flex-1 bg-gray-50/80 rounded-2xl px-6 py-2.5 text-[10px] text-gray-400 font-mono flex items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">
                <Check size={10} /> SSL SECURE
              </div>
              {origin}{addressUrl}
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-hidden bg-gray-50/50">
          <iframe
            ref={iframeRef}
            src={buildPreviewUrl(config, activePage)}
            className="w-full h-full rounded-b-[2.5rem] border border-gray-100 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
            title="Site Preview"
          />
        </div>
      </div>

    </div>
  );
}
