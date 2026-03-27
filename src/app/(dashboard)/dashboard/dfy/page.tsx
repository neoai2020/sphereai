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

const TYPES = [
  "E-commerce", "Service", "Portfolio", "Landing Page", "Blog", 
  "Education", "Health/Medical", "Personal Branding", "Corporate"
];

const TYPE_IMAGES: Record<string, string[]> = {
  "E-commerce": [
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
  ],
  "Service": [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581578731522-7455ee538bca?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1591955506264-3f5a6834570a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=800"
  ],
  "Portfolio": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1454165833267-0c1fd46585f5?auto=format&fit=crop&q=80&w=800"
  ],
  "Landing Page": [
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"
  ],
  "Blog": [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800"
  ],
  "Education": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1513258496099-48168024adb0?auto=format&fit=crop&q=80&w=800"
  ],
  "Health/Medical": [
    "https://images.unsplash.com/photo-1505751172107-12939972c7dd?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1631217816660-ad3535299921?auto=format&fit=crop&q=80&w=800"
  ],
  "Personal Branding": [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  ],
  "Corporate": [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
  ]
};

const SITE_VERBS = ["Pro", "Elite", "Hub", "Studio", "Labs", "Agency", "Works", "Co", "Space", "Ventures"];
const SITE_ADJECTIVES = ["Premium", "Advanced", "Smart", "Modern", "Expert", "Digital", "Creative", "Dynamic", "Global", "Next-Gen"];

const ALL_SITES = [
  {
    id: "dfy-cartflow",
    name: "CartFlow",
    niche: "E-commerce Solutions",
    description: "Handcrafted goods from independent artisans, delivered worldwide. Optimized for speed and high conversion.",
    type: "E-commerce",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
    posts: 200,
    theme: "Clean Theme"
  },
  {
    id: "dfy-lumina",
    name: "Lumina Labs",
    niche: "Agency / Saas",
    description: "Next-gen digital solutions for high-growth startups and enterprises. Built with a modern tech stack.",
    type: "Service",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    posts: 200,
    theme: "Dark Mode"
  },
  {
    id: "dfy-expert",
    name: "Expert Academy",
    niche: "Education / LMS",
    description: "A complete learning management platform to host your courses and grow your community.",
    type: "Education",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    posts: 200,
    theme: "Clean Theme"
  },
  ...Array.from({ length: 177 }).map((_, i) => {
    const type = TYPES[i % TYPES.length];
    const images = TYPE_IMAGES[type];
    const image = images[i % images.length];
    const verb = SITE_VERBS[Math.floor(i / TYPES.length) % SITE_VERBS.length];
    const adj = SITE_ADJECTIVES[(i + 3) % SITE_ADJECTIVES.length];
    return {
      id: `dfy-${i + 3}`,
      name: `${adj} ${type} ${verb}`,
      niche: `${type} - ${verb}`,
      description: `A fully optimized ${type.toLowerCase()} platform with ${adj.toLowerCase()} features and pre-written SEO content.`,
      type: type,
      image: image,
      posts: 200,
      theme: "Clean Theme"
    };
  })
];

export default function DFYPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [claimedProjectMap, setClaimedProjectMap] = useState<Record<string, string>>({}); // Site ID -> Project Slug
  const [claiming, setClaiming] = useState<string | null>(null);
  
  const [activePreview, setActivePreview] = useState<typeof ALL_SITES[0] | null>(null);
  const [activePosts, setActivePosts] = useState<typeof ALL_SITES[0] | null>(null);
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

  const handleClaim = async (site: typeof ALL_SITES[0]) => {
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
        project_type: "service"
      }).select().single();
      
      if (pError || !project) throw pError || new Error("Project creation failed");

      const { error: pgError } = await supabase.from("pages").insert({
        project_id: project.id,
        title: site.name,
        slug: "index",
        page_type: "landing",
        is_published: true,
        content: {
          heroTitle: site.name,
          heroSubtitle: site.description,
          features: [
            { title: "Premium Design", description: "Fully optimized for speed and conversion." },
            { title: "Done-For-You", description: "Complete content and SEO-ready structure." }
          ]
        }
      });

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
              {TYPES.map((type) => (
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
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{site.type}</span>
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
               {Array.from({ length: 15 }).map((_, i) => (
                 <div key={i} className="group p-5 rounded-2xl bg-white border border-gray-100 hover:border-brand-500/30 transition-all shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-6 h-6 rounded-lg bg-gray-50 text-[10px] font-black text-gray-400 flex items-center justify-center">{i + 1}</span>
                           <h4 className="text-gray-900 font-bold text-sm">How to optimize your {activePosts.niche} strategy for 2024</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Discover the latest trends and techniques to drive massive traffic and conversions to your {activePosts.type} platform...
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`How to optimize your ${activePosts.niche} strategy for 2024\n\nDiscover the latest trends...`);
                          alert("Copied to clipboard!");
                        }}
                        className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                 </div>
               ))}
               <div className="text-center py-10">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">Pagination simulated — 200 posts available in total</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activePreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm" onClick={() => setActivePreview(null)} />
          <div className="relative w-full max-w-6xl bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">{activePreview.name}</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activePreview.niche} • {activePreview.theme}</p>
                </div>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-950 shadow-sm transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#FDFDFF] p-10 pt-20">
               <div className="max-w-4xl mx-auto space-y-20">
                  <div className="text-center space-y-6">
                     <span className="px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest">{activePreview.niche}</span>
                     <h1 className="text-6xl font-black tracking-tighter text-gray-950 leading-none italic">Discover. Shop. Love.</h1>
                     <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">{activePreview.description}</p>
                     <div className="pt-4">
                        <button className="px-8 py-4 rounded-2xl bg-brand-600 text-white font-black uppercase tracking-widest shadow-xl shadow-brand-500/20">Get Started Today</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-20 border-t border-gray-100">
                    <div className="space-y-4">
                       <h2 className="text-3xl font-black italic">Why choose {activePreview.name}?</h2>
                       <p className="text-gray-500 font-medium">Everything you need to launch your niche enterprise instantly.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                       {[
                         { t: "SEO Optimized", d: "Pre-written posts and metadata." },
                         { t: "Premium Design", d: "High-end aesthetic for better conversion." }
                       ].map((f, i) => (
                         <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                               <Check size={18} />
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-950">{f.t}</h4>
                               <p className="text-xs text-gray-500">{f.d}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
               <button onClick={() => setActivePreview(null)} className="px-8 py-4 rounded-2xl bg-gray-200 text-gray-600 font-black uppercase tracking-widest hover:bg-gray-300 transition-all">Cancel</button>
               <button 
                 onClick={() => { handleClaim(activePreview); setActivePreview(null); }}
                 disabled={claiming === activePreview.id}
                 className="px-8 py-4 rounded-2xl bg-brand-600 text-white font-black uppercase tracking-widest shadow-xl shadow-brand-600/20 flex items-center gap-2 hover:bg-brand-500 transition-all"
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
