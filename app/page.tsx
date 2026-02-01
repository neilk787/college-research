import { db } from "@/lib/db";
import { SchoolInsightsClient } from "@/components/school-insights-client";
import { unstable_cache } from "next/cache";

const getColleges = unstable_cache(
  async () => {
    return db.college.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        setting: true,
        undergraduateEnrollment: true,
        studentsAdmittedPercent: true,
        costOfAttendanceInState: true,
        costOfAttendanceOutOfState: true,
        studentFacultyRatio: true,
        admissionsSelectivity: true,
        institutionalSector: true,
        testPolicy: true,
        retentionRate: true,
        graduationRate4yr: true,
        medianEarnings10yr: true,
        satScores: true,
        actScores: true,
        popularMajors: true,
      },
      orderBy: { name: "asc" },
    });
  },
  ["colleges-list"],
  { revalidate: 3600, tags: ["colleges"] }
);

export default async function HomePage() {
  const colleges = await getColleges();

  if (colleges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Colleges Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The database is empty. Run the seed script to populate colleges.
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left text-sm overflow-x-auto">
            npm run db:seed
          </pre>
        </div>
      </div>
    );
  }

  return <SchoolInsightsClient colleges={colleges} />;
}
