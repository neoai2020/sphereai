import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Clock, User, CheckCircle2, ArrowRight } from "lucide-react";

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

interface TemplateProps {
  content: BlogContent;
  slug: string;
  themeId: string;
  primaryColor: string;
  styles: ReturnType<typeof getThemeStyles>;
  isDark: boolean;
  title: string;
  intro: string;
}

function SectionContent({
  section, primaryColor, isDark, styles,
}: {
  section: BlogSection;
  primaryColor: string;
  isDark: boolean;
  styles: ReturnType<typeof getThemeStyles>;
}) {
  return (
    <>
      {section.paragraphs?.map((p, j) => (
        <p key={j} className={cn(styles.text, "leading-relaxed")}>{p}</p>
      ))}
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
    </>
  );
}

function MetaRow({ content, isDark }: { content: BlogContent; isDark: boolean }) {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-400 font-medium flex-wrap">
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
  );
}

// Template 1 (default): Image header, full-width article text with sections
function Template1({ content, themeId, primaryColor, styles, isDark, title, intro }: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <article className={styles.section}>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Blog Article</span>
            <h1 className={cn(styles.heading, "leading-tight")}>{title}</h1>
            <MetaRow content={content} isDark={isDark} />
          </div>

          {intro && <p className={cn(styles.text, "text-xl leading-relaxed font-medium")}>{intro}</p>}

          {content.sections && content.sections.length > 0 && (
            <div className="space-y-10">
              {content.sections.map((section, i) => (
                <div key={i} className="space-y-4">
                  {section.heading && (
                    <h2 className="text-2xl font-black text-gray-900" style={isDark ? { color: "white" } : {}}>{section.heading}</h2>
                  )}
                  <SectionContent section={section} primaryColor={primaryColor} isDark={isDark} styles={styles} />
                </div>
              ))}
            </div>
          )}

          {content.conclusion && (
            <div className="p-8 rounded-2xl border-l-4 mt-8" style={{ borderColor: primaryColor, backgroundColor: primaryColor + "08" }}>
              <p className={cn(styles.text, "italic")}>{content.conclusion}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

// Template 2: "Magazine" — 2-col layout: main content + sidebar with section index
function Template2({ content, themeId, primaryColor, styles, isDark, title, intro }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const borderColor = isDark ? "#1f1f1f" : "#e2e8f0";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Hero */}
      <div className="py-20 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Blog</p>
          <h1 className="text-5xl font-black leading-tight max-w-3xl" style={{ color: textColor }}>{title}</h1>
          <MetaRow content={content} isDark={isDark} />
        </div>
      </div>

      {/* Two-col */}
      <div className="max-w-6xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-16">
        {/* Main content */}
        <div className="md:col-span-2 space-y-10">
          {intro && (
            <p className="text-xl font-medium leading-relaxed" style={{ color: mutedColor }}>{intro}</p>
          )}
          {content.sections?.map((section, i) => (
            <div key={i} className="space-y-4" id={`section-${i}`}>
              {section.heading && (
                <h2 className="text-2xl font-black" style={{ color: textColor }}>{section.heading}</h2>
              )}
              <SectionContent section={section} primaryColor={primaryColor} isDark={isDark} styles={styles} />
            </div>
          ))}
          {content.conclusion && (
            <div className="p-8 rounded-2xl border-l-4" style={{ borderColor: primaryColor, backgroundColor: primaryColor + "08" }}>
              <p className="text-base font-medium leading-relaxed italic" style={{ color: mutedColor }}>{content.conclusion}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="sticky top-8">
            <div className="p-6 rounded-2xl" style={isDark ? { backgroundColor: "#111", border: `1px solid ${borderColor}` } : { backgroundColor: "#f8fafc", border: `1px solid ${borderColor}` }}>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>In this article</p>
              <div className="space-y-3">
                {content.sections?.map((section, i) => section.heading && (
                  <a key={i} href={`#section-${i}`} className="flex items-center gap-3 text-sm font-medium hover:opacity-100 transition-opacity opacity-60" style={{ color: textColor }}>
                    <span className="text-[10px] font-black tabular-nums" style={{ color: primaryColor }}>{String(i + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            {(content.author || content.readTime) && (
              <div className="mt-6 p-6 rounded-2xl" style={isDark ? { backgroundColor: "#111", border: `1px solid ${borderColor}` } : { backgroundColor: "#f8fafc", border: `1px solid ${borderColor}` }}>
                {content.author && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: primaryColor }}>
                      {content.author[0]}
                    </div>
                    <div>
                      <p className="font-black text-sm" style={{ color: textColor }}>{content.author}</p>
                      {content.readTime && <p className="text-[10px] font-medium" style={{ color: mutedColor }}>{content.readTime}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Template 3: "Minimal" — max-width narrow text, no background boxes, clean typography only
function Template3({ content, themeId, primaryColor, styles, isDark, title, intro }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const dividerColor = isDark ? "#1f1f1f" : "#f1f5f9";
  return (
    <div className={cn("max-w-xl mx-auto px-8", isDark ? "bg-gray-950" : "bg-white")}>
      <div className="py-32 space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: primaryColor }}>Article</p>
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight" style={{ color: textColor }}>{title}</h1>
        <div className="flex items-center gap-4 text-xs font-medium" style={{ color: mutedColor }}>
          {content.author && <span>{content.author}</span>}
          {content.author && content.readTime && <span>·</span>}
          {content.readTime && <span>{content.readTime}</span>}
          {content.publishDate && <><span>·</span><span>{new Date(content.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></>}
        </div>
      </div>

      <div className="border-t pb-32 space-y-12" style={{ borderColor: dividerColor }}>
        {intro && (
          <p className="pt-12 text-2xl font-medium leading-relaxed" style={{ color: textColor }}>{intro}</p>
        )}
        {content.sections?.map((section, i) => (
          <div key={i} className="space-y-5">
            {section.heading && (
              <h2 className="text-xl font-black mt-8" style={{ color: textColor }}>{section.heading}</h2>
            )}
            {section.paragraphs?.map((p, j) => (
              <p key={j} className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
            ))}
            {section.content && (
              <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{section.content}</p>
            )}
            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2">
                {section.bulletPoints.map((point, k) => (
                  <li key={k} className="flex items-start gap-3 text-base font-medium" style={{ color: mutedColor }}>
                    <span style={{ color: primaryColor }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {content.conclusion && (
          <p className="text-xl font-medium leading-relaxed pt-6 border-t italic" style={{ color: textColor, borderColor: dividerColor }}>{content.conclusion}</p>
        )}
      </div>
    </div>
  );
}

// Template 4: "Bold" — dark header section, large numbered sections with borders
function Template4({ content, themeId, primaryColor, styles, isDark, title, intro }: TemplateProps) {
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Dark header */}
      <div className="py-28 px-8 bg-gray-950">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Article</p>
          <h1 className="text-6xl font-black text-white leading-[0.95] tracking-tight">{title}</h1>
          <MetaRow content={content} isDark={true} />
        </div>
      </div>

      {/* Intro */}
      {intro && (
        <div className="px-8 py-16" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl font-medium text-white/90 leading-relaxed">{intro}</p>
          </div>
        </div>
      )}

      {/* Numbered sections */}
      <div className="px-8 py-16" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "#fafafa" }}>
        <div className="max-w-4xl mx-auto space-y-0">
          {content.sections?.map((section, i) => (
            <div key={i} className="py-16 border-b" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#e2e8f0" }}>
              <div className="flex gap-10 items-start">
                <span className="text-6xl font-black tabular-nums flex-shrink-0 leading-none" style={{ color: isDark ? "#1f1f1f" : "#e2e8f0" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-5 flex-1">
                  {section.heading && (
                    <h2 className="text-3xl font-black" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{section.heading}</h2>
                  )}
                  {section.paragraphs?.map((p, j) => (
                    <p key={j} className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
                  ))}
                  {section.content && (
                    <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{section.content}</p>
                  )}
                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className="space-y-3">
                      {section.bulletPoints.map((point, k) => (
                        <li key={k} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
                          <span className="text-base font-medium" style={{ color: mutedColor }}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {content.conclusion && (
        <div className="px-8 py-16 bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl font-medium text-white/70 leading-relaxed italic">{content.conclusion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Template 5: "Cards" — each section of the article is a separate card with its own heading
function Template5({ content, themeId, primaryColor, styles, isDark, title, intro }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header */}
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-end">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>Article</p>
            <h1 className="text-5xl font-black leading-tight" style={{ color: textColor }}>{title}</h1>
          </div>
          <div className="space-y-4">
            {intro && <p className="text-lg font-medium leading-relaxed" style={{ color: mutedColor }}>{intro}</p>}
            <MetaRow content={content} isDark={isDark} />
          </div>
        </div>
      </section>

      {/* Cards grid */}
      <section className="py-16 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {content.sections?.map((section, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl space-y-5"
              style={isDark
                ? { backgroundColor: "#111", border: "1px solid #1f1f1f" }
                : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }
              }
            >
              {section.heading && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black tabular-nums" style={{ color: primaryColor }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-black" style={{ color: textColor }}>{section.heading}</h2>
                </div>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-sm font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
              ))}
              {section.content && (
                <p className="text-sm font-medium leading-relaxed" style={{ color: mutedColor }}>{section.content}</p>
              )}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2">
                  {section.bulletPoints.map((point, k) => (
                    <li key={k} className="flex items-start gap-2 text-sm font-medium" style={{ color: mutedColor }}>
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: primaryColor }} />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {content.conclusion && (
        <section className="py-16 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto">
            <div className="p-10 rounded-3xl" style={{ backgroundColor: primaryColor + "10", border: `1px solid ${primaryColor}25` }}>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: primaryColor }}>Conclusion</p>
              <p className="text-xl font-medium leading-relaxed" style={{ color: textColor }}>{content.conclusion}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function BlogRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
  templateId = 1,
}: {
  content: BlogContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
  templateId?: number;
}) {
  const styles = getThemeStyles(themeId, primaryColor);
  const isDark = themeId === "4";
  const title = content.headline || content.title || "Blog Article";
  const intro = content.introduction || content.excerpt || "";
  const props: TemplateProps = { content, slug, themeId, primaryColor, styles, isDark, title, intro };

  switch (templateId) {
    case 2: return <Template2 {...props} />;
    case 3: return <Template3 {...props} />;
    case 4: return <Template4 {...props} />;
    case 5: return <Template5 {...props} />;
    default: return <Template1 {...props} />;
  }
}
