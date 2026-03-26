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
  Palette,
  Layout,
  LayoutDashboard,
  Layers,
  Sparkles,
  Settings2
} from "lucide-react";
import { SiteCustomizer } from "@/components/dashboard/projects/SiteCustomizer";
import { cn } from "@/lib/utils";

const pageTypeConfig: Record<
  string,
  { label: string; icon: any; path: string }
> = {
  landing: { label: "Landing Page", icon: Globe, path: "" },
  about: { label: "About Page", icon: Info, path: "/about" },
  faq: { label: "FAQ Page", icon: HelpCircle, path: "/faq" },
  blog: { label: "Blog Article", icon: BookOpen, path: "/blog" },
  reviews: { label: "Reviews Page", icon: Star, path: "/reviews" },
};

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "pages" } = await searchParams;
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
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col gap-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-600 mb-4 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Asset Vault
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">{project.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  project.status === "published"
                    ? "bg-green-100 text-green-700"
                    : project.status === "generating"
                    ? "bg-yellow-100 text-yellow-700 animate-pulse"
                    : project.status === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                • {project.status}
              </span>
            </div>
            <p className="text-gray-500 font-medium text-lg">{project.product_name}</p>
          </div>

          <div className="flex items-center gap-3">
             <Link 
              href={`/software/user/${project.id}`} 
              target="_blank"
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl"
            >
              <Globe size={16} /> View Production Site
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-[1.5rem] border border-gray-200 shadow-sm self-start">
          {[
            { id: "pages", label: "Pages Gallery", icon: Layers },
            { id: "customize", label: "Site Customizer", icon: Sparkles },
            { id: "details", label: "Project Details", icon: Settings2 },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/projects/${id}?tab=${t.id}`}
              className={cn(
                "flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap",
                tab === t.id ? "bg-white text-brand-600 shadow-md ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              <t.icon size={18} className={cn(tab === t.id ? "text-brand-600" : "text-gray-400")} />
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {tab === "pages" && (
        <div className="space-y-6 px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-900 text-2xl tracking-tight flex items-center gap-3">
              <FileText size={24} className="text-brand-600" /> Site Pages Feed
              <span className="text-sm font-bold text-gray-400">({pages?.length || 0}/5)</span>
            </h2>
          </div>

          {!pages || pages.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-xl shadow-gray-200/20">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-500 font-medium">Wait for SiteForge to finish generating your website.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pages.map((page) => {
                const config = pageTypeConfig[page.page_type] || {
                  label: page.page_type,
                  icon: FileText,
                  path: `/${page.page_type}`,
                };
                const Icon = config.icon;
                const publicUrl = `/software/${user.id}/${project.id}${config.path}`;

                return (
                  <div
                    key={page.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-xl hover:shadow-brand-100/20 transition-all border-b-4 border-b-transparent hover:border-b-brand-500 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center transition-colors shadow-inner">
                        <Icon size={24} className="text-gray-400 group-hover:text-brand-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{config.label}</p>
                        <p className="font-bold text-gray-900 text-lg group-hover:text-brand-700 transition-colors line-clamp-1">{page.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/projects/${id}/edit/${page.id}`}
                        className="px-6 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={publicUrl}
                        target="_blank"
                        className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all flex items-center gap-2 shadow-lg"
                      >
                         View <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "customize" && (
        <div className="px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <SiteCustomizer project={project} />
        </div>
      )}

      {tab === "details" && (
        <div className="px-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/20">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Info size={24} className="text-brand-600" /> Project Blueprint
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Description</dt>
                  <dd className="text-gray-700 text-lg font-medium leading-relaxed">
                    {project.product_description}
                  </dd>
                </div>
                <div className="space-y-8">
                   <div className="space-y-2">
                      <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Keywords</dt>
                      <dd className="flex flex-wrap gap-2 pt-1">
                        {project.keywords?.map((kw: string) => (
                          <span
                            key={kw}
                            className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl text-xs font-bold border border-brand-100"
                          >
                            {kw}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div className="space-y-2">
                      <dt className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment URL</dt>
                      <dd className="text-brand-600 font-black text-sm select-all bg-brand-50 p-4 rounded-2xl border border-brand-100 flex items-center justify-between">
                        <span>/software/{user.id}/{project.id}</span>
                        <ExternalLink size={14} />
                      </dd>
                    </div>
                </div>
              </dl>
           </div>
        </div>
      )}
    </div>
  );
}
