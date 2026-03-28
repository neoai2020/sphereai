import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { getThemeStyles } from "@/lib/themes";
import { SiteRelatedNavStrip } from "@/components/pages/site-related-nav";
import { cn } from "@/lib/utils";
import { Check, ArrowRight, Zap, Star, ShieldCheck, Sparkles, Rocket, Target } from "lucide-react";

const FEATURE_ICONS = [Zap, ShieldCheck, Rocket, Target, Sparkles, Star];

// ─── Diverse Hero Image Pool ───────────────────────────────────────────────────
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600", // tech abstract
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600", // office modern
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1600", // ecommerce
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600", // team meeting
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600", // analytics
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600", // circuit tech
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1600", // workspace laptop
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1600", // portrait professional
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600", // startup team
  "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=1600", // coding laptop
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600", // developer
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1600", // office work
  "https://images.unsplash.com/photo-1477244075012-5cc28286e465?auto=format&fit=crop&q=80&w=1600", // city skyline
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1600", // web design
  "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=1600", // health wellness
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600", // mountain
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1600", // laptop code
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600", // collaboration
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600", // modern office
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1600", // finance
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600", // business
  "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=1600", // light bulb idea
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=1600", // gaming
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1600", // retail
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1600", // medical
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600", // coworking
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1600", // education
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1600", // saas dashboard
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600", // video call
  "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&q=80&w=1600", // e-learning
];

/** Deterministic image selection based on the project slug/name so each site gets a unique image */
function getHeroImage(seed?: string): string {
  if (!seed) return HERO_IMAGES[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return HERO_IMAGES[Math.abs(hash) % HERO_IMAGES.length];
}

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
  relatedNav?: Array<{ label: string; path: string }>;
}

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
    </div>
  );
}

