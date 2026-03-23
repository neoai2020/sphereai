import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateForumReply } from "@/lib/rapidapi/generate";
import type { Project } from "@/types/database";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, forumTopic, forumUrl } = await req.json();

    if (!projectId || !forumTopic) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const productInfo = {
      productName: project.product_name,
      productDescription: project.product_description,
      productUrl: project.product_url,
      keywords: project.keywords || [],
      targetAudience: project.target_audience,
    };

    const reply = await generateForumReply(forumTopic, productInfo);
    const domain = process.env.NEXT_PUBLIC_BASE_URL || "https://getshpereaccess.com";
    const websiteLink = `${domain}/s/${project.slug}`;

    // Save to DB
    const { data: inserted, error: insertError } = await supabase
      .from("forum_replies")
      .insert({
        user_id: user.id,
        project_id: projectId,
        forum_url: forumUrl || null,
        forum_topic: forumTopic,
        generated_reply: reply,
        website_link: websiteLink,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(inserted);
  } catch (error) {
    console.error("Traffic Magnet error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
