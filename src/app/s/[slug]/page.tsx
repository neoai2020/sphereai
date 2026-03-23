import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { LandingRenderer } from "@/components/pages/landing-renderer";

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
    .eq("is_published", true)
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

  if (!project) notFound();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("project_id", project.id)
    .eq("page_type", "landing")
    .eq("is_published", true)
    .single();

  if (!page) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(page.schema_markup),
        }}
      />
      <LandingRenderer
        content={page.content as Record<string, unknown>}
        productUrl={project.product_url}
        slug={project.slug}
      />
    </>
  );
}
