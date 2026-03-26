"use client";

import { useState, useRef, useCallback } from "react";
import {
  Palette, Save, Loader2, Check, Globe, Upload, RefreshCw, X, Image as ImageIcon, Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

const PAGE_TABS = [
  { id: "landing", label: "Landing" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
  { id: "blog", label: "Blog" },
  { id: "reviews", label: "Reviews" },
];

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SiteCustomizer({ project }: CustomizerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewTs, setPreviewTs] = useState(Date.now());
  const [activePage, setActivePage] = useState("landing");

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
        setPreviewTs(Date.now());
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const activeStyle = STYLE_PRESETS.find(s => s.themeId === config.theme_id && s.primary === config.primary_color);

  const pageSlug = activePage === "landing" ? "" : activePage;
  const previewUrl = `/software/user/${project.id}${pageSlug ? `/${pageSlug}` : ""}?t=${previewTs}`;
  const addressUrl = `/software/user/${project.id}${pageSlug ? `/${pageSlug}` : ""}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ height: "780px" }}>
      <div className="flex h-full">

        {/* ── Sidebar ── */}
        <div className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <Palette size={16} className="text-brand-600" /> Site Customizer
            </h2>
          </div>

          {/* Page Tabs */}
          <div className="px-4 pt-4 pb-0">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Page</p>
            <div className="flex gap-1 flex-wrap">
              {PAGE_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-black transition-all",
                    activePage === tab.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

            {/* Site Name */}
            <section className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Site Name</label>
              <input
                type="text"
                value={config.name}
                onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your site name"
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-200 text-sm font-semibold text-gray-900 transition-all"
              />
            </section>

            {/* CTA Link */}
            <section className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1.5">
                <LinkIcon size={10} /> CTA Button Link
              </label>
              <input
                type="url"
                value={config.product_url}
                onChange={e => setConfig(prev => ({ ...prev, product_url: e.target.value }))}
                placeholder="https://your-product.com"
                className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-200 text-sm font-medium text-gray-900 transition-all"
              />
              <p className="text-[10px] text-gray-400 font-medium">All CTA buttons on your site link here</p>
            </section>

            {/* Logo */}
            <section className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo</label>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-400 transition-colors shrink-0"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {config.site_logo
                    ? <img src={config.site_logo} className="w-full h-full object-contain" alt="logo" />
                    : <Globe size={16} className="text-gray-300" />}
                </div>
                <div className="flex-1 space-y-1">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={11} /> Upload Logo
                  </button>
                  {config.site_logo && (
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, site_logo: "" }))}
                      className="w-full flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={9} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Hero Image */}
            <section className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Image</label>
              <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              {config.custom_images?.hero ? (
                <div className="relative">
                  <img src={config.custom_images.hero} className="w-full h-24 object-cover rounded-xl border border-gray-100" alt="hero" />
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: "" } }))}
                    className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => heroInputRef.current?.click()}
                  className="w-full h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                >
                  <ImageIcon size={16} className="text-gray-300" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Upload Hero Image</span>
                </button>
              )}
            </section>

            {/* Style & Tone */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Style & Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLE_PRESETS.map(preset => {
                  const isActive = config.theme_id === preset.themeId && config.primary_color === preset.primary;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setConfig(prev => ({ ...prev, theme_id: preset.themeId, primary_color: preset.primary }))}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all",
                        isActive
                          ? "border-gray-900 bg-gray-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {/* Color strip */}
                      <div className="w-full h-7 rounded-lg overflow-hidden flex">
                        {preset.colors.map((c, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wide",
                        isActive ? "text-gray-900" : "text-gray-400"
                      )}>
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom color */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
                <input
                  type="color"
                  value={config.primary_color}
                  onChange={e => setConfig(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-gray-500">{config.primary_color}</span>
                <span className="text-[10px] text-gray-400 font-medium ml-auto">Custom</span>
              </div>
            </section>

          </div>

          {/* Save */}
          <div className="px-4 py-4 border-t border-gray-100">
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
          <div className="flex items-center justify-between px-5 py-3 bg-gray-100 border-b border-gray-200/50 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preview</span>
              <span className="text-[10px] font-black text-gray-500 capitalize bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                {activePage}
              </span>
            </div>
            <button
              onClick={() => setPreviewTs(Date.now())}
              title="Refresh preview"
              className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-600 transition-colors shadow-sm"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          {/* Browser chrome */}
          <div className="px-4 pt-3 pb-0">
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-2 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-md px-3 py-1 text-[10px] text-gray-400 font-mono truncate">
                {typeof window !== "undefined" ? window.location.origin : ""}{addressUrl}
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <iframe
              key={previewTs + activePage}
              src={previewUrl}
              className="w-full h-full rounded-b-xl border border-gray-200 bg-white"
              title="Site Preview"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
