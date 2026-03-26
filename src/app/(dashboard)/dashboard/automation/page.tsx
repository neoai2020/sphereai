"use client";

import { 
  Zap, 
  Search, 
  Link as LinkIcon, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Share2, 
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
  ArrowRight,
  Check
} from "lucide-react";
import { useState, useMemo } from "react";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";

export default function AutomationPage() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [completedSources, setCompletedSources] = useState<string[]>([]);
  const [userLink, setUserLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

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
    { id: 'all', label: 'All', count: 60, icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-600' },
    { id: 'Weight Loss', label: 'Weight Loss', count: 10, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'Make Money Online', label: 'Make Money Online', count: 10, icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'Health & Fitness', label: 'Health & Fitness', count: 10, icon: HeartPulse, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'Beauty & Skincare', label: 'Beauty & Skincare', count: 10, icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'Pets', label: 'Pets', count: 10, icon: PawPrint, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'Home & Garden', label: 'Home & Garden', count: 10, icon: Home, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  const steps = [
    { id: '01', title: 'Pick a Source', desc: 'CHOOSE FROM 60 HIGH-VOLUME TRAFFIC SOURCES IN YOUR NICHE.' },
    { id: '02', title: 'Follow Steps', desc: 'EACH SOURCE HAS CLEAR, NUMBERED INSTRUCTIONS TO FOLLOW.' },
    { id: '03', title: 'Paste Snippet', desc: 'COPY THE SYNCED MARKETING MESSAGE AND POST IT INSTANTLY.' },
  ];

  const rawSources = [
    // Weight Loss (1-10)
    { id: '1', name: 'MyFitnessPal Community', type: 'FORUM', visitors: '200-500/mo', time: '10 min', niche: 'Weight Loss', steps: ['Join the community and introduce yourself', 'Research popular threads in this niche', 'Write a value-driven response', 'Add your synced affiliate link naturally'], snippet: 'Hey! Looking at the discussion, I found this system to be a game-changer for Weight Loss. It really simplified my workflow. You can check it out here: [LINK]' },
    { id: '2', name: 'LoseIt Reddit', type: 'SOCIAL', visitors: '300-800/mo', time: '5 min', niche: 'Weight Loss', steps: ['Navigate to r/loseit', 'Find a help request thread', 'Share your success story or tips', 'Link your resource as a solution'], snippet: 'I struggled with this too until I found this tool. It helped me stay consistent. Hope it helps you on your journey! See it here: [LINK]' },
    { id: '3', name: 'Weight Loss Support Group (FB)', type: 'SOCIAL', visitors: '400-1k/mo', time: '15 min', niche: 'Weight Loss', steps: ['Join the group', 'Interact with 5 posts', 'Share a tip', 'Mention your link in comments'], snippet: 'I found this really useful for staying on track: [LINK]' },
    { id: '4', name: 'Quora Weight Loss', type: 'Q&A', visitors: '500-1.2k/mo', time: '10 min', niche: 'Weight Loss', steps: ['Find a high-traffic question', 'Write a detailed answer', 'Insert your link at the end'], snippet: 'If you want to see the exact plan I used, it\'s here: [LINK]' },
    { id: '5', name: 'r/WeightLossAdvice', type: 'SOCIAL', visitors: '200-600/mo', time: '5 min', niche: 'Weight Loss', steps: ['Search for "struggling"', 'Offer encouraging words', 'Provide your link as a resource'], snippet: 'This tool was a lifesaver for me: [LINK]' },
    { id: '6', name: 'SparkPeople Forums', type: 'FORUM', visitors: '150-400/mo', time: '10 min', niche: 'Weight Loss', steps: ['Create an account', 'Join the main forum', 'Reply to a newer member'], snippet: 'Welcome! I highly recommend checking this out: [LINK]' },
    { id: '7', name: '30 Day Weight Loss Challenge', type: 'SOCIAL', visitors: '600-1.5k/mo', time: '12 min', niche: 'Weight Loss', steps: ['Go to the latest challenge post', 'Tell them you are starting', 'Share your tools'], snippet: 'Starting today with this system: [LINK]' },
    { id: '8', name: 'Weight Watchers Community', type: 'FORUM', visitors: '300-700/mo', time: '20 min', niche: 'Weight Loss', steps: ['Login to community', 'Find "General Discussion"', 'Start a thread about consistency'], snippet: 'Here is how I stay consistent: [LINK]' },
    { id: '9', name: 'Pinterest Weight Loss Boards', type: 'SOCIAL', visitors: '1k-3k/mo', time: '8 min', niche: 'Weight Loss', steps: ['Create a pin', 'Use a high-quality image', 'Direct link to your asset'], snippet: 'Check this weight loss asset: [LINK]' },
    { id: '10', name: 'Bodybuilding.com Fat Loss Forum', type: 'FORUM', visitors: '400-900/mo', time: '15 min', niche: 'Weight Loss', steps: ['Find fat loss sub-forum', 'Look for "Help with plateau"', 'Reply with value'], snippet: 'This helped me break my plateau: [LINK]' },

    // Make Money Online (11-20)
    { id: '11', name: 'Warrior Forum', type: 'FORUM', visitors: '500-1.5k/mo', time: '15 min', niche: 'Make Money Online', steps: ['Search for "Traffic"', 'Provide 3 free tips', 'Link your automation tool'], snippet: 'I automated my traffic using this: [LINK]' },
    { id: '12', name: 'BlackHatWorld', type: 'FORUM', visitors: '1k-3k/mo', time: '20 min', niche: 'Make Money Online', steps: ['Search "My Journey"', 'Comment on a post', 'Invite them to see your setup'], snippet: 'My current setup is right here: [LINK]' },
    { id: '13', name: 'r/PassiveIncome', type: 'SOCIAL', visitors: '500-1k/mo', time: '10 min', niche: 'Make Money Online', steps: ['Filter by "Top"', 'Reply to a comment', 'Share your passive link'], snippet: 'One of my favorite passive sources: [LINK]' },
    { id: '14', name: 'r/SideHustle', type: 'SOCIAL', visitors: '400-900/mo', time: '5 min', niche: 'Make Money Online', steps: ['Answer a question', 'Tell them what you use', 'Link the asset'], snippet: 'I use this for my side hustle: [LINK]' },
    { id: '15', name: 'Quora MMO Spaces', type: 'Q&A', visitors: '400-1.2k/mo', time: '10 min', niche: 'Make Money Online', steps: ['Answer 2 questions', 'Provide a link'], snippet: 'You can see the full system here: [LINK]' },
    { id: '16', name: 'Digital Point Forums', type: 'FORUM', visitors: '200-500/mo', time: '15 min', niche: 'Make Money Online', steps: ['Go to Market section', 'Talk about free tools', 'Link yours'], snippet: 'Best free tool I found: [LINK]' },
    { id: '17', name: 'AffiliateFix', type: 'FORUM', visitors: '300-800/mo', time: '12 min', niche: 'Make Money Online', steps: ['Introduce yourself', 'Link to your case study/link'], snippet: 'Check my recent progress here: [LINK]' },
    { id: '18', name: 'LinkedIn Marketing Groups', type: 'SOCIAL', visitors: '200-600/mo', time: '15 min', niche: 'Make Money Online', steps: ['Find a marketing group', 'Post a "Win"', 'Add link in first comment'], snippet: 'Here is how I did it: [LINK]' },
    { id: '19', name: 'YouTube Comment Automation', type: 'SOCIAL', visitors: '500-2k/mo', time: '15 min', niche: 'Make Money Online', steps: ['Find latest MMO videos', 'Useful comment', 'Link to asset'], snippet: 'More details on this system here: [LINK]' },
    { id: '20', name: 'Facebook Ad Community', type: 'SOCIAL', visitors: '400-1k/mo', time: '12 min', niche: 'Make Money Online', steps: ['Help someone with an ad error', 'Provide your link as a better alternative'], snippet: 'Try this instead of ads: [LINK]' },

    // Health & Fitness (21-30)
    { id: '21', name: 'Healthline Community', type: 'FORUM', visitors: '1k-5k/mo', time: '10 min', niche: 'Health & Fitness', steps: ['Find any fitness topic', 'Give advice', 'Mention your link'], snippet: 'I hope this link helps you: [LINK]' },
    { id: '22', name: 'r/Fitness', type: 'SOCIAL', visitors: '2k-10k/mo', time: '5 min', niche: 'Health & Fitness', steps: ['Reply to a Daily Thread', 'Be helpful', 'Link your resource'], snippet: 'Check out this fitness resource: [LINK]' }
  ];

  const filteredSources = useMemo(() => {
    return rawSources.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.niche.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'all' || s.niche === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

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

      {/* Main Automation Dashboard Card */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.bg} p-10 rounded-[32px] text-center space-y-2 border border-white/50 backdrop-blur-sm`}>
              <p className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Community Bar */}
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] font-bold text-white">
                U
              </div>
            ))}
            <div className="w-6 h-6 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[8px] font-black text-white">
              +
            </div>
          </div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            MEMBERS SUBMITTED TO <span className="text-emerald-700">847,290+ TRAFFIC SOURCES</span> THIS MONTH
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="space-y-8">
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-[0.2em]">HOW IT WORKS — 3 SIMPLE STEPS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white border border-gray-100 p-10 rounded-[32px] shadow-sm space-y-6 flex flex-col items-start hover:shadow-md transition-shadow">
               <div className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-black">
                 {step.id}
               </div>
               <div className="space-y-2">
                 <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] leading-relaxed">
                   {step.desc}
                 </p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls & List */}
      <div className="space-y-8 relative">
        {!isSubscribed && (
          <PremiumOverlay 
            title="Automation Machine Locked"
            description="Access our database of 60+ high-traffic sources across 6 profitable niches. Each source includes step-by-step automation guides."
            onUpgrade={() => setIsSubscribed(true)}
          />
        )}

        <div className={`space-y-8 ${!isSubscribed ? 'opacity-30 blur-[4px] pointer-events-none' : ''}`}>
          {/* Inputs Section */}
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

          {/* Sources List */}
          <div className="space-y-4">
            {filteredSources.map((source, i) => {
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
                    <ChevronDown className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  {isExpanded && source.steps && (
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
                              className={`flex-1 font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${checked ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:indigo-700'}`}
                            >
                               {checked ? 'COMPLETED' : 'MARK AS DONE'}
                               <CheckCircle2 size={16} />
                            </button>
                            <button className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-gray-800">
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
