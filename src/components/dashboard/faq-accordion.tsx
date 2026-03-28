"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SphereAiFaq } from "@/data/sphereai-faqs";

type FaqAccordionProps = {
  items: SphereAiFaq[];
  /** First item open by default (Support behavior). Use null for all closed. */
  defaultOpenIndex?: number | null;
  className?: string;
  /** Compact = training tab; roomy = support column */
  variant?: "default" | "compact";
};

export function FaqAccordion({
  items,
  defaultOpenIndex = 0,
  className,
  variant = "default",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex ?? null);

  const padding = variant === "compact" ? "px-5 py-4" : "px-8 py-5";
  const answerPadding = variant === "compact" ? "px-5 pb-4" : "px-8 pb-5";

  return (
    <div className={cn("divide-y divide-gray-50", className)}>
      {items.map((faq, i) => (
        <div key={i} className="group">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={cn(
              "w-full flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors",
              padding
            )}
          >
            <span
              className={cn(
                "text-xs font-bold transition-colors pr-3",
                openIndex === i
                  ? "text-brand-600 font-black"
                  : "text-gray-600 group-hover:text-gray-950"
              )}
            >
              {faq.q}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "text-gray-300 shrink-0 transition-transform duration-300",
                openIndex === i && "rotate-180 text-brand-500"
              )}
            />
          </button>
          {openIndex === i && (
            <div
              className={cn(
                "text-gray-500 text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200",
                answerPadding
              )}
            >
              {faq.a.split("**").map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-bold text-gray-700">
                    {part}
                  </strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
