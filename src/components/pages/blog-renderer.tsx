import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface BlogContent {
  title: string;
  excerpt: string;
  sections: Array<{ type: string; content: string }>;
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

  return (
    <div className={cn(themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
      <article className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>AI Industry Analysis</span>
            <h1 className={cn(styles.heading, "leading-tight")}>{content.title}</h1>
            <p className="text-xl text-gray-400 font-medium italic">"{content.excerpt}"</p>
          </div>
          
          <div className="p-16 bg-gray-50/50 rounded-[4rem] border border-gray-100/50 space-y-12" style={themeId === "4" ? { backgroundColor: "#111", borderColor: "#222" } : {}}>
            {content.sections?.map((section, i) => (
              <div key={i} className="prose prose-xl prose-brand max-w-none">
                <p className={cn(styles.text, "leading-[1.8] text-gray-700")}>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
