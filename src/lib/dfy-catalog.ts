/**
 * DFY Library: 180 unique catalog entries aligned with Site Forge (theme_id, colors, templates).
 * Hero + section images: /public/dfy/heroes/{id}.webp, {id}-benefits.webp, {id}-social.webp
 * Run: npm run generate:dfy-heroes
 */

import {
  buildDfyAboutContent,
  buildDfyBlogContent,
  buildDfyFaqContent,
  buildDfyReviewsContent,
  DFY_RELATED_NAV,
} from "@/lib/dfy-page-contents";

export const DFY_SITE_TYPES = [
  "E-commerce",
  "Service",
  "Portfolio",
  "Landing Page",
  "Blog",
  "Education",
  "Health/Medical",
  "Personal Branding",
  "Corporate",
] as const;

export type DfySiteType = (typeof DFY_SITE_TYPES)[number];

/** Mirrors SiteCustomizer STYLE_PRESETS for consistency */
const STYLE_PRESETS = [
  { name: "Clean", themeId: "1", primary: "#4F46E5", secondary: "#F3F4F6" },
  { name: "Minimal", themeId: "2", primary: "#1F2937", secondary: "#E5E7EB" },
  { name: "Royal", themeId: "3", primary: "#7C3AED", secondary: "#EDE9FE" },
  { name: "Dark", themeId: "4", primary: "#6366F1", secondary: "#1E293B" },
  { name: "Soft", themeId: "5", primary: "#F97316", secondary: "#FED7AA" },
  { name: "Ocean", themeId: "1", primary: "#3B82F6", secondary: "#BFDBFE" },
  { name: "Forest", themeId: "1", primary: "#10B981", secondary: "#A7F3D0" },
  { name: "Sunset", themeId: "5", primary: "#EC4899", secondary: "#FBCFE8" },
  { name: "Midnight", themeId: "4", primary: "#818CF8", secondary: "#1E1B4B" },
  { name: "Bold", themeId: "4", primary: "#EF4444", secondary: "#1F1F1F" },
  { name: "Warm", themeId: "5", primary: "#D97706", secondary: "#FDE68A" },
  { name: "Slate", themeId: "2", primary: "#475569", secondary: "#CBD5E1" },
  { name: "Arctic", themeId: "1", primary: "#0EA5E9", secondary: "#BAE6FD" },
  { name: "Ember", themeId: "5", primary: "#DC2626", secondary: "#FECACA" },
  { name: "Neon", themeId: "4", primary: "#00FF87", secondary: "#0D0D0D" },
] as const;

const FONT_ROTATION = [
  "Inter",
  "DM Sans",
  "Plus Jakarta Sans",
  "Manrope",
  "Outfit",
  "Space Grotesk",
] as const;

const PREFIXES = [
  "Nova", "Atlas", "Zenith", "Pulse", "Volt", "Echo", "Ridge", "Cobalt", "Lumen", "Stride",
  "Nexa", "Prism", "Vertex", "Halo", "Raven", "Mistral", "Quartz", "Aurora", "Cipher", "Forge",
] as const;

const MIDDLES = [
  "Cart", "Bloom", "Stack", "Vault", "Flow", "Craft", "Peak", "Scale", "Spark", "Drive",
  "Wave", "Nest", "Port", "Grid", "Lane", "Base", "Dock", "Field", "Mint", "Rift",
] as const;

const SUFFIXES = [
  "Labs", "Studio", "Hub", "Works", "Space", "Digital", "Collective", "Network", "Layer", "Frame",
  "Shift", "Core",
] as const;

const VISUAL_BY_TYPE: Record<DfySiteType, string> = {
  "E-commerce":
    "luxury ecommerce product still life soft shadows editorial retail hero abstract",
  Service:
    "professional services consulting office abstract trust minimal corporate hero",
  Portfolio:
    "creative portfolio designer workspace art direction moody gallery hero abstract",
  "Landing Page":
    "high conversion SaaS landing abstract gradient shapes startup hero cinematic",
  Blog:
    "editorial magazine reading nook typography calm content creator hero abstract",
  Education:
    "online learning campus light modern education technology hero abstract",
  "Health/Medical":
    "wellness clinic calm medical abstract soft light trustworthy hero",
  "Personal Branding":
    "personal brand speaker stage spotlight authentic portrait mood hero abstract",
  Corporate:
    "enterprise skyline boardroom glass architecture leadership hero abstract",
};

