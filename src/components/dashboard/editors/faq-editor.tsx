"use client";

import { useState } from "react";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditorProps {
  page: any;
  projectId: string;
}

export function FAQEditor({ page, projectId }: EditorProps) {
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
          Save FAQs
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Manage FAQs</h2>
          <button 
            onClick={() => setContent({ ...content, faqs: [...content.faqs, { question: "New Question?", answer: "Answer goes here" }] })}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 px-3 py-1.5 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
          >
            <Plus size={16} /> Add FAQ
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {content.faqs.map((faq: any, i: number) => (
            <div key={i} className="p-6 space-y-4 relative group">
              <button 
                onClick={() => setContent({ ...content, faqs: content.faqs.filter((_: any, idx: number) => idx !== i) })}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question</label>
                <input 
                  className="w-full bg-transparent font-semibold text-gray-900 text-lg outline-none pr-10"
                  value={faq.question}
                  onChange={(e) => {
                    const newFaqs = [...content.faqs];
                    newFaqs[i].question = e.target.value;
                    setContent({ ...content, faqs: newFaqs });
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Answer</label>
                <textarea 
                  className="w-full bg-transparent text-gray-600 leading-relaxed outline-none"
                  value={faq.answer}
                  rows={3}
                  onChange={(e) => {
                    const newFaqs = [...content.faqs];
                    newFaqs[i].answer = e.target.value;
                    setContent({ ...content, faqs: newFaqs });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
