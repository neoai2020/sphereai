import Link from "next/link";

interface BlogContent {
  headline?: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  introduction?: string;
  sections?: Array<{
    heading: string;
    paragraphs: string[];
    bulletPoints?: string[];
  }>;
  conclusion?: string;
}

export function BlogRenderer({
  content,
  slug,
}: {
  content: BlogContent;
  slug: string;
}) {
  return (
    <div>
      <header className="py-16 px-4 bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.headline}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {content.author && <span>By {content.author}</span>}
            {content.publishDate && (
              <span>{new Date(content.publishDate).toLocaleDateString()}</span>
            )}
            {content.readTime && <span>{content.readTime}</span>}
          </div>
        </div>
      </header>

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-gray prose-lg">
          {content.introduction && (
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {content.introduction}
            </p>
          )}

          {content.sections?.map((section, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-gray-600 leading-relaxed mb-4">
                  {p}
                </p>
              ))}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  {section.bulletPoints.map((point, k) => (
                    <li key={k}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {content.conclusion && (
            <div className="mt-10 p-6 bg-brand-50 rounded-xl">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Conclusion
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {content.conclusion}
              </p>
            </div>
          )}
        </div>
      </article>

      <nav className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/s/${slug}`} className="text-gray-500 hover:text-gray-700">Home</Link>
          <Link href={`/s/${slug}/about`} className="text-gray-500 hover:text-gray-700">About</Link>
          <Link href={`/s/${slug}/faq`} className="text-gray-500 hover:text-gray-700">FAQ</Link>
          <Link href={`/s/${slug}/blog`} className="text-brand-600 font-medium">Blog</Link>
          <Link href={`/s/${slug}/reviews`} className="text-gray-500 hover:text-gray-700">Reviews</Link>
        </div>
      </nav>
    </div>
  );
}
