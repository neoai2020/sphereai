"use client";

import { Rocket, Lock, CheckCircle2, Zap, BarChart3, Globe, Layers } from "lucide-react";
import { FeatureVideo } from "@/components/dashboard/feature-video";
import { PremiumOverlay } from "@/components/dashboard/premium-overlay";
import Link from "next/link";

export default function TenXPage() {
  const features = [
    {
      title: "Bulk Website Generation",
      description: "توليد حتى 50 موقع دفعة واحدة",
      icon: Layers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Advanced Analytics",
      description: "تحليلات متقدمة للترافيك والتحويلات والإيرادات",
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Priority Templates",
      description: "قوالب حصرية عالية التحويل",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Custom Domains",
      description: "ربط دومين خاص بأي موقع",
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Rocket className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            10x
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
          Multiply your output by 10. Premium tools to scale your business faster than ever.
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
              <Zap size={18} className="text-amber-500" />
              Why Choose 10x?
            </h3>
            <ul className="space-y-3">
              {[
                "Save hundreds of hours",
                "Scale to multiple niches",
                "Dominate search results",
                "Maximum ROI",
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
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16" />

      {/* Locked Section */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Premium Power Tools</h2>
          <p className="text-gray-500 font-medium">Advanced features to take your business to the next level.</p>
        </div>

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
          title="10x Profits Suite"
          description="Unlock the full power of 10x scaling. Multiply your website generations and automate your domain workflows in one click."
        />
      </div>
      </div>
    </div>
  );
}
