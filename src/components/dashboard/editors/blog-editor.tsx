"use client";

import { useState } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditorProps {
  page: any;
  projectId: string;
}

export function BlogEditor({ page, projectId }: EditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(page.content);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      router.refresh();
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
          Save Article
        </button>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Headline</label>
            <input 
              className="w-full bg-transparent font-bold text-2xl text-gray-900 outline-none"
              value={content.headline}
              onChange={(e) => setContent({ ...content, headline: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Introduction</label>
            <textarea 
              className="w-full p-4 rounded-lg bg-gray-50 border border-gray-100 italic text-gray-600 outline-none"
              value={content.introduction}
              rows={3}
              onChange={(e) => setContent({ ...content, introduction: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Main Body</label>
            <textarea 
              className="w-full p-4 min-h-[400px] rounded-lg border border-gray-200 outline-none focus:border-brand-500 leading-relaxed text-gray-800"
              value={content.body}
              onChange={(e) => setContent({ ...content, body: e.target.value })}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
