/**
 * Fix missing Recommendation(s) field in admissionConsiderations
 *
 * Many large state schools and UC system don't require/consider recommendations.
 * Add "Not Considered" for these schools.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Schools that don't use recommendations (or Not Considered)
const NO_RECOMMENDATIONS_SCHOOLS = [
  // UC System - doesn't accept recommendations
  "university-of-california-berkeley",
  "university-of-california-los-angeles",
  "university-of-california-san-diego",
  "university-of-california-davis",
  "university-of-california-irvine",
  "university-of-california-santa-barbara",
  "university-of-california-santa-cruz",
  "university-of-california-riverside",
  "university-of-california-merced",
  // CSU System
  "cal-poly-san-luis-obispo",
  "san-diego-state-university",
  "cal-state-fullerton",
  "cal-state-long-beach",
  "san-jose-state-university",
  // Large state schools that don't require recommendations
  "university-of-florida",
  "penn-state-university",
  "university-of-minnesota-twin-cities",
  "university-of-minnesota",
  "arizona-state-university",
  "george-mason-university",
  "texas-am-university",
  "university-of-tennessee",
  "university-of-mississippi",
  "university-of-south-florida",
  "university-of-central-florida",
  "florida-state-university",
  "university-of-texas-austin",
  "university-of-texas-dallas",
  "university-of-arizona",
  "university-of-colorado-boulder",
  "colorado-state-university",
  "university-of-iowa",
  "iowa-state-university",
  "university-of-kansas",
  "kansas-state-university",
  "university-of-oregon",
  "oregon-state-university",
  "washington-state-university",
  "indiana-university-bloomington",
  "purdue-university",
];

async function main() {
  console.log("Adding Recommendation(s) field to schools that don't use recommendations...\n");

  let updated = 0;

  for (const slug of NO_RECOMMENDATIONS_SCHOOLS) {
    const school = await db.college.findUnique({
      where: { slug },
      select: { id: true, name: true, admissionConsiderations: true },
    });

    if (!school) {
      console.log(`School not found: ${slug}`);
      continue;
    }

    if (!school.admissionConsiderations) {
      console.log(`No admissionConsiderations for: ${slug}`);
      continue;
    }

    const parsed = JSON.parse(school.admissionConsiderations) as Record<string, string>;

    // Check if Recommendations or Recommendation(s) is already present
    const hasRecommendations = Object.keys(parsed).some(
      (k) => k.toLowerCase() === "recommendations" || k.toLowerCase() === "recommendation(s)"
    );

    if (hasRecommendations) {
      console.log(`Already has recommendations field: ${school.name}`);
      continue;
    }

    // Add Recommendation(s) as Not Considered
    parsed["Recommendation(s)"] = "Not Considered";

    await db.college.update({
      where: { id: school.id },
      data: { admissionConsiderations: JSON.stringify(parsed) },
    });

    console.log(`Updated: ${school.name}`);
    updated++;
  }

  console.log(`\n✓ Updated ${updated} schools`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
