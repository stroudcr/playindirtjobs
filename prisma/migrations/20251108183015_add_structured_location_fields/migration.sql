-- CreateTable or AlterTable: Add structured location fields to Job table

-- Step 1: Add new columns as nullable first (to handle existing rows)
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "remote" BOOLEAN DEFAULT false NOT NULL;

-- Step 2: Migrate existing location data by parsing "City, State" format
UPDATE "Job"
SET
  "city" = TRIM(SPLIT_PART("location", ',', 1)),
  "state" = TRIM(SPLIT_PART("location", ',', 2))
WHERE "location" IS NOT NULL
  AND "location" != ''
  AND "city" IS NULL;

-- Step 3: Handle edge cases - set defaults for any empty values
UPDATE "Job"
SET "state" = 'XX'
WHERE ("state" = '' OR "state" IS NULL);

UPDATE "Job"
SET "city" = 'Unknown'
WHERE ("city" = '' OR "city" IS NULL);

-- Step 4: Now make city and state required (NOT NULL)
ALTER TABLE "Job" ALTER COLUMN "city" SET NOT NULL;
ALTER TABLE "Job" ALTER COLUMN "state" SET NOT NULL;

-- Step 5: Update location field to be consistently formatted
UPDATE "Job"
SET "location" = CONCAT("city", ', ', "state")
WHERE "city" IS NOT NULL AND "state" IS NOT NULL;
