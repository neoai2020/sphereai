import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";

interface AboutContent {
  story?: string;
  mission?: string;
  vision?: string;
  team?: Array<{ name: string; role: string }>;
}

export function AboutRenderer({
  content,
  productName,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
}: {
  content: AboutContent;
  productName: string;
  slug: string;
  themeId?: string;
  primaryColor?: string;
}) {
  const styles = getThemeStyles(themeId, primaryColor);

  return (
    <div className={cn(themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-12 text-center lg:text-left">
          <h1 className={styles.heading}>About {productName}</h1>
          <div className="bg-gray-50/50 p-12 rounded-[3rem] border border-gray-100" style={themeId === "4" ? { backgroundColor: "#111", borderColor: "#222" } : {}}>
             <p className={styles.text}>{content.story}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className={styles.card}>
              <h3 className="text-xl font-black text-gray-900 mb-4" style={themeId === "4" ? { color: "white" } : {}}>Our Mission</h3>
              <p className={styles.text}>{content.mission}</p>
            </div>
            <div className={styles.card}>
              <h3 className="text-xl font-black text-gray-900 mb-4" style={themeId === "4" ? { color: "white" } : {}}>Our Vision</h3>
              <p className={styles.text}>{content.vision}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
