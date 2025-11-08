# Location Fields Migration Guide

This guide walks you through migrating from a single `location` field to structured location fields (city, state, postalCode, remote).

## What Changed

### Before
- Single `location` field: `"Portland, Oregon"`

### After
- `city`: `"Portland"`
- `state`: `"OR"` (2-letter state code)
- `postalCode`: `"97204"` (optional)
- `remote`: `false` (boolean)
- `location`: `"Portland, OR"` (auto-generated display string for backward compatibility)

## Migration Steps

### 1. Run Database Migration

First, ensure you have your DATABASE_URL configured in `.env`:

```bash
# Copy .env.example to .env if you haven't already
cp .env.example .env

# Edit .env and add your DATABASE_URL
```

Then run the SQL migration:

```bash
# If using PostgreSQL directly:
psql $DATABASE_URL < prisma/migrations/add_structured_location_fields.sql

# OR if using Prisma (recommended):
npx prisma migrate dev --name add_structured_location_fields
```

This will:
- Add new columns: `city`, `state`, `postalCode`, `remote`
- Attempt to parse existing `location` data
- Make `city` and `state` required fields

### 2. Generate Prisma Client

After running the migration, regenerate the Prisma client:

```bash
npx prisma generate
```

### 3. Migrate Existing Data (Optional)

If you have existing job data that wasn't properly parsed by the SQL migration, run the TypeScript migration script:

```bash
# Install tsx if you haven't already
npm install -D tsx

# Run the migration script
npx tsx scripts/migrate-location-data.ts
```

This script will:
- Parse existing location strings in "City, State" format
- Convert state names to 2-letter codes (e.g., "Oregon" → "OR")
- Detect remote positions from "(Remote)" suffix
- Update all jobs with structured location data
- Provide a summary of successes and failures

### 4. Verify the Migration

Check that your data was migrated correctly:

```bash
# Open Prisma Studio to inspect the data
npx prisma studio
```

Look for jobs and verify:
- `city` field is populated
- `state` field contains 2-letter codes (e.g., "OR", "CA")
- `location` field is properly formatted
- `remote` field is set correctly for remote jobs

## Schema.org / SEO Benefits

The structured location fields improve SEO and Google JobPosting compliance:

### Before (Brittle)
```json
{
  "jobLocation": {
    "@type": "Place",
    "address": {
      "addressLocality": "Portland",  // ❌ Parsed from string - could break
      "addressRegion": "Oregon",       // ❌ Not a valid state code
      "addressCountry": "US"
    }
  }
}
```

### After (Robust)
```json
{
  "jobLocation": {
    "@type": "Place",
    "address": {
      "addressLocality": "Portland",   // ✅ Direct from city field
      "addressRegion": "OR",            // ✅ Valid 2-letter state code
      "postalCode": "97204",            // ✅ Optional postal code
      "addressCountry": "US"
    }
  },
  "jobLocationType": "TELECOMMUTE"    // ✅ Set for remote jobs
}
```

## Rollback (If Needed)

If you need to rollback the migration:

```sql
-- WARNING: This will delete the new columns
ALTER TABLE "Job" DROP COLUMN IF EXISTS "city";
ALTER TABLE "Job" DROP COLUMN IF EXISTS "state";
ALTER TABLE "Job" DROP COLUMN IF EXISTS "postalCode";
ALTER TABLE "Job" DROP COLUMN IF EXISTS "remote";
```

Then revert the Prisma schema and regenerate:

```bash
git checkout prisma/schema.prisma
npx prisma generate
```

## Testing

After migration, test the following:

1. **Create a new job posting**
   - Visit `/post-job`
   - Fill out the form with city, state, postal code
   - Check the "Remote Position" box
   - Verify the preview shows the correct location
   - Complete payment and verify job appears correctly

2. **View existing jobs**
   - Visit `/` (homepage)
   - Verify all job cards show locations correctly
   - Click on a job to view details
   - Verify location displays correctly on detail page

3. **Check structured data**
   - View a job detail page
   - Inspect the page source
   - Find the `<script type="application/ld+json">` tag
   - Verify the `jobLocation` has correct `addressLocality` and `addressRegion`

4. **Validate with Google**
   - Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
   - Test a job detail page URL
   - Verify no errors in JobPosting structured data

## Troubleshooting

### Error: "column city does not exist"
You need to run the database migration first (Step 1).

### Error: "column city violates not-null constraint"
Some jobs don't have city/state data. Run the migration script (Step 3) to parse existing locations.

### State appears as full name instead of code
The migration script converts state names to codes. If some weren't converted, you may need to manually update them or add mappings to the script.

### Remote jobs don't show "(Remote)"
Check that the `remote` boolean field is set to `true`. The display location is auto-generated based on this field.

## Questions?

If you encounter issues during migration, check:
1. Database connection is working
2. All environment variables are set
3. Prisma client is generated (`npx prisma generate`)
4. Migration script has execute permissions

For additional help, consult the Next.js and Prisma documentation.
