'use client';

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFiltersProps {
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

export function MobileFilters(props: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 btn btn-primary shadow-lg flex items-center gap-2 px-4 py-3 rounded-full"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span className="font-semibold">Filters</span>
        {(props.selectedCategories.length +
          props.selectedJobTypes.length +
          props.selectedFarmTypes.length +
          props.selectedBenefits.length) > 0 && (
          <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {props.selectedCategories.length +
             props.selectedJobTypes.length +
             props.selectedFarmTypes.length +
             props.selectedBenefits.length}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto ${
          isOpen ? 'animate-slide-in-right' : 'translate-x-full'
        }`}
        style={{ display: isOpen ? undefined : 'none' }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-display text-forest">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <X className="w-6 h-6 text-forest" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4">
          <FilterSidebar {...props} />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-4 py-4">
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-primary w-full justify-center"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}
