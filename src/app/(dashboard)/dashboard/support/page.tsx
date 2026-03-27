"use client";

import { Mail, ArrowUpRight, GraduationCap, ShieldCheck, MessageCircle, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SupportPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center pt-24 pb-24 px-4 overflow-hidden">
      
      {/* ─ Abstract Decoration ─ */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-brand-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-50/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full space-y-24 relative z-10">
        
        {/* 1. Header Section: Refined & Minimal */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 rounded-full border border-gray-100 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Support Portal 4.0
          </div>
          <h1 className="text-5xl font-black text-gray-950 tracking-tighter leading-tight italic">
            Elite Support for <br /> Master Innovators.
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 text-sm font-medium leading-relaxed tracking-tight">
            We don&apos;t just fix problems; we optimize your path to scale. Reach out to our dedicated engineering team for assistance.
          </p>
        </div>

        {/* 2. Primary CTA: Minimalist & Elegant */}
        <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.03)] text-center space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/30 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-100/50 transition-all duration-1000" />
          
          <div className="space-y-4">
             <h2 className="text-xl font-black text-gray-900 tracking-tight">Direct Inquiry Channel</h2>
             <p className="text-gray-400 text-sm font-medium">Standard response time is under 12 hours for all active users.</p>
          </div>

          <a 
            href="mailto:sphere@neoai.freshdesk.com"
            className="inline-flex items-center gap-4 px-10 py-3.5 bg-gray-950 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-600 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-gray-200"
          >
            <Mail size={14} /> Send Inquiry
          </a>

          <div className="pt-4">
             <span className="text-[10px] font-bold text-gray-300 font-mono tracking-widest uppercase">
               sphere@neoai.freshdesk.com
             </span>
          </div>
        </div>

        {/* 3. Secondary Options: Clean Grid */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="p-8 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all duration-500 group">
              <div className="space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand-600 transition-all">
                    <GraduationCap size={20} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Training Vault</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Access comprehensive tutorials and case studies on maximizing your AI ROI.</p>
                 </div>
              </div>
              <Link href="/dashboard/training" className="mt-8 inline-flex items-center gap-2 text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-[0.2em] transition-colors">
                Open Vault <ArrowUpRight size={12} />
              </Link>
           </div>

           <div className="p-8 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all duration-500 group">
              <div className="space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-all">
                    <ShieldCheck size={20} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Priority Portal</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Already have a ticket? Check status and logs in our advanced tracking portal.</p>
                 </div>
              </div>
              <button className="mt-8 inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-[0.2em] transition-colors">
                Track Ticket <ExternalLink size={12} />
              </button>
           </div>
        </div>

        {/* 4. Footer Trust Badge */}
        <div className="pt-12 border-t border-gray-50 flex items-center justify-center gap-12">
           <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center">
                 <Globe size={12} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status: 100% UP</span>
           </div>
           <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center">
                 <MessageCircle size={12} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Average Reply: 4.2h</span>
           </div>
        </div>

      </div>
    </div>
  );
}
