/**
 * Pre-built JSON for DFY subpages (about, faq, blog, reviews).
 * Claim copies these into Supabase — no user-side generation.
 */

export type DfyRelatedLink = { label: string; path: string };

export const DFY_RELATED_NAV: DfyRelatedLink[] = [
  { label: "Home", path: "" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Reviews", path: "/reviews" },
];

function pick<T>(arr: T[], seed: number, offset = 0): T {
  return arr[(seed + offset) % arr.length];
}

export function buildDfyAboutContent(p: {
  name: string;
  type: string;
  description: string;
  niche: string;
  variantSeed: number;
}): Record<string, unknown> {
  const v = p.variantSeed;
  const focus = pick(
    ["conversion", "retention", "trust", "speed", "clarity", "scale"],
    v,
  );
  return {
    story: {
      headline: `Inside ${p.name}`,
      paragraphs: [
        `${p.name} was structured for ${p.type.toLowerCase()} buyers who scan fast, compare options, and only engage when the story feels specific.`,
        `The through-line is ${p.niche}: every section reinforces who it is for, what changes after signup, and why ${p.name} is credible.`,
        p.description,
      ],
    },
    mission: {
      headline: "What we optimize for",
      text: `We focus on ${focus}: fewer dead clicks, clearer offers, and pages that stay maintainable as your catalog or services evolve.`,
    },
    team: {
      headline: "Why this template works",
      description: `Pre-built copy blocks, stats, and FAQs are tuned for ${p.type.toLowerCase()} traffic. Swap details in Site Forge without breaking layout.`,
    },
    values: [
      {
        title: pick(["Radical clarity", "Proof-forward", "Operator-grade", "Human tone", "Systems thinking"], v, 0),
        description: "Sections answer the next question before visitors bounce to a competitor tab.",
      },
      {
        title: pick(["Launch velocity", "Editor-friendly", "SEO-ready", "Mobile-first", "Accessible rhythm"], v, 1),
        description: "Typography, spacing, and CTAs stay consistent across Home, About, Blog, FAQ, and Reviews.",
      },
      {
        title: pick(["Measured iteration", "Offer flexibility", "Lifecycle hooks", "Trust layering", "Brand room"], v, 2),
        description: "You can change headlines, colors, and templates per page without re-generating the whole site.",
      },
    ],
    relatedNav: DFY_RELATED_NAV,
  };
}

export function buildDfyFaqContent(p: {
  name: string;
  type: string;
  description: string;
  variantSeed: number;
}): Record<string, unknown> {
  const v = p.variantSeed;
  const pool: [string, string][] = [
    [
      `Is ${p.name} ready to publish out of the box?`,
      `Yes. Claiming copies pre-written landing, about, blog, FAQ, and reviews pages with static images and working internal navigation.`,
    ],
    [
      `Who is this ${p.type.toLowerCase()} kit for?`,
      `Teams that want a credible site immediately, then refine copy and offers in Site Forge without rebuilding structure.`,
    ],
    [
      "Do internal links work between pages?",
      "Navigation uses your live slug under /s/{slug} for Home, About, Blog, FAQ, and Reviews. No manual wiring required after claim.",
    ],
    [
      "Can I change colors and layout templates?",
      "Each page type has its own template id (1–5). Site Forge presets control theme_id and primary_color across the whole site.",
    ],
    [
      "What about images?",
      "Hero, benefits, and social proof images ship as static WebP files in /public — the same files every user sees until you replace them.",
    ],
    [
      "How is this different from generating pages on demand?",
      "Nothing is generated at claim time. Content and asset paths are copied from the DFY catalog into your project rows.",
    ],
    [
      `Will this work for ${p.type.toLowerCase()} SEO?`,
      "Meta descriptions and page titles are set per page. Expand keywords in your dashboard when you personalize the project.",
    ],
  ];
  const start = v % 3;
  const faqs = [0, 1, 2, 3, 4].map((j) => pool[(start + j) % pool.length]).map(([question, answer]) => ({
    question,
    answer,
  }));
  return {
    headline: `${p.name} — questions, answered`,
    faqs,
    relatedNav: DFY_RELATED_NAV,
  };
}

export function buildDfyBlogContent(p: {
  name: string;
  type: string;
  description: string;
  niche: string;
  variantSeed: number;
}): Record<string, unknown> {
  const v = p.variantSeed;
  const readM = 5 + (v % 6);
  return {
    headline: `How ${p.name} wins on ${p.type.toLowerCase()} landing pages`,
    author: pick(["Jordan Lee", "Sam Rivera", "Alex Chen", "Riley Park", "Casey Mora"], v),
    readTime: `${readM} min read`,
    publishDate: "2026-03-15",
    introduction: `${p.name} pairs a sharp hero with proof bands and FAQs that mirror how real ${p.type.toLowerCase()} buyers decide. This article walks through the page rhythm we ship — and how to keep it fresh without a rewrite.`,
    sections: [
      {
        heading: "Start with one promise",
        paragraphs: [
          `Your first screen should answer: who is this for, what outcome, and why ${p.name}. The DFY kit anchors that with ${p.niche} language already in place.`,
        ],
      },
      {
        heading: "Layer proof before the ask",
        paragraphs: [
          "Visitors compare three tabs at once. Stats, testimonials, and FAQs are ordered to reduce doubt before the primary CTA.",
        ],
        bulletPoints: [
          "Use real numbers in the stats row when you personalize.",
          "Swap testimonial quotes to match your niche voice.",
          "Keep one CTA above the fold; repeat at the close.",
        ],
      },
      {
        heading: "Connect pages with intent",
        paragraphs: [
          `About explains credibility, Blog educates, FAQ handles objections, and Reviews reinforces trust — each page links back to Home so journeys stay inside ${p.name}.`,
          p.description,
        ],
      },
    ],
    conclusion: `When you are ready, open Site Forge, tune ${p.name} for your offer, and keep the same structure that already works for ${p.type.toLowerCase()} traffic.`,
    relatedNav: DFY_RELATED_NAV,
  };
}

export function buildDfyReviewsContent(p: {
  name: string;
  type: string;
  variantSeed: number;
}): Record<string, unknown> {
  const v = p.variantSeed;
  const base = 110 + (v % 50);
  const t = p.type.toLowerCase();
  return {
    headline: `Why people recommend ${p.name}`,
    description: `Unified feedback from ${t} operators who wanted a credible site without a six-week build cycle.`,
    overallRating: 4.7 + (v % 4) * 0.05,
    totalReviews: base,
    reviews: [
      {
        name: pick(["Morgan Ellis", "Priya Shah", "Chris Nolan", "Taylor Brooks", "Jamie Ortiz"], v, 0),
        role: pick(["Founder", "Marketing lead", "GM", "Consultant", "Creator"], v, 1),
        rating: 5,
        text: `We claimed ${p.name} and had a full five-page site the same day. Internal links and images were already there; we only edited copy.`,
        date: "2026-02-12",
      },
      {
        name: pick(["Ren Kim", "Avery Cole", "Devon Watts", "Sam Patel", "Quinn Harper"], v, 2),
        role: pick(["COO", "Growth", "VP Sales", "Director", "Owner"], v, 3),
        rating: 5,
        text: `The layout matches our ${p.type.toLowerCase()} positioning. FAQ and reviews pages saved us from writing from a blank page.`,
        date: "2026-02-04",
      },
      {
        name: pick(["Logan Meyer", "Indira Rao", "Noah Bennett", "Skyler Fox", "Emery Lane"], v, 4),
        role: pick(["PM", "Analyst", "Partner", "Lead", "Strategist"], v, 5),
        rating: 4,
        text: "Templates vary by page so it does not feel like a single reused landing block. Site Forge made color changes trivial.",
        date: "2026-01-28",
      },
      {
        name: pick(["Rowan Tate", "Mina Cho", "Felix Grant", "Drew Alvarez", "Reese Young"], v, 6),
        role: pick(["Ops", "Brand", "Content", "Sales", "Product"], v, 7),
        rating: 5,
        text: `Static images loaded instantly compared to our old on-the-fly hero setup. ${p.name} felt production-ready immediately.`,
        date: "2026-01-19",
      },
    ],
    summary: {
      headline: "Built for launch day",
      text: `Average sentiment highlights speed, clarity, and complete pages — the same experience you get when you claim ${p.name}.`,
    },
    relatedNav: DFY_RELATED_NAV,
  };
}
