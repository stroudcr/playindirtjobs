/**
 * Additive JSearch job importer.
 *
 * Usage:
 *   npm run jobs:import -- --target=20 --dry-run
 *   npm run jobs:import -- --target=20
 *
 * Prerequisites:
 *   - Set RAPIDAPI_KEY in .env
 *   - Run `npx prisma generate` if not already done
 */

import { createHash } from 'node:crypto';
import { PrismaClient, type Prisma } from '@prisma/client';
import {
  BENEFITS,
  FARM_TYPES,
  JOB_CATEGORIES,
  JOB_TYPES,
  TAGS,
  US_STATES,
} from '../lib/constants';

const prisma = new PrismaClient();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';
const PLACEHOLDER_EMAIL = 'playindirtjobs@welldiem.com';
const DEFAULT_TARGET = 20;
const DEFAULT_DATE_POSTED = 'month';
const RESULTS_PER_QUERY = 10;
const REQUEST_DELAY_MS = 750;

const VALID_DATE_POSTED_VALUES = new Set(['all', 'today', '3days', 'week', 'month']);
const VALID_CATEGORY_IDS = new Set<string>(JOB_CATEGORIES.map((category) => category.id));
const VALID_FARM_TYPE_IDS = new Set<string>(FARM_TYPES.map((farmType) => farmType.id));
const VALID_JOB_TYPE_IDS = new Set<string>(JOB_TYPES.map((jobType) => jobType.id));
const VALID_TAG_IDS = new Set<string>(TAGS.map((tag) => tag.id));
const VALID_BENEFIT_IDS = new Set<string>(BENEFITS.map((benefit) => benefit.id));

const SEARCH_QUERIES = [
  'farm hand in California',
  'farm worker in United States',
  'organic farm worker',
  'farm manager agriculture',
  'ranch hand in Texas',
  'cattle ranch worker',
  'livestock farm worker',
  'harvest worker agriculture',
  'greenhouse grower',
  'greenhouse worker agriculture',
  'horticulture farm worker',
  'nursery grower agriculture',
  'vegetable farm worker',
  'dairy farm worker',
  'poultry farm worker',
  'vineyard worker',
  'orchard worker',
  'irrigation technician agriculture',
  'agricultural equipment operator',
  'regenerative agriculture jobs',
  'permaculture farm jobs',
  'farm apprentice agriculture',
  'apiary beekeeper',
  'aquaponics technician',
  'farmers market farm coordinator',
  'CSA farm coordinator',
  'agritourism farm jobs',
  'soil health agriculture jobs',
];

interface CliOptions {
  target: number;
  dryRun: boolean;
  datePosted: string;
  help: boolean;
}

interface JSearchJob {
  job_id?: string | null;
  job_title?: string | null;
  employer_name?: string | null;
  job_description?: string | null;
  job_city?: string | null;
  job_state?: string | null;
  job_country?: string | null;
  job_apply_link?: string | null;
  employer_logo?: string | null;
  employer_website?: string | null;
  job_employment_type?: string | null;
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;
  job_salary_period?: string | null;
  job_is_remote?: boolean | null;
}

interface Candidate {
  jsearchId: string;
  sourceQuery: string;
  title: string;
  company: string;
  applyUrl: string;
  data: Prisma.JobCreateInput;
}

interface Rejection {
  title: string;
  company: string;
  reason: string;
}

interface BuildCandidateResult {
  candidate?: Candidate;
  rejection?: Rejection;
}

