"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface FAQContent {
  headline?: string;
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <h3 className="font-medium text-gray-900 pr-4">{question}</h3>
        <ChevronDown
          size={18}
          className={`text-gray-400 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FAQRenderer({
  content,
  slug,
}: {
  content: FAQContent;
  slug: string;
}) {
  return (
    <div>
      <header className="py-16 px-4 bg-gradient-to-b from-brand-50 to-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.headline || "Frequently Asked Questions"}
          </h1>
          {content.description && (
            <p className="text-lg text-gray-600">{content.description}</p>
          )}
        </div>
      </header>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {content.faqs?.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      <nav className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/s/${slug}`} className="text-gray-500 hover:text-gray-700">Home</Link>
          <Link href={`/s/${slug}/about`} className="text-gray-500 hover:text-gray-700">About</Link>
          <Link href={`/s/${slug}/faq`} className="text-brand-600 font-medium">FAQ</Link>
          <Link href={`/s/${slug}/blog`} className="text-gray-500 hover:text-gray-700">Blog</Link>
          <Link href={`/s/${slug}/reviews`} className="text-gray-500 hover:text-gray-700">Reviews</Link>
        </div>
      </nav>
    </div>
  );
}
