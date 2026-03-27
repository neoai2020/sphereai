import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { LandingRenderer } from "@/components/pages/landing-renderer";
import { AboutRenderer } from "@/components/pages/about-renderer";
import { FAQRenderer } from "@/components/pages/faq-renderer";
import { BlogRenderer } from "@/components/pages/blog-renderer";
import { ReviewsRenderer } from "@/components/pages/reviews-renderer";
import { WebsiteLayout } from "@/components/pages/WebsiteLayout";
import type { PageType } from "@/types/database";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length < 2) return { title: "Not Found" };

  const [username, projectIdOrSlug, pageType] = slug;
  const supabase = createServiceClient();

  // Safer check for ID vs Slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectIdOrSlug);
  
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq(isUuid ? "id" : "slug", projectIdOrSlug)
    .single();

  if (projectErr || !project) {
    console.error("Project lookup failed:", projectErr, "for slug:", projectIdOrSlug);
    return { title: "Not Found" };
  }

  const activePageType = (pageType || "landing") as PageType;

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", activePageType)
    .single();

  return {
    title: page?.title || project.product_name,
    description: page?.meta_description || project.product_description,
    openGraph: {
      title: page?.title || project.product_name,
      description: page?.meta_description || project.product_description,
      type: activePageType === "blog" ? "article" : "website",
    },
    // AI Crawler optimization: robots tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function SoftwarePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  if (!slug || slug.length < 2) notFound();

  const [username, projectIdOrSlug, pageType] = slug;
  const supabase = createServiceClient();

  // Safer check for ID vs Slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectIdOrSlug);

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*")
    .eq(isUuid ? "id" : "slug", projectIdOrSlug)
    .single();

  if (projectErr || !project) {
    console.error("Project lookup failed in Page:", projectErr, "for slug:", projectIdOrSlug);
    notFound();
  }

  const activePageType = (pageType || "landing") as PageType;
  const requestedLang = sp.lang ? decodeURIComponent(sp.lang) : null;

  // Try to find the page, even if not explicitly marked as published
  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", activePageType)
    .single();

  if (pageErr || !page) {
    // Show a friendly placeholder instead of a 404 when page content hasn't been generated yet
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4 px-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Page is being generated…</h2>
          <p className="text-sm text-gray-400 max-w-xs">Your content is being built. This usually takes a few seconds. Refresh to check.</p>
        </div>
      </div>
    );
  }

  // If ?lang=X is set, try to load translated content from project_translations
  let content = page.content as Record<string, unknown>;
  if (requestedLang) {
    const { data: translation } = await supabase
      .from("project_translations")
      .select("content")
      .eq("project_id", project.id)
      .eq("language", requestedLang)
      .eq("page_type", activePageType)
      .single();
    if (translation?.content) {
      content = translation.content as Record<string, unknown>;
    }
  }
  const baseUrl = `/software/${username}/${projectIdOrSlug}`;

  // URL param overrides for live customizer preview (prefixed with __)
  const projectTpls = (project as any).selected_templates || {};
  const effectiveThemeId  = sp.__theme || project.theme_id;
  const effectiveColor    = sp.__color ? decodeURIComponent(sp.__color) : project.primary_color;
  const effectiveProductUrl = sp.__url ? decodeURIComponent(sp.__url) : project.product_url;
  const effectiveTemplate = sp.__tpl ? Number(sp.__tpl) : (projectTpls[activePageType] || 1);

  return (
    <WebsiteLayout project={{ ...project, theme_id: effectiveThemeId, primary_color: effectiveColor }} activePath={`${baseUrl}/${pageType || ""}`}>
      {/* AI Semantic Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(page.schema_markup || {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page.title,
            "description": page.meta_description,
            "publisher": {
              "@type": "Organization",
              "name": "SphereAI SiteForge"
            }
          }),
        }}
      />

      {activePageType === "landing" && (
        <LandingRenderer
          content={content as any}
          productUrl={effectiveProductUrl}
          slug={project.slug}
          productName={project.product_name}
          themeId={effectiveThemeId}
          primaryColor={effectiveColor}
          heroImage={(project.custom_images as any)?.hero}
          templateId={effectiveTemplate}
        />
      )}
      {activePageType === "about" && (
        <AboutRenderer
          content={content as any}
          productName={project.product_name}
          slug={project.slug}
          themeId={effectiveThemeId}
          primaryColor={effectiveColor}
          templateId={effectiveTemplate}
        />
      )}
      {activePageType === "faq" && (
        <FAQRenderer
          content={content as any}
          slug={project.slug}
          themeId={effectiveThemeId}
          primaryColor={effectiveColor}
          templateId={effectiveTemplate}
        />
      )}
      {activePageType === "blog" && (
        <BlogRenderer
          content={content as any}
          slug={project.slug}
          themeId={effectiveThemeId}
          primaryColor={effectiveColor}
          templateId={effectiveTemplate}
        />
      )}
      {activePageType === "reviews" && (
        <ReviewsRenderer
          content={content as any}
          slug={project.slug}
          themeId={effectiveThemeId}
          primaryColor={effectiveColor}
          templateId={effectiveTemplate}
        />
      )}
    </WebsiteLayout>
  );
}
