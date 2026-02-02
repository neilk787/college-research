import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Check which schools have invalid race data
  const allWithRace = await db.college.findMany({
    where: { raceEthnicity: { not: null } },
    select: { slug: true, raceEthnicity: true, location: true }
  });

  const invalidRace = allWithRace.filter(s => {
    const parsed = JSON.parse(s.raceEthnicity!);
    const hasWhite = parsed["White"] !== undefined;
    const hasAsian = parsed["Asian"] !== undefined;
    const hasHispanic = parsed["Hispanic"] !== undefined || parsed["Hispanic/Latino"] !== undefined;
    const hasBlack = parsed["Black"] !== undefined || parsed["Black/African American"] !== undefined;
    return !(hasWhite && hasAsian && hasHispanic && hasBlack);
  });

  console.log("Schools with incomplete race data:", invalidRace.length);
  invalidRace.forEach(s => {
    console.log("  -", s.slug, "|", s.location);
    console.log("    Data:", s.raceEthnicity);
  });

  await db.$disconnect();
}
main();
