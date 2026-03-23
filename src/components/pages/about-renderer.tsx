import Link from "next/link";

interface AboutContent {
  story?: {
    headline: string;
    paragraphs: string[];
  };
  mission?: {
    headline: string;
    text: string;
  };
  values?: Array<{
    title: string;
    description: string;
  }>;
  team?: {
    headline: string;
    description: string;
  };
}

export function AboutRenderer({
  content,
  productName,
  slug,
}: {
  content: AboutContent;
  productName: string;
  slug: string;
}) {
  return (
    <div>
      <header className="py-16 px-4 bg-gradient-to-b from-brand-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About {productName}
          </h1>
        </div>
      </header>

      {content.story && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {content.story.headline}
            </h2>
            {content.story.paragraphs?.map((p, i) => (
              <p key={i} className="text-gray-600 mb-4 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {content.mission && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {content.mission.headline}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {content.mission.text}
            </p>
          </div>
        </section>
      )}

      {content.values && content.values.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.values.map((value, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.team && (
        <section className="py-12 px-4 bg-brand-50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {content.team.headline}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {content.team.description}
            </p>
          </div>
        </section>
      )}

      <nav className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/s/${slug}`} className="text-gray-500 hover:text-gray-700">Home</Link>
          <Link href={`/s/${slug}/about`} className="text-brand-600 font-medium">About</Link>
          <Link href={`/s/${slug}/faq`} className="text-gray-500 hover:text-gray-700">FAQ</Link>
          <Link href={`/s/${slug}/blog`} className="text-gray-500 hover:text-gray-700">Blog</Link>
          <Link href={`/s/${slug}/reviews`} className="text-gray-500 hover:text-gray-700">Reviews</Link>
        </div>
      </nav>
    </div>
  );
}