const STATE_NAME_TO_CODE = new Map(
  US_STATES.flatMap((state) => [
    [state.code.toLowerCase(), state.code],
    [state.name.toLowerCase(), state.code],
  ])
);

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'farm-hand': [
    'farm hand',
    'farm worker',
    'farm labor',
    'farmhand',
    'field worker',
    'field hand',
    'agricultural worker',
    'equipment operator',
    'irrigation',
  ],
  gardener: [
    'gardener',
    'garden',
    'horticulture',
    'horticultural',
    'groundskeeper',
    'landscape gardener',
  ],
  'ranch-hand': [
    'ranch hand',
    'ranch worker',
    'wrangler',
    'cowboy',
    'cattle',
    'pasture',
  ],
  'agricultural-tech': [
    'agricultural technician',
    'ag tech',
    'precision agriculture',
    'irrigation technician',
    'equipment technician',
    'soil health',
  ],
  permaculture: ['permaculture', 'food forest'],
  'farm-manager': [
    'farm manager',
    'farm supervisor',
    'farm director',
    'agricultural manager',
    'ranch manager',
    'greenhouse manager',
    'orchard manager',
  ],
  'livestock-care': [
    'livestock',
    'animal care',
    'dairy',
    'poultry',
    'cattle',
    'sheep',
    'goat',
    'swine',
    'equine',
    'horse',
  ],
  'harvest-worker': ['harvest', 'picker', 'crop worker', 'fruit picker', 'packing shed'],
  'nursery-worker': ['nursery', 'propagation', 'greenhouse', 'plant care'],
  apiculture: ['bee', 'apiary', 'honey', 'beekeeper', 'beekeeping'],
  viticulture: ['vineyard', 'viticulture', 'grape', 'winery'],
  aquaponics: ['aquaponics', 'hydroponics', 'aquaculture', 'fish farm'],
  marketing: ['marketing', 'farmers market', 'sales coordinator', 'farm coordinator', 'csa coordinator'],
  retail: ['farm store', 'retail', 'market associate'],
  kitchen: ['farm kitchen', 'food processing', 'canning', 'preserving', 'farm to table'],
};

const FARM_TYPE_KEYWORDS: Record<string, string[]> = {
  agritourism: ['agritourism', 'farm tour', 'farm stay', 'u-pick', 'u pick'],
  organic: ['organic', 'certified organic', 'usda organic'],
  conventional: ['conventional', 'commercial farm', 'row crop', 'grain farm'],
  permaculture: ['permaculture', 'food forest'],
  regenerative: ['regenerative', 'soil health', 'no-till', 'cover crop', 'rotational grazing'],
  biodynamic: ['biodynamic', 'demeter'],
  csa: ['csa', 'community supported agriculture', 'farm share'],
  garden: ['garden', 'market garden', 'urban farm'],
  ranch: ['ranch', 'cattle', 'pasture', 'grazing', 'livestock'],
  'small-scale': ['small farm', 'family farm', 'small-scale', 'market farm'],
  'large-scale': ['large-scale', 'commercial', 'industrial', 'acre operation'],
  indoor: ['greenhouse', 'indoor', 'hydroponic', 'vertical farm', 'aquaponic'],
};

const TAG_KEYWORDS: Record<string, string[]> = {
  sustainable: ['sustainable', 'organic', 'regenerative', 'permaculture', 'soil health'],
  'animal-care': ['livestock', 'cattle', 'dairy', 'poultry', 'horse', 'sheep', 'goat', 'bee'],
  'crop-production': ['crop', 'vegetable', 'fruit', 'harvest', 'orchard', 'vineyard', 'greenhouse'],
  machinery: ['tractor', 'equipment', 'machinery', 'irrigation', 'mechanic'],
  marketing: ['marketing', 'social media', 'newsletter', 'outreach'],
  sales: ['sales', 'retail', 'farmers market', 'farm store', 'csa'],
  education: ['education', 'workshop', 'apprentice', 'intern', 'training', 'school'],
  processing: ['processing', 'packing', 'wash pack', 'canning', 'preserving', 'cheese', 'dairy'],
  greenhouse: ['greenhouse', 'hoop house', 'hydroponic', 'indoor'],
  outdoor: ['outdoor', 'field', 'pasture', 'orchard', 'vineyard'],
  physical: ['physical', 'lift', 'standing', 'field work'],
  'beginner-friendly': ['no experience', 'will train', 'entry level', 'beginner'],
};

const BENEFIT_KEYWORDS: Record<string, string[]> = {
  housing: ['housing', 'room and board', 'lodging'],
  meals: ['meals', 'food provided', 'room and board'],
  equipment: ['equipment provided', 'tools provided', 'company vehicle'],
  learning: ['training', 'education', 'apprentice', 'learning', 'workshop'],
  'profit-sharing': ['profit sharing', 'bonus', 'performance bonus'],
  'health-insurance': ['health insurance', 'medical insurance', 'health benefits'],
  'flexible-hours': ['flexible schedule', 'flexible hours'],
  transportation: ['transportation', 'company vehicle', 'vehicle provided'],
};

