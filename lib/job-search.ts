import type { Prisma } from "@prisma/client";
import { US_STATES } from "@/lib/constants";

export const MAX_SEARCH_QUERY_LENGTH = 100;

export interface PublicJobFilters {
  search: string;
  state?: string;
  categories: string[];
  jobTypes: string[];
  farmTypes: string[];
  benefits: string[];
  sortBy: string;
}

export interface JobSearchIntent {
  query: string;
  keywords: string;
  stateCode?: string;
  stateName?: string;
}

const STATES_BY_NAME = [...US_STATES].sort((a, b) => b.name.length - a.name.length);
type StateOption = (typeof US_STATES)[number];

const STATE_BY_CODE = new Map<string, StateOption>(US_STATES.map((state) => [state.code, state]));
const STATE_BY_NAME = new Map<string, StateOption>(US_STATES.map((state) => [state.name.toLowerCase(), state]));

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeSearchQuery(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SEARCH_QUERY_LENGTH);
}

function cleanRemainingKeywords(value: string) {
  return normalizeSearchQuery(value)
    .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "")
    .replace(/\b(?:in|near|around|within)\s*$/i, "")
    .replace(/^[,;:\-\s]+|[,;:\-\s]+$/g, "")
    .trim();
}

function withoutMatch(query: string, start: number, length: number) {
  return cleanRemainingKeywords(`${query.slice(0, start)} ${query.slice(start + length)}`);
}

function exactState(value: string) {
  return STATE_BY_CODE.get(value.toUpperCase()) ?? STATE_BY_NAME.get(value.toLowerCase());
}

export function parseJobSearch(value: string | null | undefined): JobSearchIntent {
  const query = normalizeSearchQuery(value);
  if (!query) return { query, keywords: "" };

  const exactMatch = exactState(query);
  if (exactMatch) {
    return {
      query,
      keywords: "",
      stateCode: exactMatch.code,
      stateName: exactMatch.name,
    };
  }

  for (const state of STATES_BY_NAME) {
    const pattern = new RegExp(`(^|[\\s,])(${escapeRegExp(state.name)})(?=$|[\\s,])`, "i");
    const match = pattern.exec(query);
    if (!match || match.index === undefined) continue;

    const stateStart = match.index + match[1].length;
    return {
      query,
      keywords: withoutMatch(query, stateStart, state.name.length),
      stateCode: state.code,
      stateName: state.name,
    };
  }

  // In mixed searches, require an uppercase state code (or a comma-delimited
  // code) so ordinary words such as "in", "or", and "me" are not mistaken
  // for Indiana, Oregon, and Maine.
  const uppercaseCodePattern = /(^|[\s,])([A-Z]{2})(?=$|[\s,])/g;
  for (const match of query.matchAll(uppercaseCodePattern)) {
    const state = STATE_BY_CODE.get(match[2]);
    if (!state || match.index === undefined) continue;

    const codeStart = match.index + match[1].length;
    return {
      query,
      keywords: withoutMatch(query, codeStart, state.code.length),
      stateCode: state.code,
      stateName: state.name,
    };
  }

  const commaCodeMatch = /,\s*([a-z]{2})$/i.exec(query);
  const commaState = commaCodeMatch ? STATE_BY_CODE.get(commaCodeMatch[1].toUpperCase()) : undefined;
  if (commaCodeMatch && commaState && commaCodeMatch.index !== undefined) {
    return {
      query,
      keywords: withoutMatch(query, commaCodeMatch.index, commaCodeMatch[0].length),
      stateCode: commaState.code,
      stateName: commaState.name,
    };
  }

  return { query, keywords: query };
}

function stateCondition(stateCode: string, stateName: string): Prisma.JobWhereInput {
  return {
    OR: [
      { state: stateCode },
      { state: stateName },
    ],
  };
}

export function buildPublicJobWhere(filters: PublicJobFilters, now = new Date()): Prisma.JobWhereInput {
  const searchIntent = parseJobSearch(filters.search);
  const explicitStateQuery = normalizeSearchQuery(filters.state);
  const explicitState = explicitStateQuery ? exactState(explicitStateQuery) : undefined;
  const andConditions: Prisma.JobWhereInput[] = [];

  if (searchIntent.stateCode && searchIntent.stateName) {
    andConditions.push(stateCondition(searchIntent.stateCode, searchIntent.stateName));
  }

  if (explicitState) {
    andConditions.push(stateCondition(explicitState.code, explicitState.name));
  } else if (explicitStateQuery) {
    // Preserve the API's previous fail-closed behavior for unknown state values.
    andConditions.push({ state: explicitStateQuery });
  }

  if (searchIntent.keywords) {
    andConditions.push({
      OR: [
        { title: { contains: searchIntent.keywords, mode: "insensitive" } },
        { company: { contains: searchIntent.keywords, mode: "insensitive" } },
        { city: { contains: searchIntent.keywords, mode: "insensitive" } },
        { location: { contains: searchIntent.keywords, mode: "insensitive" } },
        { description: { contains: searchIntent.keywords, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.JobWhereInput = {
    active: true,
    expiresAt: { gt: now },
    ...(andConditions.length > 0 && { AND: andConditions }),
  };

  if (filters.categories.length > 0) where.categories = { hasSome: filters.categories };
  if (filters.jobTypes.length > 0) where.jobType = { hasSome: filters.jobTypes };
  if (filters.farmTypes.length > 0) where.farmType = { hasSome: filters.farmTypes };
  if (filters.benefits.length > 0) where.benefits = { hasSome: filters.benefits };

  return where;
}
