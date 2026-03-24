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
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";

export default function AutomationPage() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [completedSources, setCompletedSources] = useState<string[]>([]);

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
    { id: 'weight-loss', label: 'Weight Loss', count: 10, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'mmo', label: 'Make Money Online', count: 10, icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'health', label: 'Health & Fitness', count: 10, icon: HeartPulse, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'beauty', label: 'Beauty & Skincare', count: 10, icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'pets', label: 'Pets', count: 10, icon: PawPrint, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'home', label: 'Home & Garden', count: 10, icon: Home, color: 'text-lime-600', bg: 'bg-lime-50' },
  ];

  const steps = [
    { id: '01', title: 'Pick a Source', desc: 'CHOOSE FROM 60 HIGH-VOLUME TRAFFIC SOURCES IN YOUR NICHE.' },
    { id: '02', title: 'Follow Steps', desc: 'EACH SOURCE HAS CLEAR, NUMBERED INSTRUCTIONS TO FOLLOW.' },
    { id: '03', title: 'Paste Snippet', desc: 'COPY THE SYNCED MARKETING MESSAGE AND POST IT INSTANTLY.' },
  ];

  const sources = [
    // Weight Loss (1-10)
    { id: '1', name: 'MyFitnessPal Community', type: 'FORUM', visitors: '200-500/mo', time: '10 min', niche: 'Weight Loss', steps: ['Join the community and introduce yourself', 'Research popular threads in this niche', 'Write a value-driven response', 'Add your synced affiliate link naturally'], snippet: 'Hey! Looking at the discussion, I found this system to be a game-changer for Weight Loss. It really simplified my workflow. You can check it out here: https://your-affiliate-link.com/ref=you' },
    { id: '2', name: 'LoseIt Reddit', type: 'SOCIAL', visitors: '300-800/mo', time: '5 min', niche: 'Weight Loss', steps: ['Navigate to r/loseit', 'Find a help request thread', 'Share your success story or tips', 'Link your resource as a solution'], snippet: 'I struggled with this too until I found this tool. It helped me stay consistent. Hope it helps you on your journey! See it here: https://your-affiliate-link.com/ref=you' },
    { id: '3', name: 'Weight Loss Support Group (FB)', type: 'SOCIAL', visitors: '400-1k/mo', time: '15 min', niche: 'Weight Loss' },
    { id: '4', name: 'Quora Weight Loss', type: 'Q&A', visitors: '500-1.2k/mo', time: '10 min', niche: 'Weight Loss' },
    { id: '5', name: 'r/WeightLossAdvice', type: 'SOCIAL', visitors: '200-600/mo', time: '5 min', niche: 'Weight Loss' },
    { id: '6', name: 'SparkPeople Forums', type: 'FORUM', visitors: '150-400/mo', time: '10 min', niche: 'Weight Loss' },
    { id: '7', name: '30 Day Weight Loss Challenge', type: 'SOCIAL', visitors: '600-1.5k/mo', time: '12 min', niche: 'Weight Loss' },
    { id: '8', name: 'Weight Watchers Community', type: 'FORUM', visitors: '300-700/mo', time: '20 min', niche: 'Weight Loss' },
    { id: '9', name: 'Pinterest Weight Loss Boards', type: 'SOCIAL', visitors: '1k-3k/mo', time: '8 min', niche: 'Weight Loss' },
    { id: '10', name: 'Bodybuilding.com Fat Loss Forum', type: 'FORUM', visitors: '400-900/mo', time: '15 min', niche: 'Weight Loss' },

    // Make Money Online (11-20)
    { id: '11', name: 'Warrior Forum', type: 'FORUM', visitors: '500-1.5k/mo', time: '15 min', niche: 'Make Money Online' },
    { id: '12', name: 'BlackHatWorld', type: 'FORUM', visitors: '1k-3k/mo', time: '20 min', niche: 'Make Money Online' },
    { id: '13', name: 'r/PassiveIncome', type: 'SOCIAL', visitors: '500-1k/mo', time: '10 min', niche: 'Make Money Online' },
    { id: '14', name: 'r/SideHustle', type: 'SOCIAL', visitors: '400-900/mo', time: '5 min', niche: 'Make Money Online' },
    { id: '15', name: 'Quora MMO Spaces', type: 'Q&A', visitors: '400-1.2k/mo', time: '10 min', niche: 'Make Money Online' },
    { id: '16', name: 'Digital Point Forums', type: 'FORUM', visitors: '200-500/mo', time: '15 min', niche: 'Make Money Online' },
    { id: '17', name: 'AffiliateFix', type: 'FORUM', visitors: '300-800/mo', time: '12 min', niche: 'Make Money Online' },
    { id: '18', name: 'LinkedIn Marketing Groups', type: 'SOCIAL', visitors: '200-600/mo', time: '15 min', niche: 'Make Money Online' },
    { id: '19', name: 'YouTube Comment Automation', type: 'SOCIAL', visitors: '500-2k/mo', time: '15 min', niche: 'Make Money Online' },
    { id: '20', name: 'Facebook Ad Community', type: 'SOCIAL', visitors: '400-1k/mo', time: '12 min', niche: 'Make Money Online' },

    // Health & Fitness (21-30)
    { id: '21', name: 'Healthline Community', type: 'FORUM', visitors: '1k-5k/mo', time: '10 min', niche: 'Health & Fitness' },
    { id: '22', name: 'r/Fitness', type: 'SOCIAL', visitors: '2k-10k/mo', time: '5 min', niche: 'Health & Fitness' },
    { id: '23', name: 'r/Biohacking', type: 'SOCIAL', visitors: '500-2k/mo', time: '8 min', niche: 'Health & Fitness' },
    { id: '24', name: 'Men\'s Health Forum', type: 'FORUM', visitors: '1.2k-4k/mo', time: '15 min', niche: 'Health & Fitness' },
    { id: '25', name: 'Women\'s Health Community', type: 'FORUM', visitors: '1k-3.5k/mo', time: '15 min', niche: 'Health & Fitness' },
    { id: '26', name: 'Self.com Community', type: 'SOCIAL', visitors: '800-2k/mo', time: '12 min', niche: 'Health & Fitness' },
    { id: '27', name: 'Yoga Journal Forum', type: 'FORUM', visitors: '300-900/mo', time: '10 min', niche: 'Health & Fitness' },
    { id: '28', name: 'Livestrong Forums', type: 'FORUM', visitors: '500-1.5k/mo', time: '15 min', niche: 'Health & Fitness' },
    { id: '29', name: 'HealthUnlimited (FB)', type: 'SOCIAL', visitors: '600-2k/mo', time: '10 min', niche: 'Health & Fitness' },
    { id: '30', name: 'VeryWell Health Forum', type: 'FORUM', visitors: '400-1k/mo', time: '12 min', niche: 'Health & Fitness' },

    // Beauty & Skincare (31-40)
    { id: '31', name: 'SkincareAddiction Reddit', type: 'SOCIAL', visitors: '3k-15k/mo', time: '5 min', niche: 'Beauty & Skincare' },
    { id: '32', name: 'r/MakeupAddiction', type: 'SOCIAL', visitors: '2.5k-10k/mo', time: '5 min', niche: 'Beauty & Skincare' },
    { id: '33', name: 'Sephora Community', type: 'FORUM', visitors: '5k-20k/mo', time: '8 min', niche: 'Beauty & Skincare' },
    { id: '34', name: 'Ulta Beauty Insider', type: 'FORUM', visitors: '2k-8k/mo', time: '10 min', niche: 'Beauty & Skincare' },
    { id: '35', name: 'MakeupAlley', type: 'FORUM', visitors: '1.5k-5k/mo', time: '15 min', niche: 'Beauty & Skincare' },
    { id: '36', name: 'RealSelf Forum', type: 'FORUM', visitors: '1k-3k/mo', time: '12 min', niche: 'Beauty & Skincare' },
    { id: '37', name: 'Glossier Community (FB)', type: 'SOCIAL', visitors: '500-1.5k/mo', time: '10 min', niche: 'Beauty & Skincare' },
    { id: '38', name: 'Paula\'s Choice Community', type: 'FORUM', visitors: '600-2k/mo', time: '15 min', niche: 'Beauty & Skincare' },
    { id: '39', name: 'The Ordinary Enthusiasts', type: 'SOCIAL', visitors: '800-2.5k/mo', time: '10 min', niche: 'Beauty & Skincare' },
    { id: '40', name: 'BeautyBay Community', type: 'FORUM', visitors: '300-1k/mo', time: '12 min', niche: 'Beauty & Skincare' },

    // Pets (41-50)
    { id: '41', name: 'The Cat Site Forums', type: 'FORUM', visitors: '500-2k/mo', time: '15 min', niche: 'Pets' },
    { id: '42', name: 'DogForums.com', type: 'FORUM', visitors: '400-1.5k/mo', time: '15 min', niche: 'Pets' },
    { id: '43', name: 'r/Dogs', type: 'SOCIAL', visitors: '2k-8k/mo', time: '5 min', niche: 'Pets' },
    { id: '44', name: 'r/Cats', type: 'SOCIAL', visitors: '3k-12k/mo', time: '5 min', niche: 'Pets' },
    { id: '45', name: 'r/Aquariums', type: 'SOCIAL', visitors: '800-3k/mo', time: '8 min', niche: 'Pets' },
    { id: '46', name: 'PetSmart Community', type: 'FORUM', visitors: '1k-4k/mo', time: '12 min', niche: 'Pets' },
    { id: '47', name: 'Petco Insider', type: 'FORUM', visitors: '800-3k/mo', time: '12 min', niche: 'Pets' },
    { id: '48', name: 'The Honest Kitchen (FB)', type: 'SOCIAL', visitors: '300-1k/mo', time: '10 min', niche: 'Pets' },
    { id: '49', name: 'Dog Owners Collective', type: 'SOCIAL', visitors: '500-2k/mo', time: '10 min', niche: 'Pets' },
    { id: '50', name: 'Chewy.com Community', type: 'FORUM', visitors: '2k-10k/mo', time: '8 min', niche: 'Pets' },

    // Home & Garden (51-60)
    { id: '51', name: 'GardenWeb Forums', type: 'FORUM', visitors: '1k-4k/mo', time: '20 min', niche: 'Home & Garden' },
    { id: '52', name: 'Houzz Community', type: 'FORUM', visitors: '5k-25k/mo', time: '15 min', niche: 'Home & Garden' },
    { id: '53', name: 'r/Gardening', type: 'SOCIAL', visitors: '4k-15k/mo', time: '5 min', niche: 'Home & Garden' },
    { id: '54', name: 'r/InteriorDesign', type: 'SOCIAL', visitors: '2k-7k/mo', time: '8 min', niche: 'Home & Garden' },
    { id: '55', name: 'r/HomeImprovement', type: 'SOCIAL', visitors: '3k-12k/mo', time: '5 min', niche: 'Home & Garden' },
    { id: '56', name: 'DIY Network Forum', type: 'FORUM', visitors: '800-3k/mo', time: '15 min', niche: 'Home & Garden' },
    { id: '57', name: 'Better Homes & Gardens', type: 'SOCIAL', visitors: '2k-8k/mo', time: '10 min', niche: 'Home & Garden' },
    { id: '58', name: 'Apartment Therapy Community', type: 'FORUM', visitors: '3k-10k/mo', time: '12 min', niche: 'Home & Garden' },
    { id: '59', name: 'Potted Plant Society (FB)', type: 'SOCIAL', visitors: '500-2k/mo', time: '10 min', niche: 'Home & Garden' },
    { id: '60', name: 'Homesteading Today Forum', type: 'FORUM', visitors: '300-1.2k/mo', time: '20 min', niche: 'Home & Garden' },
  ];

  const progressPercent = Math.round((completedSources.length / sources.length) * 100);

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
               {completedSources.length} of {sources.length} Sources Launched
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
                 placeholder="Search traffic sources..."
                 className="w-full bg-white border border-gray-200 rounded-2xl pl-14 pr-6 py-4 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
               />
            </div>
            <div className="relative group">
               <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
               <input 
                 type="url"
                 placeholder="https://your-affiliate-link.com/ref=you"
                 className="w-full bg-white border border-gray-200 rounded-2xl pl-14 pr-6 py-4 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
               />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${cat.id === 'all' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100 hover:bg-gray-50'}`}
              >
                <cat.icon size={14} className={cat.id === 'all' ? 'text-white' : cat.color} />
                {cat.label} <span className={`ml-1 opacity-50 ${cat.id === 'all' ? 'text-white' : ''}`}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROGRESS: <span className="text-gray-900">{completedSources.length} OF {sources.length} SOURCES COMPLETED</span></span>
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
            {sources.map((source, i) => {
              const checked = completedSources.includes(source.id);
              return (
                <div key={i} className={`bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm group transition-all ${checked ? 'opacity-60' : ''}`}>
                  <div 
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedSource(expandedSource === source.id ? null : source.id)}
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
                    <ChevronDown className={`text-gray-300 transition-transform ${expandedSource === source.id ? 'rotate-180' : ''}`} />
                  </div>

                  {expandedSource === source.id && source.steps && (
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
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium italic text-gray-500 leading-relaxed pr-12">
                              "{source.snippet}"
                            </div>
                            <button className="absolute right-4 top-4 p-2 rounded-xl bg-white border border-gray-100 text-indigo-600 shadow-sm hover:indigo-50 transition-colors">
                              <Copy size={16} />
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
                            <button className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:black transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-gray-800">
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
