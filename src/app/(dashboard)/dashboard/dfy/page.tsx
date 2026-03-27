"use client";

import { useState, useEffect } from "react";
import { Sparkles, Filter, CheckCircle2, ChevronRight, Layout, Zap, Rocket, Lock, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import Link from "next/link";

const TYPES = [
  "E-commerce", "Service", "Portfolio", "Landing Page", "Blog", 
  "Education", "Health/Medical", "Personal Branding", "Corporate"
];

const TYPE_COLORS: Record<string, string> = {
  "E-commerce": "bg-blue-500",
  "Service": "bg-emerald-500",
  "Portfolio": "bg-purple-500",
  "Landing Page": "bg-rose-500",
  "Blog": "bg-amber-500",
  "Education": "bg-cyan-500",
  "Health/Medical": "bg-green-500",
  "Personal Branding": "bg-orange-500",
  "Corporate": "bg-slate-500",
};

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

// Generate 180 sites
const ALL_SITES = Array.from({ length: 180 }).map((_, i) => {
  const type = TYPES[i % TYPES.length];
  const images = TYPE_IMAGES[type];
  const image = images[i % images.length];
  return {
    id: `dfy-${i}`,
    name: `${type} Solutions ${Math.floor(i / TYPES.length) + 1}`,
    niche: `${type} - Premium`,
    description: `A fully optimized ${type.toLowerCase()} platform with custom features, high-converting design, and pre-written content.`,
    type: type,
    image: image,
    posts: 200,
    blueprint: "v1-premium-blueprint"
  };
});

export default function DFYPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [claiming, setClaiming] = useState<string | null>(null);

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

      const { data } = await supabase
        .from("projects")
        .select("slug")
        .eq("user_id", user.id);
      
      if (data) {
        setClaimedIds(new Set(data.map(p => {
            const match = p.slug.match(/dfy-(dfy-\d+)-/);
            return match ? match[1] : "";
        }).filter(id => id)));
      }
    }
    checkAccess();
  }, []);

  const filteredSites = activeType === "All" 
    ? ALL_SITES 
    : ALL_SITES.filter(s => s.type === activeType);

  const visibleSites = filteredSites.slice(0, visibleCount);

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
      
      // 1. Insert Project
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

      // 2. Insert Landing Page
      const { error: pgError } = await supabase.from("pages").insert({
        project_id: project.id,
        title: site.name,
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

      // 3. Call AI API for articles
      await fetch("/api/dfy/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectId: project.id,
          siteName: site.name, 
          type: site.type 
        }),
      });

      setClaimedIds(prev => new Set(prev).add(site.id));
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
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing DFY Library...</p>
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

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-6 text-center lg:text-left">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mx-auto lg:mx-0">
            <Sparkles className="text-white" size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">DFY Library</h1>
            <p className="text-xl text-gray-500 font-medium">
              180+ ready-to-launch websites. Hand-picked, pre-filled, and optimized.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className={`space-y-8`}>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
            <button
              onClick={() => { setActiveType("All"); setVisibleCount(12); }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeType === "All" 
                  ? "bg-gray-900 text-white shadow-xl scale-105" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              All Sites
            </button>
            {TYPES.map((type) => (
              <button
                key={type}
                onClick={() => { setActiveType(type); setVisibleCount(12); }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeType === type 
                    ? `${TYPE_COLORS[type]} text-white shadow-xl scale-105` 
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleSites.map((site) => {
              const isClaimed = claimedIds.has(site.id);
              return (
                <div 
                  key={site.id} 
                  className="group relative bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={site.image} 
                      alt={site.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${TYPE_COLORS[site.type]}`}>
                        {site.type}
                      </span>
                    </div>
                    {isClaimed && (
                      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="text-white" size={24} />
                          </div>
                          <p className="text-white font-black text-xl">Already Claimed</p>
                          <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm">
                            View in Asset Vault <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{site.name}</h3>
                      <p className="text-xs text-indigo-600 font-black uppercase tracking-widest">{site.niche}</p>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {site.description}
                    </p>
                    
                    <div className="pt-4 mt-auto flex items-center justify-between border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Content</span>
                        <button className="text-sm font-black text-brand-600 hover:text-brand-700 flex items-center gap-1 group/posts">
                          {site.posts} Posts
                          <Sparkles size={12} className="group-hover/posts:rotate-12 transition-transform" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(site.image, '_blank')}
                          className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-600 transition-all"
                          title="View Demo"
                        >
                          <ExternalLink size={18} />
                        </button>
                        {!isClaimed && (
                          <button
                            onClick={() => handleClaim(site)}
                            disabled={claiming === site.id}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-brand-600 text-white text-sm font-bold transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                          >
                            {claiming === site.id ? "Claiming..." : "Claim Now"}
                            <ArrowRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {visibleSites.length < filteredSites.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount(p => p + 12)}
                className="px-10 py-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold transition-all hover:scale-105 shadow-sm"
              >
                Load More Websites
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Features Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-gray-100">
        {[
          { title: "AI Optimized", text: "كل قالب محسّن للتحويل وسرعة التحميل", icon: Zap, color: "text-amber-500" },
          { title: "Instant Deploy", text: "Claim وإطلاق في أقل من 60 ثانية", icon: Rocket, color: "text-indigo-500" },
          { title: "Full Control", text: "تعديل كامل للمحتوى والمنتجات والتصميم", icon: Layout, color: "text-emerald-500" },
        ].map((feat, i) => (
          <div key={i} className="flex gap-4 p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:border-indigo-100 transition-colors">
            <div className={`p-4 rounded-2xl bg-gray-50 ${feat.color}`}>
              <feat.icon size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-gray-900">{feat.title}</h4>
              <p className="text-gray-500 mt-1">Ready-to-use assets optimized for high performance across all devices.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
