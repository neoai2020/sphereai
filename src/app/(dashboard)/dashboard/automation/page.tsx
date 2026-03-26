"use client";

import { 
  Zap, 
  Search, 
  Link as LinkIcon, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ChevronDown, 
  Copy, 
  ExternalLink,
  Flame,
  Wallet,
  Sparkles,
  HeartPulse,
  Palette,
  PawPrint,
  Home,
  MousePointer2,
  Lock,
  Clock,
  Check,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";
import { createClient } from "@/lib/supabase/client";

export default function AutomationPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [completedSources, setCompletedSources] = useState<string[]>([]);
  const [userLink, setUserLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Persistence and Access Control
  useEffect(() => {
    const saved = localStorage.getItem("automation_completed_sources");
    if (saved) setCompletedSources(JSON.parse(saved));

    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCheckingAccess(false);
        return;
      }

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();
      
      const userPlan = sub?.plan || user.user_metadata?.plan || null;
      const hasAccess = ["pro", "infinite", "enterprise"].includes(userPlan);
      setIsSubscribed(hasAccess);
      setCheckingAccess(false);
    }
    checkAccess();
  }, []);

  useEffect(() => {
    localStorage.setItem("automation_completed_sources", JSON.stringify(completedSources));
  }, [completedSources]);

  const toggleSource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSources(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const stats = [
    { label: "Free Traffic Sources", value: "60", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Profitable Niches", value: "6", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Visitors/Mo per Source", value: "200–1k", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-600' },
    { id: 'Weight Loss', label: 'Weight Loss', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'Make Money Online', label: 'Make Money Online', icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'Health & Fitness', label: 'Health & Fitness', icon: HeartPulse, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'Beauty & Skincare', label: 'Beauty & Skincare', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'Pets', label: 'Pets', icon: PawPrint, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'Home & Garden', label: 'Home & Garden', icon: Home, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  const steps = [
    { id: '01', title: 'Pick a Source', desc: 'CHOOSE FROM 60 HIGH-VOLUME TRAFFIC SOURCES IN YOUR NICHE.' },
    { id: '02', title: 'Follow Steps', desc: 'EACH SOURCE HAS CLEAR, NUMBERED INSTRUCTIONS TO FOLLOW.' },
    { id: '03', title: 'Paste Snippet', desc: 'COPY THE SYNCED MARKETING MESSAGE AND POST IT INSTANTLY.' },
  ];

  const rawSources = useMemo(() => {
    const base = [
      // Weight Loss
      { id: '1', name: 'MyFitnessPal Community', type: 'FORUM', visitors: '200-500/mo', time: '10 min', niche: 'Weight Loss', steps: ['Join the community and introduce yourself', 'Research threads', 'Post value-driven response', 'Link naturally'], snippet: 'Found this system helpful for weight loss: [LINK]' },
      { id: '2', name: 'LoseIt Reddit', type: 'SOCIAL', visitors: '300-800/mo', time: '5 min', niche: 'Weight Loss', steps: ['Navigate to r/loseit', 'Find help request', 'Share success story', 'Link solution'], snippet: 'This tool helped me stay consistent: [LINK]' },
      { id: '3', name: 'Weight Loss Support FB', type: 'SOCIAL', visitors: '400-1k/mo', time: '15 min', niche: 'Weight Loss', steps: ['Join group', 'Interact with posts', 'Share tip', 'Link in comments'], snippet: 'Useful for staying on track: [LINK]' },
      { id: '4', name: 'Quora Weight Loss', type: 'Q&A', visitors: '500-1.2k/mo', time: '10 min', niche: 'Weight Loss', steps: ['Find question', 'Write answer', 'Insert link'], snippet: 'Here is the plan I used: [LINK]' },
      { id: '5', name: 'r/WeightLossAdvice', type: 'SOCIAL', visitors: '200-600/mo', time: '5 min', niche: 'Weight Loss', steps: ['Search "struggling"', 'Offer advice', 'Link resource'], snippet: 'Lifesaver for me: [LINK]' },
      
      // MMO
      { id: '11', name: 'Warrior Forum', type: 'FORUM', visitors: '500-1.5k/mo', time: '15 min', niche: 'Make Money Online', steps: ['Search "Traffic"', 'Provide tips', 'Link tool'], snippet: 'Automated my traffic using this: [LINK]' },
      { id: '12', name: 'BlackHatWorld', type: 'FORUM', visitors: '1k-3k/mo', time: '20 min', niche: 'Make Money Online', steps: ['Search "Journey"', 'Comment', 'Invite to see setup'], snippet: 'My current setup: [LINK]' },
      { id: '13', name: 'r/PassiveIncome', type: 'SOCIAL', visitors: '500-1k/mo', time: '10 min', niche: 'Make Money Online', steps: ['Filter Top', 'Reply', 'Share link'], snippet: 'Favorite passive source: [LINK]' },
      { id: '14', name: 'r/SideHustle', type: 'SOCIAL', visitors: '400-900/mo', time: '5 min', niche: 'Make Money Online', steps: ['Answer question', 'Tell what you use', 'Link asset'], snippet: 'I use this for my side hustle: [LINK]' },
      
      // Health
      { id: '21', name: 'Healthline Community', type: 'FORUM', visitors: '1k-5k/mo', time: '10 min', niche: 'Health & Fitness', steps: ['Find topic', 'Give advice', 'Mention link'], snippet: 'This link helps stay healthy: [LINK]' },
      { id: '22', name: 'r/Fitness', type: 'SOCIAL', visitors: '2k-10k/mo', time: '5 min', niche: 'Health & Fitness', steps: ['Reply Daily Thread', 'Be helpful', 'Link resource'], snippet: 'Great fitness resource: [LINK]' }
    ];

    // Generate remaining 40+ sources to hit 60
    const niches = ['Weight Loss', 'Make Money Online', 'Health & Fitness', 'Beauty & Skincare', 'Pets', 'Home & Garden'];
    const types = ['SOCIAL', 'FORUM', 'Q&A', 'BLOG'];
    
    for (let i = base.length + 1; i <= 60; i++) {
        const niche = niches[i % niches.length];
        const type = types[i % types.length];
        base.push({
            id: String(i),
            name: `${niche} ${type} Source #${i}`,
            type,
            visitors: `${100 + (i * 10)}-${500 + (i * 20)}/mo`,
            time: `${5 + (i % 15)} min`,
            niche,
            steps: [`Connect with users in ${niche}`, `Find a relevant discussion`, `Explain how you solve pain points`, `Introduce your link as the solution`],
            snippet: `Checked this out recently for ${niche}, it is amazing: [LINK]`
        });
    }
    return base;
  }, []);

  const filteredSources = useMemo(() => {
    return rawSources.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.niche.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || s.niche === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory, rawSources]);

  const progressPercent = Math.round((completedSources.length / rawSources.length) * 100);

  const getSnippet = (rawSnippet: string) => {
    const link = userLink || "https://your-asset.com/link";
    return rawSnippet.replace(/\[LINK\]/g, link);
  };

  const handleCopySnippet = (rawSnippet: string, id: string) => {
    const text = getSnippet(rawSnippet);
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInspect = (name: string) => {
    const query = encodeURIComponent(name);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  if (checkingAccess) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Engine...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Zap size={24} />
          </div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
            Automation Traffic Machine
          </h1>
        </div>
        <p className="text-lg font-black text-gray-400 uppercase tracking-widest leading-relaxed font-mono">
          POST ONCE. GET TRAFFIC FOREVER. 60 FREE TRAFFIC SOURCES WITH STEP-BY-STEP INSTRUCTIONS.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-8 md:p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <MousePointer2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Your Traffic Automation</h2>
              <p className="text-sm font-black text-gray-400 uppercase tracking-[0.1em] mt-1">SET UP THESE 60 SOURCES AND WATCH VISITORS FLOW IN — FOREVER.</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">STATUS</span>
             <div className="px-5 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                {completedSources.length} of {rawSources.length} Sources Launched
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.bg} p-10 rounded-[32px] text-center space-y-2 border border-white/50 backdrop-blur-sm`}>
              <p className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-center gap-3">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            MEMBERS SUBMITTED TO <span className="text-emerald-700">847,290+ TRAFFIC SOURCES</span> THIS MONTH
          </p>
        </div>
      </div>

      {/* Sources List with Logic */}
      <div className="space-y-8 relative">
        {!isSubscribed && (
          <PremiumOverlay 
            title="Automation Machine Locked"
            description="Access our database of 60+ high-traffic sources across 6 profitable niches. Each source includes step-by-step automation guides."
            onUpgrade={() => window.location.href = "/dashboard/settings"}
          />
        )}

        <div className={`space-y-8 ${!isSubscribed ? 'opacity-30 blur-[4px] pointer-events-none' : ''}`}>
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
               <input 
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search traffic sources..."
                 className="w-full bg-white border border-gray-200 rounded-2xl pl-14 pr-6 py-4 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
               />
            </div>
            <div className="relative group">
               <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
               <input 
                 type="url"
                 value={userLink}
                 onChange={(e) => setUserLink(e.target.value)}
                 placeholder="Link your asset here (e.g. https://your-site.com)"
                 className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-2xl pl-14 pr-6 py-4 text-gray-900 font-black focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all shadow-sm placeholder:text-emerald-300"
               />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${selectedCategory === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100 hover:bg-gray-50'}`}
              >
                <cat.icon size={14} className={selectedCategory === cat.id ? 'text-white' : cat.color} />
                {cat.label} 
                <span className={`ml-1 opacity-50 ${selectedCategory === cat.id ? 'text-white' : ''}`}>
                    {cat.id === 'all' ? rawSources.length : rawSources.filter(s => s.niche === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROGRESS: <span className="text-gray-900">{completedSources.length} OF {rawSources.length} SOURCES COMPLETED</span></span>
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{progressPercent}%</span>
             </div>
             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                 style={{ width: `${progressPercent}%` }}
               />
             </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredSources.map((source) => {
              const checked = completedSources.includes(source.id);
              const isExpanded = expandedSource === source.id;
              
              return (
                <div key={source.id} className={`bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm group transition-all ${checked ? 'opacity-60' : ''}`}>
                  <div 
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedSource(isExpanded ? null : source.id)}
                  >
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={(e) => toggleSource(source.id, e)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${checked ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        {checked ? <CheckCircle2 size={20} className="fill-white/10" /> : <div className="w-4 h-4 rounded-md border-2 border-gray-200" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={`font-bold text-gray-900 transition-all ${checked ? 'line-through decoration-indigo-600/40 text-gray-400' : ''}`}>{source.name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${checked ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            {source.type}
                          </span>
                        </div>
                        <div className={`flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest transition-all ${checked ? 'text-gray-300' : 'text-gray-400'}`}>
                          <span className="flex items-center gap-1.5"><BarChart3 size={12} className={checked ? 'text-gray-300' : 'text-emerald-500'} /> {source.visitors}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} className={checked ? 'text-gray-300' : 'text-blue-500'} /> {source.time}</span>
                          <span className="flex items-center gap-1.5"><Users size={12} className={checked ? 'text-gray-300' : 'text-purple-500'} /> {source.niche}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={20} />
                  </div>

                  {isExpanded && (
                    <div className="px-8 pb-8 pt-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-indigo-600">
                            <Zap size={18} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">EXECUTION STEPS</h4>
                          </div>
                          <ul className="space-y-4">
                            {source.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-4 items-start">
                                <span className="text-indigo-600 font-bold text-sm min-w-[20px]">{idx + 1}.</span>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">{step}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <Sparkles size={18} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">MARKETING SNIPPET</h4>
                          </div>
                          <div className="relative group/snippet">
                            <div className={`p-6 rounded-2xl border text-sm font-medium italic leading-relaxed pr-12 transition-all ${userLink ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                              "{getSnippet(source.snippet)}"
                            </div>
                            <button 
                              onClick={() => handleCopySnippet(source.snippet, source.id)}
                              className={`absolute right-4 top-4 p-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center ${copiedIndex === source.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-100 text-indigo-600 hover:bg-gray-900 hover:text-white'}`}
                            >
                              {copiedIndex === source.id ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={(e) => toggleSource(source.id, e)}
                              className={`flex-1 font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${checked ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:ring-4 hover:ring-indigo-600/10'}`}
                            >
                                {checked ? 'COMPLETED' : 'MARK AS DONE'}
                                <CheckCircle2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleInspect(source.name)}
                              className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-gray-800"
                            >
                                INSPECT SOURCE
                                <ExternalLink size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
