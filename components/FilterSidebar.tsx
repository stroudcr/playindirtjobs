"use client";

import { JOB_CATEGORIES, JOB_TYPES, FARM_TYPES, BENEFITS, SORT_OPTIONS } from "@/lib/constants";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedJobTypes: string[];
  selectedFarmTypes: string[];
  selectedBenefits: string[];
  sortBy: string;
  onFilterChange: (filters: {
    categories?: string[];
    jobTypes?: string[];
    farmTypes?: string[];
    benefits?: string[];
    sortBy?: string;
  }) => void;
}

export function FilterSidebar({
  selectedCategories,
  selectedJobTypes,
  selectedFarmTypes,
  selectedBenefits,
  sortBy,
  onFilterChange,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState({
    categories: true,
    jobTypes: true,
    farmTypes: false,
    benefits: false,
  });

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onFilterChange({ categories: newCategories });
  };

  const toggleJobType = (type: string) => {
    const newTypes = selectedJobTypes.includes(type)
      ? selectedJobTypes.filter((t) => t !== type)
      : [...selectedJobTypes, type];
    onFilterChange({ jobTypes: newTypes });
  };

  const toggleFarmType = (type: string) => {
    const newTypes = selectedFarmTypes.includes(type)
      ? selectedFarmTypes.filter((t) => t !== type)
      : [...selectedFarmTypes, type];
    onFilterChange({ farmTypes: newTypes });
  };

  const toggleBenefit = (benefit: string) => {
    const newBenefits = selectedBenefits.includes(benefit)
      ? selectedBenefits.filter((b) => b !== benefit)
      : [...selectedBenefits, benefit];
    onFilterChange({ benefits: newBenefits });
  };

  return (
    <div className="space-y-6">
        {/* Sort */}
        <div className="card p-4">
          <h3 className="font-display text-forest mb-3">Sort by</h3>
          <div className="space-y-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => onFilterChange({ sortBy: option.id })}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  sortBy === option.id
                    ? "bg-primary/5 text-primary border-l-2 border-primary font-medium"
                    : "hover:bg-gray-50 text-forest-light"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="card p-4">
          <button
            onClick={() => setIsOpen({ ...isOpen, categories: !isOpen.categories })}
            className="w-full flex items-center justify-between font-display text-forest mb-3"
          >
            <span>Categories</span>
            {isOpen.categories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen.categories && (
            <div className="space-y-2">
              {JOB_CATEGORIES.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-forest-light flex items-center gap-1">
                    <span>{category.emoji}</span>
                    <span>{category.label}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Job Type */}
        <div className="card p-4">
          <button
            onClick={() => setIsOpen({ ...isOpen, jobTypes: !isOpen.jobTypes })}
            className="w-full flex items-center justify-between font-display text-forest mb-3"
          >
            <span>Job Type</span>
            {isOpen.jobTypes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen.jobTypes && (
            <div className="space-y-2">
              {JOB_TYPES.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedJobTypes.includes(type.id)}
                    onChange={() => toggleJobType(type.id)}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-forest-light">{type.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Farm Type */}
        <div className="card p-4">
          <button
            onClick={() => setIsOpen({ ...isOpen, farmTypes: !isOpen.farmTypes })}
            className="w-full flex items-center justify-between font-display text-forest mb-3"
          >
            <span>Farm Type</span>
            {isOpen.farmTypes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen.farmTypes && (
            <div className="space-y-2">
              {FARM_TYPES.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedFarmTypes.includes(type.id)}
                    onChange={() => toggleFarmType(type.id)}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-forest-light flex items-center gap-1">
                    <span>{type.emoji}</span>
                    <span>{type.label}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="card p-4">
          <button
            onClick={() => setIsOpen({ ...isOpen, benefits: !isOpen.benefits })}
            className="w-full flex items-center justify-between font-display text-forest mb-3"
          >
            <span>Benefits</span>
            {isOpen.benefits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isOpen.benefits && (
            <div className="space-y-2">
              {BENEFITS.map((benefit) => (
                <label
                  key={benefit.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(benefit.id)}
                    onChange={() => toggleBenefit(benefit.id)}
                    className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-forest-light flex items-center gap-1">
                    <span>{benefit.emoji}</span>
                    <span>{benefit.label}</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