const MOODS = [
  "golden hour",
  "cool blue hour",
  "high contrast monochrome accent",
  "pastel minimal",
  "neon rim light",
  "film grain editorial",
  "soft diffusion",
  "geometric depth",
  "macro texture detail",
  "wide cinematic",
] as const;

const DESC_LEADS: Record<DfySiteType, string[]> = {
  "E-commerce": [
    "Curated SKUs, lifecycle email hooks, and checkout tuned for repeat buyers.",
    "Built for catalogs that need trust badges, urgency blocks, and clean PDP flow.",
    "Ship-ready merchandising story with seasonal collections and bundle CTAs.",
  ],
  Service: [
    "Lead capture, case-study proof, and booking-ready service pages out of the box.",
    "Positions your offer with authority sections and outcome-first messaging.",
    "Ideal for agencies, consultants, and local pros who sell expertise first.",
  ],
  Portfolio: [
    "Showcase grid, project storytelling, and press-ready case study rhythm.",
    "Built for creatives who need visual hierarchy without clutter.",
    "Case-forward layout with process, results, and referral-ready polish.",
  ],
  "Landing Page": [
    "Single-offer focus: hero, objection handling, and one primary conversion path.",
    "Perfect for launches, waitlists, and paid traffic with tight message match.",
    "Above-the-fold clarity with social proof bands and risk reversal.",
  ],
  Blog: [
    "Editorial rhythm with category hubs, author voice, and newsletter growth blocks.",
    "Structured for topical authority and internal linking at scale.",
    "Readable typography, digest modules, and share-friendly excerpts.",
  ],
  Education: [
    "Course catalog framing, curriculum highlights, and student outcome language.",
    "LMS-friendly structure with lesson previews and enrollment CTAs.",
    "Community and cohort positioning with clear next steps.",
  ],
  "Health/Medical": [
    "Calm, compliant tone with care-team credibility and appointment CTAs.",
    "Patient-first copy blocks with empathy-led headlines.",
    "Service lines, provider trust, and gentle urgency for consults.",
  ],
  "Personal Branding": [
    "Speaker-style positioning with media logos, topics, and booking flow.",
    "Founder narrative with signature framework and lead magnet hooks.",
    "Authority bio, signature story, and high-ticket offer alignment.",
  ],
  Corporate: [
    "Stakeholder-ready narrative: vision, divisions, and investor-grade clarity.",
    "Enterprise polish with solutions mapping and partner proof.",
    "Recruiting and brand trust layers without startup gimmicks.",
  ],
};

const HEADLINE_PATTERNS: string[] = [
  "Build momentum with {name}",
  "{name} — built for what’s next",
  "Lead with clarity. Ship with {name}",
  "Your edge starts at {name}",
  "Grow faster, stay sharp with {name}",
  "Make {type} feel effortless",
  "The modern stack for {type}",
  "Win trust before the first click",
  "Designed to convert {type} traffic",
  "Less noise. More {name}.",
];

const CTA_VERBS = [
  "Start free",
  "Book a demo",
  "See pricing",
  "Get the playbook",
  "Join the waitlist",
  "Explore the suite",
  "Talk to us",
  "Download the kit",
];

const FEATURE_POOL: { title: string; description: string }[][] = [
  [
    { title: "Conversion-ready layout", description: "Hero, proof, and CTA rhythm tuned for cold traffic." },
    { title: "SEO scaffolding", description: "Titles, meta patterns, and structured sections pre-wired." },
  ],
  [
    { title: "Speed-first structure", description: "Lean sections that load fast and read clean on mobile." },
    { title: "Trust architecture", description: "Social proof, guarantees, and credibility bands included." },
  ],
  [
    { title: "Offer clarity", description: "Single-minded messaging so visitors know the next step." },
    { title: "Lifecycle hooks", description: "Email capture and nurture-friendly copy placeholders." },
  ],
  [
    { title: "Brand flexibility", description: "Palette and template pairings you can remix in Site Forge." },
    { title: "Launch velocity", description: "Ship a credible site today; refine in the customizer." },
  ],
];

