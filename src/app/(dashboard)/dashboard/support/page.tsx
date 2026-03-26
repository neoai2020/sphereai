"use client";

import { useState } from "react";
import { HelpCircle, Mail, MessageSquare, BookOpen, Send, ExternalLink, LifeBuoy, Loader2, CheckCircle2 } from "lucide-react";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
    setFormData({ subject: "", message: "" });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const supportPortalUrl = "https://neoaifreshdesk-sphereai.freshdesk.com/support/home";
  const supportEmail = "sphere@neoai.freshdesk.com";

  const faqs = [
    {
      question: "How do I create my first project?",
      answer: "Go to the 'Site Forge' tab, enter your product details or an affiliate link, and click generate. SphereAI will create 5 optimized pages for you.",
    },
    {
      question: "What is AI Search Optimization?",
      answer: "It means structuring your content with Schema Markup so that AI search engines like Perplexity can easily find and cite your website.",
    },
    {
      question: "Can I edit the generated pages?",
      answer: "Yes! You can go to the Projects section, select your project, and click the Edit button next to any page to change its content.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Support Center</h1>
        <p className="text-gray-500 text-lg">
          We're here to help you scale your AI-optimized assets.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Direct Support (Top) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-6 transition-all hover:border-brand-200">
          <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <Mail size={28} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 mb-0.5">Direct Support</h3>
            <p className="text-gray-400 text-sm font-medium">Our team typically responds in under 24 hours.</p>
          </div>
          <a href={`mailto:${supportEmail}`} className="px-5 py-2.5 bg-gray-50 rounded-xl font-bold text-brand-600 hover:bg-brand-100 transition-colors text-sm border border-gray-100/50">
            {supportEmail}
          </a>
        </div>

        {/* 2. Contact Form (Middle) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 relative">
          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <Send size={20} className="text-brand-600" />
            Send a Message
          </h2>

          {submitted ? (
            <div className="py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">Message Sent!</h3>
              <p className="text-gray-400 text-sm font-medium">Thank you for reaching out. We'll get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-brand-600 text-xs font-black uppercase tracking-widest hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Subject</label>
                  <input 
                    type="text" 
                    required
                    placeholder="What can we help you with?"
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-medium transition-all"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">Detailed Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-5 py-3.5 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-brand-500/5 focus:border-brand-200 outline-none text-base font-medium transition-all resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-12 py-3.5 bg-brand-600 text-white rounded-xl font-black text-sm hover:bg-brand-700 transition-all disabled:opacity-70 active:scale-95 shadow-lg shadow-brand-500/10"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </div>
                  ) : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 3. Support Portal (Bottom) */}
        <div className="bg-brand-600 rounded-2xl p-6 text-white flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <LifeBuoy size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black mb-0.5">Support Portal</h3>
                <p className="text-brand-100 text-sm font-medium opacity-80">Access our advanced ticketing system for deep technical issues.</p>
              </div>
           </div>
           <a 
            href={supportPortalUrl}
            target="_blank"
            className="px-6 py-3 bg-white text-brand-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-50 transition-all active:scale-95 flex items-center gap-2"
          >
            Open Ticket Portal
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

    </div>
  );
}
