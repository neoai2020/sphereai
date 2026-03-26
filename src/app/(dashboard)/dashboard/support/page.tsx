import { HelpCircle, Mail, MessageSquare, BookOpen } from "lucide-react";

export default function SupportPage() {
  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help from our team via email",
      value: "support@sphereai.com",
      icon: Mail,
    },
    {
      title: "Live Chat",
      description: "Chat with us directly (9 AM - 5 PM EST)",
      value: "Available on Pro plans",
      icon: MessageSquare,
    },
  ];

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-500 mt-1">
          Everything you need to get help and make the most of SphereAI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {contactOptions.map((option) => (
          <div key={option.title} className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <option.icon size={24} className="text-brand-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{option.description}</p>
              <p className="text-sm font-medium text-brand-600">{option.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <HelpCircle size={20} className="text-brand-600" />
          <h2 className="font-semibold text-gray-900">Quick Help & FAQs</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6">
              <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-8 bg-brand-600 rounded-2xl text-center text-white">
        <BookOpen size={40} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-xl font-bold mb-2">Need a deep dive?</h2>
        <p className="text-brand-100 mb-6 max-w-md mx-auto">
          Check out our comprehensive training area for step-by-step guides and video tutorials.
        </p>
        <a 
          href="/dashboard/training"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-brand-600 font-semibold hover:bg-brand-50 transition-colors"
        >
          Go to Training
        </a>
      </div>
    </div>
  );
}
