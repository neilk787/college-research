/**
 * Fix Early Admission Types
 *
 * This script ensures accuracy for:
 * - Schools that have SCEA (Single-Choice Early Action) vs regular EA
 * - Schools that have REA (Restrictive Early Action) vs regular EA
 * - Schools that incorrectly show ED when they only have EA
 *
 * Based on official 2024-2025 admissions policies from institutional websites.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Schools with SCEA (Single-Choice Early Action) - BINDING restriction on other private EA/ED
// Students cannot apply Early Decision or Early Action to any other private institution
const SCEA_SCHOOLS = [
  "harvard-university",
  "yale-university",
  "princeton-university",
];

// Schools with REA (Restrictive Early Action) - cannot apply EA/ED to other private schools
// Generally can only apply EA to public universities
const REA_SCHOOLS = [
  "stanford-university",       // Cannot apply ED/EA to other private schools
  "university-of-notre-dame",  // Cannot apply ED/EA to other private schools, can apply EA to public schools
  // Note: Georgetown is NOT REA - they allow you to apply EA to other schools (just not binding ED)
];

// Schools that do NOT have Early Decision (clear any incorrect ED data)
const NO_ED_SCHOOLS = [
  "harvard-university",
  "yale-university",
  "princeton-university",
  "stanford-university",
  "georgetown-university",
  "massachusetts-institute-of-technology",
  "mit",
  "california-institute-of-technology",
  "caltech",
  "university-of-chicago", // UChicago has EA (not binding), not ED
];

// Schools that have BOTH ED and EA (this is legitimate)
// These schools offer binding ED AND non-binding EA
const ED_AND_EA_SCHOOLS = [
  "university-of-notre-dame", // Has REA (restrictive EA) but also regular EA-like provisions
];

async function main() {
  console.log("Fixing Early Admission Types...\n");

  let fixed = 0;

  // Set SCEA for those schools
  console.log("=== Setting SCEA Schools ===");
  for (const slug of SCEA_SCHOOLS) {
    const result = await db.college.updateMany({
      where: { slug },
      data: { earlyActionType: "SCEA" },
    });
    if (result.count > 0) {
      console.log(`  ✓ ${slug}: Set to SCEA`);
      fixed++;
    }
  }

  // Set REA for those schools
  console.log("\n=== Setting REA Schools ===");
  for (const slug of REA_SCHOOLS) {
    const result = await db.college.updateMany({
      where: { slug },
      data: { earlyActionType: "REA" },
    });
    if (result.count > 0) {
      console.log(`  ✓ ${slug}: Set to REA`);
      fixed++;
    }
  }

  // Clear ED data for schools that don't have ED
  console.log("\n=== Clearing incorrect ED data ===");
  for (const slug of NO_ED_SCHOOLS) {
    const school = await db.college.findUnique({
      where: { slug },
      select: {
        name: true,
        earlyDecisionApplied: true,
        edDeadline: true
      },
    });

    if (school && (school.earlyDecisionApplied || school.edDeadline)) {
      await db.college.update({
        where: { slug },
        data: {
          earlyDecisionApplied: null,
          earlyDecisionAdmitted: null,
          earlyDecisionAdmitRate: null,
          edDeadline: null,
        },
      });
      console.log(`  ✓ ${school.name}: Cleared incorrect ED data`);
      fixed++;
    }
  }

  // Set regular EA for schools with EA deadline but no type
  console.log("\n=== Setting regular EA for remaining schools ===");
  const remainingEA = await db.college.updateMany({
    where: {
      eaDeadline: { not: null },
      earlyActionType: null,
    },
    data: { earlyActionType: "EA" },
  });
  console.log(`  Set EA for ${remainingEA.count} schools`);
  fixed += remainingEA.count;

  // Verification
  console.log("\n=== VERIFICATION ===\n");

  // Check SCEA schools
  const sceaSchools = await db.college.findMany({
    where: { earlyActionType: "SCEA" },
    select: {
      name: true,
      earlyActionType: true,
      eaDeadline: true,
      edDeadline: true,
      earlyDecisionApplied: true
    },
  });
  console.log("SCEA Schools:");
  for (const s of sceaSchools) {
    const hasEDData = s.earlyDecisionApplied !== null || s.edDeadline !== null;
    console.log(`  ${s.name}`);
    console.log(`    EA Type: ${s.earlyActionType}, EA Deadline: ${s.eaDeadline}`);
    console.log(`    ED Deadline: ${s.edDeadline}, ED Applied: ${s.earlyDecisionApplied}`);
    if (hasEDData) {
      console.log(`    ⚠️  WARNING: Has ED data but should be SCEA only!`);
    }
  }

  // Check REA schools
  const reaSchools = await db.college.findMany({
    where: { earlyActionType: "REA" },
    select: {
      name: true,
      earlyActionType: true,
      eaDeadline: true,
      edDeadline: true,
      earlyDecisionApplied: true
    },
  });
  console.log("\nREA Schools:");
  for (const s of reaSchools) {
    const hasEDData = s.earlyDecisionApplied !== null || s.edDeadline !== null;
    console.log(`  ${s.name}`);
    console.log(`    EA Type: ${s.earlyActionType}, EA Deadline: ${s.eaDeadline}`);
    console.log(`    ED Deadline: ${s.edDeadline}, ED Applied: ${s.earlyDecisionApplied}`);
    if (hasEDData && !ED_AND_EA_SCHOOLS.includes(s.name.toLowerCase().replace(/ /g, '-'))) {
      console.log(`    ⚠️  WARNING: Has ED data but should be REA only!`);
    }
  }

  // Check schools that have BOTH ED and EA (legitimate)
  const bothSchools = await db.college.findMany({
    where: {
      edDeadline: { not: null },
      eaDeadline: { not: null },
    },
    select: {
      name: true,
      slug: true,
      earlyActionType: true,
      eaDeadline: true,
      edDeadline: true
    },
  });

  if (bothSchools.length > 0) {
    console.log("\n⚠️  Schools with BOTH ED and EA deadlines (verify these are correct):");
    for (const s of bothSchools) {
      console.log(`  ${s.name} (${s.slug})`);
      console.log(`    ED: ${s.edDeadline}, EA: ${s.eaDeadline} (${s.earlyActionType})`);
    }
  }

  console.log(`\n✓ Fixed ${fixed} records`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
