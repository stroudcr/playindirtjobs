"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobCard } from "@/components/JobCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MobileFilters } from "@/components/MobileFilters";
import { EmailSubscribe } from "@/components/EmailSubscribe";
import { Loader2 } from "lucide-react";

interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  categories: string[];
  jobType: string[];
  featured: boolean;
  createdAt: Date;
}

interface HomeClientProps {
  initialJobs: Job[];
  initialFilters: {
    search: string;
    categories: string[];
    jobTypes: string[];
    farmTypes: string[];
    benefits: string[];
    sortBy: string;
  };
}

export function HomeClient({ initialJobs, initialFilters }: HomeClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialFilters.jobTypes);
  const [selectedFarmTypes, setSelectedFarmTypes] = useState<string[]>(initialFilters.farmTypes);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(initialFilters.benefits);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [hasInteracted, setHasInteracted] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategories.length) params.append("categories", selectedCategories.join(","));
      if (selectedJobTypes.length) params.append("jobTypes", selectedJobTypes.join(","));
      if (selectedFarmTypes.length) params.append("farmTypes", selectedFarmTypes.join(","));
      if (selectedBenefits.length) params.append("benefits", selectedBenefits.join(","));
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();

      setJobs(data.jobs.map((job: Job & { createdAt: string }) => ({
        ...job,
        createdAt: new Date(job.createdAt),
      })));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories, selectedJobTypes, selectedFarmTypes, selectedBenefits, sortBy]);

  // Update URL when filters change (after first interaction)
  useEffect(() => {
    if (!hasInteracted) return;

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (selectedJobTypes.length) params.set("jobTypes", selectedJobTypes.join(","));
    if (selectedFarmTypes.length) params.set("farmTypes", selectedFarmTypes.join(","));
    if (selectedBenefits.length) params.set("benefits", selectedBenefits.join(","));
    if (sortBy && sortBy !== "latest") params.set("sortBy", sortBy);

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : "/", { scroll: false });
  }, [searchQuery, selectedCategories, selectedJobTypes, selectedFarmTypes, selectedBenefits, sortBy, hasInteracted, router]);

  // Fetch jobs client-side when filters change (after first interaction)
  useEffect(() => {
    if (!hasInteracted) return;
    fetchJobs();
  }, [hasInteracted, fetchJobs]);

  const handleSearch = (query: string) => {
    setHasInteracted(true);
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: {
    categories?: string[];
    jobTypes?: string[];
    farmTypes?: string[];
    benefits?: string[];
    sortBy?: string;
  }) => {
    setHasInteracted(true);
    if (filters.categories !== undefined) setSelectedCategories(filters.categories);
    if (filters.jobTypes !== undefined) setSelectedJobTypes(filters.jobTypes);
    if (filters.farmTypes !== undefined) setSelectedFarmTypes(filters.farmTypes);
    if (filters.benefits !== undefined) setSelectedBenefits(filters.benefits);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <EmailSubscribe />
          <FilterSidebar
            selectedCategories={selectedCategories}
            selectedJobTypes={selectedJobTypes}
            selectedFarmTypes={selectedFarmTypes}
            selectedBenefits={selectedBenefits}
            sortBy={sortBy}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filters */}
        <MobileFilters
          selectedCategories={selectedCategories}
          selectedJobTypes={selectedJobTypes}
          selectedFarmTypes={selectedFarmTypes}
          selectedBenefits={selectedBenefits}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
        />

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          {/* Search bar within the listings area */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialQuery={initialFilters.search} />
          </div>

          {/* Active filters */}
          {(selectedCategories.length > 0 ||
            selectedJobTypes.length > 0 ||
            selectedFarmTypes.length > 0 ||
            selectedBenefits.length > 0) && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-forest-light">Active filters:</span>
              {[
                ...selectedCategories,
                ...selectedJobTypes,
                ...selectedFarmTypes,
                ...selectedBenefits,
              ].map((filter) => (
                <span
                  key={filter}
                  className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full"
                >
                  {filter.replace("-", " ")}
                </span>
              ))}
              <button
                onClick={() => {
                  setHasInteracted(true);
                  setSelectedCategories([]);
                  setSelectedJobTypes([]);
                  setSelectedFarmTypes([]);
                  setSelectedBenefits([]);
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty state */}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-semibold text-forest mb-2">
                No jobs found
              </h3>
              <p className="text-forest-light mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setHasInteracted(true);
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setSelectedJobTypes([]);
                  setSelectedFarmTypes([]);
                  setSelectedBenefits([]);
                }}
                className="btn btn-primary"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Job grid */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-forest-light mb-4">
                Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </p>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
