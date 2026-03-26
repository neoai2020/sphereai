import Link from "next/link";
import { getThemeStyles } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Zap, Star, ShieldCheck } from "lucide-react";

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
  themeId = "1",
  primaryColor = "#4F46E5",
}: {
  content: LandingContent;
  productUrl: string | null;
  slug: string;
  themeId?: string;
  primaryColor?: string;
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
               <div className="flex flex-col sm:flex-row items-center gap-6">
                 <a
                    href={ctaHref}
                    className={styles.button}
                    style={themeId !== "4" && themeId !== "3" ? { backgroundColor: primaryColor } : {}}
                  >
                    {content.hero.ctaText}
                  </a>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm flex items-center justify-center">
                          <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt="avatar" />
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="flex gap-0.5"><Star size={10} className="fill-amber-400 text-amber-400" /><Star size={10} className="fill-amber-400 text-amber-400" /><Star size={10} className="fill-amber-400 text-amber-400" /></div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5">Trusted by 10k+</p>
                    </div>
                  </div>
               </div>
            </div>
            <div className="hidden lg:block relative">
               <div className="bg-white/50 backdrop-blur-3xl rounded-[3rem] p-4 border border-white/40 shadow-2xl relative z-10">
                 <div className="bg-gray-900 rounded-[2.5rem] aspect-video overflow-hidden flex items-center justify-center shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Software Preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                         <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2" />
                       </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {content.features && content.features.length > 0 && (
        <section className={cn(styles.section)}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Innovations</span>
              <h2 className={styles.heading}>Built for the Future</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {content.features.map((feature, i) => (
                <div
                  key={i}
                  className={cn(styles.card, "group")}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-brand-50 group-hover:scale-110 transition-transform shadow-inner" style={{ backgroundColor: primaryColor + '10' }}>
                    <ShieldCheck size={28} style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-brand-600 transition-colors" style={themeId === "4" ? { color: "white" } : {}}>
                    {feature.title}
                  </h3>
                  <p className={styles.text}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits - Two Column Layout */}
      {content.benefits && content.benefits.length > 0 && (
        <section className={cn(styles.section, "bg-gray-50/50")}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px]">
               <img src="https://images.unsplash.com/photo-1551288049-bbb652167c80?auto=format&fit=crop&q=80&w=1200" alt="Benefits" className="absolute inset-0 w-full h-full object-cover" />
               <div className="absolute inset-x-8 bottom-8 p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl">
                  <p className="text-gray-900 font-bold italic">"This turned our entire workflow into a high-speed engine of efficiency."</p>
                  <p className="text-sm font-black text-brand-600 uppercase tracking-widest mt-4">– John Doe, CEO @ ModernX</p>
               </div>
            </div>
            <div className="space-y-12">
              <h2 className={styles.heading}>Why Choose {slug}?</h2>
              <div className="grid gap-10">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border border-gray-100 shadow-sm group-hover:bg-brand-50 transition-colors">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900" style={themeId === "4" ? { color: "white" } : {}}>
                        {benefit.title}
                      </h3>
                      <p className={styles.text}>{benefit.description}</p>
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
