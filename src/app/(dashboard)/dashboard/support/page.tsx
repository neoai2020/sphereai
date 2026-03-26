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

      <div className="flex flex-col gap-8">
        {/* 1. Direct Support (Top) */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Mail size={32} className="text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Direct Support</h3>
            <p className="text-gray-500 font-medium">Our team typically responds in under 24 hours.</p>
          </div>
          <a href={`mailto:${supportEmail}`} className="px-6 py-3 bg-gray-50 rounded-xl font-bold text-indigo-600 hover:bg-indigo-100 transition-colors">
            {supportEmail}
          </a>
        </div>

        {/* 2. Contact Form (Middle) */}
        <div className="bg-white rounded-[2rem] border border-gray-100 p-10 shadow-sm overflow-hidden relative">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Send size={24} className="text-indigo-600" />
            Send a Message
          </h2>

          {submitted ? (
            <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-100">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-indigo-600 text-sm font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Subject</label>
                  <input 
                    type="text" 
                    required
                    placeholder="What can we help you with?"
                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/20 outline-none text-lg font-medium shadow-inner"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Detailed Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-6 py-4 rounded-xl bg-gray-50 border-none focus:ring-4 focus:ring-indigo-500/20 outline-none text-lg font-medium shadow-inner resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-16 py-5 bg-brand-600 text-white rounded-2xl font-black text-lg hover:bg-brand-700 transition-all disabled:opacity-70 active:scale-95 shadow-2xl shadow-brand-500/20"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin" size={24} />
                      Sending...
                    </div>
                  ) : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 3. Support Portal (Bottom) */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <LifeBuoy size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Support Portal</h3>
                <p className="text-brand-100 font-medium opacity-80">Access our advanced ticketing system for deep technical issues.</p>
              </div>
           </div>
           <a 
            href={supportPortalUrl}
            target="_blank"
            className="px-8 py-4 bg-white text-brand-600 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-50 transition-all active:scale-95 flex items-center gap-2"
          >
            Open Ticket Portal
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

    </div>
  );
}