// Template 1: Split hero (left text, right image), 3-col feature cards, 2-col benefits, stats bar, dark CTA
function Template1({
  content, ctaHref, themeId, primaryColor, heroImage, benefitsImage, productName, styles,
}: {
  content: LandingContent; ctaHref: string; themeId: string; primaryColor: string;
  heroImage?: string; benefitsImage?: string; productName?: string; styles: ReturnType<typeof getThemeStyles>;
}) {
  return (
    <div className={cn("overflow-x-hidden", themeId === "4" ? "bg-gray-950 text-white" : "bg-white")}>
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
              <h1 className={cn(styles.heading, "leading-[1.1]")}>{content.hero.headline}</h1>
              <p className={styles.text}>{content.hero.subheadline}</p>
              <div className="flex flex-row items-center gap-4 flex-wrap">
                <a href={ctaHref} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>
                  {content.hero.ctaText}
                </a>
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                        <Image src={`https://i.pravatar.cc/32?img=${i+10}`} alt="avatar" width={32} height={32} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <StarRow />
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Trusted by 10k+</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ backgroundColor: primaryColor }} />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-[4/3]">
                  <Image src={heroImage || getHeroImage(productName)} alt="Product Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {content.features && content.features.length > 0 && (
        <section className={cn(styles.section, themeId === "4" ? "" : "bg-gray-50/40")}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>Features</span>
              <h2 className="text-3xl font-black text-gray-900" style={themeId === "4" ? { color: "white" } : {}}>What makes it different</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div key={i} className="p-7 rounded-2xl border bg-white transition-all hover:border-gray-200" style={themeId === "4" ? { backgroundColor: "#111", borderColor: "#222" } : { borderColor: "#f3f4f6" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: primaryColor + "12" }}>
                      <Icon size={18} style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-2" style={themeId === "4" ? { color: "white" } : {}}>{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <section className={cn(styles.section)}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image src={benefitsImage || heroImage || getHeroImage((productName || "") + "_benefits")} alt="Benefits" fill className="object-cover" />
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
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: primaryColor + "15" }}>
                      <Check className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-gray-900 mb-1" style={themeId === "4" ? { color: "white" } : {}}>{benefit.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {content.socialProof && (
        <section className="py-24 px-6 border-y border-gray-50 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {content.socialProof.stats?.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-5xl font-black tracking-tighter" style={{ color: primaryColor }}>{stat.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.cta && (
        <section className={cn("py-32 px-6", themeId === "4" ? "bg-brand-600" : "bg-gray-900")}>
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl font-black text-white tracking-tight">{content.cta.headline}</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">{content.cta.description}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <a href={ctaHref} className="px-12 py-5 rounded-2xl bg-white text-gray-950 font-black text-lg hover:bg-gray-100 transition-all shadow-2xl active:scale-95">{content.cta.buttonText}</a>
              <button className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-2 transition-transform">Watch Demo <ArrowRight size={16} /></button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 2: "Centered" — centered hero text, image below hero, 2-col features, stats bar, light CTA
function Template2({
  content, ctaHref, themeId, primaryColor, heroImage, productName, styles,
  benefitsImage: _benefitsImage,
}: {
  content: LandingContent; ctaHref: string; themeId: string; primaryColor: string;
  heroImage?: string; benefitsImage?: string; productName?: string; styles: ReturnType<typeof getThemeStyles>;
}) {
  const isDark = themeId === "4";
  return (
    <div className={cn("overflow-x-hidden", isDark ? "bg-gray-950 text-white" : "bg-white")}>
      {content.hero && (
        <section className="py-28 px-6 text-center" style={isDark ? { background: "linear-gradient(180deg,#0f172a,#030712)" } : { background: "linear-gradient(180deg,#f8faff,#ffffff)" }}>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border" style={{ color: primaryColor, borderColor: primaryColor + "30", backgroundColor: primaryColor + "08" }}>
              <Sparkles size={12} /> New Release
            </div>
            <h1 className="text-6xl font-black leading-[1.05] tracking-tight" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{content.hero.headline}</h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">{content.hero.subheadline}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={ctaHref} className="px-10 py-4 rounded-full font-black text-white shadow-xl hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>{content.hero.ctaText}</a>
              <a href="#features" className="px-10 py-4 rounded-full font-black border-2 hover:bg-gray-50 transition-all" style={isDark ? { color: "white", borderColor: "#333" } : { color: "#0f172a", borderColor: "#e2e8f0" }}>See Features</a>
            </div>
          </div>
          {(heroImage || true) && (
            <div className="mt-16 max-w-5xl mx-auto relative">
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-10" style={{ backgroundColor: primaryColor }} />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-video">
                <Image src={heroImage || getHeroImage(productName)} alt="Product" fill className="object-cover" />
              </div>
            </div>
          )}
        </section>
      )}

      {content.features && content.features.length > 0 && (
        <section id="features" className="py-24 px-6" style={isDark ? { backgroundColor: "#0a0a0a" } : { backgroundColor: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4" style={isDark ? { color: "white" } : { color: "#0f172a" }}>Everything you need</h2>
              <p className="text-gray-500 text-lg font-medium">Powerful features built for modern teams</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div key={i} className="flex gap-5 p-6 rounded-2xl border" style={isDark ? { backgroundColor: "#111", borderColor: "#1f1f1f" } : { backgroundColor: "white", borderColor: "#e2e8f0" }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: primaryColor + "15" }}>
                      <Icon size={20} style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-black text-base mb-1.5" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{feature.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <section className="py-24 px-6" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "white" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black mb-12 text-center" style={isDark ? { color: "white" } : { color: "#0f172a" }}>
              Why choose {productName || "us"}?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="p-6 rounded-2xl border text-center" style={isDark ? { backgroundColor: "#0d0d0d", borderColor: "#1f1f1f" } : { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: primaryColor + "15" }}>
                    <Check size={16} style={{ color: primaryColor }} />
                  </div>
                  <h3 className="font-black text-sm mb-2" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.socialProof && (
        <section className="py-20 px-6" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.socialProof.stats?.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.cta && (
        <section className="py-28 px-6" style={isDark ? { backgroundColor: "#0a0a0a" } : { backgroundColor: "#f0f4ff" }}>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-black" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{content.cta.headline}</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">{content.cta.description}</p>
            <a href={ctaHref} className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-white shadow-xl hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>
              {content.cta.buttonText} <ArrowRight size={18} />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 3: "Bold" — full dark hero with gradient + image overlay, accent-colored feature section, dark CTA
function Template3({
  content, ctaHref, themeId, primaryColor, heroImage, productName, styles,
  benefitsImage: _benefitsImage,
}: {
  content: LandingContent; ctaHref: string; themeId: string; primaryColor: string;
  heroImage?: string; benefitsImage?: string; productName?: string; styles: ReturnType<typeof getThemeStyles>;
}) {
  const isDark = themeId === "4";
  return (
    <div className="overflow-x-hidden bg-gray-950 text-white">
      {content.hero && (
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src={heroImage || getHeroImage(productName)} alt="Hero" fill className="object-cover opacity-30" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}99 0%, #000000ee 60%)` }} />
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-8 py-32 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/20 bg-white/5 backdrop-blur-sm">
              <Zap size={12} style={{ color: primaryColor }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Next Generation</span>
            </div>
            <h1 className="text-7xl font-black leading-[0.95] tracking-tight uppercase max-w-3xl">{content.hero.headline}</h1>
            <p className="text-xl text-white/70 font-medium max-w-xl leading-relaxed">{content.hero.subheadline}</p>
            <div className="flex items-center gap-6">
              <a href={ctaHref} className="px-10 py-4 font-black text-gray-950 uppercase tracking-widest text-sm hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>
                {content.hero.ctaText}
              </a>
              <button className="flex items-center gap-2 text-white/60 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-colors">
                Learn More <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {content.features && content.features.length > 0 && (
        <section className="py-24 px-8" style={{ backgroundColor: primaryColor + "12", borderTop: `2px solid ${primaryColor}30` }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1" style={{ backgroundColor: primaryColor + "40" }} />
              <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Core Features</span>
              <div className="h-px flex-1" style={{ backgroundColor: primaryColor + "40" }} />
            </div>
            <div className="grid md:grid-cols-3 gap-0 border border-white/10">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div key={i} className="p-8 border-r border-b border-white/10 hover:bg-white/5 transition-colors">
                    <Icon size={32} className="mb-6" style={{ color: primaryColor }} />
                    <h3 className="text-lg font-black text-white uppercase tracking-wide mb-3">{feature.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <section className="py-24 px-8 bg-gray-900">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-white uppercase tracking-tight">
                Why {productName || "us"}
              </h2>
              <div className="h-1 w-16" style={{ backgroundColor: primaryColor }} />
            </div>
            <div className="space-y-6">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-5 items-start border-b border-white/10 pb-6">
                  <span className="text-3xl font-black tabular-nums" style={{ color: primaryColor + "60" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-black text-white text-base uppercase tracking-wide mb-1">{benefit.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.socialProof && (
        <section className="py-20 px-8 border-y border-white/10">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.socialProof.stats?.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-black tracking-tighter" style={{ color: primaryColor }}>{stat.value}</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.cta && (
        <section className="py-32 px-8" style={{ background: `linear-gradient(135deg, ${primaryColor}20, #000)` }}>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-6xl font-black text-white uppercase tracking-tight">{content.cta.headline}</h2>
            <p className="text-white/50 text-lg font-medium leading-relaxed max-w-2xl mx-auto">{content.cta.description}</p>
            <a href={ctaHref} className="inline-block px-16 py-5 font-black uppercase tracking-widest text-gray-950 hover:opacity-90 transition-all" style={{ backgroundColor: primaryColor }}>
              {content.cta.buttonText}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 4: "Minimal" — no hero image, large centered headline, horizontal feature list, minimal CTA
function Template4({
  content, ctaHref, themeId, primaryColor, productName, styles,
  heroImage: _heroImage,
  benefitsImage: _benefitsImage,
}: {
  content: LandingContent; ctaHref: string; themeId: string; primaryColor: string;
  heroImage?: string; benefitsImage?: string; productName?: string; styles: ReturnType<typeof getThemeStyles>;
}) {
  const isDark = themeId === "4";
  const textColor = isDark ? "white" : "#0f172a";
  return (
    <div className={cn("overflow-x-hidden", isDark ? "bg-gray-950" : "bg-white")}>
      {content.hero && (
        <section className="py-40 px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <p className="text-xs font-black uppercase tracking-[0.5em]" style={{ color: primaryColor }}>{productName || "Product"}</p>
            <h1 className="text-8xl font-black leading-[0.9] tracking-tighter" style={{ color: textColor }}>{content.hero.headline}</h1>
            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: primaryColor }} />
            <p className="text-xl font-medium leading-relaxed max-w-2xl mx-auto" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{content.hero.subheadline}</p>
            <a href={ctaHref} className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em] border-b-2 pb-1 hover:gap-5 transition-all" style={{ color: primaryColor, borderColor: primaryColor }}>
              {content.hero.ctaText} <ArrowRight size={14} />
            </a>
          </div>
        </section>
      )}

      {content.features && content.features.length > 0 && (
        <section className="px-8 pb-24" style={isDark ? { borderTop: "1px solid #1f1f1f" } : { borderTop: "1px solid #f1f5f9" }}>
          <div className="max-w-5xl mx-auto">
            <div className="py-12 border-b mb-12" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#f1f5f9" }}>
              <p className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(148,163,184)" }}>What we offer</p>
            </div>
            <div className="space-y-0">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <div key={i} className="flex items-start gap-8 py-8 border-b" style={isDark ? { borderColor: "#1f1f1f" } : { borderColor: "#f1f5f9" }}>
                    <Icon size={20} className="mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <h3 className="font-black text-lg" style={{ color: textColor }}>{feature.title}</h3>
                      <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{feature.description}</p>
                    </div>
                    <span className="text-xs font-black tabular-nums" style={{ color: isDark ? "#333" : "#e2e8f0" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#050505" } : { backgroundColor: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: primaryColor }}>Benefits</p>
              <h2 className="text-4xl font-black leading-tight" style={{ color: textColor }}>
                Why {productName || "this"} works
              </h2>
            </div>
            <div className="space-y-8">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="font-black" style={{ color: textColor }}>{benefit.title}</h3>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.socialProof && (
        <section className="py-20 px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {content.socialProof.stats?.map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-black tabular-nums" style={{ color: primaryColor }}>{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2" style={{ color: isDark ? "rgb(75,85,99)" : "rgb(156,163,175)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {content.cta && (
        <section className="py-32 px-8" style={isDark ? { borderTop: "1px solid #1f1f1f" } : { borderTop: "1px solid #f1f5f9" }}>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-center gap-10">
            <div className="flex-1 space-y-3">
              <h2 className="text-3xl font-black" style={{ color: textColor }}>{content.cta.headline}</h2>
              <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{content.cta.description}</p>
            </div>
            <a href={ctaHref} className="inline-flex items-center gap-3 px-8 py-4 font-black text-sm border-2 hover:opacity-90 transition-all flex-shrink-0" style={{ color: isDark ? "white" : "#0f172a", borderColor: isDark ? "white" : "#0f172a" }}>
              {content.cta.buttonText} <ArrowRight size={14} />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

// Template 5: "Magazine" — large full-width image header with text overlay, alternating content sections, colored stats
function Template5({
  content, ctaHref, themeId, primaryColor, heroImage, productName, styles,
  benefitsImage: _benefitsImage,
}: {
  content: LandingContent; ctaHref: string; themeId: string; primaryColor: string;
  heroImage?: string; benefitsImage?: string; productName?: string; styles: ReturnType<typeof getThemeStyles>;
}) {
  const isDark = themeId === "4";
  return (
    <div className={cn("overflow-x-hidden", isDark ? "bg-gray-950" : "bg-white")}>
      {content.hero && (
        <section className="relative h-[90vh] flex items-end overflow-hidden">
          <Image src={heroImage || getHeroImage(productName)} alt="Hero" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-8 pb-20 w-full">
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-8" style={{ backgroundColor: primaryColor }} />
                <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>{productName || "Featured"}</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tight">{content.hero.headline}</h1>
              <p className="text-xl text-white/70 font-medium leading-relaxed max-w-xl">{content.hero.subheadline}</p>
              <a href={ctaHref} className="inline-flex items-center gap-3 px-8 py-4 font-black text-gray-950 hover:opacity-90 active:scale-95 transition-all" style={{ backgroundColor: primaryColor }}>
                {content.hero.ctaText} <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      )}

      {content.features && content.features.length > 0 && (
        <section className="py-24 px-8" style={isDark ? { backgroundColor: "#080808" } : { backgroundColor: "#fafafa" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0">
              {content.features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                const isEven = i % 2 === 0;
                return (
                  <div key={i} className="relative overflow-hidden" style={isDark ? { borderBottom: "1px solid #1a1a1a", borderRight: isEven ? "1px solid #1a1a1a" : undefined } : { borderBottom: "1px solid #ececec", borderRight: isEven ? "1px solid #ececec" : undefined }}>
                    <div className="p-10">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-2xl" style={{ backgroundColor: primaryColor + "15" }}>
                          <Icon size={24} style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black mb-3" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{feature.title}</h3>
                          <p className="text-sm font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {content.benefits && content.benefits.length > 0 && (
        <div>
          {content.benefits.map((benefit, i) => {
            const isEven = i % 2 === 0;
            return (
              <section key={i} className="py-20 px-8" style={isDark ? { backgroundColor: i % 2 === 0 ? "#050505" : "#0a0a0a" } : { backgroundColor: i % 2 === 0 ? "white" : "#f8fafc" }}>
                <div className={cn("max-w-5xl mx-auto flex items-center gap-16", !isEven && "flex-row-reverse")}>
                  <div className="flex-1 space-y-4">
                    <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: primaryColor }}>Benefit {i + 1}</span>
                    <h2 className="text-4xl font-black leading-tight" style={isDark ? { color: "white" } : { color: "#0f172a" }}>{benefit.title}</h2>
                    <p className="text-lg font-medium leading-relaxed" style={{ color: isDark ? "rgb(156,163,175)" : "rgb(107,114,128)" }}>{benefit.description}</p>
                  </div>
                  <div className="w-64 h-64 flex-shrink-0 rounded-3xl flex items-center justify-center" style={{ backgroundColor: primaryColor + "10", border: `2px solid ${primaryColor}20` }}>
                    <Check size={64} style={{ color: primaryColor + "60" }} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {content.socialProof && (
        <section className="py-24 px-8" style={{ backgroundColor: primaryColor }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs font-black uppercase tracking-[0.5em] text-white/60 mb-16">{content.socialProof.headline}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {content.socialProof.stats?.map((stat, i) => (
                <div key={i} className="text-center border-r border-white/20 last:border-r-0">
                  <p className="text-5xl font-black text-white">{stat.value}</p>
                  <p className="text-xs font-black text-white/60 uppercase tracking-[0.3em] mt-3">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {content.cta && (
        <section className="py-32 px-8" style={isDark ? { backgroundColor: "#030303" } : { backgroundColor: "#0f172a" }}>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white leading-tight">{content.cta.headline}</h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed">{content.cta.description}</p>
            </div>
            <div className="flex flex-col gap-4">
              <a href={ctaHref} className="px-10 py-5 font-black text-gray-950 text-center hover:opacity-90 active:scale-95 transition-all rounded-xl" style={{ backgroundColor: primaryColor }}>
                {content.cta.buttonText}
              </a>
              <button className="flex items-center justify-center gap-2 text-white/40 font-black text-xs uppercase tracking-[0.3em] hover:text-white transition-colors">
                Learn more <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function LandingRenderer({
  content,
  productUrl,
  slug,
  productName,
  themeId = "1",
  primaryColor = "#4F46E5",
  heroImage,
  benefitsImage,
  templateId = 1,
  catalogPreviewSiteId,
}: {
  content: LandingContent;
  productUrl: string | null;
  slug: string;
  productName?: string;
  themeId?: string;
  primaryColor?: string;
  heroImage?: string;
  benefitsImage?: string;
  templateId?: number;
  catalogPreviewSiteId?: string;
}) {
  const ctaHref = productUrl || "#";
  const styles = getThemeStyles(themeId, primaryColor);
  const props = { content, ctaHref, themeId, primaryColor, heroImage, benefitsImage, productName, styles };
  const isDark = themeId === "4";

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
