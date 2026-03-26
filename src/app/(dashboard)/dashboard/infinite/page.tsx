"use client";

import { Infinity, Lock, CheckCircle2, Globe, Languages, Zap, Plus, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  product_name: string;
  slug: string;
  project_type: string;
}

export default function InfinitePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    async function checkAccessAndLoad() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCheckingAccess(false);
        setLoading(false);
        return;
      }

      // Check if user has infinite plan access
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("has_infinite") // Changed from "plan"
        .eq("user_id", user.id)
        .single();
      
      const accessGranted = sub?.has_infinite || user.user_metadata?.plan === 'infinite';
      setHasAccess(accessGranted);
      setCheckingAccess(false);

      if (accessGranted) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data) setProjects(data);
      }
      setLoading(false);
    }
    checkAccessAndLoad();
  }, []);

  const handleTranslate = async (projectId: string, language: string) => {
    setTranslating(projectId);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, language }),
      });
      if (!response.ok) throw new Error("Translation failed");
      alert(`Website successfully translated to ${language}!`);
    } catch (error) {
      console.error(error);
      alert("Translation failed. Please try again.");
    } finally {
      setTranslating(null);
    }
  };

  // Loading state
  if (checkingAccess) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <RestrictedContent 
        title="Unlock Infinite Power"
        description="The Infinite plan removes all daily limits. Generate hundreds of pages, domains, and campaigns without ever hitting a wall. Upgrade to access unlimited generations, translations, and scaling."
        onUpgrade={() => window.location.href = "/activate"}
        icon={Infinity}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Infinity className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Infinite
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          No limits. Unlimited generations, unlimited websites, unlimited growth.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Daily Generations", value: "∞", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Websites", value: "∞", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Marketing Messages", value: "∞", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-4xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Websites List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold transition-transform hover:scale-105"
          >
            <Plus size={16} />
            Generate New
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No websites found. Start generating!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all">
                <div className="flex flex-col h-full gap-6">
                  <div className="space-y-2">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {project.project_type || "Service"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{project.name}</h3>
                  </div>

                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleTranslate(project.id, e.target.value);
                            e.target.value = ""; // reset select after triggering
                          }
                        }}
                        disabled={translating === project.id}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                      >
                        <option value="">Translate Website...</option>
                        <option value="Arabic">Arabic</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="German">German</option>
                        <option value="Turkish">Turkish</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold transition-colors"
                      >
                        Settings
                      </Link>
                      <a
                        href={`/s/${project.slug}`}
                        target="_blank"
                        className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-gray-900 hover:bg-black text-white transition-transform hover:scale-110"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
