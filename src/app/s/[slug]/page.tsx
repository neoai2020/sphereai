import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { LandingRenderer } from "@/components/pages/landing-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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
    .eq("page_type", "landing")
    .single();

  return {
    title: page?.title || project.product_name,
    description: page?.meta_description || project.product_description,
    openGraph: {
      title: page?.title || project.product_name,
      description: page?.meta_description || project.product_description,
      type: "website",
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) {
    console.error("s/ Project not found for slug:", slug);
    notFound();
  }

  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", "landing")
    .single();

  if (pageErr || !page) {
    console.error("s/ Page not found for project:", project.id, "error:", pageErr);
    notFound();
  }

  const projectTpls = (project as { selected_templates?: Record<string, number> }).selected_templates || {};
  const landingTemplateId = Number(projectTpls.landing ?? 1) || 1;

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
      <LandingRenderer
        content={page.content as any}
        productUrl={project.product_url}
        slug={project.slug}
        productName={project.product_name}
        themeId={project.theme_id}
        primaryColor={project.primary_color}
        heroImage={(project as { custom_images?: { hero?: string } }).custom_images?.hero}
        templateId={landingTemplateId}
      />
    </>
  );
}
