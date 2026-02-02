/**
 * Verify Early Admission Accuracy
 *
 * This script verifies that all schools have accurate early admission data
 * based on official 2024-2025 institutional policies.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface SchoolPolicy {
  slug: string;
  name: string;
  expectedEAType: "SCEA" | "REA" | "EA" | null;
  hasED: boolean;
  hasEA: boolean;
  source: string;
}

// Ground truth for key schools based on official 2024-2025 policies
const VERIFIED_POLICIES: SchoolPolicy[] = [
  // SCEA schools - Single-Choice Early Action (cannot apply early elsewhere)
  { slug: "harvard-university", name: "Harvard", expectedEAType: "SCEA", hasED: false, hasEA: true, source: "harvard.edu" },
  { slug: "yale-university", name: "Yale", expectedEAType: "SCEA", hasED: false, hasEA: true, source: "yale.edu" },
  { slug: "princeton-university", name: "Princeton", expectedEAType: "SCEA", hasED: false, hasEA: true, source: "princeton.edu" },

  // REA schools - Restrictive Early Action (cannot apply EA/ED to other private schools)
  { slug: "stanford-university", name: "Stanford", expectedEAType: "REA", hasED: false, hasEA: true, source: "stanford.edu" },
  { slug: "university-of-notre-dame", name: "Notre Dame", expectedEAType: "REA", hasED: false, hasEA: true, source: "nd.edu" },

  // Georgetown - Regular EA (can apply EA elsewhere, just not binding ED)
  { slug: "georgetown-university", name: "Georgetown", expectedEAType: "EA", hasED: false, hasEA: true, source: "georgetown.edu" },

  // Regular EA schools - Non-restrictive EA (can apply anywhere else)
  { slug: "massachusetts-institute-of-technology", name: "MIT", expectedEAType: "EA", hasED: false, hasEA: true, source: "mit.edu" },
  { slug: "mit", name: "MIT (alt slug)", expectedEAType: "EA", hasED: false, hasEA: true, source: "mit.edu" },
  { slug: "california-institute-of-technology", name: "Caltech", expectedEAType: "EA", hasED: false, hasEA: true, source: "caltech.edu" },
  { slug: "caltech", name: "Caltech (alt slug)", expectedEAType: "EA", hasED: false, hasEA: true, source: "caltech.edu" },

  // Schools with BOTH ED and EA
  { slug: "university-of-chicago", name: "UChicago", expectedEAType: "EA", hasED: true, hasEA: true, source: "uchicago.edu" },
  { slug: "duke-university", name: "Duke", expectedEAType: null, hasED: true, hasEA: false, source: "duke.edu" },
  { slug: "columbia-university", name: "Columbia", expectedEAType: null, hasED: true, hasEA: false, source: "columbia.edu" },
  { slug: "university-of-pennsylvania", name: "UPenn", expectedEAType: null, hasED: true, hasEA: false, source: "upenn.edu" },
  { slug: "northwestern-university", name: "Northwestern", expectedEAType: null, hasED: true, hasEA: false, source: "northwestern.edu" },
  { slug: "brown-university", name: "Brown", expectedEAType: null, hasED: true, hasEA: false, source: "brown.edu" },
  { slug: "dartmouth-college", name: "Dartmouth", expectedEAType: null, hasED: true, hasEA: false, source: "dartmouth.edu" },
  { slug: "cornell-university", name: "Cornell", expectedEAType: null, hasED: true, hasEA: false, source: "cornell.edu" },
  { slug: "vanderbilt-university", name: "Vanderbilt", expectedEAType: "EA", hasED: true, hasEA: true, source: "vanderbilt.edu" },
];

async function main() {
  console.log("=".repeat(80));
  console.log("EARLY ADMISSION ACCURACY VERIFICATION");
  console.log("=".repeat(80));
  console.log("");

  let errors = 0;
  let warnings = 0;
  let verified = 0;

  for (const policy of VERIFIED_POLICIES) {
    const school = await db.college.findUnique({
      where: { slug: policy.slug },
      select: {
        name: true,
        earlyActionType: true,
        eaDeadline: true,
        edDeadline: true,
        earlyDecisionApplied: true,
        earlyActionApplied: true,
      },
    });

    if (!school) {
      console.log(`⚠️  ${policy.name} (${policy.slug}): NOT FOUND IN DATABASE`);
      warnings++;
      continue;
    }

    const issues: string[] = [];

    // Check EA type
    if (policy.expectedEAType && school.earlyActionType !== policy.expectedEAType) {
      issues.push(`EA Type: expected ${policy.expectedEAType}, got ${school.earlyActionType}`);
    }

    // Check if should have EA
    if (policy.hasEA && !school.eaDeadline) {
      issues.push(`Should have EA deadline but doesn't`);
    }
    if (!policy.hasEA && school.eaDeadline) {
      issues.push(`Has EA deadline but shouldn't: ${school.eaDeadline}`);
    }

    // Check if should have ED
    if (policy.hasED && !school.edDeadline) {
      issues.push(`Should have ED deadline but doesn't`);
    }
    if (!policy.hasED && school.edDeadline) {
      issues.push(`Has ED deadline but shouldn't: ${school.edDeadline}`);
    }

    // Check for ED data when shouldn't have ED
    if (!policy.hasED && school.earlyDecisionApplied) {
      issues.push(`Has ED application data but shouldn't: ${school.earlyDecisionApplied} applied`);
    }

    if (issues.length > 0) {
      console.log(`❌ ${school.name} (${policy.slug}):`);
      issues.forEach(issue => console.log(`     - ${issue}`));
      errors++;
    } else {
      console.log(`✓  ${school.name}: Correct`);
      console.log(`     EA: ${school.earlyActionType || "none"} (${school.eaDeadline || "no deadline"})`);
      console.log(`     ED: ${school.edDeadline || "none"}`);
      verified++;
    }
  }

  console.log("");
  console.log("=".repeat(80));
  console.log("SUMMARY");
  console.log("=".repeat(80));
  console.log(`Verified: ${verified}`);
  console.log(`Errors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors > 0) {
    console.log("\n❌ VERIFICATION FAILED - Fix the errors above");
    process.exit(1);
  } else {
    console.log("\n✓ ALL VERIFIED SCHOOLS PASS");
  }

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
