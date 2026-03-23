import { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const supabase = createServiceClient();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  ];

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("status", "published");

  const projectPages: MetadataRoute.Sitemap = (projects || []).flatMap(
    (project) => [
      {
        url: `${baseUrl}/s/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      ...["about", "faq", "blog", "reviews"].map((page) => ({
        url: `${baseUrl}/s/${project.slug}/${page}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]
  );

  return [...staticPages, ...projectPages];
}
