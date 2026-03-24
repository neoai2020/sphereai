"use client";

import { Zap, Lock, CheckCircle2, Share2, Mail, RefreshCw, MousePointerClick, Rocket } from "lucide-react";
import { FeatureVideo } from "@/components/dashboard/feature-video";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";
import Link from "next/link";

export default function AutomationPage() {
  const features = [
    {
      title: "Auto Social Posting",
      description: "جدولة ونشر تلقائي على كل منصات التواصل",
      icon: Share2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Email Sequences",
      description: "حملات بريد إلكتروني تلقائية لتنمية العملاء",
      icon: Mail,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Content Refresh",
      description: "تحديث تلقائي لمحتوى الموقع بالـ AI",
      icon: RefreshCw,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Lead Capture Flows",
      description: "نوافذ منبثقة ذكية تنفعل بناءً على سلوك الزائر",
      icon: MousePointerClick,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
            Automation
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          Set it and forget it. Automate your marketing, content updates, and lead capture.
        </p>
      </div>

      {/* Video Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2">
          <FeatureVideo />
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Zap size={18} className="text-emerald-500" />
              Smart Automation
            </h3>
            <ul className="space-y-3">
              {[
                "24/7 Presence Online",
                "Automated Customer Journey",
                "Self-Updating Content",
                "Higher Conversion Rates",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Locked Section */}
      <div className="relative group min-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-40 blur-[4px] pointer-events-none transition-all duration-700 select-none">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <PremiumOverlay 
          title="Automation Power Suite"
          description="Put your marketing on autopilot. Unlock advanced social scheduling, email sequences, and AI content refreshing."
        />
      </div>
    </div>
  );
}
