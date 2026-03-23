import Link from "next/link";

interface LandingContent {
  hero?: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  features?: Array<{
    title: string;
    description: string;
  }>;
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  socialProof?: {
    headline: string;
    stats: Array<{ value: string; label: string }>;
  };
  cta?: {
    headline: string;
    description: string;
    buttonText: string;
  };
}

export function LandingRenderer({
  content,
  productUrl,
  slug,
}: {
  content: LandingContent;
  productUrl: string | null;
  slug: string;
}) {
  const ctaHref = productUrl || "#";

  return (
    <div>
      {/* Hero */}
      {content.hero && (
        <section className="py-20 px-4 text-center bg-gradient-to-b from-brand-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {content.hero.headline}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {content.hero.subheadline}
            </p>
            <a
              href={ctaHref}
              className="inline-flex px-8 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg transition-colors"
            >
              {content.hero.ctaText}
            </a>
          </div>
        </section>
      )}

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                    <span className="text-brand-600 font-bold text-lg">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {content.benefits && content.benefits.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof */}
      {content.socialProof && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              {content.socialProof.headline}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {content.socialProof.stats?.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-bold text-brand-600">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {content.cta && (
        <section className="py-16 px-4 bg-brand-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {content.cta.headline}
            </h2>
            <p className="text-brand-100 text-lg mb-8">
              {content.cta.description}
            </p>
            <a
              href={ctaHref}
              className="inline-flex px-8 py-3.5 rounded-lg bg-white text-brand-700 font-semibold text-lg hover:bg-brand-50 transition-colors"
            >
              {content.cta.buttonText}
            </a>
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/s/${slug}`} className="text-brand-600 font-medium">
            Home
          </Link>
          <Link href={`/s/${slug}/about`} className="text-gray-500 hover:text-gray-700">
            About
          </Link>
          <Link href={`/s/${slug}/faq`} className="text-gray-500 hover:text-gray-700">
            FAQ
          </Link>
          <Link href={`/s/${slug}/blog`} className="text-gray-500 hover:text-gray-700">
            Blog
          </Link>
          <Link href={`/s/${slug}/reviews`} className="text-gray-500 hover:text-gray-700">
            Reviews
          </Link>
        </div>
      </nav>
    </div>
  );
}
