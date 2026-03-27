"use client";

import { useState } from "react";
import { 
  Mail, 
  ArrowUpRight, 
  MessageCircle, 
  ExternalLink, 
  ChevronDown, 
  HelpCircle, 
  Headphones, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "What are the daily usage limits?", a: "Each plan comes with generous limits. Free users get 10 generations per day, while Infinite users enjoy unlimited throughput." },
  { q: "Does SphereAI send emails for me?", a: "Yes, our automation engine can handle outreach campaigns directly through your connected SMTP or API providers." },
  { q: "Why are some business emails unavailable?", a: "We prioritize verified data. If an email can't be 100% validated, we exclude it to protect your sender reputation." },
  { q: "Are leads validated?", a: "Absolutely. Every lead goes through our multi-step validation process including syntax check and MX record verification." },
  { q: "Which industries can I target in Lead Magnet?", a: "We support over 500+ industries globally across B2B and B2C segments." },
  { q: "What offer types can I create?", a: "From discount codes to lead magnets and webinar registrations, our builder supports all high-converting offer types." },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24 px-4 sm:px-8">
      
      {/* ─ Glowing Backdrops ─ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto pt-16 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Support Center
          </h1>
          <p className="text-gray-500 font-medium">Documentation and assistance resources</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="#" className="group relative bg-[#111] hover:bg-[#161616] border border-white/5 rounded-[32px] p-8 flex items-center justify-between transition-all overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Headphones size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Support Portal</h3>
                <p className="text-gray-500 text-sm">Open a ticket or check existing requests</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </a>

          <a href="mailto:ProfitLoopAI@neoai.freshdesk.com" className="group relative bg-[#111] hover:bg-[#161616] border border-white/5 rounded-[32px] p-8 flex items-center justify-between transition-all overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Email Support</h3>
                <p className="text-gray-500 text-sm">sphere@neoai.freshdesk.com</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Main Section: FAQ + Ask Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAQ Column */}
          <div className="lg:col-span-2 bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Frequently Asked Questions</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-0.5">Common queries and system documentation</p>
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {FAQS.map((faq, i) => (
                <div key={i} className="group">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-bold text-gray-400 group-hover:text-white transition-colors">{faq.q}</span>
                    <ChevronDown size={18} className={cn("text-gray-600 transition-transform duration-300", openFaq === i && "rotate-180 text-brand-500")} />
                  </button>
                  {openFaq === i && (
                    <div className="px-8 pb-6 text-gray-500 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ask Anything Card */}
          <div className="space-y-6">
            <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 p-10 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 relative">
                <div className="absolute inset-0 bg-brand-500/40 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Got a Question?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help. Reach out and we&apos;ll get back to you within 24-48 hours.
                </p>
              </div>
              <button className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 group-hover:-translate-y-1">
                <Mail size={16} /> Message Us
              </button>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Typical reply time: 4-6 hours</p>
            </div>

            <div className="bg-brand-500/5 border border-brand-500/10 rounded-[32px] p-6 flex items-center gap-4">
               <ShieldCheck size={20} className="text-brand-400" />
               <div>
                 <p className="text-xs font-black text-brand-100 italic uppercase">VIP Priority Access</p>
                 <p className="text-[10px] text-gray-500">Subscribed users get 2h priority responses.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Refund Protocol */}
        <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
               <FileText size={20} />
             </div>
             <div>
               <h2 className="text-xl font-black tracking-tight">Refund Protocol</h2>
               <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-0.5">Satisfaction guarantee terms</p>
             </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "30-DAY GUARANTEE", text: "Full refund available within 30 days of purchase. No interrogation required.", color: "text-brand-400" },
              { title: "REQUEST PROCEDURE", text: "Email us at sphere@neoai.freshdesk.com with your account email and purchase date.", color: "text-emerald-400" },
              { title: "PROCESSING TIMELINE", text: "Refunds processed within 5-7 business days. Confirmation transmitted upon completion.", color: "text-orange-400" },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-3">
                <h4 className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

