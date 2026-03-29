"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Loader2, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function PersonalPromoLinkCard({
  projectId,
  initialUrl,
}: {
  projectId: string;
  initialUrl: string | null;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl?.trim() ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUrl(initialUrl?.trim() ?? "");
  }, [initialUrl]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = url.trim() !== (initialUrl?.trim() ?? "");

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/customize`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_url: url.trim() === "" ? null : url.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof body.error === "string" ? body.error : "Could not save");
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Link2 size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
            Your personal promo link
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
            Affiliate, checkout, or booking URL used in your site CTAs. Stored only on{" "}
            <span className="text-gray-700 font-bold">your</span> account — other members who
            claimed the same template never see it.
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-2">
            <Shield size={12} className="text-emerald-500" />
            Private to you · Same template, your link only
          </p>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <label className="sr-only" htmlFor={`promo-url-${projectId}`}>
          Promo or affiliate URL
        </label>
        <input
          id={`promo-url-${projectId}`}
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://yoursite.com/offer?ref=you"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className={cn(
              "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              dirty
                ? "bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-500/15"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Saving
              </span>
            ) : saved ? (
              <span className="inline-flex items-center gap-2">
                <Check size={14} /> Saved
              </span>
            ) : (
              "Save link"
            )}
          </button>
          {error && <span className="text-xs font-medium text-red-600">{error}</span>}
        </div>
      </div>
    </div>
  );
}
