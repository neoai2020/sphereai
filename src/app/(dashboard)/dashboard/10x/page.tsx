"use client";

import { 
  Zap, 
  Share2, 
  Target, 
  BarChart3, 
  Facebook, 
  Sparkles, 
  FileText, 
  Link as LinkIcon, 
  Globe, 
  ArrowRight,
  Info,
  Users,
  Clock,
  MessageSquare,
  ShieldCheck,
  MousePointer2,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";

export default function TenXPage() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [productUrl, setProductUrl] = useState("");

  const features = [
    {
      title: "10 Unique Posts",
      description: "10 different hooks & angles per link",
      icon: Share2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "High-Converting Copy",
      description: "Optimized for clicks & engagement",
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Ready to Post",
      description: "Copy-paste directly into Facebook",
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const tips = [
    {
      title: "Where to Share",
      icon: Users,
      items: [
        { label: "Niche Facebook Groups", content: "Find groups with 10K–100K members related to your product. Avoid spammy mega-groups." },
        { label: "Your Profile & Stories", content: "Post on your personal profile too. Facebook's algorithm favors personal accounts." },
        { label: "Facebook Pages You Manage", content: "If you have a page, post there and boost the best-performing posts." },
        { label: "Comment Sections", content: "Reply to relevant viral posts with your take and a subtle link. High-traffic comments = free visibility." },
      ]
    },
    {
      title: "When & How to Post",
      icon: Clock,
      items: [
        { label: "Best times", content: "9–11 AM and 7–9 PM in your audience's timezone. Tuesday–Thursday perform best." },
        { label: "Space them out", content: "Post 1–2 per day across different groups. Never spam the same group twice in a day." },
        { label: "Engage immediately", content: "Reply to every comment within the first hour. Facebook rewards fast engagement with more reach." },
        { label: "Use all 10 angles", content: "Different posts resonate with different people. The curiosity angle might flop where storytelling goes viral." },
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
              10X Facebook Post Generator
            </h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                10X Mode Active
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
          Generate 10 unique, high-converting Facebook posts from a single link — each with a different angle to maximize reach and clicks.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-[32px] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center`}>
              <f.icon size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Generator Card */}
      <div className="relative">
        {!isSubscribed && (
          <PremiumOverlay 
            title="10X Mode Locked"
            description="Upgrade to the 10x plan to unlock unlimited Facebook post generation and advanced marketing tools."
            onUpgrade={() => setIsSubscribed(true)}
          />
        )}
        
        <div className={`bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden ${!isSubscribed ? 'opacity-40 blur-[2px] pointer-events-none' : ''}`}>
          <div className="p-8 md:p-10 space-y-10">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Facebook className="text-white fill-white" size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Generate 10 Facebook Posts</h2>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
                Premium
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Link Name</label>
                <input 
                  type="text"
                  placeholder="e.g. My Fitness eBook, Water Filter System, etc."
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Promotional Link</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <LinkIcon size={20} />
                  </div>
                  <input 
                    type="url"
                    placeholder="https://example.com/product?ref=your-id"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button className="w-full group relative overflow-hidden bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm hover:scale-[1.01] active:scale-[0.99]">
              <Sparkles size={20} className="text-amber-400 fill-amber-400/20" />
              Generate 10 Intelligent Posts
            </button>
          </div>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm space-y-12">
        <div className="flex items-center gap-4 text-indigo-600">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
            <Info size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Pro Tips: How to Go Viral on Facebook</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {tips.map((tip, i) => (
            <div key={i} className="space-y-8">
              <div className="flex items-center gap-3 text-indigo-600 border-b border-gray-50 pb-4">
                <tip.icon size={22} className="stroke-[2.5px]" />
                <h3 className="font-black uppercase tracking-[0.2em] text-sm">{tip.title}</h3>
              </div>
              <ul className="space-y-6">
                {tip.items.map((item, j) => (
                  <li key={j} className="space-y-1.5 pl-2 border-l-2 border-indigo-100">
                    <span className="block font-black text-gray-900 text-sm">{item.label}</span>
                    <span className="block text-sm text-gray-500 font-medium leading-relaxed">{item.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Golden Rule Callout */}
        <div className="bg-indigo-900 rounded-[32px] p-8 md:p-10 text-white flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -mr-20 -mt-20" />
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center flex-shrink-0 border border-white/10">
            <MessageSquare className="text-white" size={32} />
          </div>
          <div className="space-y-3 relative z-10">
            <h4 className="text-xl font-bold text-white uppercase tracking-wider">The Golden Rule of Facebook Groups</h4>
            <p className="text-indigo-100 font-medium leading-relaxed">
              Contribute value to the group FIRST. Comment on other people&apos;s posts, answer questions, and be helpful for a few days before sharing your own link posts. Group admins are more likely to approve your posts, and members are more likely to engage with someone they recognize. A warm audience converts <span className="text-emerald-400 font-bold italic">5–10x better</span> than cold posting.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-white border border-gray-100 p-8 rounded-[32px] flex items-center justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <FileText size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 text-lg">Create Full Article</h3>
              <p className="text-sm text-gray-500 font-medium">Write a long-form SEO article instead</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
        </button>
        
        <button className="bg-white border border-gray-100 p-8 rounded-[32px] flex items-center justify-between group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <LinkIcon size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-gray-900 text-lg">My Portfolio</h3>
              <p className="text-sm text-gray-500 font-medium">Manage your saved links & articles</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
        </button>
      </div>

    </div>
  );
}
