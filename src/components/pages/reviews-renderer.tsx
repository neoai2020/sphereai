import Link from "next/link";

interface ReviewsContent {
  headline?: string;
  description?: string;
  overallRating?: number;
  totalReviews?: number;
  reviews?: Array<{
    name: string;
    role?: string;
    rating: number;
    text: string;
    date?: string;
  }>;
  summary?: {
    headline: string;
    text: string;
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsRenderer({
  content,
  slug,
}: {
  content: ReviewsContent;
  slug: string;
}) {
  return (
    <div>
      <header className="py-16 px-4 bg-gradient-to-b from-brand-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.headline || "Customer Reviews"}
          </h1>
          {content.description && (
            <p className="text-lg text-gray-600 mb-6">{content.description}</p>
          )}
          {content.overallRating && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-bold text-gray-900">
                {content.overallRating}
              </span>
              <div>
                <StarRating rating={Math.round(content.overallRating)} />
                <p className="text-sm text-gray-500 mt-1">
                  Based on {content.totalReviews || 0} reviews
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {content.reviews?.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <StarRating rating={review.rating} />
              <p className="text-gray-600 mt-4 mb-4 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-700 font-semibold text-sm">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {review.name}
                  </p>
                  {review.role && (
                    <p className="text-xs text-gray-500">{review.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {content.summary && (
        <section className="py-12 px-4 bg-brand-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {content.summary.headline}
            </h2>
            <p className="text-brand-100 leading-relaxed">
              {content.summary.text}
            </p>
          </div>
        </section>
      )}

      <nav className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/s/${slug}`} className="text-gray-500 hover:text-gray-700">Home</Link>
          <Link href={`/s/${slug}/about`} className="text-gray-500 hover:text-gray-700">About</Link>
          <Link href={`/s/${slug}/faq`} className="text-gray-500 hover:text-gray-700">FAQ</Link>
          <Link href={`/s/${slug}/blog`} className="text-gray-500 hover:text-gray-700">Blog</Link>
          <Link href={`/s/${slug}/reviews`} className="text-brand-600 font-medium">Reviews</Link>
        </div>
      </nav>
    </div>
  );
}
