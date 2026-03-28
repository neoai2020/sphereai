"use client";

import { FaqAccordion } from "@/components/dashboard/faq-accordion";
import { SPHEREAI_FAQS } from "@/data/sphereai-faqs";

/** Shared FAQ block: same content and accordion behavior as Training → FAQs. */
export function ProductFaqSection() {
  return (
    <>
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Site Forge, Asset Vault, premium tools, billing, and limits — same list on Support and Training.
        </p>
      </div>
      <FaqAccordion items={SPHEREAI_FAQS} defaultOpenIndex={null} variant="compact" />
    </>
  );
}