const FARM_RELATED_TERMS = [
  'agriculture',
  'agricultural',
  'farm',
  'farming',
  'farmer',
  'ranch',
  'ranching',
  'cattle',
  'livestock',
  'dairy',
  'poultry',
  'greenhouse',
  'garden',
  'gardener',
  'horticulture',
  'horticultural',
  'orchard',
  'vineyard',
  'harvest',
  'crop',
  'vegetable',
  'fruit',
  'nursery grower',
  'plant nursery',
  'permaculture',
  'regenerative',
  'organic',
  'irrigation',
  'apiary',
  'beekeeper',
  'aquaponics',
  'hydroponic',
  'soil health',
  'csa',
  'farmers market',
];

const STRONG_FARM_OPERATION_TERMS = [
  'agriculture',
  'agricultural',
  'ranch',
  'cattle',
  'livestock',
  'dairy',
  'poultry',
  'greenhouse',
  'horticulture',
  'orchard',
  'vineyard',
  'harvest',
  'crop',
  'vegetable',
  'fruit',
  'plant nursery',
  'permaculture',
  'regenerative',
  'irrigation',
  'apiary',
  'beekeeper',
  'aquaponics',
  'hydroponic',
  'soil health',
  'csa',
  'farmers market',
];

const CHILDCARE_TERMS = [
  'childcare',
  'child care',
  'daycare',
  'pre-school',
  'preschool',
  'infant',
  'toddler',
  'children',
  'kids',
  'church nursery',
  'nursery attendant',
  'nursery teacher',
];

const UNRELATED_TERMS = [
  'warehouse associate',
  'software engineer',
  'security officer',
  'restaurant server',
  'cashier',
  'retail associate',
  'truck driver cdl',
  'delivery driver',
  'forklift operator',
];

