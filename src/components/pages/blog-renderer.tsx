import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Clock, User, CheckCircle2 } from "lucide-react";

interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bulletPoints?: string[];
  // legacy
  type?: string;
  content?: string;
}

interface BlogContent {
  // AI-generated structure
  headline?: string;
  author?: string;
  publishDate?: string;
  readTime?: string;
  introduction?: string;
  sections?: BlogSection[];
  conclusion?: string;
  // legacy
  title?: string;
  excerpt?: string;
}

export function BlogRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
}: {
  content: BlogContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
}) {
  const styles = getThemeStyles(themeId, primaryColor);
  const isDark = themeId === "4";

  const title = content.headline || content.title || "Blog Article";
  const intro = content.introduction || content.excerpt || "";

  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <article className={styles.section}>
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
              Blog Article
            </span>
            <h1 className={cn(styles.heading, "leading-tight")}>{title}</h1>

            <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
              {content.author && (
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  {content.author}
                </div>
              )}
              {content.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {content.readTime}
                </div>
              )}
              {content.publishDate && (
                <span>{new Date(content.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              )}
            </div>
          </div>

          {/* Introduction */}
          {intro && (
            <p className={cn(styles.text, "text-xl leading-relaxed font-medium")}>{intro}</p>
          )}

          {/* Sections */}
          {content.sections && content.sections.length > 0 && (
            <div className="space-y-10">
              {content.sections.map((section, i) => (
                <div key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl font-black text-gray-900" style={isDark ? { color: "white" } : {}}>
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs?.map((p, j) => (
                    <p key={j} className={cn(styles.text, "leading-relaxed")}>{p}</p>
                  ))}
                  {/* Legacy support */}
                  {section.content && typeof section.content === "string" && (
                    <p className={cn(styles.text, "leading-relaxed")}>{section.content}</p>
                  )}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-3 mt-4">
                      {section.bulletPoints.map((point, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
                          <span className={styles.text}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Conclusion */}
          {content.conclusion && (
            <div
              className="p-8 rounded-2xl border-l-4 mt-8"
              style={{ borderColor: primaryColor, backgroundColor: primaryColor + "08" }}
            >
              <p className={cn(styles.text, "italic")}>{content.conclusion}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
