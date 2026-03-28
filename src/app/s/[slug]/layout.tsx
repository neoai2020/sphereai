import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { SiteShell } from "@/components/pages/SiteShell";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function PublicPageLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, product_name, product_description, primary_color, site_logo, product_url")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  return (
    <SiteShell project={project} slug={slug}>
      {children}
    </SiteShell>
  );
}
