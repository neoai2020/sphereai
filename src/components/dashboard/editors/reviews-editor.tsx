"use client";

import { useState } from "react";
import { Loader2, Save, ArrowLeft, Plus, Trash2, User, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EditorProps {
  page: any;
  projectId: string;
}

export function ReviewsEditor({ page, projectId }: EditorProps) {
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
          Save Reviews
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Customer Testimonials</h2>
          <button 
            onClick={() => setContent({ ...content, reviews: [...content.reviews, { name: "New Reviewer", role: "Customer", rating: 5, text: "Awesome product!", date: new Date().toISOString().split("T")[0] }] })}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 px-3 py-1.5 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
          >
            <Plus size={16} /> Add Review
          </button>
        </div>
        
        {content.reviews.map((review: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 relative group flex flex-col gap-4 shadow-sm">
            <button 
              onClick={() => setContent({ ...content, reviews: content.reviews.filter((_: any, idx: number) => idx !== i) })}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User size={20} />
              </div>
              <div className="flex-1">
                <input 
                  className="w-full bg-transparent font-bold text-gray-900 outline-none"
                  value={review.name}
                  onChange={(e) => {
                    const newReviews = [...content.reviews];
                    newReviews[i].name = e.target.value;
                    setContent({ ...content, reviews: newReviews });
                  }}
                />
                <input 
                  className="w-full bg-transparent text-xs text-gray-500 outline-none"
                  value={review.role}
                  onChange={(e) => {
                    const newReviews = [...content.reviews];
                    newReviews[i].role = e.target.value;
                    setContent({ ...content, reviews: newReviews });
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={14} 
                  className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                  onClick={() => {
                    const newReviews = [...content.reviews];
                    newReviews[i].rating = s;
                    setContent({ ...content, reviews: newReviews });
                  }}
                />
              ))}
            </div>

            <textarea 
              className="w-full bg-transparent text-sm text-gray-600 leading-relaxed outline-none flex-1 italic"
              value={review.text}
              rows={4}
              onChange={(e) => {
                const newReviews = [...content.reviews];
                newReviews[i].text = e.target.value;
                setContent({ ...content, reviews: newReviews });
              }}
            />
            
            <input 
              type="date"
              className="text-[10px] text-gray-400 uppercase font-bold outline-none bg-transparent"
              value={review.date}
              onChange={(e) => {
                const newReviews = [...content.reviews];
                newReviews[i].date = e.target.value;
                setContent({ ...content, reviews: newReviews });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
