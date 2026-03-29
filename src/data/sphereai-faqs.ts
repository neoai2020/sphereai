/**
 * Product FAQs — keep in sync with Support + Training (FAQs tab).
 */
export type SphereAiFaq = { q: string; a: string };

export const SPHEREAI_FAQS: SphereAiFaq[] = [
  {
    q: "What is SphereAI?",
    a: "SphereAI is a dashboard for building AI- and search-friendly websites. You describe a product or service (or paste an affiliate link), and Site Forge generates a multi-page site with structured content aimed at traditional SEO and AI discovery.",
  },
  {
    q: "What is Site Forge and how do I create a site?",
    a: "Site Forge is the guided builder at Dashboard → Site Forge. You choose Affiliate or Service, enter your offer (name, description, optional URL, keywords), then run generation. The system creates a project and generates five page types in one flow: Landing, About, FAQ, Blog, and Reviews.",
  },
  {
    q: "What is the difference between Affiliate and Service projects?",
    a: "Both use the same page types. Affiliate is tuned for promoting an external product or link; Service is tuned for a business or offer you describe. Pick the type that best matches how you will use the site.",
  },
  {
    q: "What pages does each website include?",
    a: "Every project gets five pages: Landing (home), About, FAQ, Blog, and Reviews. Each can include titles, meta descriptions, block-based content, and JSON-LD-style schema helpers so search engines and AI systems can understand your pages.",
  },
  {
    q: "How does the Site Forge generation limit work?",
    a: "Most accounts can run up to **5 full Site Forge builds** per **rolling 24-hour window** (one new website = all five page types). Counts are stored on our servers in your `generations` history—not in your browser. **Infinite** subscribers have **no Site Forge daily cap**: generation checks are skipped for your account, and builds are not counted against the five-slot limit. Everyone else sees remaining slots in the builder; when you are at the limit, the next slot opens when your oldest build in the window is more than 24 hours old.",
  },
  {
    q: "What is Asset Vault?",
    a: "Asset Vault (Dashboard → Asset Vault) lists all your projects. Open a project to see pages, status, links to the public site, and editing options.",
  },
  {
    q: "Where is my live site URL?",
    a: "Published sites are served under your app’s public routes (typically `/s/your-project-slug` for the landing page, with paths like `/s/slug/about` for other pages). Exact links appear on each project in Asset Vault.",
  },
  {
    q: "How do I edit a page after generation?",
    a: "From Asset Vault, open a project and use the page editor for the page you want to change. Save updates there; the public preview reflects your stored content.",
  },
  {
    q: "Can Site Forge pull details from a product URL?",
    a: "Yes. When you provide a product URL in Site Forge, you can use scrape/fetch helpers (where enabled) to pre-fill description and context before you generate. Always review and adjust the text before publishing.",
  },
  {
    q: "What is the Logo Generator?",
    a: "Dashboard → Logo Generator lets you build a simple lettermark-style logo, generate one with AI from a text prompt, or upload an image. You can preview, download, and apply the logo to any of your projects via the project customize API from that page.",
  },
  {
    q: "What are 10x, Automation, Infinite, and DFY?",
    a: "They are premium areas: **10x** bulk-creates social-style post copy from an offer. **Automation** helps you produce platform-specific content and workflows from your site or link. **Infinite** focuses on unlimited-scale positioning and one-click translation of existing sites into more languages. **DFY** is a catalog of done-for-you site templates you can claim and attach to your account.",
  },
  {
    q: "Why don’t I see 10x, Automation, Infinite, or DFY in the sidebar?",
    a: "Those items appear when your account has the matching subscription flags (or equivalent bundled access). If you purchased an add-on and still don’t see a section, sign out and back in, then email support with your account email.",
  },
  {
    q: "How does Infinite translation work?",
    a: "With Infinite access, open Dashboard → Infinite, choose Translate, pick a website, and select a target language. The app sends your existing page content through translation and stores localized versions for that project.",
  },
  {
    q: "How does DFY claiming work?",
    a: "On the DFY page, browse prebuilt site types, preview them, and claim one you want. Claiming ties the template to your account so you can use it like other projects. Already-claimed sites show in your mapping so you don’t duplicate.",
  },
  {
    q: "What is Schema / structured data?",
    a: "Generated pages can include structured data (JSON-LD) alongside visible copy. That helps search engines and assistants understand entities on the page (organization, product, FAQs, etc.). It is not a ranking guarantee but is part of how SphereAI optimizes pages.",
  },
  {
    q: "Where are training videos?",
    a: "Dashboard → Training has Vimeo walkthroughs (Getting Started, Site Forge, Logo Generator). You can also open the FAQs tab on the same page for this question list.",
  },
  {
    q: "How do I contact support?",
    a: "Use Dashboard → Support for FAQs and links. Email **sphere@neoai.freshdesk.com** for tickets. Response times are typically within 24–48 hours; subscribed users may receive faster priority per the Support page.",
  },
  {
    q: "What is your refund policy?",
    a: "Support → Refund Protocol describes the 30-day satisfaction window, how to request a refund by email, and processing timelines. Always include your account details when writing in.",
  },
  {
    q: "Do you send email campaigns or validate leads for me?",
    a: "No. SphereAI does not send email campaigns or validate leads for you. The product is site generation and dashboard tools: Site Forge, Asset Vault, logo tools, and premium modules (10x, Automation, Infinite, DFY). If you use email or CRM tools, you connect them outside this dashboard unless a specific integration is documented.",
  },
];
