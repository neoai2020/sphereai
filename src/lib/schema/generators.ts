import type { PageType, Page, Project } from "@/types/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function generateSchemaMarkup(
  pageType: PageType,
  page: Page,
  project: Project
): Record<string, unknown> {
  const pageUrl = `${BASE_URL}/s/${project.slug}${pageType === "landing" ? "" : `/${pageType}`}`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: project.product_name,
        item: `${BASE_URL}/s/${project.slug}`,
      },
      ...(pageType !== "landing"
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: page.title,
              item: pageUrl,
            },
          ]
        : []),
    ],
  };

  const schemas: Record<PageType, Record<string, unknown>> = {
    landing: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          name: page.title,
          description: page.meta_description,
          url: pageUrl,
        },
        {
          "@type": "Product",
          name: project.product_name,
          description: project.product_description,
          url: project.product_url || pageUrl,
        },
        breadcrumb,
      ],
    },

    about: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          name: page.title,
          description: page.meta_description,
          url: pageUrl,
        },
        {
          "@type": "Organization",
          name: project.product_name,
          description: project.product_description,
          url: project.product_url || `${BASE_URL}/s/${project.slug}`,
        },
        breadcrumb,
      ],
    },

    faq: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FAQPage",
          name: page.title,
          description: page.meta_description,
          url: pageUrl,
          mainEntity: ((page.content as { faqs?: { question: string; answer: string }[] }).faqs || []).map(
            (faq: { question: string; answer: string }) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })
          ),
        },
        breadcrumb,
      ],
    },

    blog: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          headline: (page.content as { headline?: string }).headline || page.title,
          description: page.meta_description,
          url: pageUrl,
          author: {
            "@type": "Organization",
            name: project.product_name,
          },
          datePublished: (page.content as { publishDate?: string }).publishDate || page.created_at,
          publisher: {
            "@type": "Organization",
            name: project.product_name,
          },
        },
        breadcrumb,
      ],
    },

    reviews: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: project.product_name,
          description: project.product_description,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (page.content as { overallRating?: number }).overallRating || 4.8,
            reviewCount: (page.content as { totalReviews?: number }).totalReviews || 100,
            bestRating: 5,
          },
          review: (
            (page.content as { reviews?: { name: string; rating: number; text: string; date: string }[] }).reviews || []
          ).map((r: { name: string; rating: number; text: string; date: string }) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
            },
            reviewBody: r.text,
            datePublished: r.date,
          })),
        },
        breadcrumb,
      ],
    },
  };

  return schemas[pageType];
}
