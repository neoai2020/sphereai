"use client";

import { useState } from "react";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditorProps {
  page: any;
  projectId: string;
}

export function LandingEditor({ page, projectId }: EditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(page.content);
  const [title, setTitle] = useState(page.title);
  const [metaDescription, setMetaDescription] = useState(page.meta_description);

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, title, metaDescription }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href={`/dashboard/projects/${projectId}`}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Project
        </Link>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Hero Section</h3>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Headline</label>
              <input 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-500"
                value={content.hero.headline}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Subheadline</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-500"
                value={content.hero.subheadline}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })}
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">CTA Button Text</label>
              <input 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-500"
                value={content.hero.ctaText}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, ctaText: e.target.value } })}
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900">Features</h3>
              <button 
                className="text-brand-600 text-sm font-bold flex items-center gap-1"
                onClick={() => setContent({ ...content, features: [...content.features, { title: "New Feature", description: "Edit me", icon: "Check" }] })}
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-4">
              {content.features.map((f: any, i: number) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                  <button 
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setContent({ ...content, features: content.features.filter((_: any, idx: number) => idx !== i) })}
                  >
                    <Trash2 size={14} />
                  </button>
                  <input 
                    className="w-full bg-transparent font-bold text-gray-900 mb-1 outline-none"
                    value={f.title}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[i].title = e.target.value;
                      setContent({ ...content, features: newFeatures });
                    }}
                  />
                  <textarea 
                    className="w-full bg-transparent text-sm text-gray-500 outline-none"
                    value={f.description}
                    rows={2}
                    onChange={(e) => {
                      const newFeatures = [...content.features];
                      newFeatures[i].description = e.target.value;
                      setContent({ ...content, features: newFeatures });
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">SEO Settings</h3>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Meta Title</label>
              <input 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-500 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <textarea 
                className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-brand-500 text-sm"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={5}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
