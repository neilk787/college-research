import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const INTL = new Set([
  "kaust", "unam", "iit-bombay", "iit-delhi", "iit-madras", "iit-kanpur", "iit-kharagpur",
  "indian-institute-of-science", "university-of-sao-paulo", "university-of-tokyo", "peking-university",
  "tsinghua-university", "university-of-cambridge", "university-of-oxford", "eth-zurich",
  "national-university-of-singapore", "university-of-toronto", "mcgill-university",
  "university-of-hong-kong", "seoul-national-university", "london-school-of-economics",
  "imperial-college-london", "bits-pilani", "sciences-po", "kaist", "university-of-delhi",
  "nanyang-technological-university", "epfl", "tel-aviv-university", "technion",
  "american-university-of-beirut", "university-of-amsterdam", "university-of-queensland",
  "university-of-buenos-aires", "pontifical-catholic-university-of-chile", "university-of-melbourne",
  "australian-national-university", "university-of-sydney", "university-of-british-columbia",
  "university-of-waterloo", "trinity-college-dublin", "university-of-edinburgh",
]);

const IMPORTANT = [
  "setting", "admissionsSelectivity", "testPolicy", "retentionRate", "graduationRate4yr",
  "medianEarnings10yr", "totalApplicants", "totalAdmitted", "satScores", "actScores",
  "popularMajors", "admissionConsiderations", "rdDeadline", "fafsaRequired", "cssProfileRequired",
  "averageNetPrice", "genderDistribution", "raceEthnicity",
];

async function main() {
  const schools = await db.college.findMany() as Record<string, unknown>[];

  const usSchools = schools.filter((s) => !INTL.has(s.slug as string));

  console.log("US schools:", usSchools.length);

  const missing: Record<string, number> = {};
  for (const field of IMPORTANT) {
    const count = usSchools.filter((s) => s[field] === null || s[field] === "").length;
    if (count > 0) missing[field] = count;
  }

  const sorted = Object.entries(missing).sort((a, b) => b[1] - a[1]);
  console.log("\nMissing important fields (US schools):");
  sorted.forEach(([field, count]) => console.log("  " + count + " - " + field));

  await db.$disconnect();
}
main();
