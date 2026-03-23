import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderOpen, Plus, Globe, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalProjects = projects?.length || 0;
  const published = projects?.filter((p) => p.status === "published").length || 0;
  const totalPages = published * 5;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your AI-optimized pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <FolderOpen size={20} className="text-brand-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Projects
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalProjects}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Globe size={20} className="text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Published
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{published}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Pages
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalPages}</p>
        </div>
      </div>

      {totalProjects === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Plus size={28} className="text-brand-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Create your first project
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Generate 5 AI-search-optimized pages for your product or service in
            minutes.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            <Plus size={18} />
            New Project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              New
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {projects?.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{project.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {project.product_name}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    project.status === "published"
                      ? "bg-green-50 text-green-700"
                      : project.status === "generating"
                      ? "bg-yellow-50 text-yellow-700"
                      : project.status === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {project.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
