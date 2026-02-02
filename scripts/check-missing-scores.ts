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

async function main() {
  const schools = await db.college.findMany({
    where: { satScores: null },
    select: { slug: true, name: true, studentsAdmittedPercent: true, testPolicy: true },
    orderBy: { studentsAdmittedPercent: "asc" },
  });

  const usSchools = schools.filter((s) => !INTL.has(s.slug));

  console.log("US schools missing SAT scores:", usSchools.length);
  usSchools.forEach((s) =>
    console.log(`  - ${s.slug} | ${s.studentsAdmittedPercent}% | ${s.testPolicy}`)
  );

  await db.$disconnect();
}
main();
