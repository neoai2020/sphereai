import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSchemaMarkup } from "@/lib/schema/generators";
import type { Page, Project } from "@/types/database";

export async function PATCH(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, title, metaDescription } = await request.json();

    // 1. Get current page and project info
    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("*, projects(*)")
      .eq("id", params.pageId)
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const project = page.projects as Project;

    // 2. Verify ownership
    if (project.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Prepare updated data
    const updatedPage = {
      ...page,
      content: content || page.content,
      title: title || page.title,
      meta_description: metaDescription || page.meta_description,
    } as Page;

    // 4. Regenerate schema markup
    const schemaMarkup = generateSchemaMarkup(
      page.page_type,
      updatedPage,
      project
    );

    // 5. Update in DB
    const { error: updateError } = await supabase
      .from("pages")
      .update({
        content: updatedPage.content,
        title: updatedPage.title,
        meta_description: updatedPage.meta_description,
        schema_markup: schemaMarkup,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.pageId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
