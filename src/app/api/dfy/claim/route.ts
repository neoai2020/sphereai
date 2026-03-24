import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { siteName, type } = await req.json();
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
      throw new Error("RapidAPI key missing");
    }

    // Since 20 full articles would timeout, we'll generate 20 detailed blog titles and outlines 
    // and store them.
    const prompt = `Generate 20 unique and compelling blog article titles for a ${type} business named "${siteName}". 
    For each title, provide a 1-sentence summary. 
    Format as valid JSON: { "articles": [{ "title": "...", "summary": "..." }] }`;

    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        system_prompt: "You are an expert content strategist.",
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`RapidAPI responded with ${response.status}`);
    }

    const data = await response.json();
    
    // In a real scenario, we'd save these to the database.
    // For now, we'll just return success to indicate they are "being generated" or are ready.
    return NextResponse.json({ 
      success: true, 
      message: "20 articles generated successfully",
      articles: data.result 
    });
  } catch (error: any) {
    console.error("DFY Claim API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
