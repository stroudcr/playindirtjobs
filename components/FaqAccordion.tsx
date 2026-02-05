"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-200 ${
              isOpen
                ? "border-primary/30 shadow-soft-lg bg-white"
                : "border-border bg-white hover:border-gray-300"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex items-center justify-between w-full p-5 text-left gap-4"
              aria-expanded={isOpen}
            >
              <h3 className="text-base font-semibold text-forest pr-2">
                {faq.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-forest-light flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-all duration-200"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-forest-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
