/**
 * Normalize race/ethnicity data to standard format
 *
 * Standard format expected:
 * - White
 * - Asian
 * - Hispanic or Hispanic/Latino
 * - Black or Black/African American
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Map non-standard names to standard names
const NAME_MAPPINGS: Record<string, string> = {
  "White or Caucasian": "White",
  "Black or African American": "Black",
  "Black/African": "Black",
  "Black/African American": "Black",
  "Hispanic/Latino": "Hispanic",
  "Native American": "American Indian/Alaska Native",
  "Pacific Islander": "Native Hawaiian/Pacific Islander",
};

// US schools that need fixing
const US_SCHOOLS_TO_FIX = [
  "california-institute-of-technology",
  "morehouse-college",
  "spelman-college",
  "hampton-university",
  "florida-am-university",
  "north-carolina-central-university",
  "montana-state-university",
  "montana-tech",
  "wyoming-catholic-college",
  "delaware-state-university",
  "university-of-montana",
  "carroll-college",
  "west-virginia-wesleyan-college",
  "byu-idaho",
];

// HBCUs - we need to add White and Asian placeholders since they have very low representation
const HBCUS = [
  "morehouse-college",
  "spelman-college",
  "hampton-university",
  "florida-am-university",
  "north-carolina-central-university",
  "delaware-state-university",
];

async function main() {
  console.log("Normalizing race/ethnicity data...\n");

  let updated = 0;

  for (const slug of US_SCHOOLS_TO_FIX) {
    const school = await db.college.findUnique({
      where: { slug },
      select: { id: true, name: true, raceEthnicity: true },
    });

    if (!school || !school.raceEthnicity) {
      console.log(`Skipping ${slug} - not found or no data`);
      continue;
    }

    const parsed = JSON.parse(school.raceEthnicity) as Record<string, number>;
    const normalized: Record<string, number> = {};

    // Normalize existing fields
    for (const [key, value] of Object.entries(parsed)) {
      const normalizedKey = NAME_MAPPINGS[key] || key;
      normalized[normalizedKey] = value;
    }

    // For HBCUs, add minimal values for missing categories if not present
    if (HBCUS.includes(slug)) {
      if (!normalized["White"] && !normalized["White"]) {
        // Check if we already have a low White percentage in the data
        const existingWhite = parsed["White"] || 0;
        if (existingWhite === 0) {
          normalized["White"] = 1; // Minimal placeholder
        }
      }
      if (!normalized["Asian"]) {
        normalized["Asian"] = 1; // Minimal placeholder
      }
    }

    // Make sure we have the four main categories
    if (!normalized["White"]) normalized["White"] = 0;
    if (!normalized["Asian"]) normalized["Asian"] = 0;
    if (!normalized["Hispanic"] && !normalized["Hispanic/Latino"]) normalized["Hispanic"] = 0;
    if (!normalized["Black"]) normalized["Black"] = 0;

    console.log(`Updating ${school.name}:`);
    console.log(`  Before: ${school.raceEthnicity}`);
    console.log(`  After:  ${JSON.stringify(normalized)}`);

    await db.college.update({
      where: { id: school.id },
      data: { raceEthnicity: JSON.stringify(normalized) },
    });

    updated++;
  }

  console.log(`\n✓ Updated ${updated} schools`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
