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
    .select("id, slug, user_id, updated_at")
    .eq("status", "published");

  const projectPages: MetadataRoute.Sitemap = (projects || []).flatMap(
    (project) => [
      {
        url: `${baseUrl}/software/${project.user_id}/${project.id}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      ...["about", "faq", "blog", "reviews"].map((page) => ({
        url: `${baseUrl}/software/${project.user_id}/${project.id}/${page}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]
  );

  return [...staticPages, ...projectPages];
}
