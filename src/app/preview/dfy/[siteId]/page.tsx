import { notFound } from "next/navigation";
import Link from "next/link";
import { getDfySiteById } from "@/lib/dfy-catalog";
import { LandingRenderer } from "@/components/pages/landing-renderer";
import { AboutRenderer } from "@/components/pages/about-renderer";
import { FAQRenderer } from "@/components/pages/faq-renderer";
import { BlogRenderer } from "@/components/pages/blog-renderer";
import { ReviewsRenderer } from "@/components/pages/reviews-renderer";

export const dynamic = "force-dynamic";

const PAGE_TABS = ["landing", "about", "faq", "blog", "reviews"] as const;
type PageTab = (typeof PAGE_TABS)[number];

interface Props {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function DfyCatalogPreviewPage({ params, searchParams }: Props) {
  const { siteId: rawId } = await params;
  const siteId = decodeURIComponent(rawId);
  const { page: rawPage } = await searchParams;
  const page = (PAGE_TABS as readonly string[]).includes(rawPage || "")
    ? (rawPage as PageTab)
    : "landing";

  const site = getDfySiteById(siteId);
  if (!site) notFound();

  const tpl = site.selected_templates;
  const enc = encodeURIComponent(site.id);

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-1 border-b border-gray-200 bg-white/95 px-3 py-2 backdrop-blur-md">
        {PAGE_TABS.map((p) => (
          <Link
            key={p}
            href={`/preview/dfy/${enc}?page=${p}`}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
              page === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {p}
          </Link>
        ))}
      </nav>
      <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-amber-950">
        DFY catalog preview · {site.name} · L{tpl.landing} A{tpl.about} F{tpl.faq} B{tpl.blog} R{tpl.reviews} · {page}
      </div>

      {page === "landing" && (
        <LandingRenderer
          content={site.landingContent as never}
          productUrl={null}
          slug="preview"
          productName={site.name}
          themeId={site.theme_id}
          primaryColor={site.primary_color}
          heroImage={site.custom_images.hero}
          benefitsImage={site.custom_images.benefits}
          templateId={tpl.landing}
          catalogPreviewSiteId={site.id}
        />
      )}
      {page === "about" && (
        <AboutRenderer
          content={site.aboutContent as never}
          productName={site.name}
          slug="preview"
          themeId={site.theme_id}
          primaryColor={site.primary_color}
          templateId={tpl.about}
          catalogPreviewSiteId={site.id}
        />
      )}
      {page === "faq" && (
        <FAQRenderer
          content={site.faqContent as never}
          slug="preview"
          themeId={site.theme_id}
          primaryColor={site.primary_color}
          templateId={tpl.faq}
          catalogPreviewSiteId={site.id}
        />
      )}
      {page === "blog" && (
        <BlogRenderer
          content={site.blogContent as never}
          slug="preview"
          themeId={site.theme_id}
          primaryColor={site.primary_color}
          templateId={tpl.blog}
          catalogPreviewSiteId={site.id}
        />
      )}
      {page === "reviews" && (
        <ReviewsRenderer
          content={site.reviewsContent as never}
          slug="preview"
          themeId={site.theme_id}
          primaryColor={site.primary_color}
          templateId={tpl.reviews}
          catalogPreviewSiteId={site.id}
        />
      )}
    </div>
  );
}
