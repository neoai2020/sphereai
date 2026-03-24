import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { projectId, language } = await req.json();

    if (!language) {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const apiKey = process.env.RAPIDAPI_KEY;

    // 1. Get existing pages
    const { data: pages, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .eq("project_id", projectId);

    if (fetchError || !pages || pages.length === 0) {
      throw fetchError || new Error("No pages found for this project");
    }

    if (!apiKey) {
      throw new Error("RapidAPI key not configured.");
    }

    // 2. Translate each page
    for (const page of pages) {
      const content = page.content as Record<string, unknown>;

      // Collect ALL translatable text from the actual content structure
      // The LandingRenderer uses: content.hero.headline, content.hero.subheadline, content.hero.ctaText
      // content.features[].title, content.features[].description
      // content.benefits[].title, content.benefits[].description
      // content.socialProof.headline, content.cta.headline, content.cta.description, content.cta.buttonText

      const allTexts: Record<string, string> = {};
      const hero = content.hero as Record<string, string> | undefined;
      if (hero) {
        if (hero.headline) allTexts["hero_headline"] = hero.headline;
        if (hero.subheadline) allTexts["hero_subheadline"] = hero.subheadline;
        if (hero.ctaText) allTexts["hero_ctaText"] = hero.ctaText;
      }

      const features = content.features as Array<{ title: string; description: string }> | undefined;
      if (features) {
        features.forEach((f, i) => {
          if (f.title) allTexts[`feature_${i}_title`] = f.title;
          if (f.description) allTexts[`feature_${i}_desc`] = f.description;
        });
      }

      const benefits = content.benefits as Array<{ title: string; description: string }> | undefined;
      if (benefits) {
        benefits.forEach((b, i) => {
          if (b.title) allTexts[`benefit_${i}_title`] = b.title;
          if (b.description) allTexts[`benefit_${i}_desc`] = b.description;
        });
      }

      const cta = content.cta as Record<string, string> | undefined;
      if (cta) {
        if (cta.headline) allTexts["cta_headline"] = cta.headline;
        if (cta.description) allTexts["cta_description"] = cta.description;
        if (cta.buttonText) allTexts["cta_buttonText"] = cta.buttonText;
      }

      const socialProof = content.socialProof as Record<string, unknown> | undefined;
      if (socialProof) {
        if (socialProof.headline) allTexts["socialProof_headline"] = socialProof.headline as string;
      }

      if (Object.keys(allTexts).length === 0) {
        continue; // Nothing to translate
      }

      // Build a simple format for AI
      const textBlock = Object.entries(allTexts)
        .map(([key, val]) => `${key}|||${val}`)
        .join("\n");

      const prompt = `Translate the following website content to ${language}.
Each line has format: KEY|||VALUE
Keep the KEY exactly the same, only translate the VALUE.
Return each line in the same format: KEY|||TRANSLATED_VALUE

Content:
${textBlock}`;

      try {
        const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "x-rapidapi-key": apiKey,
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            system_prompt: `You are a professional translator. Translate website content to ${language}. Keep the KEY|||VALUE format. Only translate the VALUE part. Do not add any extra text.`,
            temperature: 0.3,
            max_tokens: 4000,
          }),
        });

        if (!response.ok) {
          throw new Error(`RapidAPI responded with ${response.status}`);
        }

        const data = await response.json();
        const resultText = (data.result || "") as string;

        // Parse the AI response: KEY|||VALUE per line
        const translations: Record<string, string> = {};
        resultText.split("\n").forEach((line: string) => {
          const parts = line.split("|||");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join("|||").trim();
            if (key && val) {
              translations[key] = val;
            }
          }
        });

        // Apply translations back into content
        const newContent = JSON.parse(JSON.stringify(content)); // deep clone

        if (newContent.hero) {
          if (translations["hero_headline"]) newContent.hero.headline = translations["hero_headline"];
          if (translations["hero_subheadline"]) newContent.hero.subheadline = translations["hero_subheadline"];
          if (translations["hero_ctaText"]) newContent.hero.ctaText = translations["hero_ctaText"];
        }

        if (newContent.features) {
          newContent.features.forEach((f: { title: string; description: string }, i: number) => {
            if (translations[`feature_${i}_title`]) f.title = translations[`feature_${i}_title`];
            if (translations[`feature_${i}_desc`]) f.description = translations[`feature_${i}_desc`];
          });
        }

        if (newContent.benefits) {
          newContent.benefits.forEach((b: { title: string; description: string }, i: number) => {
            if (translations[`benefit_${i}_title`]) b.title = translations[`benefit_${i}_title`];
            if (translations[`benefit_${i}_desc`]) b.description = translations[`benefit_${i}_desc`];
          });
        }

        if (newContent.cta) {
          if (translations["cta_headline"]) newContent.cta.headline = translations["cta_headline"];
          if (translations["cta_description"]) newContent.cta.description = translations["cta_description"];
          if (translations["cta_buttonText"]) newContent.cta.buttonText = translations["cta_buttonText"];
        }

        if (newContent.socialProof) {
          if (translations["socialProof_headline"]) newContent.socialProof.headline = translations["socialProof_headline"];
        }

        newContent.translatedTo = language;

        // Save to DB
        const { error: updateError } = await supabase
          .from("pages")
          .update({
            content: newContent,
            title: `${page.title.replace(/ \(.*\)$/, "")} (${language})`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", page.id);

        if (updateError) throw updateError;

      } catch (aiError: any) {
        console.error("AI translation error:", aiError);
        throw new Error(`Translation failed: ${aiError.message}`);
      }
    }

    return NextResponse.json({ success: true, message: `Translated to ${language}` });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
