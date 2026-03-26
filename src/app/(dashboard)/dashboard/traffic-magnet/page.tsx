"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Magnet, 
  Search, 
  Loader2, 
  Copy, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare,
  History,
  Trash2,
  Plus,
  Link as LinkIcon
} from "lucide-react";
import type { Project, ForumReply } from "@/types/database";

export default function TrafficMagnetPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const supabase = createClient();

  const [form, setForm] = useState({
    projectId: "",
    forumTopic: "",
    forumUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setFetching(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [projRes, replRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("forum_replies").select("*").order("created_at", { ascending: false }).limit(10)
    ]);

    if (projRes.data) setProjects(projRes.data);
    if (replRes.data) setReplies(replRes.data);
    if (projRes.data && projRes.data.length > 0) setForm(f => ({ ...f, projectId: projRes.data[0].id }));
    
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/traffic-magnet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newReply = await res.json();
        setReplies([newReply, ...replies]);
        setForm({ ...form, forumTopic: "", forumUrl: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReply(id: string) {
    const { error } = await supabase.from("forum_replies").delete().eq("id", id);
    if (!error) {
      setReplies(replies.filter(r => r.id !== id));
    }
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Magnet className="text-brand-600" size={32} />
            Traffic Magnet
          </h1>
          <p className="text-gray-500 mt-1">Generate high-value forum replies that drive traffic to your assets in the Vault.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Generator Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-brand-600" />
              New Magnet Reply
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Project</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  required
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Forum Topic / Question</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  placeholder="e.g. How can I automate my SEO with AI?"
                  rows={4}
                  value={form.forumTopic}
                  onChange={(e) => setForm({ ...form, forumTopic: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Forum URL (optional)</label>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  placeholder="https://reddit.com/r/SEO/..."
                  value={form.forumUrl}
                  onChange={(e) => setForm({ ...form, forumUrl: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !form.projectId || !form.forumTopic}
                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Generate Smart Reply
              </button>
            </form>
          </div>
        </div>

        {/* Right: History & Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <History size={18} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Magnet History</h2>
          </div>

          {replies.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <MessageSquare className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-500 font-medium">No replies generated yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start by filling out the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {replies.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold">
                          {projects.find(p => p.id === r.project_id)?.name || "Project"}
                        </div>
                        {r.forum_url && (
                          <a 
                            href={r.forum_url} 
                            target="_blank" 
                            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteReply(r.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors md:opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">&quot;{r.forum_topic}&quot;</h3>
                    
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {r.generated_reply}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleCopy(r.generated_reply, `${r.id}-text`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {copied === `${r.id}-text` ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                        Copy Reply
                      </button>
                      <button 
                        onClick={() => handleCopy(r.website_link, `${r.id}-link`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors"
                      >
                        {copied === `${r.id}-link` ? <CheckCircle2 size={16} className="text-green-500" /> : <LinkIcon size={16} />}
                        Copy Project Link
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Generated {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">
                      Magnet Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
