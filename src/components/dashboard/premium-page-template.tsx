import React from "react";
import { LucideIcon, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumPageTemplateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  steps: { title: string; text: string }[];
  ctaText: string;
  ctaHref: string;
  badge?: string;
}

export function PremiumPageTemplate({
  title,
  description,
  icon: Icon,
  features,
  steps,
  ctaText,
  ctaHref,
  badge,
}: PremiumPageTemplateProps) {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white p-8 md:p-16 mb-12 border border-gray-800">
        <div className="relative z-10 max-w-2xl">
          {badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-6 uppercase tracking-wider">
              {badge}
            </span>
          )}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-600 rounded-2xl shadow-lg shadow-brand-500/20">
              <Icon size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            {description}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-brand-600/20"
          >
            {ctaText}
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/20 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 px-4">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3 hover:border-brand-200 transition-colors"
              >
                <CheckCircle2 size={24} className="text-brand-600 shrink-0" />
                <span className="font-medium text-gray-800 leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="space-y-8 relative">
            {/* Step line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-brand-100" />
            
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-6">
                <div className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-brand-50 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-brand-700 font-bold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="mt-16 text-center border-t border-gray-100 pt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to unlock full potential?</h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Scale your income and automate your workflow with our most powerful tools.
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-gray-900 text-white font-bold text-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-2xl"
        >
          {ctaText}
          <ArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
}
