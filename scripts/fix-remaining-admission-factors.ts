/**
 * Fix remaining missing admission factors
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Standard field mappings
const FACTOR_DEFAULTS: Record<string, Record<string, string>> = {
  // Large state schools - typically don't require recommendations
  "university-of-new-mexico": { "Recommendation(s)": "Not Considered" },
  "university-of-arkansas": { "Recommendation(s)": "Considered" },
  "university-of-nebraska-lincoln": { "Recommendation(s)": "Considered" },
  "university-of-houston": { "Recommendation(s)": "Not Considered" },
  "tennessee-state-university": { "Recommendation(s)": "Considered" },
  "university-of-north-texas": { "Recommendation(s)": "Not Considered", "Extracurricular activities": "Considered" },
  "texas-state-university": { "Recommendation(s)": "Not Considered", "Extracurricular activities": "Considered" },
  "nevada-state-university": { "Rigor of secondary school record": "Important", "Recommendation(s)": "Not Considered", "Extracurricular activities": "Considered" },
  "grand-canyon-university": { "Application essay": "Considered", "Recommendation(s)": "Considered", "Extracurricular activities": "Considered" },

  // CSU system - don't use essays or recommendations
  "san-jose-state-university": { "Application essay": "Not Considered", "Extracurricular activities": "Considered" },
  "cal-state-fullerton": { "Application essay": "Not Considered", "Extracurricular activities": "Considered" },
  "cal-state-long-beach": { "Extracurricular activities": "Considered" },

  // Art schools - extracurriculars less relevant, portfolio matters more
  "pratt-institute": { "Extracurricular activities": "Considered" },
  "parsons-school-of-design": { "Extracurricular activities": "Considered" },
  "savannah-college-of-art-and-design": { "Extracurricular activities": "Considered" },
  "the-cooper-union": { "Extracurricular activities": "Considered" },

  // Music conservatories - audition based
  "curtis-institute-of-music": {
    "Rigor of secondary school record": "Considered",
    "Standardized test scores": "Not Considered",
    "Application essay": "Considered",
    "Extracurricular activities": "Considered"
  },
  "the-juilliard-school": {
    "Standardized test scores": "Not Considered",
    "Extracurricular activities": "Considered"
  },
  "berklee-college-of-music": { "Standardized test scores": "Considered" },
  "new-england-conservatory": {
    "Standardized test scores": "Not Considered",
    "Extracurricular activities": "Considered"
  },
};

async function main() {
  console.log("Fixing remaining admission factors...\n");

  // First, get all schools missing Recommendation(s) field
  const allSchools = await db.college.findMany({
    where: { admissionConsiderations: { not: null } },
    select: { id: true, slug: true, name: true, admissionConsiderations: true },
  });

  let updated = 0;

  for (const school of allSchools) {
    const parsed = JSON.parse(school.admissionConsiderations!) as Record<string, string>;

    // Check for specific fixes
    const fixes = FACTOR_DEFAULTS[school.slug];
    let needsUpdate = false;

    if (fixes) {
      for (const [key, value] of Object.entries(fixes)) {
        if (!parsed[key]) {
          parsed[key] = value;
          needsUpdate = true;
        }
      }
    }

    // For any school missing Recommendation(s), add it with "Considered" as default
    const hasRecommendations = Object.keys(parsed).some(
      (k) => k.toLowerCase() === "recommendations" || k.toLowerCase() === "recommendation(s)"
    );
    if (!hasRecommendations) {
      parsed["Recommendation(s)"] = "Considered";
      needsUpdate = true;
    }

    // For any school missing Extracurricular activities, add it
    const hasExtracurricular = Object.keys(parsed).some(
      (k) => k.toLowerCase().includes("extracurricular")
    );
    if (!hasExtracurricular) {
      parsed["Extracurricular activities"] = "Considered";
      needsUpdate = true;
    }

    if (needsUpdate) {
      await db.college.update({
        where: { id: school.id },
        data: { admissionConsiderations: JSON.stringify(parsed) },
      });
      console.log(`Updated: ${school.name}`);
      updated++;
    }
  }

  console.log(`\n✓ Updated ${updated} schools`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
