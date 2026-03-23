import Link from "next/link";
import { Globe, Zap, Search, FileText, Shield, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SphereAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-6">
            <Zap size={14} />
            AI-Powered Page Generation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Generate 5 AI-Optimized Pages{" "}
            <span className="text-brand-600">in Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create high-converting, AI-search-optimized pages for your product
            or affiliate service. Designed to be cited by AI assistants like
            ChatGPT, Perplexity, and Google AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="px-8 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="#features"
              className="px-8 py-3.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 bg-gray-50" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              5 Pages, Built for the AI Era
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every page is crafted with structured data, semantic HTML, and
              content that AI search engines love to cite.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                title: "Landing Page",
                desc: "Hero, features, social proof, CTAs",
                schema: "Product + WebPage",
              },
              {
                title: "About Page",
                desc: "Brand story, mission, values",
                schema: "Organization",
              },
              {
                title: "FAQ Page",
                desc: "8-10 optimized Q&As",
                schema: "FAQPage",
              },
              {
                title: "Blog Article",
                desc: "Long-form SEO content",
                schema: "Article",
              },
              {
                title: "Reviews Page",
                desc: "Testimonials & ratings",
                schema: "Review + Rating",
              },
            ].map((page, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-600 font-bold">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{page.desc}</p>
                <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded">
                  {page.schema}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "AI Search Optimized",
                desc: "JSON-LD schema markup on every page. FAQPage, Article, Product, Review schemas that AI engines understand.",
              },
              {
                icon: FileText,
                title: "AI-Generated Content",
                desc: "Compelling, persuasive copy generated by AI tailored to your product and target audience.",
              },
              {
                icon: Zap,
                title: "Instant Generation",
                desc: "Fill in your product details and get 5 complete, published pages in under 2 minutes.",
              },
              {
                icon: Globe,
                title: "Hosted & Live",
                desc: "Pages are instantly published and accessible. Share your URL and start getting traffic.",
              },
              {
                icon: Shield,
                title: "SEO Best Practices",
                desc: "Semantic HTML, proper heading hierarchy, meta tags, Open Graph, and structured data.",
              },
              {
                icon: BarChart3,
                title: "Dashboard Analytics",
                desc: "Manage all your projects from a clean dashboard. Track status and manage pages.",
              },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={22} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Plans */}
      <section className="py-20 px-4 bg-gray-50" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600">Get started for free or scale with Pro features</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-center text-center shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Standard</h3>
              <p className="text-gray-500 mb-6 text-sm">Perfect for individuals and small projects</p>
              <div className="text-3xl font-bold text-gray-900 mb-8">$0<span className="text-sm font-normal text-gray-500"> / month</span></div>
              <ul className="space-y-3 mb-10 text-left w-full text-sm text-gray-600">
                <li className="flex items-center gap-2"><Globe size={16} className="text-brand-600" /> 5 AI-optimized pages</li>
                <li className="flex items-center gap-2"><Zap size={16} className="text-brand-600" /> Basic AI generation</li>
                <li className="flex items-center gap-2"><BarChart3 size={16} className="text-brand-600" /> Public project link</li>
              </ul>
              <Link href="/sign-up" className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors">
                Start for Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-brand-600 flex flex-col items-center text-center shadow-lg relative">
              <div className="absolute -top-4 bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-500 mb-6 text-sm">Unlock full power with traffic tools</p>
              <div className="text-3xl font-bold text-gray-900 mb-8">$49<span className="text-sm font-normal text-gray-500"> / month</span></div>
              <ul className="space-y-3 mb-10 text-left w-full text-sm text-gray-600">
                <li className="flex items-center gap-2"><Globe size={16} className="text-brand-600" /> Unlimited projects</li>
                <li className="flex items-center gap-2"><Zap size={16} className="text-brand-600" /> Advanced Traffic Magnet tools</li>
                <li className="flex items-center gap-2"><Shield size={16} className="text-brand-600" /> Custom branding & editors</li>
              </ul>
              <Link href="/sign-up-pro" className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-md">
                Get Started Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Be Found by AI?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Create your AI-optimized pages now. It takes less than 2 minutes.
          </p>
          <Link
            href="/register"
            className="inline-flex px-8 py-3.5 rounded-lg bg-white text-brand-700 font-semibold text-lg hover:bg-brand-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand-600 flex items-center justify-center">
              <Globe size={12} className="text-white" />
            </div>
            <span>SphereAI</span>
          </div>
          <p>&copy; {new Date().getFullYear()} SphereAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
