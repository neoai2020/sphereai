import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface FAQContent {
  headline?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function FAQRenderer({
  content,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
}: {
  content: FAQContent;
  slug: string;
  themeId?: string;
  primaryColor?: string;
}) {
  const styles = getThemeStyles(themeId, primaryColor);

  return (
    <div className={cn(themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className={styles.heading}>{content.headline || "Common Questions"}</h1>
            <p className={styles.text}>Everything you need to know about our solution.</p>
          </div>
          
          <div className="grid gap-6">
            {content.faqs?.map((faq, i) => (
              <div
                key={i}
                className={cn(styles.card, "group cursor-pointer")}
              >
                <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-brand-600 transition-colors" style={themeId === "4" ? { color: "white" } : {}}>
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
