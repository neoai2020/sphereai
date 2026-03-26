"use client";

import { useState, useRef, useCallback } from "react";
import {
  Palette, Layout, Zap, Monitor, Smartphone, Save,
  Loader2, Check, Globe, Upload, RefreshCw, Type, Image as ImageIcon, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

const THEMES = [
  { id: "1", name: "SaaS Classic", desc: "Centered hero, clean sections", icon: Layout },
  { id: "2", name: "Minimal Agency", desc: "Left-aligned, high whitespace", icon: Monitor },
  { id: "3", name: "Glass Modern", desc: "Blurred cards, deep gradients", icon: Zap },
  { id: "4", name: "Dark Tech", desc: "Dark mode first, neon borders", icon: Smartphone },
  { id: "5", name: "Soft Elegant", desc: "Rounded cards, soft shadows", icon: Palette },
];

const COLOR_PALETTES = [
  { id: "brand",  primary: "#4F46E5", secondary: "#C026D3", label: "Indigo" },
  { id: "blue",   primary: "#3B82F6", secondary: "#06B6D4", label: "Ocean" },
  { id: "green",  primary: "#10B981", secondary: "#059669", label: "Forest" },
  { id: "sunset", primary: "#EC4899", secondary: "#F59E0B", label: "Sunset" },
  { id: "mono",   primary: "#1F2937", secondary: "#4B5563", label: "Mono" },
];

interface CustomizerProps {
  project: Project & {
    theme_id?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    site_logo?: string;
    custom_images?: Record<string, string>;
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

  const [config, setConfig] = useState({
    theme_id: project.theme_id || "1",
    primary_color: project.primary_color || "#4F46E5",
    secondary_color: project.secondary_color || "#10B981",
    font_family: project.font_family || "Inter",
    site_logo: project.site_logo || "",
    custom_images: project.custom_images || {} as Record<string, string>,
    name: project.name || "",
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

  const previewUrl = `/software/user/${project.id}?t=${previewTs}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ height: "780px" }}>
      <div className="flex h-full">

        {/* ── Sidebar ── */}
        <div className="w-80 shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Palette size={18} className="text-brand-600" /> Site Customizer
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Control every aspect of your site</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

            {/* Site Name */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Site Name</label>
              <input
                type="text"
                value={config.name}
                onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your site name"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-200 text-sm font-semibold text-gray-900 transition-all"
              />
            </section>

            {/* Logo Upload */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Logo</label>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-400 transition-colors shrink-0"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {config.site_logo
                    ? <img src={config.site_logo} className="w-full h-full object-contain" alt="logo" />
                    : <Globe size={20} className="text-gray-300" />}
                </div>
                <div className="flex-1 space-y-1.5">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={12} /> Upload Logo
                  </button>
                  {config.site_logo && (
                    <button
                      onClick={() => setConfig(prev => ({ ...prev, site_logo: "" }))}
                      className="w-full flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={10} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Hero Image */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Hero Image</label>
              <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              {config.custom_images?.hero ? (
                <div className="relative">
                  <img src={config.custom_images.hero} className="w-full h-28 object-cover rounded-xl border border-gray-100" alt="hero" />
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, custom_images: { ...prev.custom_images, hero: "" } }))}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => heroInputRef.current?.click()}
                  className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                >
                  <ImageIcon size={20} className="text-gray-300" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Upload Hero Image</span>
                </button>
              )}
            </section>

            {/* Colors */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Brand Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_PALETTES.map(p => (
                  <button
                    key={p.id}
                    title={p.label}
                    onClick={() => setConfig(prev => ({ ...prev, primary_color: p.primary, secondary_color: p.secondary }))}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-transform hover:scale-110",
                      config.primary_color === p.primary ? "border-gray-900 scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: p.primary }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <input
                  type="color"
                  value={config.primary_color}
                  onChange={e => setConfig(prev => ({ ...prev, primary_color: e.target.value }))}
                  className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-gray-500">{config.primary_color}</span>
                <span className="text-[10px] text-gray-400 font-medium ml-auto">Custom color</span>
              </div>
            </section>

            {/* Theme */}
            <section className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Visual Style</label>
              <div className="space-y-2">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setConfig(prev => ({ ...prev, theme_id: t.id }))}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                      config.theme_id === t.id
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-gray-100 bg-gray-50/50 text-gray-600 hover:bg-white hover:border-gray-200"
                    )}
                  >
                    <t.icon size={15} />
                    <div>
                      <p className="text-xs font-black">{t.name}</p>
                      <p className="text-[10px] opacity-60">{t.desc}</p>
                    </div>
                    {config.theme_id === t.id && <Check size={14} className="ml-auto text-brand-600" />}
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Save */}
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                : success
                ? <><Check size={16} className="text-green-400" /> Saved!</>
                : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* ── Live Preview (iframe) ── */}
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-gray-100 border-b border-gray-200/50 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Preview</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-gray-500">Synced after save</span>
              </div>
            </div>
            <button
              onClick={() => setPreviewTs(Date.now())}
              title="Refresh preview"
              className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-600 transition-colors shadow-sm"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          {/* Browser chrome */}
          <div className="px-4 pt-3 pb-0">
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-2 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-md px-3 py-1 text-[10px] text-gray-400 font-mono truncate">
                {typeof window !== "undefined" ? window.location.origin : ""}/software/user/{project.id}
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 pb-4 overflow-hidden">
            <iframe
              key={previewTs}
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
