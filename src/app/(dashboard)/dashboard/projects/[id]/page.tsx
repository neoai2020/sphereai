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
  Settings2,
  MessageCircleQuestion,
  User2
} from "lucide-react";
import { SiteCustomizer } from "@/components/dashboard/projects/SiteCustomizer";
import { PersonalPromoLinkCard } from "@/components/dashboard/projects/PersonalPromoLinkCard";
import { cn } from "@/lib/utils";

const pageTypeConfig: Record<
  string,
  { label: string; icon: any; path: string }
> = {
  landing: { label: "Landing Page", icon: Globe, path: "" },
  about: { label: "About Page", icon: User2, path: "/about" },
  faq: { label: "FAQ Page", icon: MessageCircleQuestion, path: "/faq" },
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
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* 1. Navigation & Header */}
      <div className="space-y-10 px-4">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Asset Vault
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b border-gray-100 pb-16">
          <div className="flex-1 min-w-0 space-y-5">
            <div className="flex items-center gap-5 flex-wrap">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none max-w-xl truncate">
                {project.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap flex-shrink-0 flex items-center gap-2 border shadow-sm ${
                  project.status === "published"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                }`}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", project.status === "published" ? "bg-green-500 animate-pulse" : "bg-gray-300")} /> 
                {project.status}
              </span>
            </div>
            
            <div className="flex items-center gap-6 flex-wrap">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                   <Globe size={18} className="text-gray-400" />
                 </div>
                 <div className="space-y-0.5">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Product Identity</p>
                   <p className="text-lg font-bold text-gray-500 tracking-tight">{project.product_name}</p>
                 </div>
               </div>

               <div className="hidden sm:block w-px h-8 bg-gray-100 mx-2" />

               <div className="flex flex-col space-y-1 justify-center">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">Asset ID</p>
                 <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                   {project.id.slice(0, 8)}
                 </p>
               </div>
            </div>
          </div>

          <div className="shrink-0">
             <Link 
              href={`/software/user/${project.id}`} 
              target="_blank"
              className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <Globe size={16} className="text-gray-400" /> Visit Site
            </Link>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 w-fit">
          {[
            { id: "pages", label: "Assets Feed", icon: Layers },
            { id: "customize", label: "Customizer", icon: Sparkles },
            { id: "details", label: "Blueprint", icon: Settings2 },
          ].map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/projects/${id}?tab=${t.id}`}
              className={cn(
                "flex items-center gap-3 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                tab === t.id ? "bg-white text-brand-600 shadow-md border border-gray-200" : "text-gray-400 hover:text-gray-900 hover:bg-white/40"
              )}
            >
              <t.icon size={18} className={cn(tab === t.id ? "text-brand-600" : "text-gray-400")} />
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {tab === "pages" && (
        <div className="space-y-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between border-b border-gray-50 pb-8">
            <h2 className="font-black text-gray-900 text-2xl tracking-tighter flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center border border-brand-100">
                <FileText size={24} className="text-brand-600" />
              </div>
              Site Pages Feed
              <span className="text-sm font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                {pages?.length || 0} Pages Published
              </span>
            </h2>
          </div>

          <PersonalPromoLinkCard
            projectId={project.id}
            initialUrl={project.product_url}
          />

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
                const publicUrl = `/software/user/${project.id}${config.path}`;

                return (
                  <div
                    key={page.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-xl hover:shadow-brand-100/20 transition-all border-b-4 border-b-transparent hover:border-b-brand-500 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-brand-50 flex items-center justify-center transition-colors shadow-inner shrink-0 scale-95 origin-center">
                        <Icon size={24} className="text-gray-400 group-hover:text-brand-600 transition-transform duration-500 group-hover:scale-110" />
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
        <div className="px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="bg-white rounded-[2.5rem] border border-gray-100 p-12 shadow-xl shadow-gray-200/20">
              <div className="flex items-center justify-between mb-12 border-b border-gray-50 pb-8">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4 tracking-tighter">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center border border-brand-100">
                    <Info size={24} className="text-brand-600" />
                  </div>
                  Project Blueprint
                </h3>
              </div>
              
              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Business Narrative</h4>
                    <p className="text-gray-600 text-lg font-medium leading-relaxed italic">
                      &quot;{project.product_description}&quot;
                    </p>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Primary Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.keywords?.map((kw: string) => (
                          <span
                            key={kw}
                            className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-xl text-[10px] font-black border border-brand-100 uppercase tracking-wider"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Public Endpoint</h4>
                      <div className="group relative">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-mono text-xs text-brand-600 break-all pr-12">
                           /software/{user.id}/{project.id}
                        </div>
                        <ExternalLink size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-brand-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
