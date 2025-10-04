"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedFarmTypes, setSelectedFarmTypes] = useState<string[]>([]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");

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

      setJobs(data.jobs.map((job: any) => ({
        ...job,
        createdAt: new Date(job.createdAt),
      })));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories, selectedJobTypes, selectedFarmTypes, selectedBenefits, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (filters: {
    categories?: string[];
    jobTypes?: string[];
    farmTypes?: string[];
    benefits?: string[];
    sortBy?: string;
  }) => {
    if (filters.categories !== undefined) setSelectedCategories(filters.categories);
    if (filters.jobTypes !== undefined) setSelectedJobTypes(filters.jobTypes);
    if (filters.farmTypes !== undefined) setSelectedFarmTypes(filters.farmTypes);
    if (filters.benefits !== undefined) setSelectedBenefits(filters.benefits);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
  };

  return (
    <main className="min-h-screen bg-earth-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-earth-cream to-accent-yellow/10 border-b border-border">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="max-w-3xl mx-auto text-center mb-4 md:mb-8">
            <div className="flex justify-center mb-4 md:mb-6">
              <img
                src="/images/PlayInDirtLogo.PNG"
                alt="PlayInDirtJobs - Farm, Garden & Ranch Jobs"
                className="h-64 sm:h-96 md:h-128 lg:h-192 w-auto max-w-full"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest mb-3 md:mb-4">
              Find Farming, Gardening & Ranch Jobs
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-forest-light mb-6 md:mb-8 px-4">
              Discover sustainable agriculture careers, organic farming positions, and ranch work opportunities across America.
              <span className="hidden sm:inline"> Build a sustainable future, one job at a time.</span>
            </p>
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Main Content */}
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

      {/* Browse by Category Section */}
      <section className="bg-forest/5 border-y border-border py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-forest mb-8 text-center">Browse Jobs by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            <a href="/farming-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="font-semibold text-forest mb-1">Farming Jobs</h3>
              <p className="text-sm text-forest-light">General farm work</p>
            </a>
            <a href="/gardening-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="font-semibold text-forest mb-1">Gardening Jobs</h3>
              <p className="text-sm text-forest-light">Horticulture careers</p>
            </a>
            <a href="/ranch-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🐄</div>
              <h3 className="font-semibold text-forest mb-1">Ranch Jobs</h3>
              <p className="text-sm text-forest-light">Livestock & cattle</p>
            </a>
            <a href="/organic-farm-jobs" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="font-semibold text-forest mb-1">Organic Farms</h3>
              <p className="text-sm text-forest-light">Certified organic</p>
            </a>
            <a href="/farm-apprenticeships" className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border border-border">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold text-forest mb-1">Apprenticeships</h3>
              <p className="text-sm text-forest-light">Learn & earn</p>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content Footer */}
      <section className="bg-earth-cream py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">Popular Job Searches</h3>
              <ul className="space-y-2 text-forest-light">
                <li><a href="/farming-jobs" className="hover:text-primary">Farming Jobs</a></li>
                <li><a href="/gardening-jobs" className="hover:text-primary">Gardening Jobs</a></li>
                <li><a href="/ranch-jobs" className="hover:text-primary">Ranch Hand Jobs</a></li>
                <li><a href="/organic-farm-jobs" className="hover:text-primary">Organic Farm Jobs</a></li>
                <li><a href="/farm-apprenticeships" className="hover:text-primary">Farm Apprenticeships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">Job Types</h3>
              <ul className="space-y-2 text-forest-light">
                <li>Full-time Farm Jobs</li>
                <li>Part-time Agriculture Work</li>
                <li>Seasonal Harvest Jobs</li>
                <li>Farm Internships</li>
                <li>Remote Agriculture Positions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest mb-4">About PlayInDirtJobs</h3>
              <p className="text-forest-light leading-relaxed">
                PlayInDirtJobs is the premier job board connecting agriculture professionals with sustainable farming, gardening, and ranching opportunities nationwide. Whether you're seeking organic farm positions, ranch hand work, or agricultural apprenticeships, we help you build a meaningful career in sustainable agriculture.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-forest mb-4">Find Your Dream Agriculture Career</h2>
            <p className="text-forest-light leading-relaxed mb-4">
              The agriculture industry offers diverse career paths from hands-on farming and gardening to ranch management and sustainable agriculture leadership. PlayInDirtJobs features the most comprehensive collection of farming jobs, gardening positions, and ranch work opportunities in the United States.
            </p>
            <p className="text-forest-light leading-relaxed">
              Our platform serves organic farms, regenerative agriculture operations, livestock ranches, nurseries, vineyards, and community gardens. Browse full-time, part-time, seasonal, and apprenticeship positions. Start your sustainable agriculture career today.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
