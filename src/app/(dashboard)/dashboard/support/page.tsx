"use client";

import { Mail, BookOpen, LifeBuoy, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const supportPortalUrl = "https://neoaifreshdesk-sphereai.freshdesk.com/support/home";
  const supportEmail = "sphere@neoai.freshdesk.com";

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-brand-50 rounded-[2.5rem] mb-4">
          <LifeBuoy size={40} className="text-brand-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase">Support Center</h1>
        <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
          We&apos;re here to help you scale your AI-optimized assets and resolve any technical hurdles.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Main Direct CTA */}
        <div className="bg-white rounded-[3rem] border border-gray-100 p-12 shadow-xl shadow-gray-200/40 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-600" />
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Got Questions? We&apos;ve Got Answers.</h2>
              <p className="text-gray-500 font-medium text-lg">Send us an email and our expert team will get back to you within 24 hours.</p>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <a 
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-4 px-12 py-6 bg-gray-950 hover:bg-black text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-gray-200 active:scale-95 group/btn"
              >
                <Mail size={24} className="group-hover/btn:scale-110 transition-transform" />
                <span className="uppercase tracking-[0.1em]">Send Your Inquiry</span>
              </a>
              <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] font-mono italic">
                {supportEmail}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Secondary Support Options */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col justify-between group hover:bg-white hover:shadow-lg transition-all duration-500">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Knowledge Base</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">Browse our detailed documentation to learn how to master Site Forge and the Asset Vault.</p>
            </div>
            <Link href="/dashboard/training" className="mt-8 text-brand-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              Go to training <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="bg-brand-600 rounded-[2.5rem] p-8 flex flex-col justify-between text-white shadow-xl shadow-brand-100/40 hover:scale-[1.02] transition-transform duration-500">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Priority Portal</h3>
              <p className="text-brand-100 font-medium text-sm leading-relaxed opacity-80">Already have a ticket? Access our portal for advanced technical tracking and logs.</p>
            </div>
            <a 
              href={supportPortalUrl}
              target="_blank"
              className="mt-8 inline-flex items-center justify-center px-6 py-4 bg-white text-brand-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-50 transition-all shadow-md"
            >
              Open Ticket Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 16} 
      height={size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
