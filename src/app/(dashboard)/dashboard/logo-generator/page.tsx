import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoGeneratorClient } from "./LogoGeneratorClient";

export default async function LogoGeneratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, product_name, primary_color, site_logo")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <LogoGeneratorClient projects={projects || []} />;
}
