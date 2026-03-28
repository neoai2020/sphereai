import type { ReactNode } from "react";
import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { SiteRelatedNavStrip } from "@/components/pages/site-related-nav";

interface FAQContent {
  headline?: string;
  faqs?: Array<{ question: string; answer: string }>;
  relatedNav?: Array<{ label: string; path: string }>;
}

interface TemplateProps {
  content: FAQContent;
  slug: string;
  themeId: string;
  primaryColor: string;
  styles: ReturnType<typeof getThemeStyles>;
  isDark: boolean;
}

// Template 1 (default): Centered header, single column Q&A cards
function Template1({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className={styles.heading}>{content.headline || "Common Questions"}</h1>
            <p className={styles.text}>Everything you need to know about our solution.</p>
          </div>
          <div className="grid gap-6">
            {content.faqs?.map((faq, i) => (
              <div key={i} className={cn(styles.card, "group cursor-pointer")}>
                <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:opacity-80 transition-opacity" style={isDark ? { color: "white" } : {}}>
                  {faq.question}
                </h3>
                <p className={styles.text}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Template 2: "Two Column" — 2-col FAQ grid, each item is a card
function Template2({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>FAQ</p>
            <h1 className="text-5xl font-black leading-tight" style={{ color: textColor }}>
              {content.headline || "Common Questions"}
            </h1>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {content.faqs?.map((faq, i) => (
              <div key={i} className="p-8 rounded-2xl space-y-4" style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: "white", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="flex items-start gap-4">
                  <span className="text-xs font-black tabular-nums mt-1" style={{ color: primaryColor }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-black leading-snug" style={{ color: textColor }}>{faq.question}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed pl-8" style={{ color: mutedColor }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Template 3: "Numbered" — clean numbered list style (01, 02, 03...), no cards
function Template3({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const dividerColor = isDark ? "#1f1f1f" : "#f1f5f9";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      <section className="py-32 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-20 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: primaryColor }}>FAQ</p>
            <h1 className="text-6xl font-black leading-[0.9] tracking-tighter" style={{ color: textColor }}>
              {content.headline || "Questions"}
            </h1>
          </div>
          <div>
            {content.faqs?.map((faq, i) => (
              <div key={i} className="py-12 border-t flex gap-12" style={{ borderColor: dividerColor }}>
                <span className="text-4xl font-black tabular-nums flex-shrink-0 leading-none" style={{ color: primaryColor + "30" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-4">
                  <h3 className="text-xl font-black" style={{ color: textColor }}>{faq.question}</h3>
                  <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Template 4: "Bold Q" — large bold question as heading, answer below, with accent left border
function Template4({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Hero header */}
      <section className="py-28 px-8" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white/60 mb-6">FAQ</p>
          <h1 className="text-6xl font-black text-white leading-[0.95] tracking-tight">
            {content.headline || "Got Questions?"}
          </h1>
        </div>
      </section>

      {/* Q&A Items */}
      <section className="py-16 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "#fafafa" }}>
        <div className="max-w-5xl mx-auto space-y-0">
          {content.faqs?.map((faq, i) => (
            <div
              key={i}
              className="py-12 pl-8 border-l-4 mb-8"
              style={{ borderColor: primaryColor, backgroundColor: isDark ? "#111" : "white" }}
            >
              <div className="max-w-3xl px-8">
                <h3 className="text-3xl font-black mb-5 leading-tight" style={{ color: textColor }}>{faq.question}</h3>
                <p className="text-lg font-medium leading-relaxed" style={{ color: mutedColor }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Template 5: "Side by Side" — Q on the left fixed column, A on the right (table-like layout)
function Template5({ content, themeId, primaryColor, styles, isDark }: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const dividerColor = isDark ? "#1f1f1f" : "#e2e8f0";
  return (
    <div className={cn(isDark ? "bg-gray-950" : "bg-white")}>
      {/* Header */}
      <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto flex items-end gap-16">
          <div className="flex-1 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.6em]" style={{ color: primaryColor }}>FAQ</p>
            <h1 className="text-5xl font-black leading-tight" style={{ color: textColor }}>{content.headline || "Common Questions"}</h1>
          </div>
          <p className="text-sm font-medium max-w-xs" style={{ color: mutedColor }}>
            Find answers to the most common questions about our product and service.
          </p>
        </div>
      </section>

      {/* Table-like layout */}
      <section className="px-8 pb-24" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
        <div className="max-w-6xl mx-auto border rounded-2xl overflow-hidden" style={{ borderColor: dividerColor }}>
          {/* Header row */}
          <div className="grid grid-cols-2 border-b py-4 px-8" style={{ borderColor: dividerColor, backgroundColor: isDark ? "#111" : "white" }}>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Question</p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Answer</p>
          </div>
          {content.faqs?.map((faq, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b last:border-b-0"
              style={{ borderColor: dividerColor, backgroundColor: isDark ? (i % 2 === 0 ? "#0a0a0a" : "#111") : (i % 2 === 0 ? "white" : "#fafafa") }}
            >
              <div className="p-8 border-r" style={{ borderColor: dividerColor }}>
                <h3 className="text-base font-black leading-snug" style={{ color: textColor }}>{faq.question}</h3>
              </div>
              <div className="p-8">
                <p className="text-sm font-medium leading-relaxed" style={{ color: mutedColor }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function FAQRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
  templateId = 1,
  catalogPreviewSiteId,
}: {
  content: FAQContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
  templateId?: number;
  catalogPreviewSiteId?: string;
}) {
  const styles = getThemeStyles(themeId, primaryColor);
  const isDark = themeId === "4";
  const props: TemplateProps = { content, slug, themeId, primaryColor, styles, isDark };

  let body: ReactNode;
  switch (templateId) {
    case 2:
      body = <Template2 {...props} />;
      break;
    case 3:
      body = <Template3 {...props} />;
      break;
    case 4:
      body = <Template4 {...props} />;
      break;
    case 5:
      body = <Template5 {...props} />;
      break;
    default:
      body = <Template1 {...props} />;
  }

  return (
    <>
      {body}
      <SiteRelatedNavStrip
        relatedNav={content.relatedNav}
        slug={slug}
        primaryColor={primaryColor}
        isDark={isDark}
        catalogPreviewSiteId={catalogPreviewSiteId}
      />
    </>
  );
}
