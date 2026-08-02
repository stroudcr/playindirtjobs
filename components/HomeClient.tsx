"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { JobCard } from "@/components/JobCard";
import { EmployerCTA } from "@/components/EmployerCTA";
import { FilterSidebar } from "@/components/FilterSidebar";
import { MobileFilters } from "@/components/MobileFilters";
import { EmailSubscribe } from "@/components/EmailSubscribe";

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
  initialTotal: number;
  initialFilters: {
    search: string;
    categories: string[];
    jobTypes: string[];
    farmTypes: string[];
    benefits: string[];
    sortBy: string;
  };
}

export function HomeClient({ initialJobs, initialTotal, initialFilters }: HomeClientProps) {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [totalJobs, setTotalJobs] = useState(Math.max(initialTotal, initialJobs.length));
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(initialFilters.jobTypes);
  const [selectedFarmTypes, setSelectedFarmTypes] = useState<string[]>(initialFilters.farmTypes);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(initialFilters.benefits);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialFilters.search || window.location.hash !== "#jobs") return;

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById("jobs")?.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialFilters.search]);

  const fetchJobs = useCallback(async ({
    signal,
    offset = 0,
  }: {
    signal?: AbortSignal;
    offset?: number;
  } = {}) => {
    const appending = offset > 0;
    if (appending) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategories.length) params.append("categories", selectedCategories.join(","));
      if (selectedJobTypes.length) params.append("jobTypes", selectedJobTypes.join(","));
      if (selectedFarmTypes.length) params.append("farmTypes", selectedFarmTypes.join(","));
      if (selectedBenefits.length) params.append("benefits", selectedBenefits.join(","));
      if (sortBy) params.append("sortBy", sortBy);
      if (offset > 0) params.append("offset", String(offset));

      const response = await fetch(`/api/jobs?${params.toString()}`, { signal });
      if (!response.ok) throw new Error(`Job search failed with status ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data.jobs)) throw new Error("Job search returned an invalid response");
      if (!Number.isSafeInteger(data.total) || data.total < 0) {
        throw new Error("Job search returned an invalid total");
      }

      const nextJobs = data.jobs.map((job: Job & { createdAt: string }) => ({
        ...job,
        createdAt: new Date(job.createdAt),
      }));

      if (appending) {
        setJobs((currentJobs) => {
          const existingIds = new Set(currentJobs.map((job) => job.id));
          return [
            ...currentJobs,
            ...nextJobs.filter((job: Job) => !existingIds.has(job.id)),
          ];
        });
      } else {
        setJobs(nextJobs);
      }
      setTotalJobs(Math.max(data.total, offset + nextJobs.length));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error fetching jobs:", error);
      setError("We couldn’t refresh the results. Please try again.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
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
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchJobs({ signal: controller.signal }), 150);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [hasInteracted, fetchJobs]);

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
    <div id="jobs" className="container mx-auto scroll-mt-24 px-4 py-8">
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
          {/* Active filters */}
          {(searchQuery ||
            selectedCategories.length > 0 ||
            selectedJobTypes.length > 0 ||
            selectedFarmTypes.length > 0 ||
            selectedBenefits.length > 0) && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-forest-light">Active filters:</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setHasInteracted(true);
                    setSearchQuery("");
                  }}
                  aria-label={`Remove search ${searchQuery}`}
                  className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full hover:bg-primary/30"
                >
                  “{searchQuery}” <span aria-hidden="true">×</span>
                </button>
              )}
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

          {error && (
            <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <span>{error}</span>
              <button type="button" onClick={() => void fetchJobs()} className="font-semibold underline underline-offset-2">
                Try again
              </button>
            </div>
          )}

          {/* Loading state - skeleton cards */}
          {loading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-11 h-11 rounded-lg bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-4 mb-3">
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-20" />
                    <div className="h-4 bg-gray-100 rounded w-16" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-100 rounded w-16" />
                    <div className="h-6 bg-gray-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-14">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-semibold text-forest mb-2">
                No jobs found
              </h3>
              <p className="text-forest-light mb-6">
                {searchQuery
                  ? <>We couldn’t find a match for “{searchQuery}”. Try another role or location.</>
                  : "Try adjusting your filters or search query"}
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
              <div className="mx-auto mt-10 max-w-2xl text-left">
                <EmployerCTA source="search_empty_state" compact />
              </div>
            </div>
          )}

          {/* Job grid */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-4">
              <p role="status" aria-live="polite" className="text-sm text-forest-light mb-4">
                Showing <span className="font-semibold text-forest">{jobs.length}</span> of{" "}
                <span className="font-semibold text-forest">{totalJobs}</span> active job{totalJobs !== 1 ? "s" : ""}
                {searchQuery ? <> for <span className="font-semibold text-forest">“{searchQuery}”</span></> : null}
              </p>
              <div className="grid gap-4 animate-stagger">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {jobs.length < totalJobs && (
                <div className="flex justify-center pt-4">
                  <button
                    type="button"
                    onClick={() => void fetchJobs({ offset: jobs.length })}
                    disabled={loadingMore}
                    className="btn btn-primary min-w-44 justify-center disabled:cursor-wait disabled:opacity-70"
                  >
                    {loadingMore ? "Loading more jobs…" : "Load more jobs"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
