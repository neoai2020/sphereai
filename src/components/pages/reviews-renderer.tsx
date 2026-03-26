import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

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
        <Star
          key={star}
          size={16}
          className={cn(star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200")}
        />
      ))}
    </div>
  );
}

export function ReviewsRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
}: {
  content: ReviewsContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
}) {
  const styles = getThemeStyles(themeId, primaryColor);

  return (
    <div className={cn(themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
      <header className={styles.section}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className={styles.heading}>
            {content.headline || "Customer Wisdom"}
          </h1>
          {content.description && (
            <p className={styles.text}>{content.description}</p>
          )}
          {content.overallRating && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl font-black text-gray-900" style={themeId === "4" ? { color: "white" } : {}}>
                {content.overallRating}
              </span>
              <StarRating rating={Math.round(content.overallRating)} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
                Unified rating from {content.totalReviews || 0} reviewers
              </p>
            </div>
          )}
        </div>
      </header>

      <section className={cn(styles.section, "pt-0")}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.reviews?.map((review, i) => (
            <div
              key={i}
              className={cn(styles.card, "space-y-6")}
            >
              <StarRating rating={review.rating} />
              <p className={styles.text}>
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50" style={themeId === "4" ? { borderColor: "#222" } : {}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg" style={{ backgroundColor: primaryColor }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm" style={themeId === "4" ? { color: "white" } : {}}>
                    {review.name}
                  </p>
                  {review.role && (
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {content.summary && (
        <section className={cn("py-24 px-6", themeId === "4" ? "bg-brand-600" : "bg-gray-900")}>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-black text-white">
              {content.summary.headline}
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              {content.summary.text}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
