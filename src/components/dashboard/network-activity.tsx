"use client";

import { useEffect, useState, useCallback } from "react";
import { Globe, ShieldCheck, Activity, TrendingUp, Users, MapPin, DollarSign, Rocket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = ["earned", "joined", "deployed", "scaled", "cited", "boosted", "activated", "generated"];
const PRODUCTS = [
  "Keto Affiliate 1.5", "AI SEO Master", "Blogging SaaS", "ChatGPT Ranking", "Infinite Module",
  "Meta Ads Pro", "Ecomm Flow", "Lead Magnet", "Authority Site", "Niche Sniper", "Deep Research AI"
];
const NAMES = ["Ahmed", "Sarah", "Marc", "Emma", "Omar", "Jessica", "David", "Lucas", "Maya", "Zoe", "Ryan", "Elena"];
const LOCATIONS = ["USA", "EGP", "ARE", "GBR", "DEU", "CAN", "FRA", "AUS", "SGP", "IND"];

interface FeedItem {
  id: string;
  user: string;
  action: string;
  value: string;
  product: string;
  time: string;
  location: string;
}

export function NetworkActivity() {
  const [activities, setActivities] = useState<FeedItem[]>([
    { id: "1", user: "Zoe", action: "earned", value: "$597", product: "Authority Site", time: "NOW", location: "USA" },
    { id: "2", user: "Sophia", action: "deployed", value: "$342", product: "Ecomm Flow", time: "1M", location: "GBR" },
    { id: "3", user: "Lucas", action: "joined", value: "$1045", product: "Infinite Module", time: "3M", location: "CAN" },
    { id: "4", user: "Omar", action: "joined", value: "$368", product: "Blogging SaaS", time: "5M", location: "ARE" },
    { id: "5", user: "Ahmed", action: "published", value: "$958", product: "AI SEO Tool", time: "8M", location: "EGP" },
  ]);

  const [globalEarnings, setGlobalEarnings] = useState(25074);
  const [activeNow, setActiveNow] = useState(125);

  const addRandomActivity = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 9);
    const newActivity: FeedItem = {
      id,
      user: NAMES[Math.floor(Math.random() * NAMES.length)],
      action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
      value: `$${Math.floor(Math.random() * 2000) + 100}`,
      product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
      time: "NOW",
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    };

    setActivities(prev => {
      const updated = prev.map(item => {
        if (item.time === "NOW") return { ...item, time: "1M" };
        if (item.time === "1M") return { ...item, time: "3M" };
        if (item.time === "3M") return { ...item, time: "5M" };
        return { ...item, time: "8M" };
      });
      return [newActivity, ...updated.slice(0, 4)];
    });

    setGlobalEarnings(prev => prev + Math.floor(Math.random() * 60) + 20);
    setActiveNow(prev => Math.max(120, Math.min(250, prev + (Math.random() > 0.4 ? 1 : -1))));
  }, []);

  useEffect(() => {
    // CALM INTERVAL (2s to 6s)
    let timeout: NodeJS.Timeout;
    const tick = () => {
      addRandomActivity();
      const delay = Math.random() * 4000 + 2000; 
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 2000);
    return () => clearTimeout(timeout);
  }, [addRandomActivity]);

  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_32px_64px_-32px_rgba(0,0,0,0.03)] overflow-hidden relative group/feed transition-all duration-700">
      
      <style jsx global>{`
        @keyframes calmEnter {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-calm {
          animation: calmEnter 0.8s cubic-bezier(0.2, 0, 0, 1) both;
        }
      `}</style>

      {/* 1. Header: Classic & Minimal */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm text-brand-600">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-gray-950 font-black text-lg tracking-tight uppercase">Network Activity</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">
           {activeNow} Active
        </div>
      </div>

      {/* 2. Feed: Elegant & Clean */}
      <div className="space-y-8 relative">
        {activities.map((item, i) => (
          <div 
            key={item.id} 
            className={cn(
               "relative flex gap-5 transition-all duration-500 group/item",
               i === 0 ? "animate-calm opacity-100" : "opacity-40 hover:opacity-100"
            )}
          >
            {/* Minimal Avatar */}
            <div className="relative shrink-0 pt-1">
               <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 relative border transition-all duration-300",
                i === 0 ? "bg-white border-brand-200 text-brand-600" : "bg-gray-50 border-gray-100 text-gray-400"
              )}>
                <span className="font-black text-xs uppercase">{item.user[0]}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1 bg-gray-950 text-white rounded-md text-[6px] font-black border border-white/20 select-none">
                 {item.location}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 flex flex-col justify-center border-b border-gray-50 pb-4 last:border-0">
               <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-black text-gray-900 group-hover/item:text-brand-600 transition-colors uppercase tracking-tight">
                    {item.user} <span className="font-bold text-gray-400 italic lowercase ml-1">{item.action}</span>
                  </p>
                  <span className={cn(
                    "text-[8px] font-black px-1.5 py-0.5 rounded-md tracking-tighter uppercase",
                    i === 0 ? "bg-brand-50 text-brand-600" : "bg-gray-50 text-gray-300"
                  )}>
                    {item.time}
                  </span>
               </div>
               
               <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-medium text-gray-400 truncate opacity-90">{item.product}</p>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50/50 text-emerald-600 border border-emerald-100/50">
                    <span className="text-[10px] font-black tabular-nums">{item.value}</span>
                    <TrendingUp size={10} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Performance */}
      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white shadow-lg">
               <DollarSign size={14} />
            </div>
            <div>
               <p className="text-2xl font-black text-gray-950 tracking-tighter tabular-nums">${globalEarnings.toLocaleString()}</p>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Payouts</p>
            </div>
         </div>
         <div className="flex items-center gap-2 grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all opacity-50">
            <CheckCircle2 size={12} className="text-brand-600" />
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified Nodes</span>
         </div>
      </div>

    </div>
  );
}
