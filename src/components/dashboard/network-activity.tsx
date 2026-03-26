"use client";

import { useEffect, useState } from "react";
import { Globe, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = ["generated", "published", "earned", "cited", "scaled", "joined", "deployed"];
const PRODUCTS = [
  "Keto Affiliate", "AI SEO Tool", "Blogging SaaS", "ChatGPT Ranking", "Infinite Module",
  "Meta Ads Pro", "Ecomm Flow", "Lead Magnet", "Authority Site", "Niche Sniper"
];
const NAMES = ["Ahmed", "Sarah", "Marc", "Emma", "Omar", "Jessica", "David", "Lucas", "Maya", "Zoe"];
const COLORS = ["brand", "green", "purple", "blue", "orange", "indigo"];

interface Activity {
  id: number;
  user: string;
  action: string;
  value: string;
  product: string;
  time: string;
  color: string;
  locked?: boolean;
}

export function NetworkActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, user: "Ahmed", action: "generated", value: "$420", product: "Keto Affiliate", time: "just now", color: "brand" },
    { id: 2, user: "Sarah", action: "published", value: "$1,200", product: "AI SEO tool", time: "2m ago", color: "green" },
    { id: 3, user: "Marc", action: "earned", value: "$850", product: "Blogging SaaS", time: "5m ago", color: "purple" },
    { id: 4, user: "Emma", action: "cited", value: "Locked", product: "ChatGPT ranking", time: "12m ago", color: "orange", locked: true },
    { id: 5, user: "Omar", action: "scaled", value: "$2,100", product: "Infinite module", time: "15m ago", color: "blue" },
  ]);

  const [globalEarnings, setGlobalEarnings] = useState(24942);
  const [activeNow, setActiveNow] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Randomly add new activity
      const newActivity: Activity = {
        id: Date.now(),
        user: NAMES[Math.floor(Math.random() * NAMES.length)],
        action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
        value: `$${Math.floor(Math.random() * 2000) + 100}`,
        product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
        time: "just now",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        locked: Math.random() > 0.9,
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 4)];
        // Transition time strings for older items
        return updated.map((item, i) => {
          if (i === 0) return item;
          if (i === 1) return { ...item, time: "1m ago" };
          if (i === 2) return { ...item, time: "3m ago" };
          return item;
        });
      });

      // 2. Jiggle the stats
      setGlobalEarnings(prev => prev + Math.floor(Math.random() * 50));
      setActiveNow(prev => Math.max(100, Math.min(200, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/30 border border-gray-100 overflow-hidden relative group hover:border-brand-200 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-gray-900 font-black text-xl flex items-center gap-3">
          <Globe size={22} className="text-brand-600 animate-spin-slow" /> Network Activity
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100/50">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="space-y-6 relative h-[380px]">
        {/* Visual Connector Line */}
        <div className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gradient-to-b from-brand-100 via-gray-100 to-transparent" />
        
        {activities.map((item, i) => (
          <div 
            key={item.id} 
            className={cn(
               "flex gap-4 relative group/item transition-all duration-700 animate-in fade-in slide-in-from-top-4",
               i === 0 ? "scale-105 origin-left" : "opacity-80 hover:opacity-100"
            )}
          >
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 z-10 shadow-sm transition-all group-hover/item:shadow-lg group-hover/item:-translate-y-0.5",
              item.locked ? "bg-gray-100 text-gray-400" : `bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100`
            )}>
              {item.locked ? <ShieldCheck size={18} /> : <div className="font-black text-xs">{item.user[0]}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {item.user} <span className="font-medium text-gray-400 tracking-tight">{item.action}</span>
                </p>
                <span className="text-[9px] font-black text-gray-300 uppercase whitespace-nowrap tracking-widest">{item.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium truncate italic text-brand-600/70">
                {item.product}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm border",
                  item.locked ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                )}>
                  {item.value}
                </span>
                {item.locked && (
                  <span className="text-[9px] font-black text-brand-400 tracking-tighter cursor-default bg-brand-50/50 px-1.5 rounded-full">PRO NODE</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network Stats at the bottom */}
      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between bg-gradient-to-t from-gray-50/50 to-white -mx-8 -mb-8 p-8">
        <div className="text-center flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Global Earnings</p>
          <p className="text-xl font-black text-gray-900 tabular-nums">${globalEarnings.toLocaleString()}</p>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div className="text-center flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Active Now</p>
          <p className="text-xl font-black text-brand-600 flex items-center justify-center gap-1.5 tabular-nums">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 shadow-[0_0_8px_rgba(67,56,202,0.4)] animate-pulse" /> {activeNow}
          </p>
        </div>
      </div>
    </div>
  );
}
