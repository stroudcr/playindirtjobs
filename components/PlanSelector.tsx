'use client';

import { PRICING } from "@/lib/constants";
import { Check } from "lucide-react";

interface PlanSelectorProps {
  selected: "basic" | "featured";
  onChange: (plan: "basic" | "featured") => void;
}

export function PlanSelector({ selected, onChange }: PlanSelectorProps) {
  const plans = [
    {
      id: "basic" as const,
      name: "Basic Listing",
      price: PRICING.BASIC,
      features: [
        "60 day listing",
        "Standard visibility",
        "Email support",
      ]
    },
    {
      id: "featured" as const,
      name: "Featured Listing",
      price: PRICING.FEATURED,
      badge: "Most Popular",
      features: [
        "60 day listing",
        "Featured badge & highlighting",
        "Top of search results",
        "2x more visibility",
        "Priority email support",
      ]
    }
  ];

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-display text-forest mb-4">Choose Your Plan</h3>

      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onChange(plan.id)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selected === plan.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div>
                    <p className="font-semibold text-forest">{plan.name}</p>
                    {plan.badge && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${(plan.price / 100).toFixed(0)}
                    </p>
                  </div>
                </div>

                <ul className="space-y-1.5 mt-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-forest-light">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-forest-light mt-4 text-center">
        All plans include applicant tracking and job management
      </p>
    </div>
  );
}
