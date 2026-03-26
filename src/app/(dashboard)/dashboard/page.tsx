import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  FolderOpen, 
  Plus, 
  Globe, 
  BarChart3, 
  Play, 
  Zap, 
  MessageSquare, 
  TrendingUp, 
  Award,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

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
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0];

  const successStories = [
    { name: "Ahmed", profit: "$2,400", story: "Generated 5 affiliate pages for a keto product. Ranking on AI search in 3 days!" },
    { name: "Sarah", profit: "$1,850", story: "My blog post about AI tools was cited by ChatGPT. Traffic jumped 400%." },
    { name: "Marc", profit: "$3,120", story: "Sold 12 subscriptions in the first week using the Landing Page generator." }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Welcome back, {userName}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">
            Your AI-optimized portfolio is growing. Here&apos;s your current status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/new"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-xl shadow-brand-200 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            New Project
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* 2. Featured Video Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-1">
             <div className="aspect-video bg-gray-100 rounded-[22px] overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
                  alt="AI Strategy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl border-4 border-brand-50">
                    <Play size={40} className="text-brand-600 fill-brand-600 ml-1.5" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4 shadow-lg shadow-brand-500/30">
                    <Zap size={14} fill="currentColor" /> Mastering AI Search
                  </div>
                  <p className="text-white font-bold text-3xl mb-2 drop-shadow-md">The 2024 AI Citation Guide</p>
                  <p className="text-white/90 text-base drop-shadow-sm font-medium">How to ensure your content is recommended by ChatGPT & Perplexity.</p>
                </div>
              </div>
          </div>

          {/* 3. Statistics Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FolderOpen, label: "Total Projects", value: totalProjects, color: "brand", trend: "+2 this week" },
              { icon: Globe, label: "Published Pages", value: published, color: "green", trend: "Live & Active" },
              { icon: BarChart3, label: "Generated Assets", value: totalPages, color: "purple", trend: "Optimized" },
              { icon: Users, label: "AI Citations", value: "Locked", color: "orange", trend: "Pro feature", locked: true },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group border-b-4 border-b-transparent hover:border-b-brand-500">
                {stat.locked && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-4">
                    <Link href="/dashboard/settings" className="px-4 py-1.5 bg-brand-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">Upgrade Now</Link>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-full bg-${stat.color}-50 text-${stat.color}-700 uppercase`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500 mb-0.5 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 4. Recent Innovations */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-brand-600" size={24} />
                <h2 className="font-bold text-gray-900 text-xl tracking-tight">Active Generations</h2>
              </div>
              <Link href="/dashboard/projects" className="text-brand-600 text-sm font-bold hover:underline flex items-center gap-1.5 bg-brand-50 px-4 py-2 rounded-full transition-colors hover:bg-brand-100">
                History <ArrowUpRight size={14} />
              </Link>
            </div>
            {totalProjects === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-brand-50 flex items-center justify-center mx-auto mb-6 shadow-brand-100/50 shadow-inner">
                  <Zap size={40} className="text-brand-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Build your empire</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                  Start by creating your first AI-optimized project. It only takes 2 minutes to go live.
                </p>
                <Link
                  href="/dashboard/projects/new"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black transition-all shadow-2xl shadow-brand-100"
                >
                  Start Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {projects?.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center justify-between p-8 hover:bg-brand-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-md group-hover:border-brand-200 group-hover:bg-brand-50 transition-all">
                        <Globe size={22} className="text-gray-400 group-hover:text-brand-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg group-hover:text-brand-700 transition-colors">{project.name}</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">{project.product_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        project.status === "published"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : project.status === "generating"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                        {project.status}
                      </span>
                      <ArrowUpRight size={20} className="text-gray-300 group-hover:text-brand-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Sidebar */}
        <div className="lg:col-span-4 space-y-8">
            {/* Account Status at the top */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 p-8 overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-gray-900 text-xl tracking-tight">Active Plan</h2>
                <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Standard Tier</span>
                  <div className="h-1 w-1 rounded-full bg-brand-300" />
                </div>
                <p className="text-2xl font-black text-gray-900">Verified Account</p>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-gray-400">
                  <Clock size={12} /> Renewal in 24 days
                </div>
              </div>
              <Link href="/dashboard/settings" className="block w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm text-center transition-all shadow-xl shadow-brand-200 hover:-translate-y-1">
                Manage Subscription
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/30 border border-gray-100 relative overflow-hidden">
              <h2 className="text-gray-900 font-black text-xl mb-8 flex items-center gap-3">
                <Zap size={22} className="text-brand-600" /> Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "New Project", href: "/dashboard/projects/new", icon: Plus, color: "brand" },
                  { label: "Traffic Magnet", href: "/dashboard/traffic-magnet", icon: Search, color: "purple" },
                  { label: "Training Center", href: "/dashboard/training", icon: Play, color: "orange" },
                  { label: "Contact Support", href: "/dashboard/support", icon: MessageSquare, color: "green" },
                ].map((action, i) => (
                  <Link 
                    key={i}
                    href={action.href} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 font-bold transition-all border border-transparent hover:border-brand-100 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <action.icon size={20} className={`text-${action.color}-600`} />
                      </div>
                      <span className="text-base tracking-tight">{action.label}</span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* 6. Live Success (Bottom Ticker) */}
      <div className="bg-white rounded-2xl p-1 border border-gray-100 shadow-sm overflow-hidden mt-12 mb-8">
        <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-5 flex items-center overflow-hidden">
          <div className="flex gap-20 animate-scroll whitespace-nowrap">
            {[...successStories, ...successStories, ...successStories].map((story, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-700">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-black border border-brand-200">
                  {story.name[0]}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{story.name}</span>
                  <span className="text-green-600 font-bold">{story.profit}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="text-gray-400 text-xs font-bold italic truncate max-w-[400px] tracking-tight">&quot;{story.story}&quot;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