const FEATURED = [
  {
    id: "dfy-cartflow",
    name: "CartFlow",
    niche: "E-commerce Solutions",
    type: "E-commerce" as DfySiteType,
    description:
      "Artisan-forward storefront story with bundles, urgency-friendly modules, and lifecycle hooks for repeat buyers.",
  },
  {
    id: "dfy-lumina",
    name: "Lumina Labs",
    niche: "Agency / SaaS",
    type: "Service" as DfySiteType,
    description:
      "Productized services positioning with case-study cadence, ROI language, and demo-ready CTAs for B2B buyers.",
  },
  {
    id: "dfy-expert",
    name: "Expert Academy",
    niche: "Education / LMS",
    type: "Education" as DfySiteType,
    description:
      "Cohort and course narrative with curriculum previews, outcome metrics, and enrollment paths that feel premium.",
  },
];

export type DfySelectedTemplates = {
  landing: number;
  about: number;
  faq: number;
  blog: number;
  reviews: number;
};

export type DfyCustomImages = {
  hero: string;
  benefits: string;
  social: string;
};

export type DfySite = {
  id: string;
  name: string;
  niche: string;
  description: string;
  type: DfySiteType;
  /** Same as custom_images.hero — card + preview */
  image: string;
  custom_images: DfyCustomImages;
  posts: number;
  theme: string;
  theme_id: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  selected_templates: DfySelectedTemplates;
  previewHeadline: string;
  previewSubhead: string;
  previewCta: string;
  previewFeatures: Array<{ title: string; description: string }>;
  landingContent: Record<string, unknown>;
  aboutContent: Record<string, unknown>;
  faqContent: Record<string, unknown>;
  blogContent: Record<string, unknown>;
  reviewsContent: Record<string, unknown>;
  keywords: string[];
  target_audience: string;
  /** Stable integer for derived copy (posts modal, etc.) */
  variantSeed: number;
};

function stableSeedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h || 1;
}

/** Source URL used only by scripts/generate-dfy-heroes.ts to build static assets. */
export function pollinationsHeroUrl(seed: number, type: DfySiteType, brandName: string): string {
  const visual = VISUAL_BY_TYPE[type];
  const mood = MOODS[seed % MOODS.length];
  const prompt =
    `${visual}, ${mood}, ultra high quality, website hero, no text, no logo, no watermark, ${brandName.slice(0, 40)} brand mood`;
  const enc = encodeURIComponent(prompt.slice(0, 450));
  return `https://image.pollinations.ai/prompt/${enc}?width=1200&height=750&seed=${seed % 100000}&nologo=true`;
}

export function dfyHeroStaticPath(siteId: string): string {
  return `/dfy/heroes/${siteId}.webp`;
}

export function dfyBenefitsStaticPath(siteId: string): string {
  return `/dfy/heroes/${siteId}-benefits.webp`;
}

export function dfySocialStaticPath(siteId: string): string {
  return `/dfy/heroes/${siteId}-social.webp`;
}

function templatesForIndex(i: number): DfySelectedTemplates {
  return {
    landing: (i % 5) + 1,
    about: ((i * 3) % 5) + 1,
    faq: ((i * 5) % 5) + 1,
    blog: ((i * 7) % 5) + 1,
    reviews: ((i * 11) % 5) + 1,
  };
}

function generatedName(i: number): string {
  const p = PREFIXES[i % PREFIXES.length];
  const m = MIDDLES[(i * 3) % MIDDLES.length];
  const s = SUFFIXES[(i * 7) % SUFFIXES.length];
  return `${p} ${m} ${s}`;
}

function siteIdentityAtIndex(i: number): { id: string; name: string; type: DfySiteType } {
  const featured = i < FEATURED.length ? FEATURED[i] : undefined;
  const type = featured?.type ?? DFY_SITE_TYPES[i % DFY_SITE_TYPES.length];
  const id = featured?.id ?? `dfy-${i}`;
  const name = featured?.name ?? generatedName(i);
  return { id, name, type };
}

