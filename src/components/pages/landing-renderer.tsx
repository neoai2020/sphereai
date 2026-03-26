import Link from "next/link";
import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Zap, Star, ShieldCheck, Sparkles, Rocket, Target } from "lucide-react";

const FEATURE_ICONS = [Zap, ShieldCheck, Rocket, Target, Sparkles, Star];

interface LandingContent {
  hero?: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  features?: Array<{
    title: string;
    description: string;
  }>;
  benefits?: Array<{
    title: string;
    description: string;
  }>;
  socialProof?: {
    headline: string;
    stats: Array<{ value: string; label: string }>;
  };
  cta?: {
    headline: string;
    description: string;
    buttonText: string;
  };
}

export function LandingRenderer({
  content,
  productUrl,
  slug,
  productName,
  themeId = "1",
  primaryColor = "#4F46E5",
  heroImage,
}: {
  content: LandingContent;
  productUrl: string | null;
  slug: string;
  productName?: string;
  themeId?: string;
  primaryColor?: string;
  heroImage?: string;
}) {
  const ctaHref = productUrl || "#";
  const styles = getThemeStyles(themeId, primaryColor);

  return (
    <div className={cn("overflow-x-hidden", themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
      {/* Hero */}
      {content.hero && (
        <section className={cn("py-32 px-6 text-center lg:text-left relative flex flex-col items-center justify-center min-h-[80vh]", 
          themeId === "1" && "bg-gradient-to-b from-brand-50 to-white",
          themeId === "4" && "bg-gradient-to-b from-gray-900 to-gray-950"
        )}>
          {themeId === "3" && (
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
               <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: primaryColor + '30' }} />
               <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]" style={{ backgroundColor: primaryColor + '20' }} />
            </div>
          )}
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-full border border-brand-100" style={{ backgroundColor: primaryColor + '10', borderColor: primaryColor + '20' }}>
                 <Zap size={14} style={{ color: primaryColor }} />
                 <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>AI-POWERED GENERATION</span>
               </div>
               <h1 className={cn(styles.heading, "leading-[1.]")}>
                {content.hero.headline}
               </h1>
               <p className={styles.text}>
                {content.hero.subheadline}
               </p>
               <div className="flex flex-row items-center gap-4 flex-wrap">
                 <a
                    href={ctaHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {content.hero.ctaText}
                  </a>
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/32?img=${i+10}`} alt="avatar" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">Trusted by 10k+</p>
                    </div>
                  </div>
               </div>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ backgroundColor: primaryColor }} />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/3]">
                  <img
                    src={heroImage || "https://images.unsplash.com/photo-1551288049-bbb652167c80?auto=format&fit=crop&q=80&w=1200"}
                    alt="Product Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section className={cn(styles.section, themeId === "4" ? "" : "bg-gray-50/40")}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Features</span>
              <h2 className="text-3xl font-black text-gray-900" style={themeId === "4" ? { color: "white" } : {}}>
                What makes it different
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div
                    key={i}
                    className="p-7 rounded-2xl border bg-white transition-all hover:border-gray-200"
                    style={themeId === "4" ? { backgroundColor: "#111", borderColor: "#222" } : { borderColor: "#f3f4f6" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: primaryColor + "12" }}
                    >
                      <Icon size={18} style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-2" style={themeId === "4" ? { color: "white" } : {}}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {content.benefits && content.benefits.length > 0 && (
        <section className={cn(styles.section)}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200"
                alt="Benefits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Why Us</span>
                <h2 className="text-3xl font-black text-gray-900" style={themeId === "4" ? { color: "white" } : {}}>
                  Why Choose {productName || content.hero?.headline?.split(" ").slice(0, 3).join(" ") || "This"}?
                </h2>
              </div>
              <div className="space-y-5">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: primaryColor + "15" }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 mb-1" style={themeId === "4" ? { color: "white" } : {}}>
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Stats */}
      {content.socialProof && (
        <section className="py-24 px-6 border-y border-gray-50 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {content.socialProof.stats?.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-5xl font-black tracking-tighter" style={{ color: primaryColor }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {content.cta && (
        <section className={cn("py-32 px-6", themeId === "4" ? "bg-brand-600" : "bg-gray-900")}>
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl font-black text-white tracking-tight">
              {content.cta.headline}
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {content.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
               <a
                href={ctaHref}
                className="px-12 py-5 rounded-2xl bg-white text-gray-950 font-black text-lg hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
              >
                {content.cta.buttonText}
              </a>
              <button className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-2 transition-transform">
                Watch Demo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
