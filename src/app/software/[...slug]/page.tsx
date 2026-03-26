import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { LandingRenderer } from "@/components/pages/landing-renderer";

export const dynamic = "force-dynamic";
import { AboutRenderer } from "@/components/pages/about-renderer";
import { FAQRenderer } from "@/components/pages/faq-renderer";
import { BlogRenderer } from "@/components/pages/blog-renderer";
import { ReviewsRenderer } from "@/components/pages/reviews-renderer";
import { WebsiteLayout } from "@/components/pages/WebsiteLayout";
import type { PageType } from "@/types/database";

interface Props {
  params: Promise<{ slug: string[] }>;
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
    .eq("is_published", true)
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

export default async function SoftwarePage({ params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length < 2) notFound();

  const [username, projectIdOrSlug, pageType] = slug;
  const supabase = createServiceClient();

  // Safer check for ID vs Slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectIdOrSlug);

  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .select("*, users!inner(full_name)")
    .eq(isUuid ? "id" : "slug", projectIdOrSlug)
    .single();

  if (projectErr || !project) {
    console.error("Project lookup failed in Page:", projectErr, "for slug:", projectIdOrSlug);
    notFound();
  }

  const activePageType = (pageType || "landing") as PageType;

  // Try to find the page, even if not explicitly marked as published
  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", activePageType)
    .single();

  if (pageErr || !page) {
    console.error("Page not found for project:", project.id, "type:", activePageType, "error:", pageErr);
    notFound();
  }

  const content = page.content as Record<string, unknown>;
  const baseUrl = `/software/${username}/${projectIdOrSlug}`;

  return (
    <WebsiteLayout project={project} activePath={`${baseUrl}/${pageType || ""}`}>
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
          productUrl={project.product_url}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
        />
      )}
      {activePageType === "about" && (
        <AboutRenderer
          content={content as any}
          productName={project.product_name}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
        />
      )}
      {activePageType === "faq" && (
        <FAQRenderer 
          content={content as any} 
          slug={project.slug} 
          themeId={project.theme_id}
          primaryColor={project.primary_color}
        />
      )}
      {activePageType === "blog" && (
        <BlogRenderer 
          content={content as any} 
          slug={project.slug} 
          themeId={project.theme_id}
          primaryColor={project.primary_color}
        />
      )}
      {activePageType === "reviews" && (
        <ReviewsRenderer 
          content={content as any} 
          slug={project.slug} 
          themeId={project.theme_id}
          primaryColor={project.primary_color}
        />
      )}
    </WebsiteLayout>
  );
}
