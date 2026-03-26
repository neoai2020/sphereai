import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Shield, Users, Target } from "lucide-react";

interface AboutContent {
  story?: { headline?: string; paragraphs?: string[] } | string;
  mission?: { headline?: string; text?: string } | string;
  values?: Array<{ title: string; description: string }>;
  team?: { headline?: string; description?: string } | Array<{ name: string; role: string }>;
}

function getString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val.text || val.description || val.paragraphs?.join(" ") || "";
  }
  return String(val);
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
  const isDark = themeId === "4";

  const storyParagraphs = Array.isArray((content.story as any)?.paragraphs)
    ? (content.story as any).paragraphs
    : getString(content.story) ? [getString(content.story)]
    : [];

  const missionText = typeof content.mission === "object" && !Array.isArray(content.mission)
    ? (content.mission as any).text || (content.mission as any).headline || ""
    : getString(content.mission);

  const teamData = typeof content.team === "object" && !Array.isArray(content.team)
    ? content.team as { headline?: string; description?: string }
    : null;

  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Hero */}
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
              Our Story
            </span>
            <h1 className={styles.heading}>About {productName}</h1>
          </div>

          {storyParagraphs.length > 0 && (
            <div
              className="p-10 rounded-3xl border space-y-5"
              style={isDark ? { backgroundColor: "#111", borderColor: "#222" } : { backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}
            >
              {storyParagraphs.map((p: string, i: number) => (
                <p key={i} className={styles.text}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mission + Values */}
      <section className={cn(styles.section, isDark ? "" : "bg-gray-50/50")}>
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            {missionText && (
              <div className={styles.card}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: primaryColor + "15" }}>
                  <Target size={22} style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3" style={isDark ? { color: "white" } : {}}>
                  {(content.mission as any)?.headline || "Our Mission"}
                </h3>
                <p className={styles.text}>{missionText}</p>
              </div>
            )}

            {teamData && (
              <div className={styles.card}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: primaryColor + "15" }}>
                  <Users size={22} style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3" style={isDark ? { color: "white" } : {}}>
                  {teamData.headline || "Why Trust Us"}
                </h3>
                <p className={styles.text}>{teamData.description}</p>
              </div>
            )}
          </div>

          {content.values && content.values.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900" style={isDark ? { color: "white" } : {}}>
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {content.values.map((value, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: primaryColor + "15" }}
                    >
                      <Shield size={15} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 mb-1" style={isDark ? { color: "white" } : {}}>{value.title}</h4>
                      <p className={cn(styles.text, "text-sm")}>{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
