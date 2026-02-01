import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample colleges for initial seeding
// You can expand this or import from the main LMS database
const sampleColleges = [
  {
    name: "Harvard University",
    slug: "harvard-university",
    location: "Cambridge, MA",
    setting: "Urban",
    institutionalSector: "Private",
    undergraduateEnrollment: 7153,
    studentsAdmittedPercent: 3.2,
    costOfAttendanceInState: 82866,
    costOfAttendanceOutOfState: 82866,
    studentFacultyRatio: "5:1",
    admissionsSelectivity: "Most Selective",
    testPolicy: "Test Optional",
    retentionRate: 98,
    graduationRate4yr: 86,
    graduationRate6yr: 97,
    medianEarnings10yr: 95114,
    website: "https://www.harvard.edu",
    description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher learning in the United States.",
    popularMajors: JSON.stringify([
      "Economics",
      "Computer Science",
      "Political Science",
      "Biology",
      "History",
    ]),
    satScores: JSON.stringify({
      readingWriting: { min: 730, max: 780 },
      math: { min: 750, max: 800 },
      total: { min: 1480, max: 1580 },
      percentSubmitted: 48,
    }),
    actScores: JSON.stringify({
      composite: { min: 34, max: 36 },
      percentSubmitted: 34,
    }),
    fafsaRequired: true,
    cssProfileRequired: true,
    edDeadline: "November 1",
    rdDeadline: "January 1",
    primaryColor: "#A51C30",
    secondaryColor: "#1E1E1E",
  },
  {
    name: "Stanford University",
    slug: "stanford-university",
    location: "Stanford, CA",
    setting: "Suburban",
    institutionalSector: "Private",
    undergraduateEnrollment: 7761,
    studentsAdmittedPercent: 3.7,
    costOfAttendanceInState: 85761,
    costOfAttendanceOutOfState: 85761,
    studentFacultyRatio: "5:1",
    admissionsSelectivity: "Most Selective",
    testPolicy: "Test Optional",
    retentionRate: 98,
    graduationRate4yr: 76,
    graduationRate6yr: 96,
    medianEarnings10yr: 103000,
    website: "https://www.stanford.edu",
    description: "Stanford University is a private research university in Stanford, California. Known for its academic strength, proximity to Silicon Valley, and entrepreneurial culture.",
    popularMajors: JSON.stringify([
      "Computer Science",
      "Engineering",
      "Biology",
      "Economics",
      "Human Biology",
    ]),
    satScores: JSON.stringify({
      readingWriting: { min: 720, max: 770 },
      math: { min: 750, max: 800 },
      total: { min: 1470, max: 1570 },
      percentSubmitted: 52,
    }),
    actScores: JSON.stringify({
      composite: { min: 33, max: 35 },
      percentSubmitted: 38,
    }),
    fafsaRequired: true,
    cssProfileRequired: true,
    eaDeadline: "November 1",
    rdDeadline: "January 5",
    primaryColor: "#8C1515",
    secondaryColor: "#2E2D29",
  },
  {
    name: "MIT",
    slug: "mit",
    location: "Cambridge, MA",
    setting: "Urban",
    institutionalSector: "Private",
    undergraduateEnrollment: 4638,
    studentsAdmittedPercent: 3.5,
    costOfAttendanceInState: 82730,
    costOfAttendanceOutOfState: 82730,
    studentFacultyRatio: "3:1",
    admissionsSelectivity: "Most Selective",
    testPolicy: "Test Required",
    retentionRate: 99,
    graduationRate4yr: 86,
    graduationRate6yr: 95,
    medianEarnings10yr: 115000,
    website: "https://www.mit.edu",
    description: "The Massachusetts Institute of Technology is a private research university in Cambridge, Massachusetts. MIT is known for its strength in science, technology, engineering, and mathematics.",
    popularMajors: JSON.stringify([
      "Computer Science",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Mathematics",
      "Physics",
    ]),
    satScores: JSON.stringify({
      readingWriting: { min: 730, max: 780 },
      math: { min: 780, max: 800 },
      total: { min: 1510, max: 1580 },
      percentSubmitted: 66,
    }),
    actScores: JSON.stringify({
      composite: { min: 34, max: 36 },
      percentSubmitted: 42,
    }),
    fafsaRequired: true,
    cssProfileRequired: true,
    eaDeadline: "November 1",
    rdDeadline: "January 1",
    primaryColor: "#750014",
    secondaryColor: "#8B959E",
  },
  {
    name: "University of Virginia",
    slug: "university-of-virginia",
    location: "Charlottesville, VA",
    setting: "Suburban",
    institutionalSector: "Public",
    undergraduateEnrollment: 17496,
    studentsAdmittedPercent: 16.3,
    costOfAttendanceInState: 37554,
    costOfAttendanceOutOfState: 72890,
    studentFacultyRatio: "15:1",
    admissionsSelectivity: "Most Selective",
    testPolicy: "Test Optional",
    retentionRate: 97,
    graduationRate4yr: 89,
    graduationRate6yr: 95,
    medianEarnings10yr: 79000,
    website: "https://www.virginia.edu",
    description: "The University of Virginia is a public research university in Charlottesville, Virginia. Founded by Thomas Jefferson in 1819, it is known as one of the top public universities in the nation.",
    popularMajors: JSON.stringify([
      "Economics",
      "Commerce",
      "Biology",
      "Computer Science",
      "Political Science",
    ]),
    satScores: JSON.stringify({
      readingWriting: { min: 680, max: 750 },
      math: { min: 690, max: 780 },
      total: { min: 1370, max: 1530 },
      percentSubmitted: 55,
    }),
    fafsaRequired: true,
    cssProfileRequired: true,
    edDeadline: "November 1",
    rdDeadline: "January 1",
    primaryColor: "#232D4B",
    secondaryColor: "#F84C1E",
  },
  {
    name: "UCLA",
    slug: "ucla",
    location: "Los Angeles, CA",
    setting: "Urban",
    institutionalSector: "Public",
    undergraduateEnrollment: 32423,
    studentsAdmittedPercent: 8.8,
    costOfAttendanceInState: 37014,
    costOfAttendanceOutOfState: 68474,
    studentFacultyRatio: "18:1",
    admissionsSelectivity: "Most Selective",
    testPolicy: "Test Blind",
    retentionRate: 97,
    graduationRate4yr: 79,
    graduationRate6yr: 92,
    medianEarnings10yr: 68000,
    website: "https://www.ucla.edu",
    description: "The University of California, Los Angeles is a public research university in Los Angeles. UCLA offers over 130 undergraduate programs and is known for strong academics and athletics.",
    popularMajors: JSON.stringify([
      "Biology",
      "Psychology",
      "Economics",
      "Political Science",
      "Computer Science",
    ]),
    fafsaRequired: true,
    rdDeadline: "November 30",
    primaryColor: "#2774AE",
    secondaryColor: "#FFD100",
  },
];

async function main() {
  console.log("Starting college seed...");

  for (const college of sampleColleges) {
    const existing = await prisma.college.findUnique({
      where: { slug: college.slug },
    });

    if (existing) {
      console.log(`Updating: ${college.name}`);
      await prisma.college.update({
        where: { slug: college.slug },
        data: college,
      });
    } else {
      console.log(`Creating: ${college.name}`);
      await prisma.college.create({
        data: college,
      });
    }
  }

  console.log(`\nSeeded ${sampleColleges.length} colleges.`);
  console.log(
    "\nTo import more colleges from your main LMS database, run:\n" +
    "  psql source_db -c \"COPY (SELECT * FROM College) TO STDOUT\" | psql target_db -c \"COPY College FROM STDIN\""
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
