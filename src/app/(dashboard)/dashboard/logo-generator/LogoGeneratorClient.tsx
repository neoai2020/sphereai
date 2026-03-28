"use client";

import { useState } from "react";
import { Check, Loader2, Wand2, Download, Link2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VimeoEmbed } from "@/components/dashboard/vimeo-embed";
import { SITE_FORGE_VIMEO_ID } from "@/lib/vimeo-config";

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

const STYLES = ["modern","minimal","bold","elegant","tech","playful"];

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
  const [activeTab, setActiveTab] = useState<"manual" | "ai" | "upload">("manual");

  // Manual state
  const [letter,    setLetter]    = useState("S");
  const [color,     setColor]     = useState("#4F46E5");
  const [shape,     setShape]     = useState<typeof SHAPES[number]["id"]>("rounded");
  const [bgMode,    setBgMode]    = useState<"solid" | "gradient">("gradient");
  const [textColor, setTextColor] = useState("#FFFFFF");

  // AI state
  const [brandText,  setBrandText]  = useState("");
  const [aiStyle,    setAiStyle]    = useState("modern");
  const [aiColor,    setAiColor]    = useState("#4F46E5");
  const [generating, setGenerating] = useState(false);
  const [aiLogo,     setAiLogo]     = useState<string | null>(null);
  const [aiDebug,    setAiDebug]    = useState<string | null>(null);
  const [aiError,    setAiError]    = useState<string | null>(null);
 
  // Upload state
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [uploading,    setUploading]    = useState(false);

  // Apply state
  const [selectedProject, setSelectedProject] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const rxVal      = SHAPES.find(s => s.id === shape)?.rx || "20";
  const manualUrl  = svgToDataUrl(buildSvg(letter || "S", color, rxVal, bgMode, textColor));
  const currentLogo = activeTab === "upload" && uploadedLogo 
    ? uploadedLogo 
    : activeTab === "ai" && aiLogo 
      ? aiLogo 
      : manualUrl;

  async function generateWithAI() {
    if (!brandText.trim()) return;
    setGenerating(true); setAiError(null); setAiLogo(null); setAiDebug(null);
    try {
      const res  = await fetch("/api/logo-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: brandText, style: aiStyle, color: aiColor }),
      });
      const data = await res.json();
      if (data.image) {
        setAiLogo(data.image);
      } else if (data.error) {
        setAiError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      } else {
        const dbg = data.debug;
        if (
          dbg &&
          typeof dbg === "object" &&
          dbg !== null &&
          (dbg as { status?: string; message?: string }).status === "error" &&
          typeof (dbg as { message?: string }).message === "string"
        ) {
          setAiError((dbg as { message: string }).message);
        } else {
          setAiDebug(JSON.stringify(data, null, 2));
          setAiError("API returned unexpected format — see debug below");
        }
      }
    } catch (e: any) {
      setAiError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function applyToProject() {
    if (!selectedProject) return;
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`/api/projects/${selectedProject}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_logo: currentLogo }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    } finally { setSaving(false); }
  }

  function downloadLogo() {
    const a = document.createElement("a");
    a.href = currentLogo;
    a.download = activeTab === "upload" ? "uploaded-logo" : `logo.svg`;
    a.click();
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedLogo(event.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 space-y-8">

      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center border border-brand-100 shrink-0">
            <Wand2 size={24} className="text-brand-600" />
          </div>
          Logo Generator
        </h1>
        <p className="text-gray-400 font-medium text-sm mt-1 ml-16">Design or AI-generate a logo and apply it to any of your websites</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">2 — Site Forge</h2>
        <p className="text-sm text-gray-500 mb-3">
          Walkthrough for building your site in Site Forge before you attach a logo.
        </p>
        <VimeoEmbed
          videoId={SITE_FORGE_VIMEO_ID}
          title="2 — Site Forge"
          variant="training"
        />
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {(["manual","ai","upload"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === t ? "bg-white text-gray-900 shadow-md" : "text-gray-400 hover:text-gray-700"
            )}>
            {t === "manual" ? "✏️ Builder" : t === "ai" ? "✨ AI Generate" : "📤 Upload"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Preview ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-6 p-10 min-h-[300px]">
          {generating ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="animate-spin text-brand-500" />
              <p className="text-sm font-bold text-gray-400">Generating…</p>
            </div>
          ) : (
            <img src={currentLogo} alt="preview"
              className="w-40 h-40 object-contain rounded-3xl shadow-2xl shadow-gray-200/80" />
          )}
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            {activeTab === "ai" && aiLogo ? "AI Result" : "Preview"}
          </span>
        </div>

        {/* ── Controls ── */}
        <div className="space-y-5">

          {/* AI Panel */}
          {activeTab === "ai" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={11} /> AI Generation
              </p>

              <input type="text" value={brandText} onChange={e => setBrandText(e.target.value)}
                placeholder="Enter your brand name…"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all" />

              {/* Style */}
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setAiStyle(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                      aiStyle === s
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900"
                    )}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Color */}
              <div className="flex flex-wrap gap-2 items-center">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setAiColor(c)}
                    className={cn("w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 shrink-0",
                      aiColor === c ? "border-gray-900 scale-110 shadow" : "border-transparent")}
                    style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={aiColor} onChange={e => setAiColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 shrink-0" />
              </div>

              {aiError && (
                <p className="text-[11px] font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                  ✕ {aiError}
                </p>
              )}
              {aiDebug && (
                <pre className="text-[10px] font-mono bg-gray-50 border border-gray-100 rounded-2xl p-3 overflow-auto max-h-40 text-gray-500">
                  {aiDebug}
                </pre>
              )}

              <button onClick={generateWithAI} disabled={!brandText.trim() || generating}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-600 text-white text-sm font-black hover:bg-brand-700 transition-all disabled:opacity-40 shadow-lg shadow-brand-500/20 whitespace-nowrap">
                {generating
                  ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
                  : <><Sparkles size={15} /> Generate Logo</>}
              </button>
            </div>
          )}

          {/* Upload Panel */}
          {activeTab === "upload" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Download size={11} className="rotate-180" /> Upload Custom Logo
              </p>
              
              <div className="relative group border-2 border-dashed border-gray-100 rounded-3xl p-10 hover:border-brand-300 transition-all flex flex-col items-center justify-center gap-3 bg-gray-50/50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={20} className="text-gray-400 rotate-180" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-gray-900 uppercase">Click or Drag Image</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">PNG, JPG, or SVG up to 2MB</p>
                </div>
              </div>

              {uploadedLogo && (
                <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white p-1 border border-brand-100">
                    <img src={uploadedLogo} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-brand-900 uppercase">Logo uploaded</p>
                    <p className="text-[9px] text-brand-600 font-medium">Ready to apply to your site</p>
                  </div>
                  <button 
                    onClick={() => setUploadedLogo(null)}
                    className="text-[10px] font-black text-red-500 uppercase hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manual Panel */}
          {activeTab === "manual" && (
            <>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon / Letter</p>
                <div className="flex flex-wrap gap-2">
                  {ICON_PRESETS.map(ic => (
                    <button key={ic} onClick={() => setLetter(ic)}
                      className={cn("w-9 h-9 rounded-xl text-base flex items-center justify-center border transition-all",
                        letter === ic
                          ? "border-brand-500 bg-brand-50 scale-110 shadow-md"
                          : "border-gray-100 bg-gray-50 hover:bg-white hover:scale-105")}>
                      {ic}
                    </button>
                  ))}
                </div>
                <input type="text" value={letter} onChange={e => setLetter(e.target.value.slice(-2))}
                  placeholder="Or type a letter…" maxLength={2}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-100 text-sm font-black text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Color & Style</p>

                <div className="flex flex-wrap gap-2 items-center">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={cn("w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 shrink-0",
                        color === c ? "border-gray-900 scale-110 shadow-lg" : "border-transparent")}
                      style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 shrink-0" />
                </div>

                {/* Text color */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Text</span>
                  {["#FFFFFF","#000000"].map(c => (
                    <button key={c} onClick={() => setTextColor(c)}
                      className={cn("w-7 h-7 rounded-lg border-2 transition-all shrink-0",
                        textColor === c ? "border-brand-500 scale-110" : "border-gray-200")}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>

                {/* Shape */}
                <div className="flex gap-2">
                  {SHAPES.map(s => (
                    <button key={s.id} onClick={() => setShape(s.id)}
                      className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all whitespace-nowrap",
                        shape === s.id
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900")}>
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* BG Mode */}
                <div className="flex gap-2">
                  {(["solid","gradient"] as const).map(m => (
                    <button key={m} onClick={() => setBgMode(m)}
                      className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all whitespace-nowrap",
                        bgMode === m
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:text-gray-900")}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Apply to Project */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Link2 size={11} /> Apply to Website
        </p>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">No websites found. Create one first from Site Forge.</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all min-w-0">
                <option value="">Select a website…</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.product_name || p.name}</option>
                ))}
              </select>

              <div className="flex gap-2 shrink-0">
                <button onClick={downloadLogo}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-100 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all whitespace-nowrap">
                  <Download size={15} /> Download
                </button>
                <button onClick={applyToProject} disabled={!selectedProject || saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all disabled:opacity-40 shadow-xl shadow-black/10 whitespace-nowrap">
                  {saving ? <><Loader2 size={15} className="animate-spin" /> Applying…</>
                  : saved  ? <><Check size={15} className="text-emerald-400" /> Applied!</>
                  :          <><Wand2 size={15} /> Apply Logo</>}
                </button>
              </div>
            </div>

            {/* Project chips */}
            <div className="flex flex-wrap gap-2">
              {projects.map(p => (
                <button key={p.id} onClick={() => setSelectedProject(p.id)}
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all",
                    selectedProject === p.id
                      ? "border-brand-500 bg-brand-50 shadow-md"
                      : "border-gray-100 bg-gray-50 hover:bg-white")}>
                  {p.site_logo
                    ? <img src={p.site_logo} className="w-6 h-6 rounded-lg object-contain shrink-0" alt="" />
                    : <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
                           style={{ backgroundColor: p.primary_color || "#4F46E5" }}>
                        {(p.product_name || p.name).charAt(0).toUpperCase()}
                      </div>}
                  <span className="text-[11px] font-black text-gray-700 max-w-[100px] truncate whitespace-nowrap">
                    {p.product_name || p.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
