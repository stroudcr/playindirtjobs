/**
 * Migration Script: Parse existing location strings into structured fields
 *
 * This script reads existing Job records with location strings in "City, State" format
 * and populates the new structured fields: city, state, postalCode, remote
 *
 * Usage:
 *   npx tsx scripts/migrate-location-data.ts
 *
 * Prerequisites:
 *   npm install tsx (if not already installed)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map of state names to state codes
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
  // Also accept 2-letter codes
  'al': 'AL', 'ak': 'AK', 'az': 'AZ', 'ar': 'AR', 'ca': 'CA', 'co': 'CO',
  'ct': 'CT', 'de': 'DE', 'fl': 'FL', 'ga': 'GA', 'hi': 'HI', 'id': 'ID',
  'il': 'IL', 'in': 'IN', 'ia': 'IA', 'ks': 'KS', 'ky': 'KY', 'la': 'LA',
  'me': 'ME', 'md': 'MD', 'ma': 'MA', 'mi': 'MI', 'mn': 'MN', 'ms': 'MS',
  'mo': 'MO', 'mt': 'MT', 'ne': 'NE', 'nv': 'NV', 'nh': 'NH', 'nj': 'NJ',
  'nm': 'NM', 'ny': 'NY', 'nc': 'NC', 'nd': 'ND', 'oh': 'OH', 'ok': 'OK',
  'or': 'OR', 'pa': 'PA', 'ri': 'RI', 'sc': 'SC', 'sd': 'SD', 'tn': 'TN',
  'tx': 'TX', 'ut': 'UT', 'vt': 'VT', 'va': 'VA', 'wa': 'WA', 'wv': 'WV',
  'wi': 'WI', 'wy': 'WY', 'dc': 'DC',
};

interface ParsedLocation {
  city: string;
  state: string;
  remote: boolean;
}

function parseLocation(location: string): ParsedLocation | null {
  if (!location) return null;

  // Check for remote indicator
  const remote = /\(remote\)/i.test(location);
  const cleanedLocation = location.replace(/\(remote\)/gi, '').trim();

  // Try to parse "City, State" format
  const parts = cleanedLocation.split(',').map(p => p.trim());

  if (parts.length >= 2) {
    const city = parts[0];
    const stateInput = parts[1].toLowerCase();
    const stateCode = STATE_NAME_TO_CODE[stateInput] || stateInput.toUpperCase();

    // Validate state code is 2 letters
    if (stateCode.length === 2) {
      return { city, state: stateCode, remote };
    }
  }

  // If we only have one part, assume it's a city and we don't know the state
  if (parts.length === 1 && parts[0]) {
    console.warn(`Could not parse state from location: "${location}"`);
    return { city: parts[0], state: 'XX', remote }; // XX = unknown state
  }

  return null;
}

async function migrateLocationData() {
  console.log('Starting location data migration...\n');

  try {
    // Fetch all jobs that need migration
    // Note: In production schema, city and state are required,
    // but during migration they might be null
    const jobs = await prisma.job.findMany({
      where: {
        location: {
          not: ''
        }
      }
    });

    console.log(`Found ${jobs.length} jobs to process\n`);

    let successCount = 0;
    let failCount = 0;
    const failures: Array<{ id: string; location: string; reason: string }> = [];

    for (const job of jobs) {
      try {
        const parsed = parseLocation(job.location);

        if (parsed) {
          // Update the job with parsed location data
          await prisma.job.update({
            where: { id: job.id },
            data: {
              city: parsed.city,
              state: parsed.state,
              remote: parsed.remote,
              // Keep the original location string for display
              location: parsed.remote
                ? `${parsed.city}, ${parsed.state} (Remote)`
                : `${parsed.city}, ${parsed.state}`
            }
          });

          successCount++;
          console.log(`✅ Updated job ${job.id}: ${job.location} → ${parsed.city}, ${parsed.state}${parsed.remote ? ' (Remote)' : ''}`);
        } else {
          failCount++;
          failures.push({
            id: job.id,
            location: job.location,
            reason: 'Could not parse location format'
          });
          console.log(`❌ Failed to parse job ${job.id}: ${job.location}`);
        }
      } catch (error) {
        failCount++;
        failures.push({
          id: job.id,
          location: job.location,
          reason: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ Error updating job ${job.id}:`, error);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total jobs processed: ${jobs.length}`);
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (failures.length > 0) {
      console.log('\nFailed jobs:');
      failures.forEach(f => {
        console.log(`  - ID: ${f.id}, Location: "${f.location}", Reason: ${f.reason}`);
      });
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateLocationData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
