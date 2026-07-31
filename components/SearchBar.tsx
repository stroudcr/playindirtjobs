import { Search } from "lucide-react";
import { JOB_CATEGORIES, US_STATES_WITHOUT_DC } from "@/lib/constants";
import { MAX_SEARCH_QUERY_LENGTH } from "@/lib/job-search";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  return (
    <div className="mt-8">
      <form
        action="/#jobs"
        method="get"
        role="search"
        className="flex w-full flex-col overflow-hidden rounded-lg border border-[#d8d5cb] bg-white sm:flex-row"
      >
        <label htmlFor="hero-job-search" className="sr-only">
          Search by job title, skill, city, or state
        </label>
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-light"
          />
          <input
            id="hero-job-search"
            name="search"
            type="search"
            list="job-search-suggestions"
            defaultValue={initialQuery}
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Job, skill, city, or state"
            aria-describedby="job-search-hint"
            className="h-14 w-full bg-transparent pl-12 pr-4 text-base text-forest outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/60"
          />
          <datalist id="job-search-suggestions">
            {US_STATES_WITHOUT_DC.map((state) => (
              <option key={state.code} value={state.name}>{state.code}</option>
            ))}
            {JOB_CATEGORIES.map((category) => (
              <option key={category.id} value={category.label} />
            ))}
          </datalist>
        </div>
        <button
          type="submit"
          className="min-h-14 bg-primary px-7 font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:min-w-[164px]"
        >
          Search jobs
        </button>
      </form>
      <p id="job-search-hint" className="mt-2 text-sm text-forest-light">
        Try “farm worker in Florida” or choose a state suggestion.
      </p>
    </div>
  );
}
