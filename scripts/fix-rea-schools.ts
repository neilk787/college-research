/**
 * Fix Restrictive Early Action (REA) / Single-Choice Early Action (SCEA) schools
 *
 * Many elite schools have REA or SCEA, not regular Early Action (EA).
 * This is an important distinction for college admissions.
 *
 * REA/SCEA means students can only apply to ONE school early with certain exceptions.
 * Regular EA allows students to apply to multiple schools early.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Schools with Restrictive Early Action or Single-Choice Early Action
const REA_SCEA_SCHOOLS = [
  // SCEA (Single-Choice Early Action) - Most restrictive
  { slug: "harvard-university", type: "SCEA" },
  { slug: "yale-university", type: "SCEA" },
  { slug: "princeton-university", type: "SCEA" },
  { slug: "stanford-university", type: "REA" },

  // REA (Restrictive Early Action)
  { slug: "university-of-notre-dame", type: "REA" },
  { slug: "georgetown-university", type: "REA" }, // Georgetown's is somewhat unique

  // Regular EA schools (for comparison - these should be marked as "EA")
  // MIT, Caltech, UChicago, etc. have regular EA
];

// Schools with regular Early Action (not restrictive)
const REGULAR_EA_SCHOOLS = [
  "mit",
  "massachusetts-institute-of-technology",
  "university-of-chicago",
  "caltech",
  "california-institute-of-technology",
  "unc-chapel-hill",
  "university-of-north-carolina-chapel-hill",
  "university-of-virginia",
  "university-of-michigan-ann-arbor",
  "university-of-georgia",
  "tulane-university",
  "villanova-university",
  "boston-college", // BC has EA but is somewhat restrictive, marking as EA for simplicity
];

async function main() {
  console.log("Setting earlyActionType for REA/SCEA and EA schools...\n");

  let updated = 0;

  // Set REA/SCEA schools
  for (const { slug, type } of REA_SCEA_SCHOOLS) {
    const result = await db.college.updateMany({
      where: { slug },
      data: { earlyActionType: type },
    });

    if (result.count > 0) {
      console.log(`Set ${type}: ${slug}`);
      updated += result.count;
    } else {
      console.log(`Not found: ${slug}`);
    }
  }

  // Set regular EA schools
  for (const slug of REGULAR_EA_SCHOOLS) {
    const result = await db.college.updateMany({
      where: { slug, eaDeadline: { not: null } },
      data: { earlyActionType: "EA" },
    });

    if (result.count > 0) {
      console.log(`Set EA: ${slug}`);
      updated += result.count;
    }
  }

  // Set all remaining schools with EA deadline but no type to "EA"
  const remainingEA = await db.college.updateMany({
    where: {
      eaDeadline: { not: null },
      earlyActionType: null,
    },
    data: { earlyActionType: "EA" },
  });
  console.log(`\nSet EA for ${remainingEA.count} remaining schools with EA deadlines`);
  updated += remainingEA.count;

  console.log(`\n✓ Updated ${updated} schools`);

  // Verify
  console.log("\nVerification:");
  const reaSchools = await db.college.findMany({
    where: { earlyActionType: { in: ["REA", "SCEA"] } },
    select: { name: true, earlyActionType: true },
  });
  console.log("REA/SCEA schools:");
  reaSchools.forEach((s) => console.log(`  - ${s.name}: ${s.earlyActionType}`));

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
