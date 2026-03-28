import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import { InfiniteHub } from "./InfiniteHub";

export default async function InfinitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("has_infinite")
    .eq("id", user.id)
    .single();

  if (!profile?.has_infinite) {
    return (
      <RestrictedContent
        title="Infinite Plan Required"
        description="This area is exclusive to Infinite subscribers. Upgrade to unlock unlimited website generation and translation."
      />
    );
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, product_name, slug, project_type, available_languages")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Infinite</h1>
        <p className="text-gray-500 font-medium">
          Generate unlimited websites or translate your existing sites — no daily cap.
        </p>
      </div>

      <InfiniteHub projects={projects || []} />
    </div>
  );
}
