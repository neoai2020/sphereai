import type { PageType } from "@/types/database";

const RAPIDAPI_URL = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";

interface AIResponse {
  result: string;
  status: boolean;
}

async function callAI(prompt: string): Promise<string> {
  const response = await fetch(RAPIDAPI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      system_prompt: "",
      temperature: 0.7,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 3000,
      web_access: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
  }

  const data: AIResponse = await response.json();
  return data.result;
}

function extractJSON(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    return JSON.parse(braceMatch[0]);
  }
  throw new Error("Could not extract JSON from AI response");
}

interface ProductInfo {
  productName: string;
  productDescription: string;
  productUrl: string | null;
  keywords: string[];
  targetAudience: string;
}

export async function generatePageContent(
  pageType: PageType,
  product: ProductInfo
): Promise<{ content: Record<string, unknown>; title: string; metaDescription: string }> {
  const prompts: Record<PageType, string> = {
    landing: `Generate a landing page for the following product. Return ONLY valid JSON.

Product: ${product.productName}
Description: ${product.productDescription}
URL: ${product.productUrl || "N/A"}
Keywords: ${product.keywords.join(", ")}
Target Audience: ${product.targetAudience}

Return JSON with this exact structure:
{
  "hero": {
    "headline": "compelling headline",
    "subheadline": "supporting text",
    "ctaText": "call to action button text"
  },
  "features": [
    { "title": "feature name", "description": "feature description", "icon": "icon-name" }
  ],
  "benefits": [
    { "title": "benefit", "description": "explanation" }
  ],
  "socialProof": {
    "headline": "trust headline",
    "stats": [{ "value": "100+", "label": "stat label" }]
  },
  "cta": {
    "headline": "final CTA headline",
    "description": "urgency text",
    "buttonText": "action text"
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Make it persuasive, benefit-driven, and optimized for AI search engines. Use natural language that AI assistants would cite.`,

    about: `Generate an About page for the following product/company. Return ONLY valid JSON.

Product: ${product.productName}
Description: ${product.productDescription}
Target Audience: ${product.targetAudience}

Return JSON with this exact structure:
{
  "story": {
    "headline": "Our Story",
    "paragraphs": ["paragraph 1", "paragraph 2", "paragraph 3"]
  },
  "mission": {
    "headline": "Our Mission",
    "text": "mission statement"
  },
  "values": [
    { "title": "value name", "description": "value description" }
  ],
  "team": {
    "headline": "Why Trust Us",
    "description": "credibility paragraph"
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Write authoritative, trustworthy content optimized for AI search citations.`,

    faq: `Generate a comprehensive FAQ page for the following product. Return ONLY valid JSON.

Product: ${product.productName}
Description: ${product.productDescription}
Keywords: ${product.keywords.join(", ")}
Target Audience: ${product.targetAudience}

Return JSON with this exact structure:
{
  "headline": "Frequently Asked Questions",
  "description": "intro paragraph about the FAQ section",
  "faqs": [
    { "question": "clear question?", "answer": "detailed, helpful answer" }
  ],
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Generate 8-10 FAQs. Write questions as real users would ask them. Answers should be comprehensive, factual, and in a format that AI assistants would directly cite. This is the most important page for AI search optimization.`,

    blog: `Generate a long-form blog article for the following product. Return ONLY valid JSON.

Product: ${product.productName}
Description: ${product.productDescription}
Keywords: ${product.keywords.join(", ")}
Target Audience: ${product.targetAudience}

Return JSON with this exact structure:
{
  "headline": "article title (compelling, keyword-rich)",
  "author": "SphereAI Team",
  "publishDate": "${new Date().toISOString().split("T")[0]}",
  "readTime": "X min read",
  "introduction": "engaging intro paragraph",
  "sections": [
    {
      "heading": "section heading",
      "paragraphs": ["paragraph 1", "paragraph 2"],
      "bulletPoints": ["point 1", "point 2"]
    }
  ],
  "conclusion": "concluding paragraph with CTA",
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Write 4-5 sections. Content should be informative, well-structured, and optimized for AI search engines to cite as authoritative content.`,

    reviews: `Generate a reviews/testimonials page for the following product. Return ONLY valid JSON.

Product: ${product.productName}
Description: ${product.productDescription}
Target Audience: ${product.targetAudience}

Return JSON with this exact structure:
{
  "headline": "What Our Customers Say",
  "description": "intro about customer satisfaction",
  "overallRating": 4.8,
  "totalReviews": 150,
  "reviews": [
    {
      "name": "reviewer name",
      "role": "their role/title",
      "rating": 5,
      "text": "detailed review text",
      "date": "2024-XX-XX"
    }
  ],
  "summary": {
    "headline": "summary headline",
    "text": "paragraph summarizing why customers love the product"
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Generate 6 realistic, detailed reviews. Make them sound authentic and varied. Optimized for AI search engines to cite.`,
  };

  const rawResponse = await callAI(prompts[pageType]);
  const parsed = extractJSON(rawResponse);

  const title = (parsed.title as string) || `${product.productName} - ${pageType}`;
  const metaDescription =
    (parsed.metaDescription as string) || product.productDescription.slice(0, 155);

  delete parsed.title;
  delete parsed.metaDescription;

  return { content: parsed, title, metaDescription };
}
export async function generateForumReply(
  forumTopic: string,
  product: ProductInfo
): Promise<string> {
  const prompt = `You are a helpful forum member. Generate a helpful, natural-sounding reply to a forum post about: "${forumTopic}".
  
  Your goal is to provide genuine value first, then naturally mention this product as a solution:
  Product: ${product.productName}
  Description: ${product.productDescription}
  
  Guidelines:
  - Sound human, not like an ad.
  - Don't use marketing fluff.
  - Mention the product name only once, towards the end.
  - Focus on how it solves the specific problem mentioned in the topic.
  - Keep it under 150 words.
  
  Do NOT include the website link in the text; I will add it separately. Just the text of the reply.`;

  return await callAI(prompt);
}
