import { Infinity as InfiniteIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RestrictedContent } from "@/components/dashboard/restricted-content";
import { InfiniteHub } from "./InfiniteHub";
import { userHasInfiniteAccess } from "@/lib/infinite-access";

export default async function InfinitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("has_infinite")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!userHasInfiniteAccess(sub, user.user_metadata as { plan?: string | null } | undefined)) {
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
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <InfiniteIcon size={24} strokeWidth={2.25} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
              Infinite
            </h1>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                Infinite Plan Active
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
          Generate unlimited websites or translate your existing sites — no daily cap.
        </p>
      </div>

      <InfiniteHub projects={projects || []} />
    </div>
  );
}
