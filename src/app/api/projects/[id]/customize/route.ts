import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { theme_id, primary_color, secondary_color, font_family, navigation_style, site_logo, custom_images, name, product_url, selected_templates } = body;

  const updatePayload: Record<string, any> = {
    theme_id,
    primary_color,
    secondary_color,
    font_family,
    navigation_style,
    site_logo,
    custom_images,
    selected_templates,
    updated_at: new Date().toISOString(),
  };

  if (name) {
    updatePayload.name = name;
    updatePayload.product_name = name; // Sync with landing page renderer
  }

  if (product_url !== undefined) {
    updatePayload.product_url = product_url || null;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
