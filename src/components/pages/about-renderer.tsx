import type { ReactNode } from "react";
import { getThemeStyles } from "@/lib/themes";
import { SiteRelatedNavStrip } from "@/components/pages/site-related-nav";
import { cn } from "@/lib/utils";
import { Shield, Users, Target, Star, ArrowRight, Zap } from "lucide-react";

interface AboutContent {
  story?: { headline?: string; paragraphs?: string[] } | string;
  mission?: { headline?: string; text?: string } | string;
  values?: Array<{ title: string; description: string }>;
  team?: { headline?: string; description?: string } | Array<{ name: string; role: string }>;
  relatedNav?: Array<{ label: string; path: string }>;
}

function getString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    return val.text || val.description || val.paragraphs?.join(" ") || "";
  }
  return String(val);
}

const VALUE_ICONS = [Shield, Star, Zap, Target, Users];

// Template 1 (default): Story paragraphs box, 2-col mission+team cards, values list with icons
function Template1({
  content, productName, slug, themeId, primaryColor, styles,
  storyParagraphs, missionText, teamData, isDark,
}: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Our Story</span>
            <h1 className={styles.heading}>About {productName}</h1>
          </div>
          {storyParagraphs.length > 0 && (
            <div className="p-10 rounded-3xl border space-y-5" style={isDark ? { backgroundColor: "#111", borderColor: "#222" } : { backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}>
              {storyParagraphs.map((p: string, i: number) => (
                <p key={i} className={styles.text}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </section>

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
              <h2 className="text-2xl font-black text-gray-900" style={isDark ? { color: "white" } : {}}>Our Values</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {content.values.map((value, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: primaryColor + "15" }}>
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

// Template 2: "Bold Mission" — full-width colored banner with mission statement, then story, then values
function Template2({
  content, productName, slug, themeId, primaryColor, styles,
  storyParagraphs, missionText, teamData, isDark,
}: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Bold Mission Banner */}
      <section className="py-32 px-8" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-5xl mx-auto space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.5em] text-white/60">Our Mission</p>
          <h1 className="text-6xl font-black text-white leading-[0.95] tracking-tight">
            {(content.mission as any)?.headline || `About ${productName}`}
          </h1>
          {missionText && (
            <p className="text-2xl text-white/80 font-medium leading-relaxed max-w-3xl">{missionText}</p>
          )}
        </div>
      </section>

      {/* Story */}
      {storyParagraphs.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "#fafafa" }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: primaryColor }}>Our Story</p>
              <h2 className="text-3xl font-black leading-tight" style={isDark ? { color: "white" } : { color: "#0f172a" }}>How {productName} came to be</h2>
            </div>
            <div className="md:col-span-2 space-y-5">
              {storyParagraphs.map((p: string, i: number) => (
                <p key={i} className="text-lg font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team info */}
      {teamData && (
        <section className="py-16 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "white" }}>
          <div className="max-w-5xl mx-auto flex gap-8 items-center p-8 rounded-3xl" style={{ backgroundColor: primaryColor + "10", border: `1px solid ${primaryColor}20` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor + "20" }}>
              <Users size={28} style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="text-xl font-black mb-2" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{teamData.headline || "The Team"}</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{teamData.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {content.values && content.values.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#0a0a0a" } : { backgroundColor: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.4em] mb-12" style={{ color: primaryColor }}>Our Values</p>
            <div className="grid md:grid-cols-3 gap-8">
              {content.values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
                      <Icon size={20} style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-lg font-black" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{value.title}</h3>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 3: "Values First" — lead with 3-col values grid, then mission card, then story
function Template3({
  content, productName, slug, themeId, primaryColor, styles,
  storyParagraphs, missionText, teamData, isDark,
}: TemplateProps) {
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Header */}
      <section className="py-28 px-8 text-center" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#fafafa" }}>
        <p className="text-xs font-black uppercase tracking-[0.5em] mb-6" style={{ color: primaryColor }}>About Us</p>
        <h1 className="text-6xl font-black leading-tight" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{productName}</h1>
        <div className="w-16 h-1 mx-auto mt-8" style={{ backgroundColor: primaryColor }} />
      </section>

      {/* Values Grid — First */}
      {content.values && content.values.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "white" }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-16 text-center" style={isDark ? { color: "white" } : { color: "#0f172a" }}>What We Stand For</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <div key={i} className="p-8 rounded-3xl text-center space-y-4" style={isDark ? { backgroundColor: "#111", border: "1px solid #1f1f1f" } : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: primaryColor }}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-lg font-black" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{value.title}</h3>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mission Card */}
      {missionText && (
        <section className="py-20 px-8" style={isDark ? { backgroundColor: "#030303" } : {}}>
          <div className="max-w-4xl mx-auto">
            <div className="p-12 rounded-3xl" style={{ backgroundColor: primaryColor, color: "white" }}>
              <div className="flex items-start gap-6">
                <Target size={40} className="text-white/60 flex-shrink-0 mt-1" />
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white">{(content.mission as any)?.headline || "Our Mission"}</h2>
                  <p className="text-xl text-white/80 font-medium leading-relaxed">{missionText}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {teamData && (
        <section className="py-16 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "#fafafa" }}>
          <div className="max-w-4xl mx-auto flex gap-8 items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor + "20" }}>
              <Users size={28} style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="font-black text-xl mb-2" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{teamData.headline || "The Team"}</h3>
              <p className="font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{teamData.description}</p>
            </div>
          </div>
        </section>
      )}

      {/* Story — Last */}
      {storyParagraphs.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "white" }}>
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-black" style={isDark ? { color: "white" } : { color: "#0f172a" }}>Our Story</h2>
            {storyParagraphs.map((p: string, i: number) => (
              <p key={i} className="text-lg font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{p}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Template 4: "Split" — side-by-side large text + content for everything
function Template4({
  content, productName, slug, themeId, primaryColor, styles,
  storyParagraphs, missionText, teamData, isDark,
}: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const borderColor = isDark ? "#1f1f1f" : "#f1f5f9";
  return (
    <div className={cn(isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Split Header */}
      <section className="py-28 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#fafafa" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>About</p>
            <h1 className="text-7xl font-black leading-[0.9] tracking-tighter" style={{ color: textColor }}>{productName}</h1>
          </div>
          {storyParagraphs.length > 0 && (
            <div className="space-y-5">
              {storyParagraphs.slice(0, 2).map((p: string, i: number) => (
                <p key={i} className="text-lg font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Split Mission */}
      {missionText && (
        <section className="py-24 px-8 border-y" style={{ borderColor, backgroundColor: isDark ? "#080808" : "white" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
                <Target size={22} style={{ color: primaryColor }} />
              </div>
              <h2 className="text-4xl font-black leading-tight" style={{ color: textColor }}>{(content.mission as any)?.headline || "Our Mission"}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-medium leading-relaxed" style={{ color: mutedColor }}>{missionText}</p>
              {teamData && (
                <div className="mt-8 pt-8 border-t" style={{ borderColor }}>
                  <p className="font-black mb-2" style={{ color: textColor }}>{teamData.headline || "The Team"}</p>
                  <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{teamData.description}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Split Values */}
      {content.values && content.values.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#fafafa" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
                <Shield size={22} style={{ color: primaryColor }} />
              </div>
              <h2 className="text-4xl font-black" style={{ color: textColor }}>Our Values</h2>
              <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>The principles that guide everything we do.</p>
            </div>
            <div className="space-y-8">
              {content.values.map((value, i) => (
                <div key={i} className="border-l-2 pl-6" style={{ borderColor: primaryColor }}>
                  <h3 className="font-black text-base mb-1" style={{ color: textColor }}>{value.title}</h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: mutedColor }}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Remaining story paragraphs */}
      {storyParagraphs.length > 2 && (
        <section className="py-20 px-8 border-t" style={{ borderColor, backgroundColor: isDark ? "#080808" : "white" }}>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
            <div />
            <div className="space-y-5">
              {storyParagraphs.slice(2).map((p: string, i: number) => (
                <p key={i} className="text-lg font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 5: "Minimal" — clean text-only, no cards/boxes, large typography hierarchy
function Template5({
  content, productName, slug, themeId, primaryColor, styles,
  storyParagraphs, missionText, teamData, isDark,
}: TemplateProps) {
  const textColor = isDark ? "white" : "#0f172a";
  const mutedColor = isDark ? "rgb(156,163,175)" : "rgb(107,114,128)";
  const dividerColor = isDark ? "#1f1f1f" : "#f1f5f9";
  return (
    <div className={cn("max-w-2xl mx-auto px-8", isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Minimal Header */}
      <div className="py-32">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-10" style={{ color: primaryColor }}>About</p>
        <h1 className="text-7xl font-black leading-[0.9] tracking-tighter mb-12" style={{ color: textColor }}>{productName}</h1>
        {storyParagraphs.length > 0 && (
          <div className="space-y-5">
            {storyParagraphs.map((p: string, i: number) => (
              <p key={i} className="text-xl font-medium leading-relaxed" style={{ color: mutedColor }}>{p}</p>
            ))}
          </div>
        )}
      </div>

      {/* Divider + Mission */}
      {missionText && (
        <div className="py-16 border-t" style={{ borderColor: dividerColor }}>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-6" style={{ color: primaryColor }}>
            {(content.mission as any)?.headline || "Mission"}
          </p>
          <p className="text-2xl font-black leading-relaxed" style={{ color: textColor }}>{missionText}</p>
        </div>
      )}

      {/* Team */}
      {teamData && (
        <div className="py-16 border-t" style={{ borderColor: dividerColor }}>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-6" style={{ color: primaryColor }}>{teamData.headline || "Team"}</p>
          <p className="text-xl font-medium leading-relaxed" style={{ color: mutedColor }}>{teamData.description}</p>
        </div>
      )}

      {/* Values */}
      {content.values && content.values.length > 0 && (
        <div className="py-16 border-t border-b" style={{ borderColor: dividerColor }}>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-12" style={{ color: primaryColor }}>Values</p>
          <div className="space-y-10">
            {content.values.map((value, i) => (
              <div key={i}>
                <h3 className="text-xl font-black mb-2" style={{ color: textColor }}>{value.title}</h3>
                <p className="text-base font-medium leading-relaxed" style={{ color: mutedColor }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="py-16" />
    </div>
  );
}

interface TemplateProps {
  content: AboutContent;
  productName: string;
  slug: string;
  themeId: string;
  primaryColor: string;
  styles: ReturnType<typeof getThemeStyles>;
  storyParagraphs: string[];
  missionText: string;
  teamData: { headline?: string; description?: string } | null;
  isDark: boolean;
}

export function AboutRenderer({
  content,
  productName,
  slug,
  themeId = "1",
  primaryColor = "#4F46E5",
  templateId = 1,
  catalogPreviewSiteId,
}: {
  content: AboutContent;
  productName: string;
  slug: string;
  themeId?: string;
  primaryColor?: string;
  templateId?: number;
  /** DFY library preview: correct internal nav targets */
  catalogPreviewSiteId?: string;
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

  const props: TemplateProps = { content, productName, slug, themeId, primaryColor, styles, storyParagraphs, missionText, teamData, isDark };

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
