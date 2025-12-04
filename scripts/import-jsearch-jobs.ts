/**
 * JSearch Job Import Script
 *
 * One-time script to import farm, garden, and ranch jobs from RapidAPI JSearch.
 *
 * Usage:
 *   npx tsx scripts/import-jsearch-jobs.ts
 *
 * Prerequisites:
 *   - Set RAPIDAPI_KEY in your .env file
 *   - Run `npx prisma generate` if not already done
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com';
const PLACEHOLDER_EMAIL = 'playindirtjobs@welldiem.com';

const SEARCH_QUERIES = [
  'farm hand in South Dakota',
  'gardener in South Dakota',
  'ranch hand in South Dakota',
  'agricultural worker in South Dakota',
];

const JOBS_PER_QUERY = 5;

// JSearch API response types
interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_apply_link: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_employment_type: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
  job_is_remote: boolean;
}

interface ImportResult {
  success: boolean;
  jobId?: string;
  error?: string;
  jsearchId: string;
  title: string;
}

// State name to code mapping
const STATE_NAME_TO_CODE: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY', 'district of columbia': 'DC',
};

// Category keywords for inference
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'farm-hand': ['farm hand', 'farm worker', 'farm labor', 'farmhand', 'agricultural labor', 'farm assistant'],
  'gardener': ['gardener', 'garden', 'horticultur', 'landscape', 'groundskeeper', 'lawn care'],
  'ranch-hand': ['ranch hand', 'ranch worker', 'rancher', 'cowboy', 'cattle', 'wrangler'],
  'agricultural-tech': ['agricultural technician', 'ag tech', 'precision agriculture', 'farm technology'],
  'permaculture': ['permaculture', 'sustainable agriculture'],
  'farm-manager': ['farm manager', 'farm supervisor', 'farm director', 'agricultural manager', 'farm foreman'],
  'livestock-care': ['livestock', 'animal care', 'dairy', 'poultry', 'swine', 'sheep', 'goat'],
  'harvest-worker': ['harvest', 'picker', 'field worker', 'crop worker', 'fruit picker'],
  'nursery-worker': ['nursery', 'greenhouse worker', 'propagation', 'plant care'],
  'apiculture': ['bee', 'apiculture', 'apiary', 'honey', 'beekeeper'],
  'viticulture': ['vineyard', 'viticulture', 'grape', 'winery', 'wine'],
  'aquaponics': ['aquaponics', 'hydroponics', 'aquaculture', 'fish farm'],
  'marketing': ['marketing', 'farmers market', 'sales coordinator', 'farm marketing'],
  'retail': ['retail', 'farm store', 'sales associate', 'customer service'],
  'kitchen': ['kitchen', 'food processing', 'canning', 'preserving', 'farm to table'],
};

// Farm type keywords for inference
const FARM_TYPE_KEYWORDS: Record<string, string[]> = {
  'organic': ['organic', 'certified organic', 'usda organic'],
  'conventional': ['conventional', 'commercial farm'],
  'permaculture': ['permaculture', 'food forest'],
  'regenerative': ['regenerative', 'no-till', 'cover crop'],
  'biodynamic': ['biodynamic', 'demeter'],
  'csa': ['csa', 'community supported', 'farm share'],
  'garden': ['garden', 'urban farm', 'market garden'],
  'ranch': ['ranch', 'cattle', 'livestock operation'],
  'small-scale': ['small farm', 'family farm', 'small-scale'],
  'large-scale': ['large-scale', 'commercial', 'industrial'],
  'indoor': ['greenhouse', 'indoor', 'hydroponic', 'vertical farm'],
  'agritourism': ['agritourism', 'farm tour', 'educational farm', 'farm stay'],
};

// Employment type mapping
const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  'FULLTIME': 'full-time',
  'FULL_TIME': 'full-time',
  'FULL-TIME': 'full-time',
  'PARTTIME': 'part-time',
  'PART_TIME': 'part-time',
  'PART-TIME': 'part-time',
  'CONTRACTOR': 'contract',
  'CONTRACT': 'contract',
  'TEMPORARY': 'temporary',
  'TEMP': 'temporary',
  'INTERN': 'internship',
  'INTERNSHIP': 'internship',
};

// Query to primary category mapping
const QUERY_TO_CATEGORY: Record<string, string> = {
  'farm hand': 'farm-hand',
  'gardener': 'gardener',
  'ranch hand': 'ranch-hand',
  'agricultural worker': 'farm-hand',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function normalizeStateCode(stateInput: string): string | null {
  if (!stateInput) return null;

  const input = stateInput.toLowerCase().trim();

  // Check if it's already a valid 2-letter code
  if (input.length === 2) {
    const upperCode = input.toUpperCase();
    const isValid = Object.values(STATE_NAME_TO_CODE).includes(upperCode);
    return isValid ? upperCode : null;
  }

  // Try to find by state name
  const code = STATE_NAME_TO_CODE[input];
  return code || null;
}

function sanitizeDescription(description: string): string {
  // Remove HTML tags
  let cleaned = description.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Ensure minimum length (100 chars required by schema)
  if (cleaned.length < 100) {
    cleaned = cleaned + '\n\nFor more details about this position and to apply, please visit the application link provided.';
  }

  // Truncate if too long (5000 chars max)
  if (cleaned.length > 5000) {
    cleaned = cleaned.substring(0, 4990) + '...';
  }

  return cleaned;
}

function inferCategories(title: string, description: string, searchQuery: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const categories: string[] = [];

  // Add primary category from search query
  const primaryCategory = QUERY_TO_CATEGORY[searchQuery];
  if (primaryCategory) {
    categories.push(primaryCategory);
  }

  // Scan for additional categories (max 3 total)
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (categories.includes(category)) continue;
    if (categories.length >= 3) break;

    if (keywords.some(keyword => text.includes(keyword))) {
      categories.push(category);
    }
  }

  // Default to 'other' if no categories found
  return categories.length > 0 ? categories : ['other'];
}

function inferFarmTypes(description: string, title: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const farmTypes: string[] = [];

  for (const [farmType, keywords] of Object.entries(FARM_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      farmTypes.push(farmType);
    }
  }

  // Default to 'other' if nothing matched
  return farmTypes.length > 0 ? farmTypes : ['other'];
}

function mapEmploymentType(jsearchType: string | null): string[] {
  if (!jsearchType) return ['full-time'];

  const mapped = EMPLOYMENT_TYPE_MAP[jsearchType.toUpperCase()];
  return mapped ? [mapped] : ['full-time'];
}

function mapSalaryPeriod(period: string | null): string {
  if (!period) return 'annual';

  const periodMap: Record<string, string> = {
    'YEAR': 'annual',
    'YEARLY': 'annual',
    'ANNUAL': 'annual',
    'HOUR': 'hourly',
    'HOURLY': 'hourly',
    'MONTH': 'annual',
    'MONTHLY': 'annual',
  };

  return periodMap[period.toUpperCase()] || 'annual';
}

async function checkDuplicate(title: string, company: string): Promise<boolean> {
  const existing = await prisma.job.findFirst({
    where: {
      title: { equals: title, mode: 'insensitive' },
      company: { equals: company, mode: 'insensitive' },
    },
  });
  return !!existing;
}

async function fetchJobs(query: string): Promise<JSearchJob[]> {
  const url = new URL('https://jsearch.p.rapidapi.com/search');
  url.searchParams.set('query', query);
  url.searchParams.set('page', '1');
  url.searchParams.set('num_pages', '1');
  url.searchParams.set('country', 'us');
  url.searchParams.set('date_posted', 'month');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return (data.data || []).slice(0, JOBS_PER_QUERY);
}

async function importJob(jsearchJob: JSearchJob, searchQuery: string): Promise<ImportResult> {
  const resultBase = { jsearchId: jsearchJob.job_id, title: jsearchJob.job_title || 'Unknown' };

  try {
    // Validation checks
    if (!jsearchJob.job_title || jsearchJob.job_title.length < 5) {
      return { success: false, error: 'Title too short or missing', ...resultBase };
    }

    if (!jsearchJob.employer_name || jsearchJob.employer_name.length < 2) {
      return { success: false, error: 'Company name too short or missing', ...resultBase };
    }

    if (!jsearchJob.job_city) {
      return { success: false, error: 'Missing city', ...resultBase };
    }

    const stateCode = normalizeStateCode(jsearchJob.job_state);
    if (!stateCode) {
      return { success: false, error: `Invalid or missing state: ${jsearchJob.job_state}`, ...resultBase };
    }

    if (jsearchJob.job_country?.toUpperCase() !== 'US') {
      return { success: false, error: 'Not a US job', ...resultBase };
    }

    if (!jsearchJob.job_apply_link) {
      return { success: false, error: 'Missing apply link', ...resultBase };
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicate(jsearchJob.job_title, jsearchJob.employer_name);
    if (isDuplicate) {
      return { success: false, error: 'Duplicate job already exists', ...resultBase };
    }

    // Sanitize and validate description
    const description = sanitizeDescription(jsearchJob.job_description || '');
    if (description.length < 100) {
      return { success: false, error: 'Description too short after sanitization', ...resultBase };
    }

    // Generate unique slug
    const timestamp = Date.now();
    const slugBase = slugify(`${jsearchJob.job_title}-${jsearchJob.employer_name}`);
    const slug = `${slugBase}-${timestamp}`;

    // Build location string
    const location = jsearchJob.job_is_remote
      ? `${jsearchJob.job_city}, ${stateCode} (Remote)`
      : `${jsearchJob.job_city}, ${stateCode}`;

    // Create job data (editToken auto-generated by Prisma)
    const jobData = {
      slug,
      title: jsearchJob.job_title,
      company: jsearchJob.employer_name,
      description,
      city: jsearchJob.job_city,
      state: stateCode,
      location,
      remote: jsearchJob.job_is_remote ?? false,
      salaryMin: jsearchJob.job_min_salary ?? null,
      salaryMax: jsearchJob.job_max_salary ?? null,
      salaryType: mapSalaryPeriod(jsearchJob.job_salary_period),
      categories: inferCategories(jsearchJob.job_title, description, searchQuery),
      jobType: mapEmploymentType(jsearchJob.job_employment_type),
      farmType: inferFarmTypes(description, jsearchJob.job_title),
      tags: [] as string[],
      benefits: [] as string[],
      companyEmail: PLACEHOLDER_EMAIL,
      companyLogo: jsearchJob.employer_logo ?? null,
      companyWebsite: jsearchJob.employer_website ?? null,
      applyUrl: jsearchJob.job_apply_link,
      applyEmail: null,
      active: true,
      featured: false,
      views: 0,
      stripePaymentId: null,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    };

    const created = await prisma.job.create({ data: jobData });

    return { success: true, jobId: created.id, ...resultBase };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...resultBase,
    };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('JSearch Job Import Script');
  console.log('='.repeat(60));

  if (!RAPIDAPI_KEY) {
    console.error('\nERROR: RAPIDAPI_KEY environment variable is not set');
    console.error('Add RAPIDAPI_KEY to your .env file and try again.');
    process.exit(1);
  }

  const results: ImportResult[] = [];

  for (const query of SEARCH_QUERIES) {
    console.log(`\nSearching for: "${query}"...`);

    try {
      const jobs = await fetchJobs(query);
      console.log(`  Found ${jobs.length} jobs`);

      for (const job of jobs) {
        const result = await importJob(job, query);
        results.push(result);

        if (result.success) {
          console.log(`  ✅ Imported: ${result.title}`);
        } else {
          console.log(`  ❌ Skipped: ${result.title} - ${result.error}`);
        }
      }

      // Rate limiting: wait 1 second between queries
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ERROR fetching "${query}":`, error instanceof Error ? error.message : error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Import Summary');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Total processed: ${results.length}`);
  console.log(`✅ Successfully imported: ${successful.length}`);
  console.log(`❌ Failed/Skipped: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed/Skipped jobs:');
    failed.forEach(f => console.log(`  - ${f.title}: ${f.error}`));
  }

  console.log('\n✨ Import complete!');
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
