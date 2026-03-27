import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Infinity, CheckCircle2, Globe, Zap, Plus } from "lucide-react";
import Link from "next/link";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import { InfiniteClient } from "./InfiniteClient";

export default async function InfinitePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check access (run in parallel with projects fetch)
  const [subResult, projectsResult] = await Promise.all([
    supabase
      .from("user_subscriptions")
      .select("has_infinite")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("projects")
      .select("id, name, product_name, slug, project_type, available_languages")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const hasAccess =
    subResult.data?.has_infinite ||
    user.user_metadata?.plan === "infinite";

  if (!hasAccess) {
    return (
      <RestrictedContent
        title="Unlock Infinite Power"
        description="The Infinite plan removes all daily limits. Generate hundreds of pages, domains, and campaigns without ever hitting a wall. Upgrade to access unlimited generations, translations, and scaling."
        onUpgrade={() => {}}
        icon={Infinity}
      />
    );
  }

  const projects = projectsResult.data || [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Infinity className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Infinite
          </h1>
        </div>
        <p className="text-lg text-gray-500 max-w-2xl">
          No limits. Unlimited generations, unlimited websites, unlimited growth.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Daily Generations", value: "∞", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Active Websites", value: "∞", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Marketing Messages", value: "∞", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Websites */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Websites</h2>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
          >
            <Plus size={16} /> Generate New
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No websites yet. Start generating!</p>
          </div>
        ) : (
          <InfiniteClient projects={projects} />
        )}
      </div>
    </div>
  );
}
