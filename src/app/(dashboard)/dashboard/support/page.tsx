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

  const supportPortalUrl = "https://sphereai.freshdesk.com";
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Contact info cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <Mail size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Direct Support</h3>
            <p className="text-sm text-gray-500 mb-4 text-pretty">Our team typically responds in under 24 hours.</p>
            <a href={`mailto:${supportEmail}`} className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              {supportEmail}
            </a>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
              <LifeBuoy size={24} className="text-white" />
            </div>
            <h3 className="font-bold mb-1">Support Portal</h3>
            <p className="text-sm text-indigo-100 mb-6">Access our advanced ticketing system for deep technical issues.</p>
            <a 
              href={supportPortalUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-600 text-sm font-bold hover:bg-opacity-90 transition-all active:scale-95"
            >
              Open Ticket Portal
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Send size={20} className="text-indigo-600" />
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="What can we help you with?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Message</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-indigo-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50/50 rounded-3xl p-10 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <HelpCircle size={20} className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Common Questions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <div key={i} className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-indigo-600 font-black">Q.</span>
                {faq.question}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed pl-6 border-l-2 border-gray-50 group-hover:border-indigo-100 transition-colors">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