/** For scripts/generate-dfy-heroes.ts — same seeds as buildSiteAtIndex. */
export function listDfyHeroSources(): { id: string; sourceUrl: string }[] {
  return Array.from({ length: 180 }, (_, i) => {
    const { id, name, type } = siteIdentityAtIndex(i);
    const variantSeed = stableSeedFromId(id);
    return {
      id,
      sourceUrl: pollinationsHeroUrl(variantSeed + i * 9973, type, name),
    };
  });
}

function buildLandingPayload(site: {
  name: string;
  description: string;
  type: DfySiteType;
  previewHeadline: string;
  previewSubhead: string;
  previewCta: string;
  previewFeatures: Array<{ title: string; description: string }>;
  variantSeed: number;
}): Record<string, unknown> {
  const v = site.variantSeed;
  const stats = [
    { value: `${12 + (v % 8)}k+`, label: "Monthly visits" },
    { value: `${4 + (v % 5)}.${v % 10}`, label: "Avg. rating" },
    { value: `${30 + (v % 40)}%`, label: "Lift in leads" },
    { value: `${2 + (v % 4)}.${(v >> 2) % 10}s`, label: "Time to value" },
  ];
  const benefits = [
    {
      title: `Why teams pick ${site.name}`,
      description: site.description,
    },
    {
      title: `Built for ${site.type} buyers`,
      description:
        "Clear proof, sharp CTAs, and sections that answer objections before they stall the click.",
    },
  ];
  return {
    hero: {
      headline: site.previewHeadline,
      subheadline: site.previewSubhead,
      ctaText: site.previewCta,
    },
    features: site.previewFeatures,
    benefits,
    socialProof: {
      headline: "Trusted by operators who care about numbers",
      stats,
    },
    cta: {
      headline: `Ready to launch ${site.name}?`,
      description: "Claim this asset, open Site Forge, and swap copy, colors, or templates in minutes.",
      buttonText: site.previewCta,
    },
    relatedNav: DFY_RELATED_NAV,
  };
}

function keywordsFor(site: { name: string; type: DfySiteType; niche: string }): string[] {
  const base = site.type.toLowerCase().replace(/[^a-z]+/g, " ").trim().split(/\s+/).filter(Boolean);
  const extra = site.niche.toLowerCase().split(/[\s/]+/).filter((w) => w.length > 2).slice(0, 4);
  const brand = site.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  return Array.from(new Set([...brand, ...base, ...extra, "dfy", "siteforge"])).slice(0, 12);
}

function audienceFor(type: DfySiteType): string {
  const map: Record<DfySiteType, string> = {
    "E-commerce": "Online shoppers and catalog buyers",
    Service: "B2B buyers evaluating providers",
    Portfolio: "Hiring managers and creative clients",
    "Landing Page": "Cold traffic and paid acquisition",
    Blog: "Readers and newsletter subscribers",
    Education: "Students and course buyers",
    "Health/Medical": "Patients and local care seekers",
    "Personal Branding": "Fans, leads, and event bookers",
    Corporate: "Stakeholders, partners, and recruits",
  };
  return map[type];
}

