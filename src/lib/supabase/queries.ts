import { createClient } from "./server";

export async function getWebsitesForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching websites:", error);
    return [];
  }

  return data;
}

export async function saveWebsite(website: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("projects")
    .insert([{
      ...website,
      user_id: user.id,
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error("Error saving website:", error);
    throw error;
  }

  return data;
}
