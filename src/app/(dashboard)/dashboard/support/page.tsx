"use client";

import { 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  HelpCircle, 
  Headphones, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FaqAccordion } from "@/components/dashboard/faq-accordion";
import { SPHEREAI_FAQS } from "@/data/sphereai-faqs";

export default function SupportPage() {

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-gray-900 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* ─ Subtle Backdrop ─ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto pt-16 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-950 flex items-center gap-2 pl-1 italic">
             Support Center
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest pl-2">Documentation and assistance resources</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="#" className="group relative bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center justify-between transition-all overflow-hidden shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100/50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Support Portal</h3>
                <p className="text-gray-500 text-xs">Open a ticket or check status</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </a>

          <a href="mailto:sphere@neoai.freshdesk.com" className="group relative bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex items-center justify-between transition-all overflow-hidden shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Email Support</h3>
                <p className="text-xs text-brand-600 font-medium">sphere@neoai.freshdesk.com</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </a>
        </div>

        {/* Main Section: FAQ + Ask Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FAQ Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                <HelpCircle size={16} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-gray-900">Frequently Asked Questions</h2>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Common queries and system documentation</p>
              </div>
            </div>
            
            <FaqAccordion items={SPHEREAI_FAQS} defaultOpenIndex={0} variant="default" />
          </div>

          {/* Ask Anything Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center text-center gap-6 shadow-sm relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-100/30 flex items-center justify-center text-brand-600 relative">
                <MessageCircle size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight text-gray-950">Got a Question?</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-medium">
                  Reach out and we&apos;ll get back to you within 24-48 hours.
                </p>
              </div>
              <button className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 group-hover:-translate-y-0.5">
                <Mail size={14} /> Message Us
              </button>
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest italic">Average Reply: 4.2 hours</p>
            </div>

            <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-5 flex items-center gap-4">
               <div className="w-9 h-9 rounded-xl bg-white border border-brand-200/50 flex items-center justify-center text-brand-600 shadow-sm">
                  <ShieldCheck size={18} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-brand-900 italic uppercase leading-none">VIP Priority Access</p>
                 <p className="text-[9px] text-brand-600 font-medium pt-1">Subscribed users get 2h priority.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Refund Protocol */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
               <FileText size={16} />
             </div>
             <div>
               <h2 className="text-lg font-black tracking-tight text-gray-950 uppercase italic">Refund Protocol</h2>
               <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Satisfaction guarantee terms</p>
             </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
              { title: "30-DAY GUARANTEE", text: "Full refund available within 30 days of purchase. No interrogation required.", color: "text-brand-600", bg: "bg-brand-50/30" },
              { title: "REQUEST PROCEDURE", text: "Email us at sphere@neoai.freshdesk.com with your account details.", color: "text-emerald-600", bg: "bg-emerald-50/30" },
              { title: "PROCESSING TIMELINE", text: "Refunds processed within 5-7 business days. Confirmation transmitted.", color: "text-orange-600", bg: "bg-orange-50/30" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50/20 border border-gray-50 rounded-xl p-6 space-y-3 hover:bg-white transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <h4 className={cn("text-[9px] font-black uppercase tracking-widest", item.color)}>{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-bold">{item.text}</p>
                <div className={cn("inline-block px-2 py-0.5 rounded-full text-[7px] font-black italic", item.bg, item.color)}>Active Policy</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
