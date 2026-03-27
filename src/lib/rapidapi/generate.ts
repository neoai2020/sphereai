import type { PageType } from "@/types/database";

const RAPIDAPI_URL = "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2";

interface AIResponse {
  result: string;
  status: boolean;
}

async function callAI(prompt: string, retries = 2): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use 45s timeout — must be below Next.js maxDuration (120s) to fail gracefully
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

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
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        throw new Error(`AI service error (${response.status}): ${errText.slice(0, 200)}`);
      }

      const data: AIResponse = await response.json();
      if (!data.result) throw new Error("AI service returned empty response — please try again");
      return data.result;
    } catch (err: any) {
      const isAbort = err?.name === "AbortError";
      const isLastAttempt = attempt >= retries;

      if (!isLastAttempt) {
        console.warn(`AI call attempt ${attempt + 1} failed, retrying in 1s...`, err?.message);
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      if (isAbort) {
        throw new Error("AI service took too long to respond — please try again");
      }
      throw new Error(err?.message || "Failed to connect to AI service");
    }
  }
  throw new Error("AI call failed after all retries — please try again");
}

function extractJSON(text: string): any {
  // 1. Try direct parse first
  try { return JSON.parse(text.trim()); } catch (e) {}

  // 2. Try ```json code block
  const jsonCodeBlock = text.match(/```json\s*([\s\S]*?)```/);
  if (jsonCodeBlock) {
    try { return JSON.parse(jsonCodeBlock[1].trim()); } catch (e) {}
  }

  // 3. Try any ``` code block
  const anyCodeBlock = text.match(/```\s*([\s\S]*?)```/);
  if (anyCodeBlock) {
    try { return JSON.parse(anyCodeBlock[1].trim()); } catch (e) {}
  }

  // 4. Try to extract array [...] - most lenient, for Facebook posts
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try { return JSON.parse(arrMatch[0].trim()); } catch (e) {}
  }

  // 5. Try to extract object {...}
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try { return JSON.parse(objMatch[0].trim()); } catch (e) {}
  }

  // 6. Try to find first [ or { and match to last ] or }
  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');
  let startIdx = -1;
  let endChar = '';

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    startIdx = firstBracket; endChar = ']';
  } else if (firstBrace !== -1) {
    startIdx = firstBrace; endChar = '}';
  }

  if (startIdx !== -1) {
    const lastIdx = text.lastIndexOf(endChar);
    if (lastIdx > startIdx) {
      try { return JSON.parse(text.slice(startIdx, lastIdx + 1)); } catch (e) {}
    }
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
): Promise<{ 
  content: Record<string, unknown>; 
  title: string; 
  metaDescription: string;
  schemaMarkup: Record<string, any> | null;
}> {
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
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "product name",
    "description": "seo description",
    "brand": { "@type": "Brand", "name": "brand name" }
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Make it persuasive, benefit-driven, and optimized for AI search engines. Use natural language that AI assistants would cite. Include full JSON LD schema markup.`,

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
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
       "@type": "Organization",
       "name": "comp name",
       "description": "mission"
    }
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Write authoritative, trustworthy content optimized for AI search citations. Include full JSON LD schema markup.`,

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
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "q1", "acceptedAnswer": { "@type": "Answer", "text": "a1" } }
    ]
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Generate 8-10 FAQs. Write questions as real users would ask them. Answers should be comprehensive, factual, and in a format that AI assistants would directly cite. This is the most important page for AI search optimization. Include full JSON LD schema markup.`,

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
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "headline",
    "author": { "@type": "Person", "name": "SphereAI Team" },
    "datePublished": "2024-XX-XX"
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Write 4-5 sections. Content should be informative, well-structured, and optimized for AI search engines to cite as authoritative content. Include full JSON LD schema markup.`,

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
  "schemaMarkup": {
     "@context": "https://schema.org",
     "@type": "Review",
     "itemReviewed": { "@type": "Product", "name": "product name" },
     "reviewRating": { "@type": "Rating", "ratingValue": "5" },
     "author": { "@type": "Person", "name": "Reviewer" }
  },
  "title": "SEO page title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)"
}

Generate 6 realistic, detailed reviews. Make them sound authentic and varied. Optimized for AI search engines to cite. Include full JSON LD schema markup.`,
  };

  const rawResponse = await callAI(prompts[pageType]);
  const parsed = extractJSON(rawResponse);

  const title = (parsed.title as string) || `${product.productName} - ${pageType}`;
  const metaDescription =
    (parsed.metaDescription as string) || product.productDescription.slice(0, 155);

  const schemaMarkup = (parsed.schemaMarkup as Record<string, unknown>) || null;
  delete parsed.title;
  delete parsed.metaDescription;
  delete parsed.schemaMarkup;

  return { content: parsed, title, metaDescription, schemaMarkup };
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

export async function generateProductDescription(productName: string): Promise<string> {
  const prompt = `Based on the product name "${productName}", write a compelling and detailed product description in 2-3 sentences. Focus on key benefits, use cases, and what makes it unique. Return ONLY the description text, no extra formatting or labels.`;
  return await callAI(prompt);
}

export async function generateSEO(
  productName: string,
  productDescription: string
): Promise<{ keywords: string[]; targetAudience: string }> {
  const prompt = `Based on the following product details, suggest 10 SEO keywords and a clear target audience description.
  
  Product: ${productName}
  Description: ${productDescription}
  
  Guidelines:
  - Keywords should be optimized for both Google and AI search engines (ChatGPT, Perplexity).
  - Target audience should be specific and detail their pain points.
  
  Return ONLY valid JSON in this structure:
  {
    "keywords": ["keyword1", "keyword2", ...],
    "targetAudience": "detailed target audience description"
  }`;

  const rawResponse = await callAI(prompt);
  const parsed = extractJSON(rawResponse);
  
  return {
    keywords: (parsed.keywords as string[]) || [],
    targetAudience: (parsed.targetAudience as string) || ""
  };
}

export async function generateFacebookPosts(
  productName: string,
  productDescription: string,
  productLink?: string
): Promise<string[]> {
  const linkPlaceholder = productLink ? productLink : "[YOUR LINK HERE]";
  const prompt = `Generate exactly 10 Facebook marketing posts for this product.

Product Name: ${productName}
Product Description: ${productDescription}
Promotional Link: ${linkPlaceholder}

STRICT RULES:
- Return ONLY a raw JSON array of 10 strings. No explanation, no markdown, no extra text.
- Each string is one complete Facebook post (50-150 words).
- Use a different angle for each post: Storytelling, Curiosity, Pain Point, Benefit, Social Proof, FOMO, Educational, Myth-Busting, Comparative, Personal Invite.
- Include the link ${linkPlaceholder} naturally in each post.
- Use emojis sparingly.

OUTPUT FORMAT (copy exactly):
["post 1 text here", "post 2 text here", "post 3 text here", "post 4 text here", "post 5 text here", "post 6 text here", "post 7 text here", "post 8 text here", "post 9 text here", "post 10 text here"]`;

  const rawResponse = await callAI(prompt);
  
  try {
    const parsed = extractJSON(rawResponse);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p: string) => 
        typeof p === 'string' ? p.replace(/\[YOUR LINK HERE\]/g, linkPlaceholder) : String(p)
      );
    }
  } catch (e) {
    // fallback: try to split by numbered lines "1. ... 2. ..."
    const lines = rawResponse.split(/\n\d+\.\s+/).filter(l => l.trim().length > 20);
    if (lines.length >= 5) {
      return lines.slice(0, 10).map(l => l.trim());
    }
  }

  return [];
}

