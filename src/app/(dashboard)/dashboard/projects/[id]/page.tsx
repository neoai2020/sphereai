import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  ArrowLeft,
  Globe,
  FileText,
  HelpCircle,
  BookOpen,
  Star,
  Info,
} from "lucide-react";

const pageTypeConfig: Record<
  string,
  { label: string; icon: typeof Globe; path: string }
> = {
  landing: { label: "Landing Page", icon: Globe, path: "" },
  about: { label: "About Page", icon: Info, path: "/about" },
  faq: { label: "FAQ Page", icon: HelpCircle, path: "/faq" },
  blog: { label: "Blog Article", icon: BookOpen, path: "/blog" },
  reviews: { label: "Reviews Page", icon: Star, path: "/reviews" },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!project) redirect("/dashboard/projects");

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
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
          <p className="text-gray-500">{project.product_name}</p>
        </div>
      </div>

      <div className="grid gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Project Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Description</dt>
              <dd className="text-gray-900 mt-0.5">
                {project.product_description}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Target Audience</dt>
              <dd className="text-gray-900 mt-0.5">{project.target_audience}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Keywords</dt>
              <dd className="flex flex-wrap gap-1.5 mt-0.5">
                {project.keywords?.map((kw: string) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded text-xs"
                  >
                    {kw}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">URL Slug</dt>
              <dd className="text-gray-900 mt-0.5 font-mono text-xs">
                /s/{project.slug}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={18} />
        Generated Pages ({pages?.length || 0}/5)
      </h2>

      {pages && pages.length > 0 ? (
        <div className="grid gap-3">
          {pages.map((page) => {
            const config = pageTypeConfig[page.page_type] || {
              label: page.page_type,
              icon: FileText,
              path: `/${page.page_type}`,
            };
            const Icon = config.icon;
            const publicUrl = `/s/${project.slug}${config.path}`;

            return (
              <div
                key={page.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                    <Icon size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{config.label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{page.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${id}/edit/${page.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href={publicUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                  >
                    <ExternalLink size={14} />
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            {project.status === "generating"
              ? "Pages are being generated..."
              : "No pages generated yet."}
          </p>
        </div>
      )}
    </div>
  );
}
