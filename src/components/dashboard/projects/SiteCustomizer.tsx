"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Palette, Save, Loader2, Check, Globe, Upload, RefreshCw, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

// ─── Constants ───────────────────────────────────────────────────────────────

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
  { id: "landing",  label: "Landing" },
  { id: "about",    label: "About" },
  { id: "faq",      label: "FAQ" },
  { id: "blog",     label: "Blog" },
  { id: "reviews",  label: "Reviews" },
];

// Wireframe layout templates per page type
// Each template is described as a series of visual "blocks" (for thumbnail rendering)
const PAGE_TEMPLATES: Record<string, Array<{ id: string; name: string; blocks: string[] }>> = {
  landing: [
    { id: "split",    name: "Split Hero",    blocks: ["hero-split", "features-3col", "benefits-side", "stats", "cta"] },
    { id: "centered", name: "Centered",      blocks: ["hero-center", "features-2col", "stats", "cta"] },
    { id: "bold",     name: "Bold",          blocks: ["hero-full", "features-3col", "cta-dark"] },
  ],
  about: [
    { id: "story",    name: "Story",         blocks: ["header-center", "text-2col", "values-grid", "team"] },
    { id: "minimal",  name: "Minimal",       blocks: ["header-left", "text-full", "values-list"] },
  ],
  faq: [
    { id: "accordion", name: "Accordion",   blocks: ["header-center", "faq-list", "cta"] },
    { id: "two-col",   name: "Two Column",  blocks: ["header-left", "faq-2col"] },
  ],
  blog: [
    { id: "article",  name: "Article",      blocks: ["hero-blog", "text-full", "sections"] },
    { id: "magazine", name: "Magazine",     blocks: ["header-left", "text-2col", "sections"] },
  ],
  reviews: [
    { id: "cards",    name: "Cards Grid",   blocks: ["header-center", "reviews-3col", "stats"] },
    { id: "list",     name: "List",         blocks: ["header-left", "reviews-list"] },
  ],
};

// ─── Wireframe Block Renderer ─────────────────────────────────────────────────

