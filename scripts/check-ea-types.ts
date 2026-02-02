import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Get all schools with early action
  const schools = await db.college.findMany({
    where: { eaDeadline: { not: null } },
    select: {
      name: true,
      slug: true,
      eaDeadline: true,
      edDeadline: true,
      earlyActionType: true,
      earlyActionApplied: true,
    },
    orderBy: { name: "asc" },
  });

  console.log("Schools with Early Action:\n");

  // Group by type
  const scea = schools.filter((s) => s.earlyActionType === "SCEA");
  const rea = schools.filter((s) => s.earlyActionType === "REA");
  const ea = schools.filter(
    (s) => s.earlyActionType === "EA" || s.earlyActionType === null
  );

  console.log("=== SCEA (Single-Choice Early Action) ===");
  scea.forEach((s) => console.log(`  ${s.name}: ${s.earlyActionType}`));

  console.log("\n=== REA (Restrictive Early Action) ===");
  rea.forEach((s) => console.log(`  ${s.name}: ${s.earlyActionType}`));

  console.log(`\n=== Regular EA (${ea.length} schools) ===`);
  ea.slice(0, 30).forEach((s) =>
    console.log(`  ${s.name}: ${s.earlyActionType || "null"}`)
  );
  if (ea.length > 30) {
    console.log(`  ... and ${ea.length - 30} more`);
  }

  await db.$disconnect();
}

main();
