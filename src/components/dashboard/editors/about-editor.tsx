"use client";

import { useState } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditorProps {
  page: any;
  projectId: string;
}

export function AboutEditor({ page, projectId }: EditorProps) {
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
          Save About Info
        </button>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900">Our Mission</h3>
          <textarea 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-500"
            value={content.mission}
            rows={4}
            onChange={(e) => setContent({ ...content, mission: e.target.value })}
          />
        </section>

        <section className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <h3 className="font-bold text-gray-900">Our Story</h3>
          <textarea 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-brand-500"
            value={content.story}
            rows={8}
            onChange={(e) => setContent({ ...content, story: e.target.value })}
          />
        </section>
      </div>
    </div>
  );
}
