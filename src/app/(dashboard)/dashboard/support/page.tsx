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
    <div className="min-h-screen bg-[#FDFDFF] text-gray-900 pb-24 px-4 sm:px-8 relative overflow-hidden">
      
      {/* ─ Subtle Backdrops ─ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto pt-16 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-950 flex items-center gap-3">
             Support Center
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest pl-1">Documentation and assistance resources</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="#" className="group relative bg-white hover:bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 flex items-center justify-between transition-all overflow-hidden shadow-sm hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/[0.03] blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100/50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <Headphones size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Support Portal</h3>
                <p className="text-gray-500 text-sm">Open a ticket or check existing requests</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </a>

          <a href="mailto:ProfitLoopAI@neoai.freshdesk.com" className="group relative bg-white hover:bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 flex items-center justify-between transition-all overflow-hidden shadow-sm hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Support</h3>
                <p className="text-gray-500 text-sm">sphere@neoai.freshdesk.com</p>
              </div>
            </div>
            <ExternalLink size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </a>
        </div>

        {/* Main Section: FAQ + Ask Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FAQ Column */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-gray-900">Frequently Asked Questions</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Common queries and system documentation</p>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {FAQS.map((faq, i) => (
                <div key={i} className="group">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
                  >
                    <span className={cn("font-bold transition-colors", openFaq === i ? "text-brand-600" : "text-gray-600 group-hover:text-gray-950")}>{faq.q}</span>
                    <ChevronDown size={18} className={cn("text-gray-400 transition-transform duration-300", openFaq === i && "rotate-180 text-brand-500")} />
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
            <div className="bg-white rounded-[40px] border border-gray-100 p-10 flex flex-col items-center text-center gap-8 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-full bg-brand-50 border border-brand-100/30 flex items-center justify-center text-brand-600 relative">
                <div className="absolute inset-0 bg-brand-200/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-gray-950">Got a Question?</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help. Reach out and we&apos;ll get back to you within 24-48 hours.
                </p>
              </div>
              <button className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 group-hover:-translate-y-1">
                <Mail size={16} /> Message Us
              </button>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Typical reply time: 4-6 hours</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-[32px] p-6 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-white border border-brand-200/50 flex items-center justify-center text-brand-600 shadow-sm">
                  <ShieldCheck size={20} />
               </div>
               <div>
                 <p className="text-xs font-black text-brand-900 italic uppercase">VIP Priority Access</p>
                 <p className="text-[10px] text-brand-600 font-medium">Subscribed users get 2h priority responses.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Refund Protocol */}
        <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-100 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
               <FileText size={20} />
             </div>
             <div>
               <h2 className="text-xl font-black tracking-tight text-gray-950">Refund Protocol</h2>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-0.5">Satisfaction guarantee terms</p>
             </div>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {[
              { title: "30-DAY GUARANTEE", text: "Full refund available within 30 days of purchase. No interrogation required.", color: "text-brand-600", bg: "bg-brand-50/30" },
              { title: "REQUEST PROCEDURE", text: "Email us at sphere@neoai.freshdesk.com with your account email and purchase date.", color: "text-emerald-600", bg: "bg-emerald-50/30" },
              { title: "PROCESSING TIMELINE", text: "Refunds processed within 5-7 business days. Confirmation transmitted upon completion.", color: "text-orange-600", bg: "bg-orange-50/30" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-8 space-y-4 hover:shadow-md transition-shadow">
                <h4 className={cn("text-[10px] font-black uppercase tracking-widest", item.color)}>{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-bold">{item.text}</p>
                <div className={cn("inline-block px-3 py-1 rounded-full text-[8px] font-black", item.bg, item.color)}>Active Policy</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


