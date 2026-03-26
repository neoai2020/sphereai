import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Settings } from "lucide-react";

export default async function ProjectsPage() {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Vault</h1>
          <p className="text-gray-500 mt-1">
            Manage your high-value AI generation assets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Site Forge
          </Link>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No projects yet
          </h2>
          <p className="text-gray-500 mb-6">
            Create your first project to get started.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            <Plus size={18} />
            Create with Site Forge
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {project.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "published"
                          ? "bg-green-50 text-green-700"
                          : project.status === "generating"
                          ? "bg-yellow-50 text-yellow-700"
                          : project.status === "error"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    {project.product_description.slice(0, 120)}
                    {project.product_description.length > 120 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-4 text-sm mt-3">
                    <span className="text-gray-400">
                      Created:{" "}
                      <span className="text-gray-600">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {project.status === "published" && (
                    <Link
                      href={`/software/site/${project.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink size={14} />
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