function WireframeBlock({ type, color }: { type: string; color: string }) {
  const accent = color + "90";
  const light  = color + "20";
  const mid    = color + "40";

  const blocks: Record<string, JSX.Element> = {
    "hero-split": (
      <div className="flex gap-1 h-8">
        <div className="flex-1 flex flex-col gap-1 justify-center">
          <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: accent }} />
          <div className="h-1 rounded-full w-full bg-gray-200" />
          <div className="h-1 rounded-full w-2/3 bg-gray-200" />
          <div className="h-2 rounded w-1/2 mt-0.5" style={{ backgroundColor: color }} />
        </div>
        <div className="w-1/3 rounded" style={{ backgroundColor: light }} />
      </div>
    ),
    "hero-center": (
      <div className="flex flex-col items-center gap-1 h-8 justify-center">
        <div className="h-1.5 rounded-full w-2/3" style={{ backgroundColor: accent }} />
        <div className="h-1 rounded-full w-full bg-gray-200" />
        <div className="h-2 rounded w-1/3 mt-0.5 mx-auto" style={{ backgroundColor: color }} />
      </div>
    ),
    "hero-full": (
      <div className="h-8 rounded flex items-end p-1" style={{ backgroundColor: "#111" }}>
        <div className="h-1.5 rounded-full w-1/2" style={{ backgroundColor: color }} />
      </div>
    ),
    "hero-blog": (
      <div className="h-6 rounded flex items-center px-1" style={{ backgroundColor: light }}>
        <div className="h-1.5 rounded-full w-3/4" style={{ backgroundColor: accent }} />
      </div>
    ),
    "features-3col": (
      <div className="flex gap-1 h-5">
        {[0,1,2].map(i => <div key={i} className="flex-1 rounded bg-gray-100" />)}
      </div>
    ),
    "features-2col": (
      <div className="flex gap-1 h-5">
        {[0,1].map(i => <div key={i} className="flex-1 rounded bg-gray-100" />)}
      </div>
    ),
    "benefits-side": (
      <div className="flex gap-1 h-5">
        <div className="w-1/2 rounded" style={{ backgroundColor: light }} />
        <div className="flex-1 flex flex-col gap-0.5 justify-center">
          {[0,1,2].map(i => <div key={i} className="h-0.5 rounded bg-gray-200 w-full" />)}
        </div>
      </div>
    ),
    "stats": (
      <div className="flex gap-1 h-4 justify-center">
        {[0,1,2,3].map(i => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="h-1.5 w-full rounded" style={{ backgroundColor: mid }} />
            <div className="h-0.5 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    ),
    "cta": (
      <div className="h-5 rounded flex items-center justify-center" style={{ backgroundColor: light }}>
        <div className="h-2 w-1/3 rounded" style={{ backgroundColor: color }} />
      </div>
    ),
    "cta-dark": (
      <div className="h-5 rounded flex items-center justify-center bg-gray-800">
        <div className="h-2 w-1/3 rounded bg-white" />
      </div>
    ),
    "header-center": (
      <div className="flex flex-col items-center gap-0.5 h-5 justify-center">
        <div className="h-1.5 rounded w-1/2" style={{ backgroundColor: accent }} />
        <div className="h-0.5 rounded w-3/4 bg-gray-200" />
      </div>
    ),
    "header-left": (
      <div className="flex flex-col gap-0.5 h-5 justify-center">
        <div className="h-1.5 rounded w-1/2" style={{ backgroundColor: accent }} />
        <div className="h-0.5 rounded w-3/4 bg-gray-200" />
      </div>
    ),
    "text-2col": (
      <div className="flex gap-1 h-5">
        <div className="flex-1 flex flex-col gap-0.5">
          {[0,1,2].map(i => <div key={i} className="h-0.5 rounded bg-gray-200 w-full" />)}
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          {[0,1,2].map(i => <div key={i} className="h-0.5 rounded bg-gray-200 w-full" />)}
        </div>
      </div>
    ),
    "text-full": (
      <div className="flex flex-col gap-0.5 h-5 justify-center">
        {[0,1,2].map(i => <div key={i} className="h-0.5 rounded bg-gray-200 w-full" />)}
      </div>
    ),
    "values-grid": (
      <div className="grid grid-cols-3 gap-0.5 h-4">
        {[0,1,2].map(i => <div key={i} className="rounded" style={{ backgroundColor: light }} />)}
      </div>
    ),
    "values-list": (
      <div className="flex flex-col gap-0.5 h-5">
        {[0,1].map(i => <div key={i} className="h-1 rounded bg-gray-100 flex items-center gap-0.5 px-0.5">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
          <div className="flex-1 h-0.5 rounded bg-gray-200" />
        </div>)}
      </div>
    ),
    "team": (
      <div className="flex gap-1 h-4">
        {[0,1,2].map(i => <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <div className="h-0.5 rounded w-full bg-gray-100" />
        </div>)}
      </div>
    ),
    "faq-list": (
      <div className="flex flex-col gap-0.5 h-6">
        {[0,1,2].map(i => <div key={i} className="h-1.5 rounded bg-gray-100 flex items-center px-0.5">
          <div className="flex-1 h-0.5 rounded bg-gray-200" />
          <div className="w-1 h-1 text-gray-400">+</div>
        </div>)}
      </div>
    ),
    "faq-2col": (
      <div className="flex gap-1 h-6">
        <div className="flex-1 flex flex-col gap-0.5">
          {[0,1].map(i => <div key={i} className="h-1.5 rounded bg-gray-100" />)}
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          {[0,1].map(i => <div key={i} className="h-1.5 rounded bg-gray-100" />)}
        </div>
      </div>
    ),
    "sections": (
      <div className="flex flex-col gap-0.5 h-5">
        <div className="h-1 rounded w-1/3" style={{ backgroundColor: mid }} />
        {[0,1].map(i => <div key={i} className="h-0.5 rounded bg-gray-200 w-full" />)}
      </div>
    ),
    "reviews-3col": (
      <div className="flex gap-1 h-5">
        {[0,1,2].map(i => <div key={i} className="flex-1 rounded bg-gray-50 border border-gray-100 flex flex-col gap-0.5 p-0.5">
          <div className="flex gap-0.5">{[0,1,2].map(j => <div key={j} className="w-1 h-0.5 rounded" style={{ backgroundColor: "#FBBF24" }} />)}</div>
          <div className="h-0.5 rounded bg-gray-200 w-full" />
        </div>)}
      </div>
    ),
    "reviews-list": (
      <div className="flex flex-col gap-0.5 h-6">
        {[0,1].map(i => <div key={i} className="h-2 rounded bg-gray-50 border border-gray-100 flex items-center gap-0.5 px-0.5">
          <div className="w-2 h-2 rounded-full bg-gray-200" />
          <div className="flex-1 h-0.5 rounded bg-gray-200" />
        </div>)}
      </div>
    ),
  };

  return blocks[type] || <div className="h-2 rounded bg-gray-100" />;
}

// ─── Template Card ─────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  isSelected,
  color,
  onClick,
}: {
  template: { id: string; name: string; blocks: string[] };
  isSelected: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-2 rounded-xl border transition-all space-y-1.5",
        isSelected
          ? "border-gray-900 bg-white shadow-md"
          : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
      )}
    >
      {/* Wireframe preview */}
      <div className="space-y-1 p-1.5 rounded-lg bg-white border border-gray-100">
        {template.blocks.map((block, i) => (
          <WireframeBlock key={i} type={block} color={color} />
        ))}
      </div>
      <div className="flex items-center justify-between px-0.5">
        <span className={cn("text-[9px] font-black uppercase tracking-wide", isSelected ? "text-gray-900" : "text-gray-400")}>
          {template.name}
        </span>
        {isSelected && <Check size={10} className="text-gray-900" />}
      </div>
    </button>
  );
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
  };
}

