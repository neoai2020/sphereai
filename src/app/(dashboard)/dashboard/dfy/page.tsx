"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Layout, 
  Zap, 
  Rocket, 
  Lock, 
  ArrowRight, 
  ExternalLink, 
  Loader2,
  Check,
  Search,
  X,
  Plus,
  Eye,
  FileSearch,
  Globe,
  Copy,
  MousePointer2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VideoPlaceholder } from "@/components/dashboard/video-placeholder";
import {
  getDfySites,
  DFY_SITE_TYPES,
  dfyPostTitle,
  dfyPostBody,
  dfyPostTags,
  type DfySite,
} from "@/lib/dfy-catalog";

const ALL_SITES = getDfySites();

export default function DFYPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [claimedProjectMap, setClaimedProjectMap] = useState<Record<string, string>>({}); // Site ID -> Project Slug
  const [claiming, setClaiming] = useState<string | null>(null);
  
  const [activePreview, setActivePreview] = useState<DfySite | null>(null);
  const [activePosts, setActivePosts] = useState<DfySite | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCheckingAccess(false);
        return;
      }

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("has_dfy")
        .eq("user_id", user.id)
        .single();
      
      const hasAccess = sub?.has_dfy || user.user_metadata?.plan === 'infinite';
      setIsSubscribed(hasAccess);
      setCheckingAccess(false);

      const { data: projects } = await supabase
        .from("projects")
        .select("slug")
        .eq("user_id", user.id);
      
      if (projects) {
        const map: Record<string, string> = {};
        projects.forEach(p => {
          const match = p.slug.match(/dfy-(dfy-.*?)-/);
          if (match) {
            map[match[1]] = p.slug;
          }
        });
        setClaimedProjectMap(map);
      }
    }
    checkAccess();
  }, []);

  const handleClaim = async (site: DfySite) => {
    setClaiming(site.id);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to claim websites.");
      setClaiming(null);
      return;
    }

    try {
      const slug = `dfy-${site.id}-${Math.floor(Math.random() * 10000)}`;
      
      const { data: project, error: pError } = await supabase.from("projects").insert({
        user_id: user.id,
        name: site.name,
        slug: slug,
        product_name: site.name,
        product_description: site.description,
        status: "published",
        project_type: "service",
        theme_id: site.theme_id,
        primary_color: site.primary_color,
        secondary_color: site.secondary_color,
        font_family: site.font_family,
        keywords: site.keywords,
        target_audience: site.target_audience,
        custom_images: site.custom_images,
        selected_templates: site.selected_templates,
      }).select().single();
      
      if (pError || !project) throw pError || new Error("Project creation failed");

      const baseSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage" as const,
      };

      const pagesPayload = [
        {
          project_id: project.id,
          title: site.name,
          slug: "index",
          page_type: "landing" as const,
          is_published: true,
          meta_description: site.description.slice(0, 160),
          content: site.landingContent,
          schema_markup: {
            ...baseSchema,
            name: site.name,
            description: site.description.slice(0, 300),
          },
        },
        {
          project_id: project.id,
          title: `About ${site.name}`,
          slug: "about",
          page_type: "about" as const,
          is_published: true,
          meta_description: `About ${site.name} — ${site.description.slice(0, 120)}`,
          content: site.aboutContent,
          schema_markup: { ...baseSchema, name: `About ${site.name}` },
        },
        {
          project_id: project.id,
          title: `FAQ — ${site.name}`,
          slug: "faq",
          page_type: "faq" as const,
          is_published: true,
          meta_description: `Frequently asked questions about ${site.name}.`,
          content: site.faqContent,
          schema_markup: { ...baseSchema, name: `FAQ — ${site.name}` },
        },
        {
          project_id: project.id,
          title:
            (site.blogContent as { headline?: string }).headline || `Insights — ${site.name}`,
          slug: "insights",
          page_type: "blog" as const,
          is_published: true,
          meta_description: site.description.slice(0, 155),
          content: site.blogContent,
          schema_markup: {
            ...baseSchema,
            name: (site.blogContent as { headline?: string }).headline || site.name,
          },
        },
        {
          project_id: project.id,
          title: `Reviews — ${site.name}`,
          slug: "reviews",
          page_type: "reviews" as const,
          is_published: true,
          meta_description: `Customer reviews for ${site.name}.`,
          content: site.reviewsContent,
          schema_markup: { ...baseSchema, name: `Reviews — ${site.name}` },
        },
      ];

      const { error: pgError } = await supabase.from("pages").insert(pagesPayload);

      if (pgError) throw pgError;

      setClaimedProjectMap(prev => ({ ...prev, [site.id]: slug }));
      alert("Website successfully claimed! You can find it in your Asset Vault.");
    } catch (error) {
      console.error(error);
      alert("Failed to claim website. Please try again.");
    } finally {
      setClaiming(null);
    }
  };

  if (checkingAccess) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-brand-600" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Syncing DFY Library...</p>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <RestrictedContent 
        title="DFY Library Locked"
        description="Unlock 180+ ready-to-launch websites with pre-written content, SEO optimization, and premium designs."
        onUpgrade={() => window.location.href = "/activate"}
        icon={Sparkles}
      />
    );
  }

  const filteredSites = activeType === "All" 
    ? ALL_SITES 
    : ALL_SITES.filter(s => s.type === activeType);

  const visibleSites = filteredSites.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#FDFDFF] -m-6 p-6 pb-20 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-8">
          <div className="text-center space-y-2">
             <h1 className="text-4xl font-black tracking-tight text-gray-950 italic">DFY Library</h1>
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">180+ websites with 200 SEO posts each</p>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <VideoPlaceholder
              title="DFY Library — How to Claim & Launch"
              subtitle="Video training coming soon"
            />
          </div>

          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm gap-1">
              <button
                onClick={() => { setActiveType("All"); setVisibleCount(12); }}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeType === "All" 
                    ? "bg-brand-600 text-white shadow-lg" 
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              {DFY_SITE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setVisibleCount(12); }}
                  className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeType === type 
                      ? "bg-brand-600 text-white shadow-lg" 
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleSites.map((site) => {
            const projectSlug = claimedProjectMap[site.id];
            const isClaimed = !!projectSlug;

            return (
              <div 
                key={site.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-xl border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img 
                    src={site.image} 
                    alt={site.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border"
                    style={{ borderColor: `${site.primary_color}40` }}
                  >
                    <span
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: site.primary_color }}
                    >
                      {site.type}
                    </span>
                  </div>
                  {isClaimed && (
                    <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[2px] flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-lg">
                        <Check size={24} />
                      </div>
                      <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Claimed</p>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-xl">{site.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{site.description}</p>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="px-3 py-1 rounded-full bg-gray-50 text-[10px] font-black text-gray-400 uppercase letter-spacing-widest">
                      {site.niche}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-600 uppercase tracking-widest">
                       <Sparkles size={12} /> {site.posts} Posts
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                    <button 
                      onClick={() => setActivePreview(site)}
                      className="px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-100"
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button 
                      onClick={() => setActivePosts(site)}
                      className="px-4 py-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-brand-100"
                    >
                      <Zap size={14} /> {site.posts} Posts
                    </button>
                  </div>

                  <div className="mt-2">
                    {isClaimed ? (
                      <Link
                        href={`/s/${projectSlug}`}
                        target="_blank"
                        className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Globe size={14} /> View Live Website
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleClaim(site)}
                        disabled={claiming === site.id}
                        className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/10"
                      >
                        <Plus size={14} /> {claiming === site.id ? "Claiming..." : "Claim Now"}
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {visibleSites.length < filteredSites.length && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setVisibleCount(p => p + 12)}
              className="px-10 py-3.5 rounded-2xl bg-white border border-gray-200 text-gray-900 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-gray-50"
            >
              Load More Assets
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      {activePosts && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={() => setActivePosts(null)} />
          <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <FileSearch size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{activePosts.name}</h2>
                  <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">200 SEO Posts • {activePosts.type}</p>
                </div>
              </div>
              <button onClick={() => setActivePosts(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 border-b border-gray-100">
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search posts..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                 />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
               {Array.from({ length: 15 }).map((_, i) => {
                 const isOpen = expandedPostId === i;
                 const title = dfyPostTitle(activePosts, i);
                 const content = dfyPostBody(activePosts, i);
                 const tagList = dfyPostTags(activePosts, i);

                 return (
                   <div key={i} className={cn(
                     "group rounded-2xl border transition-all duration-300",
                     isOpen ? "bg-white border-brand-500/30 shadow-xl" : "bg-white border-gray-100 hover:border-brand-500/20 shadow-sm"
                   )}>
                      <button 
                        onClick={() => setExpandedPostId(isOpen ? null : i)}
                        className="w-full p-5 flex items-start justify-between gap-4 text-left"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                             <span className={cn(
                               "w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center transition-colors",
                               isOpen ? "bg-brand-600 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600"
                             )}>{i + 1}</span>
                             <h4 className={cn("font-bold text-sm transition-colors", isOpen ? "text-gray-950" : "text-gray-900")}>{title}</h4>
                          </div>
                          {!isOpen && (
                            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-1 ml-10">
                              Discover the latest trends and techniques to drive massive traffic...
                            </p>
                          )}
                        </div>
                        <div className={cn("mt-1 transition-transform duration-300", isOpen ? "rotate-180 text-brand-600" : "text-gray-400")}>
                           <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="ml-10 p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-4">
                              <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-medium">
                                 {content.split('\n\n').map((p, idx) => (
                                   <p key={idx}>{p}</p>
                                 ))}
                              </div>

                              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="flex gap-2 flex-wrap">
                                  {tagList.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 rounded text-[10px] font-bold"
                                      style={{
                                        backgroundColor: `${activePosts.primary_color}18`,
                                        color: activePosts.primary_color,
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${title}\n\n${content}`);
                                    alert("Post content copied to clipboard!");
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
                                >
                                  <Copy size={14} /> Copy Post Body
                                </button>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                 );
               })}
               <div className="text-center py-10">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic">Pagination simulated — 200 posts available in total</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activePreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm" onClick={() => setActivePreview(null)} />
          <div className="relative w-full max-w-6xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 gap-4 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activePreview.primary_color }}
                >
                  <Globe size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight italic truncate">{activePreview.name}</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                    Live preview · {activePreview.niche} · {activePreview.theme}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-950 shadow-sm transition-all shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 min-h-0 bg-gray-100">
              <iframe
                title={`Preview ${activePreview.name}`}
                src={`/preview/dfy/${encodeURIComponent(activePreview.id)}?page=landing`}
                className="absolute inset-0 h-full w-full border-0 bg-white"
              />
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <button onClick={() => setActivePreview(null)} className="px-8 py-4 rounded-2xl bg-gray-200 text-gray-600 font-black uppercase tracking-widest hover:bg-gray-300 transition-all">Cancel</button>
               <button 
                 onClick={() => { handleClaim(activePreview); setActivePreview(null); }}
                 disabled={claiming === activePreview.id}
                 className="px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all hover:opacity-90"
                 style={{ backgroundColor: activePreview.primary_color, boxShadow: `0 20px 40px ${activePreview.primary_color}44` }}
               >
                 <Plus size={18} /> {claiming === activePreview.id ? "Claiming..." : "Add to my websites"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
