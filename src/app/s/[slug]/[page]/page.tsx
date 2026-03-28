import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { AboutRenderer } from "@/components/pages/about-renderer";
import { FAQRenderer } from "@/components/pages/faq-renderer";
import { BlogRenderer } from "@/components/pages/blog-renderer";
import { ReviewsRenderer } from "@/components/pages/reviews-renderer";
import type { PageType } from "@/types/database";

const VALID_PAGES: PageType[] = ["about", "faq", "blog", "reviews"];

interface Props {
  params: Promise<{ slug: string; page: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page: pageSlug } = await params;

  if (!VALID_PAGES.includes(pageSlug as PageType)) {
    return { title: "Not Found" };
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) return { title: "Not Found" };

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", pageSlug)
    .single();

  return {
    title: page?.title || `${project.product_name} - ${pageSlug}`,
    description: page?.meta_description || project.product_description,
    openGraph: {
      title: page?.title || `${project.product_name} - ${pageSlug}`,
      description: page?.meta_description || project.product_description,
      type: pageSlug === "blog" ? "article" : "website",
    },
  };
}

export default async function SubPage({ params }: Props) {
  const { slug, page: pageSlug } = await params;

  if (!VALID_PAGES.includes(pageSlug as PageType)) {
    notFound();
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", pageSlug)
    .single();

  if (!page) notFound();

  const content = page.content as Record<string, unknown>;
  const projectTpls = (project as { selected_templates?: Record<string, number> }).selected_templates || {};
  const templateId = Number(projectTpls[pageSlug as PageType] ?? 1) || 1;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            page.schema_markup || {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: page.title,
              description: page.meta_description,
            },
          ),
        }}
      />
      {pageSlug === "about" && (
        <AboutRenderer
          content={content as any}
          productName={project.product_name}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
          templateId={templateId}
        />
      )}
      {pageSlug === "faq" && (
        <FAQRenderer
          content={content as any}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
          templateId={templateId}
        />
      )}
      {pageSlug === "blog" && (
        <BlogRenderer
          content={content as any}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
          templateId={templateId}
        />
      )}
      {pageSlug === "reviews" && (
        <ReviewsRenderer
          content={content as any}
          slug={project.slug}
          themeId={project.theme_id}
          primaryColor={project.primary_color}
          templateId={templateId}
        />
      )}
    </>
  );
}