export function SiteCustomizer({ project }: CustomizerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activePage, setActivePage] = useState("landing");
  const [origin, setOrigin] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<Record<string, string>>({
    landing: "split", about: "story", faq: "accordion", blog: "article", reviews: "cards",
  });

  const [config, setConfig] = useState({
    theme_id: project.theme_id || "1",
    primary_color: project.primary_color || "#4F46E5",
    secondary_color: project.secondary_color || "#10B981",
    font_family: project.font_family || "Inter",
    site_logo: project.site_logo || "",
    custom_images: (project.custom_images || {}) as Record<string, string>,
    name: project.name || "",
    product_url: project.product_url || "",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const iframeRef    = useRef<HTMLIFrameElement>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  // Build the iframe src with override params (live preview without save)
  const previewSrc = useMemo(() => {
    const pageSlug = activePage === "landing" ? "" : `/${activePage}`;
    const params = new URLSearchParams({
      __theme: config.theme_id,
      __color: config.primary_color,
      __url:   config.product_url,
      _ts:     String(Date.now()),
    });
    return `/software/user/${project.id}${pageSlug}?${params.toString()}`;
  }, [config.theme_id, config.primary_color, config.product_url, activePage, project.id]);

  // Debounced iframe src update (no React key change = no flicker)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = previewSrc;
      }
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [previewSrc]);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setConfig(prev => ({ ...prev, site_logo: base64 }));
  }, []);

  const handleHeroUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: base64 } }));
  }, []);

  async function handleSave() {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`/api/projects/${project.id}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const templates = PAGE_TEMPLATES[activePage] || [];
  const pageSlug  = activePage === "landing" ? "" : `/${activePage}`;
  const addressUrl = `/software/user/${project.id}${pageSlug}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ height: "800px" }}>
      <div className="flex h-full">

        {/* ── Sidebar ── */}
        <div className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <Palette size={15} className="text-brand-600" /> Site Customizer
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">

            {/* ─ Style & Tone ─ */}
            <div className="px-4 pt-5 pb-4 border-b border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Style & Tone</p>
              <div className="grid grid-cols-3 gap-1.5">
                {STYLE_PRESETS.map(preset => {
                  const isActive = config.theme_id === preset.themeId && config.primary_color === preset.primary;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setConfig(prev => ({ ...prev, theme_id: preset.themeId, primary_color: preset.primary }))}
                      className={cn(
                        "flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all",
                        isActive ? "border-gray-900 bg-white shadow-sm" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="w-full h-6 rounded-lg overflow-hidden flex">
                        {preset.colors.map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className={cn("text-[8px] font-black uppercase tracking-wide", isActive ? "text-gray-900" : "text-gray-400")}>
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Custom color */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 mt-2">
                <input
                  type="color"
                  value={config.primary_color}
                  onChange={e => setConfig(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent shrink-0"
                />
                <span className="text-xs font-mono font-bold text-gray-500">{config.primary_color}</span>
                <span className="text-[10px] text-gray-400 font-medium ml-auto">Custom</span>
              </div>
            </div>

            {/* ─ Site Settings ─ */}
            <div className="px-4 py-4 space-y-4 border-b border-gray-100">
              {/* Site Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Site Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your site name"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-brand-500/10 text-sm font-semibold text-gray-900 transition-all"
                />
              </div>

              {/* CTA Link */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1">
                  <LinkIcon size={9} /> CTA Button Link
                </label>
                <input
                  type="url"
                  value={config.product_url}
                  onChange={e => setConfig(prev => ({ ...prev, product_url: e.target.value }))}
                  placeholder="https://your-product.com"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-brand-500/10 text-sm font-medium text-gray-900 transition-all"
                />
              </div>

              {/* Logo + Hero in one row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Logo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo</label>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <div
                    className="h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-400 transition-colors"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {config.site_logo
                      ? <img src={config.site_logo} className="w-full h-full object-contain p-1" alt="logo" />
                      : <div className="flex flex-col items-center gap-0.5">
                          <Globe size={14} className="text-gray-300" />
                          <span className="text-[8px] text-gray-300 font-bold">Upload</span>
                        </div>}
                  </div>
                  {config.site_logo && (
                    <button onClick={() => setConfig(prev => ({ ...prev, site_logo: "" }))} className="w-full text-[9px] font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-0.5">
                      <X size={8} /> Remove
                    </button>
                  )}
                </div>

                {/* Hero Image */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Img</label>
                  <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                  {config.custom_images?.hero ? (
                    <div className="relative h-12">
                      <img src={config.custom_images.hero} className="w-full h-full object-cover rounded-xl border border-gray-100" alt="hero" />
                      <button
                        onClick={() => setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: "" } }))}
                        className="absolute top-1 right-1 w-4 h-4 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        <X size={8} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => heroInputRef.current?.click()}
                      className="w-full h-12 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5 hover:border-brand-400 transition-all"
                    >
                      <ImageIcon size={14} className="text-gray-300" />
                      <span className="text-[8px] font-bold text-gray-300">Upload</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ─ Page Templates ─ */}
            <div className="px-4 pt-4 pb-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Page Templates</p>

              {/* Page tabs */}
              <div className="flex gap-1 flex-wrap mb-4">
                {PAGE_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePage(tab.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-black transition-all",
                      activePage === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Template cards for selected page */}
              <div className="space-y-2">
                {templates.map(tpl => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isSelected={selectedTemplates[activePage] === tpl.id}
                    color={config.primary_color}
                    onClick={() => setSelectedTemplates(prev => ({ ...prev, [activePage]: tpl.id }))}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* ─ Save ─ */}
          <div className="px-4 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                : success
                ? <><Check size={14} className="text-green-400" /> Saved!</>
                : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-2.5 bg-gray-100 border-b border-gray-200/50 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Preview</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 font-medium">Updates automatically</span>
            </div>
            <button
              onClick={() => { if (iframeRef.current) iframeRef.current.src = previewSrc; }}
              title="Refresh preview"
              className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-600 transition-colors shadow-sm"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          {/* Browser chrome */}
          <div className="px-4 pt-3 pb-0">
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-1.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-md px-3 py-0.5 text-[10px] text-gray-400 font-mono truncate">
                {origin}{addressUrl}
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <iframe
              ref={iframeRef}
              src={previewSrc}
              className="w-full h-full rounded-b-xl border border-gray-200 bg-white"
              title="Site Preview"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