const LANDSCAPING_TERMS = [
  'landscaping',
  'lawn care',
  'mowing',
  'hardscape',
  'snow removal',
  'grounds maintenance',
];

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    target: DEFAULT_TARGET,
    dryRun: false,
    datePosted: DEFAULT_DATE_POSTED,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg.startsWith('--target=')) {
      const value = Number(arg.slice('--target='.length));
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error('--target must be a positive integer');
      }
      options.target = value;
      continue;
    }

    if (arg.startsWith('--date-posted=')) {
      const value = arg.slice('--date-posted='.length).trim();
      if (!VALID_DATE_POSTED_VALUES.has(value)) {
        throw new Error(
          `--date-posted must be one of: ${Array.from(VALID_DATE_POSTED_VALUES).join(', ')}`
        );
      }
      options.datePosted = value;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`JSearch farm job importer

Usage:
  npm run jobs:import -- --target=20 --dry-run
  npm run jobs:import -- --target=20

Options:
  --target=<number>       Number of jobs to add. Defaults to 20.
  --dry-run               Fetch and validate jobs without inserting them.
  --date-posted=<value>   JSearch date filter: all, today, 3days, week, month.
                          Defaults to month.
  --help                  Show this help text.
`);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(value: string | null | undefined): string {
  return value?.replace(/\s+/g, ' ').trim() ?? '';
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function shortHash(value: string): string {
  return createHash('sha1').update(value).digest('hex').slice(0, 8);
}

function buildSlug(job: RequiredJobFields): string {
  const base = slugify(`${job.title}-${job.company}-${job.city}-${job.state}`);
  return `${base}-${shortHash(job.jsearchId)}`;
}

function normalizeStateCode(value: string | null | undefined): string | null {
  const normalized = normalizeText(value).toLowerCase();
  return STATE_NAME_TO_CODE.get(normalized) ?? null;
}

function normalizeCountry(value: string | null | undefined): string {
  return normalizeText(value).toLowerCase();
}

function isUsJob(value: string | null | undefined): boolean {
  const country = normalizeCountry(value);
  return ['us', 'usa', 'united states', 'united states of america'].includes(country);
}

function normalizeUrl(value: string | null | undefined): string | null {
  const raw = normalizeText(value);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function sanitizeDescription(description: string): string {
  let cleaned = description.replace(/<[^>]*>/g, ' ');

  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (cleaned.length > 5000) {
    cleaned = `${cleaned.slice(0, 4997)}...`;
  }

  return cleaned;
}

function getFalsePositiveReason(title: string, description: string): string | null {
  const text = `${title} ${description}`.toLowerCase();
  const hasFarmTerm = containsAny(text, FARM_RELATED_TERMS);

  if (!hasFarmTerm) {
    return 'not farm/agriculture related';
  }

  if (containsAny(text, CHILDCARE_TERMS) && !containsAny(text, ['plant nursery', 'nursery grower'])) {
    return 'childcare nursery false positive';
  }

  if (containsAny(text, UNRELATED_TERMS) && !containsAny(text, STRONG_FARM_OPERATION_TERMS)) {
    return 'unrelated job false positive';
  }

  if (
    containsAny(text, LANDSCAPING_TERMS) &&
    !containsAny(text, ['farm', 'agriculture', 'horticulture', 'greenhouse', 'nursery grower', 'plant nursery'])
  ) {
    return 'landscaping-only false positive';
  }

  return null;
}

function inferIds(text: string, keywordMap: Record<string, string[]>, validIds: Set<string>, fallback: string) {
  const ids: string[] = [];

  for (const [id, keywords] of Object.entries(keywordMap)) {
    if (!validIds.has(id)) continue;
    if (containsAny(text, keywords)) {
      ids.push(id);
    }
  }

  return ids.length > 0 ? ids : [fallback];
}

function inferCategories(title: string, description: string, sourceQuery: string): string[] {
  const text = `${title} ${description} ${sourceQuery}`.toLowerCase();
  const categories = inferIds(text, CATEGORY_KEYWORDS, VALID_CATEGORY_IDS, 'farm-hand');
  return categories.slice(0, 3);
}

function inferFarmTypes(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  return inferIds(text, FARM_TYPE_KEYWORDS, VALID_FARM_TYPE_IDS, 'other').slice(0, 3);
}

function inferTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  return inferIds(text, TAG_KEYWORDS, VALID_TAG_IDS, 'outdoor').slice(0, 4);
}

function inferBenefits(description: string): string[] {
  const text = description.toLowerCase();
  const benefits = inferIds(text, BENEFIT_KEYWORDS, VALID_BENEFIT_IDS, '');
  return benefits.filter(Boolean).slice(0, 4);
}

function mapEmploymentType(value: string | null | undefined): string[] {
  const normalized = normalizeText(value).toUpperCase().replace(/[\s-]/g, '_');
  const map: Record<string, string> = {
    FULLTIME: 'full-time',
    FULL_TIME: 'full-time',
    PARTTIME: 'part-time',
    PART_TIME: 'part-time',
    CONTRACTOR: 'contract',
    CONTRACT: 'contract',
    TEMPORARY: 'temporary',
    TEMP: 'temporary',
    INTERN: 'internship',
    INTERNSHIP: 'internship',
    APPRENTICE: 'apprenticeship',
    APPRENTICESHIP: 'apprenticeship',
  };

  const mapped = map[normalized] ?? 'full-time';
  return VALID_JOB_TYPE_IDS.has(mapped) ? [mapped] : ['full-time'];
}

function normalizeSalary(job: JSearchJob): Pick<Prisma.JobCreateInput, 'salaryMin' | 'salaryMax' | 'salaryType'> {
  const currency = normalizeText(job.job_salary_currency).toUpperCase();
  if (currency && currency !== 'USD') {
    return { salaryMin: null, salaryMax: null, salaryType: 'annual' };
  }

  const min = typeof job.job_min_salary === 'number' && Number.isFinite(job.job_min_salary)
    ? job.job_min_salary
    : null;
  const max = typeof job.job_max_salary === 'number' && Number.isFinite(job.job_max_salary)
    ? job.job_max_salary
    : null;

  if (min === null && max === null) {
    return { salaryMin: null, salaryMax: null, salaryType: 'annual' };
  }

  const period = normalizeText(job.job_salary_period).toUpperCase();
  let multiplier = 1;
  let salaryType: 'annual' | 'hourly' = 'annual';

  if (['HOUR', 'HOURLY'].includes(period)) {
    salaryType = 'hourly';
  } else if (['DAY', 'DAILY'].includes(period)) {
    multiplier = 260;
  } else if (['WEEK', 'WEEKLY'].includes(period)) {
    multiplier = 52;
  } else if (['MONTH', 'MONTHLY'].includes(period)) {
    multiplier = 12;
  } else if (!period && Math.max(min ?? 0, max ?? 0) <= 250) {
    salaryType = 'hourly';
  }

  let salaryMin = min === null ? null : Math.round(min * multiplier);
  let salaryMax = max === null ? null : Math.round(max * multiplier);

  if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    [salaryMin, salaryMax] = [salaryMax, salaryMin];
  }

  return { salaryMin, salaryMax, salaryType };
}

