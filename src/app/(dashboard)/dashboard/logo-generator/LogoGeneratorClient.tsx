"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Loader2, Wand2, Download, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  product_name: string;
  primary_color: string | null;
  site_logo: string | null;
}

const SHAPES = [
  { id: "rounded", label: "Rounded", rx: "20" },
  { id: "circle",  label: "Circle",  rx: "50" },
  { id: "square",  label: "Square",  rx: "0"  },
] as const;

const ICON_PRESETS = ["✦","⚡","🌿","🔥","💎","🚀","⭐","🎯","🌊","🦁","🧠","🌸","🎨","🛡","⚙️","✈️"];

const COLORS = [
  "#4F46E5","#7C3AED","#EC4899","#EF4444","#F97316",
  "#EAB308","#10B981","#06B6D4","#3B82F6","#111827",
  "#475569","#00FF87",
];

function buildSvg(letter: string, color: string, rx: string, bgMode: "solid" | "gradient", textColor: string) {
  const rxVal = rx === "50" ? "50%" : rx;
  const bg = bgMode === "gradient"
    ? `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}cc"/></linearGradient></defs><rect width="100" height="100" rx="${rxVal}" ry="${rxVal}" fill="url(#g)"/>`
    : `<rect width="100" height="100" rx="${rxVal}" ry="${rxVal}" fill="${color}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">${bg}<text x="50" y="54" dominant-baseline="middle" text-anchor="middle" font-size="48" font-family="Arial,sans-serif" fill="${textColor}">${letter}</text></svg>`;
}

function svgToDataUrl(svg: string) {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

export function LogoGeneratorClient({ projects }: { projects: Project[] }) {
  const [letter,    setLetter]    = useState("S");
  const [color,     setColor]     = useState("#4F46E5");
  const [shape,     setShape]     = useState<typeof SHAPES[number]["id"]>("rounded");
  const [bgMode,    setBgMode]    = useState<"solid" | "gradient">("gradient");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  const rxVal = SHAPES.find(s => s.id === shape)?.rx || "20";
  const svg   = buildSvg(letter || "S", color, rxVal, bgMode, textColor);
  const dataUrl = svgToDataUrl(svg);

  async function applyToProject() {
    if (!selectedProject) return;
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`/api/projects/${selectedProject}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_logo: dataUrl }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  }

  function downloadLogo() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `logo-${letter}.svg`;
    a.click();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24 px-4">
      {/* Header */}
      <div className="space-y-2 pt-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center border border-brand-100">
            <Wand2 size={24} className="text-brand-600" />
          </div>
          Logo Generator
        </h1>
        <p className="text-gray-400 font-medium text-sm ml-16">Design a logo and apply it to any of your websites</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="bg-white rounded-3xl border border-gray-100 p-10 flex flex-col items-center justify-center gap-8 shadow-sm">
          <img src={dataUrl} alt="logo preview" className="w-40 h-40 rounded-3xl shadow-2xl shadow-gray-200/80" />
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Live Preview</p>
        </div>

        {/* Controls */}
        <div className="space-y-8">

          {/* Letter / Emoji */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon / Letter</p>
            <div className="flex flex-wrap gap-2">
              {ICON_PRESETS.map(ic => (
                <button
                  key={ic}
                  onClick={() => setLetter(ic)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all border",
                    letter === ic
                      ? "border-brand-500 bg-brand-50 scale-110 shadow-md"
                      : "border-gray-100 bg-gray-50 hover:bg-white hover:scale-105"
                  )}
                >
                  {ic}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={letter}
              onChange={e => setLetter(e.target.value.slice(-2))}
              placeholder="Or type a letter..."
              maxLength={2}
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-sm font-black text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
            />
          </div>

          {/* Color */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Background Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-xl border-2 transition-all hover:scale-110",
                    color === c ? "border-gray-900 scale-110 shadow-lg" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color" value={color}
                onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded-xl cursor-pointer border-0"
                title="Custom color"
              />
            </div>
            {/* Text color */}
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Text Color</p>
              <div className="flex gap-2">
                {["#FFFFFF", "#000000"].map(c => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className={cn(
                      "w-7 h-7 rounded-lg border-2 transition-all",
                      textColor === c ? "border-brand-500 scale-110" : "border-gray-200"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Shape & Style */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shape & Style</p>
            <div className="flex gap-2">
              {SHAPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={cn(
                    "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all",
                    shape === s.id
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["solid", "gradient"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setBgMode(m)}
                  className={cn(
                    "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all",
                    bgMode === m
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply to Project */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Link2 size={12} /> Apply to Website
        </p>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">No websites found. Create one first from Site Forge.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all"
            >
              <option value="">Select a website...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.product_name || p.name}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={downloadLogo}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-gray-100 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={applyToProject}
                disabled={!selectedProject || saving}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all disabled:opacity-40 shadow-xl shadow-black/10"
              >
                {saving ? <><Loader2 size={16} className="animate-spin" /> Applying…</>
                : saved  ? <><Check size={16} className="text-emerald-400" /> Applied!</>
                :          <><Wand2 size={16} /> Apply Logo</>}
              </button>
            </div>
          </div>
        )}

        {/* Project logos grid */}
        {projects.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all",
                  selectedProject === p.id
                    ? "border-brand-500 bg-brand-50 shadow-md"
                    : "border-gray-100 bg-gray-50 hover:bg-white"
                )}
              >
                {p.site_logo
                  ? <img src={p.site_logo} className="w-7 h-7 rounded-lg object-contain" alt="" />
                  : <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
                         style={{ backgroundColor: p.primary_color || "#4F46E5" }}>
                      {(p.product_name || p.name).charAt(0).toUpperCase()}
                    </div>}
                <span className="text-xs font-black text-gray-700 max-w-[120px] truncate">
                  {p.product_name || p.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
