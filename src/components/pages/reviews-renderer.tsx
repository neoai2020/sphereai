import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

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

interface TemplateProps {
  content: ReviewsContent;
  slug: string;
  themeId: string;
  primaryColor: string;
  styles: ReturnType<typeof getThemeStyles>;
  isDark: boolean;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200")}
        />
      ))}
    </div>
  );
}

function Avatar({ name, primaryColor, size = "md" }: { name: string; primaryColor: string; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-16 h-16 text-lg" : size === "sm" ? "w-8 h-8 text-xs" : "w-12 h-12 text-sm";
  return (
    <div className={cn(cls, "rounded-xl flex items-center justify-center text-white font-black flex-shrink-0")} style={{ backgroundColor: primaryColor }}>
      {name[0]}
    </div>
  );
}

function SummaryBanner({ content, themeId, primaryColor }: { content: ReviewsContent; themeId: string; primaryColor: string }) {
  return content.summary ? (
    <section className={cn("py-24 px-6", themeId === "4" ? "bg-brand-600" : "bg-gray-900")}>
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-black text-white">{content.summary.headline}</h2>
        <p className="text-gray-400 font-medium leading-relaxed">{content.summary.text}</p>
      </div>
    </section>
  ) : null;
}

// Template 1 (default): Centered header with rating, 3-col review cards
function Template1({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <header className={styles.section}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className={styles.heading}>{content.headline || "Customer Wisdom"}</h1>
          {content.description && <p className={styles.text}>{content.description}</p>}
          {content.overallRating && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl font-black text-gray-900" style={isDark ? { color: "white" } : {}}>{content.overallRating}</span>
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
            <div key={i} className={cn(styles.card, "space-y-6")}>
              <StarRating rating={review.rating} />
              <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-50" style={isDark ? { borderColor: "#222" } : {}}>
                <Avatar name={review.name} primaryColor={primaryColor} />
                <div>
                  <p className="font-black text-gray-900 text-sm" style={isDark ? { color: "white" } : {}}>{review.name}</p>
                  {review.role && <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SummaryBanner content={content} themeId={themeId} primaryColor={primaryColor} />
    </div>
  );
}

// Template 2: "Featured" — one large hero review at top, then 2-col grid below
function Template2({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const reviews = content.reviews || [];
  const [featured, ...rest] = reviews;
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header */}
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Reviews</p>
          <h1 className="text-5xl font-black" style={{ color: textColor }}>{content.headline || "What customers say"}</h1>
          {content.overallRating && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className="text-4xl font-black" style={{ color: primaryColor }}>{content.overallRating}</span>
              <div>
                <StarRating rating={Math.round(content.overallRating)} />
                <p className="text-[10px] font-medium mt-1" style={{ color: mutedColor }}>from {content.totalReviews || 0} reviews</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured review */}
      {featured && (
        <section className="px-8 pb-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto p-12 rounded-3xl relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
            <Quote size={80} className="absolute right-8 top-8 opacity-10 text-white" />
            <div className="relative z-10 space-y-6">
              <StarRating rating={featured.rating} size={20} />
              <p className="text-2xl font-medium text-white leading-relaxed">&ldquo;{featured.text}&rdquo;</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-xl">
                  {featured.name[0]}
                </div>
                <div>
                  <p className="font-black text-white text-lg">{featured.name}</p>
                  {featured.role && <p className="text-white/60 text-sm font-medium">{featured.role}</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest in 2-col grid */}
      {rest.length > 0 && (
        <section className="px-8 py-16" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "white" }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {rest.map((review, i) => (
              <div key={i} className="p-8 rounded-2xl space-y-5" style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <StarRating rating={review.rating} />
                <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#e2e8f0" }}>
                  <Avatar name={review.name} primaryColor={primaryColor} size="sm" />
                  <div>
                    <p className="font-black text-sm" style={{ color: textColor }}>{review.name}</p>
                    {review.role && <p className="text-[10px] font-medium" style={{ color: mutedColor }}>{review.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SummaryBanner content={content} themeId={themeId} primaryColor={primaryColor} />
    </div>
  );
}

// Template 3: "List" — vertical list of reviews with stars left, text right
function Template3({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const dividerColor = isDark ? "#1f1f1f" : "#f1f5f9";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header */}
      <section className="py-28 px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-end">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Reviews</p>
            <h1 className="text-6xl font-black leading-[0.9] tracking-tighter" style={{ color: textColor }}>{content.headline || "Customer Reviews"}</h1>
          </div>
          {content.overallRating && (
            <div className="space-y-3">
              <span className="text-8xl font-black tabular-nums" style={{ color: primaryColor }}>{content.overallRating}</span>
              <StarRating rating={Math.round(content.overallRating)} size={24} />
              <p className="text-sm font-medium" style={{ color: mutedColor }}>{content.totalReviews || 0} verified reviews</p>
            </div>
          )}
        </div>
      </section>

      {/* List */}
      <section className="px-8 pb-24" style={isDark ? { borderTop: `1px solid ${dividerColor}` } : { borderTop: `1px solid ${dividerColor}` }}>
        <div className="max-w-4xl mx-auto">
          {content.reviews?.map((review, i) => (
            <div key={i} className="py-10 border-b grid md:grid-cols-4 gap-8 items-start" style={{ borderColor: dividerColor }}>
              <div className="space-y-3">
                <Avatar name={review.name} primaryColor={primaryColor} size="md" />
                <div>
                  <p className="font-black text-sm" style={{ color: textColor }}>{review.name}</p>
                  {review.role && <p className="text-[10px] font-medium" style={{ color: mutedColor }}>{review.role}</p>}
                </div>
                <StarRating rating={review.rating} size={12} />
              </div>
              <div className="md:col-span-3">
                <p className="text-lg font-medium leading-relaxed" style={{ color: mutedColor }}>&ldquo;{review.text}&rdquo;</p>
                {review.date && <p className="text-xs font-medium mt-4" style={{ color: isDark ? "#333" : "#d1d5db" }}>{review.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SummaryBanner content={content} themeId={themeId} primaryColor={primaryColor} />
    </div>
  );
}

// Template 4: "Stats" — rating stats bar (5★ 80%, 4★ 15%...) + 2-col quote cards
function Template4({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const reviews = content.reviews || [];
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";

  // Calculate rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header + Stats */}
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Reviews</p>
            <h1 className="text-5xl font-black leading-tight" style={{ color: textColor }}>{content.headline || "What people say"}</h1>
            {content.description && <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{content.description}</p>}
            {content.overallRating && (
              <div className="flex items-center gap-4">
                <span className="text-6xl font-black" style={{ color: primaryColor }}>{content.overallRating}</span>
                <div>
                  <StarRating rating={Math.round(content.overallRating)} />
                  <p className="text-xs font-medium mt-1" style={{ color: mutedColor }}>{content.totalReviews || 0} reviews</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating bars */}
          <div className="space-y-4">
            {distribution.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                  <span className="text-xs font-black" style={{ color: textColor }}>{star}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={isDark ? { backgroundColor: "#1f1f1f" } : { backgroundColor: "#e2e8f0" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: primaryColor }} />
                </div>
                <span className="text-xs font-black w-10 text-right" style={{ color: mutedColor }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote cards */}
      {reviews.length > 0 && (
        <section className="py-16 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "white" }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="p-8 rounded-2xl relative overflow-hidden" style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Quote size={40} className="absolute right-6 top-6 opacity-10" style={{ color: primaryColor }} />
                <div className="relative z-10 space-y-4">
                  <StarRating rating={review.rating} />
                  <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>&ldquo;{review.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#e2e8f0" }}>
                    <Avatar name={review.name} primaryColor={primaryColor} size="sm" />
                    <div>
                      <p className="font-black text-sm" style={{ color: textColor }}>{review.name}</p>
                      {review.role && <p className="text-[10px] font-medium" style={{ color: mutedColor }}>{review.role}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SummaryBanner content={content} themeId={themeId} primaryColor={primaryColor} />
    </div>
  );
}

// Template 5: "Masonry" — alternating card sizes, 2-col with one tall card + two small cards
function Template5({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const reviews = content.reviews || [];
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";

  // Group reviews into chunks: [tall, small, small]
  const groups: Array<{ tall: typeof reviews[0]; smalls: typeof reviews }> = [];
  let idx = 0;
  while (idx < reviews.length) {
    const tall = reviews[idx];
    const smalls = reviews.slice(idx + 1, idx + 3);
    groups.push({ tall, smalls });
    idx += 3;
  }

  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header */}
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Reviews</p>
          <h1 className="text-5xl font-black" style={{ color: textColor }}>{content.headline || "Customer Reviews"}</h1>
          {content.overallRating && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-black" style={{ color: primaryColor }}>{content.overallRating}</span>
              <div>
                <StarRating rating={Math.round(content.overallRating)} size={20} />
                <p className="text-xs font-medium mt-1 text-center" style={{ color: mutedColor }}>{content.totalReviews || 0} reviews</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Masonry groups */}
      <section className="py-16 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto space-y-6">
          {groups.map((group, gi) => (
            <div key={gi} className={cn("grid md:grid-cols-2 gap-6", gi % 2 !== 0 && "md:grid-flow-col-dense")}>
              {/* Tall card */}
              <div
                className={cn("p-10 rounded-3xl space-y-6 flex flex-col justify-between row-span-2", gi % 2 !== 0 && "md:col-start-2")}
                style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: primaryColor + "08", border: `1px solid ${primaryColor}20` }}
              >
                <div className="space-y-5">
                  <Quote size={32} style={{ color: primaryColor, opacity: 0.4 }} />
                  <StarRating rating={group.tall.rating} size={18} />
                  <p className="text-xl font-medium leading-relaxed" style={{ color: textColor }}>&ldquo;{group.tall.text}&rdquo;</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: `${primaryColor}20` }}>
                  <Avatar name={group.tall.name} primaryColor={primaryColor} size="lg" />
                  <div>
                    <p className="font-black" style={{ color: textColor }}>{group.tall.name}</p>
                    {group.tall.role && <p className="text-xs font-medium" style={{ color: mutedColor }}>{group.tall.role}</p>}
                  </div>
                </div>
              </div>

              {/* Two small cards */}
              <div className={cn("space-y-6", gi % 2 !== 0 && "md:col-start-1")}>
                {group.smalls.map((review, si) => (
                  <div key={si} className="p-8 rounded-3xl space-y-4" style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <StarRating rating={review.rating} size={14} />
                    <p className="text-sm font-medium leading-relaxed" style={{ color: mutedColor }}>&ldquo;{review.text}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-3 border-t" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#e2e8f0" }}>
                      <Avatar name={review.name} primaryColor={primaryColor} size="sm" />
                      <div>
                        <p className="font-black text-sm" style={{ color: textColor }}>{review.name}</p>
                        {review.role && <p className="text-[10px] font-medium" style={{ color: mutedColor }}>{review.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SummaryBanner content={content} themeId={themeId} primaryColor={primaryColor} />
    </div>
  );
}

export function ReviewsRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
  templateId = 1,
}: {
  content: ReviewsContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
  templateId?: number;
}) {
  const styles = getThemeStyles(themeId, primaryColor);
  const isDark = themeId === "4";
  const props: TemplateProps = { content, slug, themeId, primaryColor, styles, isDark };

  switch (templateId) {
    case 2: return <Template2 {...props} />;
    case 3: return <Template3 {...props} />;
    case 4: return <Template4 {...props} />;
    case 5: return <Template5 {...props} />;
    default: return <Template1 {...props} />;
  }
}
