import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { LandingEditor } from "@/components/dashboard/editors/landing-editor";
import { AboutEditor } from "@/components/dashboard/editors/about-editor";
import { FAQEditor } from "@/components/dashboard/editors/faq-editor";
import { BlogEditor } from "@/components/dashboard/editors/blog-editor";
import { ReviewsEditor } from "@/components/dashboard/editors/reviews-editor";

export default async function EditPage({
  params,
}: {
  params: { id: string; pageId: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: page, error } = await supabase
    .from("pages")
    .select("*, projects!inner(*)")
    .eq("id", params.pageId)
    .eq("projects.user_id", user.id)
    .single();

  if (error || !page) notFound();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          Edit {page.page_type} Page
        </h1>
        <p className="text-gray-500 mt-1">
          Customize the content of your generated AI page.
        </p>
      </div>

      {page.page_type === "landing" && <LandingEditor page={page} projectId={params.id} />}
      {page.page_type === "about" && <AboutEditor page={page} projectId={params.id} />}
      {page.page_type === "faq" && <FAQEditor page={page} projectId={params.id} />}
      {page.page_type === "blog" && <BlogEditor page={page} projectId={params.id} />}
      {page.page_type === "reviews" && <ReviewsEditor page={page} projectId={params.id} />}
    </div>
  );
}
