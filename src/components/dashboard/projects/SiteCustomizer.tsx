"use client";

import { useState } from "react";
import { 
  Palette, 
  Layout, 
  ArrowRight, 
  Image as ImageIcon, 
  Type, 
  Check, 
  Zap, 
  Monitor,
  Phone,
  Smartphone,
  Save,
  Loader2,
  Globe
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
  { id: "blue", label: "Ocean Blue", primary: "#3B82F6", secondary: "#06B6D4" },
  { id: "green", label: "Forest Green", primary: "#10B981", secondary: "#059669" },
  { id: "sunset", label: "Neon Sunset", primary: "#EC4899", secondary: "#F59E0B" },
  { id: "mono", label: "Charcoal Mono", primary: "#1F2937", secondary: "#4B5563" },
  { id: "brand", label: "Pure Brand", primary: "#4F46E5", secondary: "#C026D3" },
];

const FONTS = ["Inter", "Poppins", "Outfit", "Space Grotesk", "Merriweather"];

interface CustomizerProps {
  project: Project & {
    theme_id?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    navigation_style?: string;
    site_logo?: string;
    custom_images?: Record<string, string>;
  };
}

export function SiteCustomizer({ project }: CustomizerProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState({
    theme_id: project.theme_id || "1",
    primary_color: project.primary_color || "#4F46E5",
    secondary_color: project.secondary_color || "#10B981",
    font_family: project.font_family || "Inter",
    navigation_style: project.navigation_style || "classic",
    site_logo: project.site_logo || "",
    custom_images: project.custom_images || {},
  });

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

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
      <div className="flex flex-col lg:flex-row h-[700px]">
        {/* Sidebar Controls */}
        <div className="w-full lg:w-96 border-r border-gray-50 flex flex-col">
          <div className="p-8 border-b border-gray-50">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Palette className="text-brand-600" size={24} /> Site Customizer
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Modify your AI-generated empire</p>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {/* Theme Selection */}
            <section>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Visual Style</label>
              <div className="grid grid-cols-1 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setConfig({ ...config, theme_id: t.id })}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                      config.theme_id === t.id 
                        ? "border-brand-600 bg-brand-50 shadow-md ring-1 ring-brand-500/20" 
                        : "border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      config.theme_id === t.id ? "bg-brand-600 text-white" : "bg-white text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600"
                    )}>
                      <t.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Colors */}
            <section>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Brand Colors</label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setConfig({ ...config, primary_color: p.primary, secondary_color: p.secondary })}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 p-0.5 transition-transform hover:scale-110",
                      config.primary_color === p.primary ? "border-brand-600 ring-2 ring-brand-100" : "border-transparent"
                    )}
                    title={p.label}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden flex transform -rotate-45">
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: p.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase">Primary</span>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <input type="color" value={config.primary_color} onChange={(e) => setConfig({ ...config, primary_color: e.target.value })} className="w-6 h-6 border-none bg-transparent" />
                    <span className="text-[10px] font-mono font-bold text-gray-600">{config.primary_color}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-gray-400 uppercase">Secondary</span>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <input type="color" value={config.secondary_color} onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })} className="w-6 h-6 border-none bg-transparent" />
                    <span className="text-[10px] font-mono font-bold text-gray-600">{config.secondary_color}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Logo */}
            <section>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Brand Identity</label>
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={config.site_logo}
                    onChange={(e) => setConfig({ ...config, site_logo: e.target.value })}
                    placeholder="Site Logo URL"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-medium"
                  />
                </div>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={config.font_family}
                    onChange={(e) => setConfig({ ...config, font_family: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-brand-500/20 text-sm font-bold appearance-none"
                  >
                    {FONTS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          </div>

          <div className="p-8 border-t border-gray-50 bg-gray-50/30">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gray-900 text-white font-black hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <Check size={20} className="text-green-400" /> : <Save size={20} />}
              {success ? "Saved Changes!" : "Save Customization"}
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 bg-gray-100 p-8 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Preview</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-gray-600">Sync Active</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-brand-600 transition-colors shadow-sm"><Phone size={14} /></button>
              <button className="p-2 rounded-lg bg-white border border-gray-200 text-brand-600 shadow-sm"><Monitor size={14} /></button>
            </div>
          </div>

          {/* Actual Site Preview Frame */}
          <div className="flex-1 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200/50 flex flex-col font-sans" style={{ fontFamily: config.font_family }}>
            {/* Nav */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: config.primary_color }}>
                  {config.site_logo ? <img src={config.site_logo} className="w-full h-full object-contain" alt="logo" /> : project.name[0]}
                </div>
                <span className="text-sm font-black text-gray-900">{project.name}</span>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                {["Home", "Blog", "FAQ", "About"].map(n => (
                  <span key={n} className="text-[10px] font-black text-gray-400 uppercase hover:text-brand-600 cursor-pointer">{n}</span>
                ))}
                <button className="px-4 py-2 rounded-lg text-white text-[10px] font-black shadow-lg" style={{ backgroundColor: config.primary_color }}>GET STARTED</button>
              </div>
            </div>

            {/* Inner Content Preview */}
            <div className="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center justify-center text-center space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-opacity-10 rounded-full mb-2" style={{ backgroundColor: config.primary_color + '20' }}>
                 <Zap size={10} style={{ color: config.primary_color }} />
                 <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: config.primary_color }}>Theme {config.theme_id}: {THEMES.find(t => t.id === config.theme_id)?.name}</span>
               </div>
               <h3 className="text-4xl font-black text-gray-900 max-w-sm">The best solution for your business.</h3>
               <p className="text-gray-500 text-sm max-w-md font-medium leading-relaxed">
                 Build your empire with SiteForge artificial intelligence. This is how your public site will look to customers.
               </p>
               <div className="flex items-center gap-4 pt-4">
                 <button className="px-8 py-3 rounded-xl text-white font-black shadow-xl transition-all hover:scale-105 active:scale-95" style={{ backgroundColor: config.primary_color }}>Explore Now</button>
                 <button className="px-8 py-3 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">Support</button>
               </div>

               {/* Sections Mockup */}
               <div className="grid grid-cols-2 gap-4 w-full mt-12 bg-gray-50/50 p-6 rounded-3xl border border-dashed border-gray-200">
                  <div className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-4">
                     <ImageIcon size={20} className="text-gray-300 mb-2" />
                     <div className="w-16 h-1 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-4">
                     <ImageIcon size={20} className="text-gray-300 mb-2" />
                     <div className="w-16 h-1 bg-gray-100 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
