import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const PAGE_TYPES = ["landing", "about", "faq", "blog", "reviews"] as const;

export async function POST(req: Request) {
  try {
    const { projectId, language } = await req.json();
    if (!language || !projectId) {
      return NextResponse.json({ error: "projectId and language are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) throw new Error("RapidAPI key not configured.");

    // 1. Get existing pages
    const { data: pages, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .eq("project_id", projectId);

    if (fetchError || !pages || pages.length === 0) {
      throw fetchError || new Error("No pages found for this project");
    }

    // 2. Translate each page and save to project_translations
    for (const page of pages) {
      const content = page.content as Record<string, unknown>;

      const allTexts: Record<string, string> = {};
      const hero = content.hero as Record<string, string> | undefined;
      if (hero) {
        if (hero.headline)     allTexts["hero_headline"]     = hero.headline;
        if (hero.subheadline)  allTexts["hero_subheadline"]  = hero.subheadline;
        if (hero.ctaText)      allTexts["hero_ctaText"]      = hero.ctaText;
      }

      const features = content.features as Array<{ title: string; description: string }> | undefined;
      if (features) {
        features.forEach((f, i) => {
          if (f.title)       allTexts[`feature_${i}_title`] = f.title;
          if (f.description) allTexts[`feature_${i}_desc`]  = f.description;
        });
      }

      const benefits = content.benefits as Array<{ title: string; description: string }> | undefined;
      if (benefits) {
        benefits.forEach((b, i) => {
          if (b.title)       allTexts[`benefit_${i}_title`] = b.title;
          if (b.description) allTexts[`benefit_${i}_desc`]  = b.description;
        });
      }

      const cta = content.cta as Record<string, string> | undefined;
      if (cta) {
        if (cta.headline)   allTexts["cta_headline"]   = cta.headline;
        if (cta.description) allTexts["cta_description"] = cta.description;
        if (cta.buttonText) allTexts["cta_buttonText"] = cta.buttonText;
      }

      const socialProof = content.socialProof as Record<string, unknown> | undefined;
      if (socialProof?.headline) allTexts["socialProof_headline"] = socialProof.headline as string;

      if (Object.keys(allTexts).length === 0) continue;

      const textBlock = Object.entries(allTexts)
        .map(([key, val]) => `${key}|||${val}`)
        .join("\n");

      const prompt = `Translate the following website content to ${language}.
Each line has format: KEY|||VALUE
Keep the KEY exactly the same, only translate the VALUE.
Return each line in the same format: KEY|||TRANSLATED_VALUE

Content:
${textBlock}`;

      const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
          "x-rapidapi-key": apiKey,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          system_prompt: `You are a professional translator. Translate to ${language}. Keep KEY|||VALUE format. Only translate the VALUE. No extra text.`,
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) throw new Error(`RapidAPI responded with ${response.status}`);

      const data = await response.json();
      const resultText = (data.result || "") as string;

      const translations: Record<string, string> = {};
      resultText.split("\n").forEach((line: string) => {
        const parts = line.split("|||");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join("|||").trim();
          if (key && val) translations[key] = val;
        }
      });

      // Apply translations to a copy of the content
      const newContent = JSON.parse(JSON.stringify(content));
      if (newContent.hero) {
        if (translations["hero_headline"])    newContent.hero.headline    = translations["hero_headline"];
        if (translations["hero_subheadline"]) newContent.hero.subheadline = translations["hero_subheadline"];
        if (translations["hero_ctaText"])     newContent.hero.ctaText     = translations["hero_ctaText"];
      }
      if (newContent.features) {
        newContent.features.forEach((f: { title: string; description: string }, i: number) => {
          if (translations[`feature_${i}_title`]) f.title       = translations[`feature_${i}_title`];
          if (translations[`feature_${i}_desc`])  f.description = translations[`feature_${i}_desc`];
        });
      }
      if (newContent.benefits) {
        newContent.benefits.forEach((b: { title: string; description: string }, i: number) => {
          if (translations[`benefit_${i}_title`]) b.title       = translations[`benefit_${i}_title`];
          if (translations[`benefit_${i}_desc`])  b.description = translations[`benefit_${i}_desc`];
        });
      }
      if (newContent.cta) {
        if (translations["cta_headline"])    newContent.cta.headline    = translations["cta_headline"];
        if (translations["cta_description"]) newContent.cta.description = translations["cta_description"];
        if (translations["cta_buttonText"])  newContent.cta.buttonText  = translations["cta_buttonText"];
      }
      if (newContent.socialProof && translations["socialProof_headline"]) {
        newContent.socialProof.headline = translations["socialProof_headline"];
      }

      // Save to project_translations (upsert so re-translating updates it)
      const { error: upsertError } = await supabase
        .from("project_translations")
        .upsert({
          project_id: projectId,
          language,
          page_type: page.page_type,
          content: newContent,
          title: `${(page.title || "").replace(/ \(.*\)$/, "")} (${language})`,
          meta_description: page.meta_description,
          updated_at: new Date().toISOString(),
        }, { onConflict: "project_id,language,page_type" });

      if (upsertError) throw upsertError;
    }

    // 3. Add language to project's available_languages array (no duplicates)
    await supabase.rpc("add_available_language", { p_project_id: projectId, p_language: language })
      .then(async ({ error }) => {
        if (error) {
          // Fallback: manual array update
          const { data: proj } = await supabase
            .from("projects")
            .select("available_languages")
            .eq("id", projectId)
            .single();
          const existing: string[] = proj?.available_languages || [];
          if (!existing.includes(language)) {
            await supabase
              .from("projects")
              .update({ available_languages: [...existing, language] })
              .eq("id", projectId);
          }
        }
      });

    return NextResponse.json({ success: true, message: `Translated to ${language}` });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
