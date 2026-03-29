"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Link2 } from "lucide-react";
import type { Page } from "@/types/database";
import { cn } from "@/lib/utils";

function collectStrings(obj: unknown, bucket: string[]): void {
  if (obj == null) return;
  if (typeof obj === "string") {
    if (obj.trim()) bucket.push(obj);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item) => collectStrings(item, bucket));
    return;
  }
  if (typeof obj === "object") {
    Object.values(obj as Record<string, unknown>).forEach((v) => collectStrings(v, bucket));
  }
}

function extractExternalUrls(obj: unknown): string[] {
  const texts: string[] = [];
  collectStrings(obj, texts);
  const found = new Set<string>();
  const re = /https?:\/\/[^\s"'<>)\]}]+/gi;
  for (const t of texts) {
    let m: RegExpExecArray | null;
    const local = new RegExp(re.source, re.flags);
    while ((m = local.exec(t)) !== null) {
      found.add(m[0].replace(/[.,;:!?]+$/, ""));
    }
  }
  return Array.from(found);
}

function estimateReadingMinutesFromContent(content: Record<string, unknown>): number {
  const texts: string[] = [];
  collectStrings(content, texts);
  const words = texts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type Check = { level: "ok" | "warn" | "error"; message: string; page?: string };

export function ContentQaPanel({
  pages,
  productDescription,
  productUrl,
}: {
  pages: Page[];
  productDescription: string;
  productUrl: string | null;
}) {
  const checks = useMemo(() => {
    const out: Check[] = [];

    if (!productDescription?.trim()) {
      out.push({ level: "error", message: "Project has no product description — SEO and AI context will suffer." });
    } else if (productDescription.trim().length < 80) {
      out.push({ level: "warn", message: "Product description is short; consider expanding for richer generated pages." });
    }

    if (productUrl?.trim()) {
      try {
        const u = new URL(productUrl.trim());
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          out.push({ level: "warn", message: "Product URL should use http or https." });
        }
      } catch {
        out.push({ level: "warn", message: "Product URL does not look like a valid link." });
      }
    } else {
      out.push({ level: "warn", message: "No product URL set — affiliate/service CTAs may be weaker." });
    }

    for (const page of pages) {
      const label = page.page_type;
      if (!page.title?.trim()) {
        out.push({ level: "error", message: "Page title is empty", page: label });
      }
      const meta = (page.meta_description || "").trim();
      if (!meta) {
        out.push({ level: "warn", message: "Missing meta description", page: label });
      } else if (meta.length < 70) {
        out.push({ level: "warn", message: "Meta description is quite short for SERP snippets", page: label });
      } else if (meta.length > 180) {
        out.push({ level: "warn", message: "Meta description may truncate in search results (> ~160 chars)", page: label });
      }

      const sm = page.schema_markup as Record<string, unknown> | null | undefined;
      if (page.page_type === "faq") {
        const t = sm?.["@type"];
        const isFaq =
          t === "FAQPage" ||
          (typeof t === "string" && t.toLowerCase().includes("faq"));
        if (!isFaq) {
          out.push({
            level: "warn",
            message: "FAQ page schema should include @type FAQPage for best AI/search signals",
            page: label,
          });
        }
      }

      const urls = extractExternalUrls(page.content);
      if (urls.length > 0) {
        out.push({
          level: "ok",
          message: `${urls.length} external URL(s) in ${label} — verify they still work after publish`,
          page: label,
        });
      }

      const mins = estimateReadingMinutesFromContent(page.content);
      if (page.page_type === "blog" && mins < 2) {
        out.push({ level: "warn", message: `Blog reading time ~${mins} min — consider deeper copy`, page: label });
      }
    }

    return out;
  }, [pages, productDescription, productUrl]);

  const errors = checks.filter((c) => c.level === "error");
  const warns = checks.filter((c) => c.level === "warn");
  const oks = checks.filter((c) => c.level === "ok");

  if (pages.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <ClipboardList size={20} />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">Content QA</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Pre-publish checks for meta, schema hints, links, and copy depth
          </p>
        </div>
      </div>
      <div className="p-5 space-y-3 max-h-[320px] overflow-y-auto">
        {errors.map((c, i) => (
          <div
            key={`e-${i}`}
            className="flex gap-3 text-sm text-red-700 bg-red-50/80 border border-red-100 rounded-xl p-3"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {c.page && <span className="font-bold uppercase text-[10px] tracking-wider text-red-800 mr-2">{c.page}</span>}
              {c.message}
            </span>
          </div>
        ))}
        {warns.map((c, i) => (
          <div
            key={`w-${i}`}
            className="flex gap-3 text-sm text-amber-800 bg-amber-50/80 border border-amber-100 rounded-xl p-3"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              {c.page && <span className="font-bold uppercase text-[10px] tracking-wider text-amber-900 mr-2">{c.page}</span>}
              {c.message}
            </span>
          </div>
        ))}
        {oks.map((c, i) => (
          <div
            key={`o-${i}`}
            className="flex gap-3 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-3"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="flex items-start gap-2">
              <Link2 className="w-3.5 h-3.5 shrink-0 mt-1 text-gray-400" />
              <span>
                {c.page && <span className="font-bold uppercase text-[10px] tracking-wider text-gray-400 mr-2">{c.page}</span>}
                {c.message}
              </span>
            </span>
          </div>
        ))}
        {errors.length === 0 && warns.length === 0 && oks.length === 0 && (
          <p className={cn("text-sm text-gray-500 font-medium flex items-center gap-2")}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            No issues flagged — still review copy manually before going live.
          </p>
        )}
      </div>
    </div>
  );
}
