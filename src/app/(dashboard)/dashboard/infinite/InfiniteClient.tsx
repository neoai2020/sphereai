"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const LANG_FLAGS: Record<string, string> = {
  Arabic: "🇸🇦", French: "🇫🇷", Spanish: "🇪🇸", German: "🇩🇪", Turkish: "🇹🇷",
  Portuguese: "🇵🇹", Italian: "🇮🇹", Dutch: "🇳🇱", Russian: "🇷🇺", Chinese: "🇨🇳",
  Japanese: "🇯🇵", Korean: "🇰🇷", Hindi: "🇮🇳", Bengali: "🇧🇩", Urdu: "🇵🇰",
  Persian: "🇮🇷", Polish: "🇵🇱", Swedish: "🇸🇪", Norwegian: "🇳🇴", Danish: "🇩🇰",
  Greek: "🇬🇷", Hebrew: "🇮🇱", Romanian: "🇷🇴", Ukrainian: "🇺🇦", Indonesian: "🇮🇩",
};

interface Project {
  id: string;
  name: string;
  slug: string;
  project_type: string;
  available_languages?: string[];
}

export function InfiniteClient({ projects }: { projects: Project[] }) {
  const [translating, setTranslating] = useState<string | null>(null);
  const [translatedMap, setTranslatedMap] = useState<Record<string, string[]>>(
    () => Object.fromEntries(projects.map(p => [p.id, p.available_languages || []]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTranslate = async (projectId: string, language: string) => {
    setTranslating(projectId);
    setErrors(prev => ({ ...prev, [projectId]: "" }));
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, language }),
      });
      if (!res.ok) throw new Error("Translation failed");
      setTranslatedMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []).filter(l => l !== language), language],
      }));
    } catch {
      setErrors(prev => ({ ...prev, [projectId]: "Translation failed. Try again." }));
    } finally {
      setTranslating(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map(project => {
        const langs = translatedMap[project.id] || [];
        const isTranslating = translating === project.id;
        return (
          <div
            key={project.id}
            className="flex flex-col gap-4 p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
          >
            <div>
              <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100 mb-2">
                {project.project_type || "Service"}
              </span>
              <h3 className="font-bold text-gray-900 line-clamp-1">{project.name}</h3>
            </div>

            <div className="mt-auto space-y-3">
              {/* Translate selector */}
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleTranslate(project.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                  disabled={isTranslating}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                >
                  <option value="">🌐 Translate Website...</option>
                  {Object.entries(LANG_FLAGS).map(([lang, flag]) => (
                    <option key={lang} value={lang}>{flag} {lang}</option>
                  ))}
                </select>
                {isTranslating && (
                  <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin shrink-0" />
                )}
              </div>

              {errors[project.id] && (
                <p className="text-[11px] text-red-500">{errors[project.id]}</p>
              )}

              {/* Translated language links */}
              {langs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {langs.map(lang => (
                    <a
                      key={lang}
                      href={`/software/user/${project.id}?lang=${encodeURIComponent(lang)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      {LANG_FLAGS[lang] || "🌐"} {lang} <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold transition-colors"
                >
                  Settings
                </Link>
                <a
                  href={`/s/${project.slug}`}
                  target="_blank"
                  className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-gray-900 hover:bg-black text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