interface RequiredJobFields {
  jsearchId: string;
  title: string;
  company: string;
  city: string;
  state: string;
}

async function fetchJobs(query: string, datePosted: string): Promise<JSearchJob[]> {
  const url = new URL('https://jsearch.p.rapidapi.com/search');
  url.searchParams.set('query', query);
  url.searchParams.set('page', '1');
  url.searchParams.set('num_pages', '1');
  url.searchParams.set('country', 'us');
  url.searchParams.set('date_posted', datePosted);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`JSearch request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const payload = await response.json() as { data?: JSearchJob[] };
  return (payload.data ?? []).slice(0, RESULTS_PER_QUERY);
}

async function isExistingDuplicate(candidate: {
  title: string;
  company: string;
  applyUrl: string;
  slug: string;
}): Promise<boolean> {
  const existing = await prisma.job.findFirst({
    where: {
      OR: [
        {
          title: { equals: candidate.title, mode: 'insensitive' },
          company: { equals: candidate.company, mode: 'insensitive' },
        },
        { applyUrl: candidate.applyUrl },
        { slug: candidate.slug },
      ],
    },
    select: { id: true },
  });

  return !!existing;
}

async function buildCandidate(
  job: JSearchJob,
  sourceQuery: string,
  seenKeys: Set<string>
): Promise<BuildCandidateResult> {
  const title = normalizeText(job.job_title);
  const company = normalizeText(job.employer_name);
  const jsearchId = normalizeText(job.job_id) || shortHash(`${title}-${company}-${job.job_apply_link ?? ''}`);
  const city = normalizeText(job.job_city);
  const state = normalizeStateCode(job.job_state);
  const applyUrl = normalizeUrl(job.job_apply_link);
  const companyWebsite = normalizeUrl(job.employer_website);
  const companyLogo = normalizeUrl(job.employer_logo);
  const description = sanitizeDescription(job.job_description ?? '');

  const rejectionBase = { title: title || 'Unknown title', company: company || 'Unknown company' };

  if (title.length < 5) return { rejection: { ...rejectionBase, reason: 'title too short or missing' } };
  if (company.length < 2) return { rejection: { ...rejectionBase, reason: 'company missing' } };
  if (!isUsJob(job.job_country)) return { rejection: { ...rejectionBase, reason: 'not a US job' } };
  if (!city) return { rejection: { ...rejectionBase, reason: 'city missing' } };
  if (!state) return { rejection: { ...rejectionBase, reason: `state invalid or missing: ${job.job_state ?? ''}` } };
  if (!applyUrl) return { rejection: { ...rejectionBase, reason: 'real apply URL missing' } };
  if (description.length < 100) return { rejection: { ...rejectionBase, reason: 'description too short' } };

  const falsePositiveReason = getFalsePositiveReason(title, description);
  if (falsePositiveReason) {
    return { rejection: { ...rejectionBase, reason: falsePositiveReason } };
  }

  const slug = buildSlug({ jsearchId, title, company, city, state });
  const inRunKeys = [
    `id:${jsearchId}`,
    `apply:${applyUrl}`,
    `title-company-location:${title.toLowerCase()}|${company.toLowerCase()}|${city.toLowerCase()}|${state}`,
    `slug:${slug}`,
  ];

  if (inRunKeys.some((key) => seenKeys.has(key))) {
    return { rejection: { ...rejectionBase, reason: 'duplicate in fetched results' } };
  }

  if (await isExistingDuplicate({ title, company, applyUrl, slug })) {
    return { rejection: { ...rejectionBase, reason: 'duplicate already exists in database' } };
  }

  inRunKeys.forEach((key) => seenKeys.add(key));

  const location = job.job_is_remote ? `${city}, ${state} (Remote)` : `${city}, ${state}`;
  const salary = normalizeSalary(job);

  return {
    candidate: {
      jsearchId,
      sourceQuery,
      title,
      company,
      applyUrl,
      data: {
        slug,
        title,
        company,
        description,
        city,
        state,
        location,
        remote: job.job_is_remote ?? false,
        ...salary,
        jobType: mapEmploymentType(job.job_employment_type),
        farmType: inferFarmTypes(title, description),
        categories: inferCategories(title, description, sourceQuery),
        tags: inferTags(title, description),
        benefits: inferBenefits(description),
        companyEmail: PLACEHOLDER_EMAIL,
        managementEmail: PLACEHOLDER_EMAIL,
        companyLogo,
        companyWebsite,
        applyUrl,
        applyEmail: null,
        featured: false,
        active: true,
        origin: 'IMPORTED',
        publishedAt: new Date(),
        views: 0,
        stripePaymentId: null,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    },
  };
}

function summarizeRejections(rejections: Rejection[]) {
  const counts = new Map<string, number>();

  for (const rejection of rejections) {
    counts.set(rejection.reason, (counts.get(rejection.reason) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }));
}

async function collectCandidates(options: CliOptions) {
  const candidates: Candidate[] = [];
  const rejections: Rejection[] = [];
  const seenKeys = new Set<string>();
  let fetchedCount = 0;

  for (const query of SEARCH_QUERIES) {
    if (candidates.length >= options.target) break;

    console.log(`Searching "${query}"...`);
    const jobs = await fetchJobs(query, options.datePosted);
    fetchedCount += jobs.length;
    console.log(`  Found ${jobs.length} postings`);

    for (const job of jobs) {
      if (candidates.length >= options.target) break;

      const result = await buildCandidate(job, query, seenKeys);
      if (result.candidate) {
        candidates.push(result.candidate);
        console.log(`  Accepted ${candidates.length}/${options.target}: ${result.candidate.title} at ${result.candidate.company}`);
      } else if (result.rejection) {
        rejections.push(result.rejection);
      }
    }

    if (candidates.length < options.target) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return { candidates, rejections, fetchedCount };
}

async function insertCandidates(candidates: Candidate[]) {
  return prisma.$transaction(
    candidates.map((candidate) => prisma.job.create({ data: candidate.data }))
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  console.log('='.repeat(72));
  console.log('Additive JSearch farm job importer');
  console.log('='.repeat(72));
  console.log(`Target: ${options.target}`);
  console.log(`Date posted: ${options.datePosted}`);
  console.log(`Dry run: ${options.dryRun ? 'yes' : 'no'}`);

  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY environment variable is not set. Add it to .env and try again.');
  }

  const { candidates, rejections, fetchedCount } = await collectCandidates(options);

  console.log('\n' + '='.repeat(72));
  console.log('Candidate summary');
  console.log('='.repeat(72));
  console.log(`Fetched: ${fetchedCount}`);
  console.log(`Eligible new jobs: ${candidates.length}`);
  console.log(`Rejected/skipped: ${rejections.length}`);

  for (const { reason, count } of summarizeRejections(rejections).slice(0, 8)) {
    console.log(`  ${count} - ${reason}`);
  }

  if (candidates.length < options.target) {
    throw new Error(
      `Only found ${candidates.length} eligible new jobs; target is ${options.target}. No jobs were inserted.`
    );
  }

  const selectedCandidates = candidates.slice(0, options.target);

  console.log('\nSelected jobs:');
  selectedCandidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.title} at ${candidate.company} (${candidate.data.location})`);
  });

  if (options.dryRun) {
    console.log('\nDry run complete. No jobs were inserted.');
    return;
  }

  const beforeCount = await prisma.job.count();
  const created = await insertCandidates(selectedCandidates);
  const afterCount = await prisma.job.count();

  console.log('\n' + '='.repeat(72));
  console.log('Import complete');
  console.log('='.repeat(72));
  console.log(`Inserted: ${created.length}`);
  console.log(`Job count before: ${beforeCount}`);
  console.log(`Job count after: ${afterCount}`);

  if (created.length !== options.target || afterCount - beforeCount !== options.target) {
    throw new Error('Import completed, but inserted count did not match the requested target.');
  }
}

main()
  .catch((error) => {
    console.error('\nERROR:', error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