function buildSiteAtIndex(i: number): DfySite {
  const { id, name, type } = siteIdentityAtIndex(i);
  const featured = i < FEATURED.length ? FEATURED[i] : undefined;
  const preset = STYLE_PRESETS[i % STYLE_PRESETS.length];
  const niche =
    featured?.niche ??
    `${type} — ${SUFFIXES[(i * 13) % SUFFIXES.length]} ${MIDDLES[(i * 17) % MIDDLES.length]}`;
  const descPool = DESC_LEADS[type];
  const description =
    featured?.description ??
    `${descPool[i % descPool.length]} ${PREFIXES[(i * 19) % PREFIXES.length]} positioning keeps your offer memorable.`;

  const variantSeed = stableSeedFromId(id);
  const custom_images: DfyCustomImages = {
    hero: dfyHeroStaticPath(id),
    benefits: dfyBenefitsStaticPath(id),
    social: dfySocialStaticPath(id),
  };
  const image = custom_images.hero;

  const headlineTpl = HEADLINE_PATTERNS[(i + variantSeed) % HEADLINE_PATTERNS.length]
    .replace("{name}", name)
    .replace("{type}", type.toLowerCase());
  const previewSubhead = description;
  const previewCta = CTA_VERBS[(i * 5 + variantSeed) % CTA_VERBS.length];
  const previewFeatures = FEATURE_POOL[(i + variantSeed) % FEATURE_POOL.length];

  const landingContent = buildLandingPayload({
    name,
    description,
    type,
    previewHeadline: headlineTpl,
    previewSubhead,
    previewCta,
    previewFeatures,
    variantSeed,
  });

  const aboutContent = buildDfyAboutContent({ name, type, description, niche, variantSeed });
  const faqContent = buildDfyFaqContent({ name, type, description, variantSeed });
  const blogContent = buildDfyBlogContent({ name, type, description, niche, variantSeed });
  const reviewsContent = buildDfyReviewsContent({ name, type: String(type), variantSeed });

  return {
    id,
    name,
    niche,
    description,
    type,
    image,
    custom_images,
    posts: 200,
    theme: preset.name,
    theme_id: preset.themeId,
    primary_color: preset.primary,
    secondary_color: preset.secondary,
    font_family: FONT_ROTATION[i % FONT_ROTATION.length],
    selected_templates: templatesForIndex(i),
    previewHeadline: headlineTpl,
    previewSubhead,
    previewCta,
    previewFeatures,
    landingContent,
    aboutContent,
    faqContent,
    blogContent,
    reviewsContent,
    keywords: keywordsFor({ name, type, niche }),
    target_audience: audienceFor(type),
    variantSeed,
  };
}

let cachedSites: DfySite[] | null = null;

export function getDfySites(): DfySite[] {
  if (cachedSites) return cachedSites;
  cachedSites = Array.from({ length: 180 }, (_, i) => buildSiteAtIndex(i));
  return cachedSites;
}

export function getDfySiteById(siteId: string): DfySite | undefined {
  return getDfySites().find((s) => s.id === siteId);
}

const POST_OPENERS = [
  "How to scale",
  "The playbook for",
  "Why operators choose",
  "Stop guessing with",
  "A practical guide to",
  "Lessons from",
  "The 2026 outlook for",
  "Winning workflows inside",
  "What changed in",
  "Build trust with",
] as const;

/** Sample post titles for the DFY posts modal (varies per site). */
export function dfyPostTitle(site: DfySite, i: number): string {
  const o = POST_OPENERS[(i + site.variantSeed) % POST_OPENERS.length];
  const angle = ["growth", "retention", "CAC", "content", "ops"][(i * 3 + site.variantSeed) % 5];
  return `${o} ${site.name} — ${site.type} ${angle}`;
}

/** Sample post body for the DFY posts modal. */
export function dfyPostBody(site: DfySite, i: number): string {
  const focus =
    [
      "audience clarity",
      "offer packaging",
      "proof and testimonials",
      "email follow-up",
      "on-page SEO structure",
    ][(i + site.variantSeed) % 5];
  return `This piece focuses on ${focus} for ${site.type.toLowerCase()} brands like ${site.name}. It maps a simple weekly rhythm: publish one strong story, reinforce it with a secondary touchpoint, and measure one north-star metric.\n\nKey moves:\n• Lead with a specific outcome your reader already wants\n• Use ${site.niche} language they recognize on day one\n• Close with one CTA — not three\n\n${site.description}\n\nTags: #${site.type.toLowerCase().replace(/\s+/g, "")} #${focus.replace(/\s+/g, "")} #marketing`;
}

/** Tag chips for the posts modal. */
export function dfyPostTags(site: DfySite, i: number): string[] {
  const pool = [
    `#${site.type.toLowerCase().replace(/\s+/g, "")}`,
    "#seo",
    "#conversion",
    "#content",
    "#growth",
    "#launch",
  ];
  return [pool[i % pool.length], pool[(i + 2) % pool.length], pool[(i + 4) % pool.length]];
}
