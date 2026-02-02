import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import {
  ArrowLeft,
  MapPin,
  Phone,
  DollarSign,
  Users,
  Calendar,
  Award,
  Building,
  Globe,
  BookOpen,
  ExternalLink,
  Info,
  Heart,
  Home,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const getCachedCollege = unstable_cache(
  async (slug: string) => {
    return db.college.findUnique({
      where: { slug },
    });
  },
  ["college-detail-v2"], // Updated cache key to force refresh
  { revalidate: 60, tags: ["colleges"] } // Reduced to 60s for faster updates
);

const SCHOOL_COLORS: Record<string, { primary: string; secondary: string; heroImage: string }> = {
  "harvard-university": { primary: "#A51C30", secondary: "#1E1E1E", heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80" },
  "yale-university": { primary: "#00356B", secondary: "#286DC0", heroImage: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1920&q=80" },
  "princeton-university": { primary: "#E77500", secondary: "#000000", heroImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80" },
  "stanford-university": { primary: "#8C1515", secondary: "#2E2D29", heroImage: "https://images.unsplash.com/photo-1545079968-1feb95a9c802?w=1920&q=80" },
  "mit": { primary: "#750014", secondary: "#8B959E", heroImage: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&q=80" },
};

const DEFAULT_COLORS = { primary: "#1a365d", secondary: "#2d3748", heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80" };

function parseJSON<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return defaultValue;
  }
}

function formatNumber(num: number | null | undefined): string {
  if (!num) return "N/A";
  return num.toLocaleString();
}

function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return "N/A";
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return `${value.toFixed(1)}%`;
}

function getSelectivityLabel(rate: number | null | undefined): string {
  if (!rate) return "Unknown";
  if (rate < 10) return "Most Selective";
  if (rate < 20) return "Highly Selective";
  if (rate < 40) return "Very Selective";
  if (rate < 60) return "Selective";
  return "Less Selective";
}

function StatCard({ label, value, subvalue }: { label: string; value: string; subvalue?: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-semibold text-slate-900 dark:text-white mt-1">{value}</p>
      {subvalue && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subvalue}</p>}
    </div>
  );
}

function ConsiderationBadge({ level }: { level: string }) {
  const textClass = level === "Not Considered"
    ? "text-slate-400 dark:text-slate-500"
    : "text-slate-700 dark:text-slate-300";

  return <span className={cn("text-sm", textClass)}>{level}</span>;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const college = await getCachedCollege(params.slug);
  if (!college) return { title: "College Not Found" };

  return {
    title: `${college.name} | College Research`,
    description: `Explore ${college.name} - admissions data, costs, student life, and outcomes.`,
  };
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
  const college = await getCachedCollege(params.slug);

  if (!college) {
    notFound();
  }

  const schoolColors = college.primaryColor
    ? { primary: college.primaryColor, secondary: college.secondaryColor || DEFAULT_COLORS.secondary, heroImage: college.heroImageUrl || DEFAULT_COLORS.heroImage }
    : (SCHOOL_COLORS[params.slug] || DEFAULT_COLORS);

  const gpaDistribution = parseJSON<Record<string, number>>(college.gpaDistribution, {});
  const satScores = parseJSON<{
    readingWriting?: { min: number; max: number };
    math?: { min: number; max: number };
    total?: { min: number; max: number };
    percentSubmitted?: number;
  }>(college.satScores, {});
  const actScores = parseJSON<{
    composite?: { min: number; max: number };
    english?: { min: number; max: number };
    math?: { min: number; max: number };
    percentSubmitted?: number;
  }>(college.actScores, {});
  const genderDistribution = parseJSON<{ women?: number; men?: number }>(college.genderDistribution, {});
  const raceEthnicity = parseJSON<Record<string, number>>(college.raceEthnicity, {});
  const housingInfo = parseJSON<Record<string, unknown>>(college.housingInfo, {});
  const athletics = parseJSON<{
    mens?: Array<{ sport: string; division: string; scholarship: string }>;
    womens?: Array<{ sport: string; division: string; scholarship: string }>;
    conference?: string;
    division?: string;
  }>(college.athletics, {});
  const admissionConsiderations = parseJSON<Record<string, string>>(college.admissionConsiderations, {});
  const popularMajors = parseJSON<string[]>(college.popularMajors, []);
  const classSize = parseJSON<Record<string, number>>(college.classSize, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[450px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${schoolColors.heroImage})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${schoolColors.primary}ee 0%, ${schoolColors.primary}cc 50%, ${schoolColors.secondary}99 100%)`,
          }}
        />

        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:text-white border border-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-white">
                {college.institutionalSector && (
                  <Badge className="mb-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                    {college.institutionalSector}
                  </Badge>
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                  {college.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{college.location}</span>
                  </div>
                  {college.setting && (
                    <div className="flex items-center gap-1.5">
                      <Building className="h-4 w-4" />
                      <span>{college.setting}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {college.studentsAdmittedPercent && (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 text-white border border-white/20">
                    <p className="text-xs uppercase tracking-wide text-white/70">Accept Rate</p>
                    <p className="text-2xl font-bold">{college.studentsAdmittedPercent}%</p>
                  </div>
                )}
                {college.undergraduateEnrollment && (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 text-white border border-white/20">
                    <p className="text-xs uppercase tracking-wide text-white/70">Undergrads</p>
                    <p className="text-2xl font-bold">{formatNumber(college.undergraduateEnrollment)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 pb-12">
        {/* Key Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            label="Acceptance Rate"
            value={formatPercent(college.studentsAdmittedPercent)}
            subvalue={getSelectivityLabel(college.studentsAdmittedPercent)}
          />
          <StatCard
            label="Enrollment"
            value={formatNumber(college.undergraduateEnrollment)}
            subvalue="Undergraduates"
          />
          <StatCard
            label="In-State Cost"
            value={formatCurrency(college.costOfAttendanceInState)}
            subvalue="Total CoA"
          />
          <StatCard
            label="Out-of-State Cost"
            value={formatCurrency(college.costOfAttendanceOutOfState)}
            subvalue="Total CoA"
          />
          <StatCard
            label="Student:Faculty"
            value={college.studentFacultyRatio || "N/A"}
            subvalue="Ratio"
          />
          {college.retentionRate && (
            <StatCard
              label="Retention"
              value={formatPercent(college.retentionRate)}
              subvalue="First-year students"
            />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {college.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-gray-500" />
                    About {college.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {college.description}
                  </p>
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-cta hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Official Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tabbed Content */}
            <Tabs defaultValue="admissions" className="space-y-4">
              <TabsList className="bg-white dark:bg-gray-800 border shadow-sm p-1 h-auto flex-wrap">
                <TabsTrigger value="admissions" className="data-[state=active]:bg-cta data-[state=active]:text-white">
                  Admissions
                </TabsTrigger>
                <TabsTrigger value="academics" className="data-[state=active]:bg-cta data-[state=active]:text-white">
                  Academics
                </TabsTrigger>
                <TabsTrigger value="costs" className="data-[state=active]:bg-cta data-[state=active]:text-white">
                  Costs & Aid
                </TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-cta data-[state=active]:text-white">
                  Student Life
                </TabsTrigger>
                <TabsTrigger value="outcomes" className="data-[state=active]:bg-cta data-[state=active]:text-white">
                  Outcomes
                </TabsTrigger>
              </TabsList>

              {/* Admissions Tab */}
              <TabsContent value="admissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Admission Statistics</CardTitle>
                    <CardDescription>Application rounds and acceptance rates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(college.totalApplicants || college.totalAdmitted) && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Applied</p>
                          <p className="text-2xl font-bold">{formatNumber(college.totalApplicants)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Admitted</p>
                          <p className="text-2xl font-bold">{formatNumber(college.totalAdmitted)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
                          <p className="text-2xl font-bold">{formatNumber(college.totalEnrolled)}</p>
                          {college.yieldRate && (
                            <p className="text-xs text-gray-500">{formatPercent(college.yieldRate)} yield</p>
                          )}
                        </div>
                      </div>
                    )}

                    {college.earlyDecisionApplied && (
                      <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800 dark:text-slate-200">Early Decision</h4>
                          {college.edDeadline && (
                            <span className="text-xs text-slate-500">{college.edDeadline}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Applied</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.earlyDecisionApplied)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Admitted</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.earlyDecisionAdmitted)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Accept Rate</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatPercent(college.earlyDecisionAdmitRate)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {college.earlyActionApplied && (
                      <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800 dark:text-slate-200">
                            {college.earlyActionType === "SCEA" ? "Single-Choice Early Action" :
                             college.earlyActionType === "REA" ? "Restrictive Early Action" :
                             "Early Action"}
                          </h4>
                          {college.eaDeadline && (
                            <span className="text-xs text-slate-500">{college.eaDeadline}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Applied</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.earlyActionApplied)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Admitted</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.earlyActionAdmitted)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Accept Rate</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatPercent(college.earlyActionAdmitRate)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {college.regularDecisionApplied && (
                      <div className="border-l-2 border-slate-300 dark:border-slate-600 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-800 dark:text-slate-200">Regular Decision</h4>
                          {college.rdDeadline && (
                            <span className="text-xs text-slate-500">{college.rdDeadline}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Applied</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.regularDecisionApplied)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Admitted</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatNumber(college.regularDecisionAdmitted)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">Accept Rate</p>
                            <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{formatPercent(college.regularDecisionAdmitRate)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Test Scores */}
                {(satScores.readingWriting || actScores.composite) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Scores</CardTitle>
                      <CardDescription>
                        {college.testPolicy && (
                          <span className="text-slate-600 dark:text-slate-400">
                            {college.testPolicy}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {satScores.readingWriting && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">
                              SAT (25th-75th Percentile)
                            </h4>
                            {satScores.percentSubmitted && (
                              <p className="text-xs text-slate-500 mb-3">{satScores.percentSubmitted}% of students submitted</p>
                            )}
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-600 dark:text-slate-400">Reading & Writing</span>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">{satScores.readingWriting.min} - {satScores.readingWriting.max}</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-slate-500 rounded-full"
                                    style={{
                                      marginLeft: `${(satScores.readingWriting.min / 800) * 100}%`,
                                      width: `${((satScores.readingWriting.max - satScores.readingWriting.min) / 800) * 100}%`
                                    }}
                                  />
                                </div>
                              </div>
                              {satScores.math && (
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Math</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{satScores.math.min} - {satScores.math.max}</span>
                                  </div>
                                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-slate-500 rounded-full"
                                      style={{
                                        marginLeft: `${(satScores.math.min / 800) * 100}%`,
                                        width: `${((satScores.math.max - satScores.math.min) / 800) * 100}%`
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              {satScores.total && (
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Total</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{satScores.total.min} - {satScores.total.max}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {actScores.composite && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">
                              ACT (25th-75th Percentile)
                            </h4>
                            {actScores.percentSubmitted && (
                              <p className="text-xs text-slate-500 mb-3">{actScores.percentSubmitted}% of students submitted</p>
                            )}
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-600 dark:text-slate-400">Composite</span>
                                  <span className="font-semibold text-slate-900 dark:text-white">{actScores.composite.min} - {actScores.composite.max}</span>
                                </div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-slate-500 rounded-full"
                                    style={{
                                      marginLeft: `${(actScores.composite.min / 36) * 100}%`,
                                      width: `${((actScores.composite.max - actScores.composite.min) / 36) * 100}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* GPA Distribution */}
                {Object.keys(gpaDistribution).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>GPA Distribution</CardTitle>
                      <CardDescription>Distribution of admitted students by GPA range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(gpaDistribution)
                          .sort((a, b) => b[0].localeCompare(a[0]))
                          .map(([range, percent]) => (
                          <div key={range}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{range}</span>
                              <span className="text-gray-600 dark:text-gray-400">{percent}%</span>
                            </div>
                            <Progress value={percent} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Admission Considerations */}
                {Object.keys(admissionConsiderations).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>What Matters in Admissions</CardTitle>
                      <CardDescription>How the admissions office weighs different factors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                        {Object.entries(admissionConsiderations).map(([factor, level]) => (
                          <div key={factor} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{factor}</span>
                            <ConsiderationBadge level={level} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Academics Tab */}
              <TabsContent value="academics" className="space-y-4">
                {popularMajors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Popular Majors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {popularMajors.map((major, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                            {major}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Class Sizes</CardTitle>
                    <CardDescription>Distribution of class sizes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {college.pctClassesUnder20 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatPercent(college.pctClassesUnder20)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Under 20 students</p>
                        </div>
                      )}
                      {college.avgClassSize && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{college.avgClassSize}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Average class size</p>
                        </div>
                      )}
                      {college.pctClassesOver50 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatPercent(college.pctClassesOver50)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Over 50 students</p>
                        </div>
                      )}
                    </div>

                    {Object.keys(classSize).length > 0 && (
                      <div className="mt-6 space-y-2">
                        {Object.entries(classSize).map(([range, percent]) => (
                          <div key={range}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{range} students</span>
                              <span className="font-medium">{percent}%</span>
                            </div>
                            <Progress value={percent} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Costs & Aid Tab */}
              <TabsContent value="costs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost of Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">In-State Total Cost</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(college.costOfAttendanceInState)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Tuition, fees, room & board</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Out-of-State Total Cost</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(college.costOfAttendanceOutOfState)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Tuition, fees, room & board</p>
                      </div>
                    </div>

                    {college.averageNetPrice && (
                      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Average Net Price (after aid)</p>
                            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                              {formatCurrency(college.averageNetPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Potential savings</p>
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                              {formatCurrency((college.costOfAttendanceInState || 0) - college.averageNetPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Aid Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">FAFSA Required</span>
                        <Badge variant={college.fafsaRequired ? "default" : "secondary"}>
                          {college.fafsaRequired ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">CSS Profile Required</span>
                        <Badge variant={college.cssProfileRequired ? "default" : "secondary"}>
                          {college.cssProfileRequired ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    {college.financialAidDeadline && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">Financial Aid Deadline:</span>
                          <span>{college.financialAidDeadline}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Student Life Tab */}
              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Demographics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {(genderDistribution.women || genderDistribution.men) && (
                      <div>
                        <h4 className="font-medium mb-3 text-slate-800 dark:text-slate-200">Gender Distribution</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                              {genderDistribution.women && (
                                <div
                                  className="bg-slate-500"
                                  style={{ width: `${genderDistribution.women}%` }}
                                />
                              )}
                              {genderDistribution.men && (
                                <div
                                  className="bg-slate-400"
                                  style={{ width: `${genderDistribution.men}%` }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>Women: {genderDistribution.women}%</span>
                          <span>Men: {genderDistribution.men}%</span>
                        </div>
                      </div>
                    )}

                    {Object.keys(raceEthnicity).length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Race/Ethnicity</h4>
                        <div className="space-y-2">
                          {Object.entries(raceEthnicity)
                            .sort((a, b) => b[1] - a[1])
                            .map(([race, percent]) => (
                            <div key={race}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{race}</span>
                                <span className="font-medium">{percent}%</span>
                              </div>
                              <Progress value={percent} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {college.outOfStatePercent && (
                      <div>
                        <h4 className="font-medium mb-3">Geographic Distribution</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                            <p className="text-2xl font-bold">{100 - college.outOfStatePercent}%</p>
                            <p className="text-sm text-gray-500">In-State</p>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                            <p className="text-2xl font-bold">{college.outOfStatePercent}%</p>
                            <p className="text-sm text-gray-500">Out-of-State</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {Object.keys(housingInfo).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Housing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries(housingInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 border-b">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(athletics.mens?.length || athletics.womens?.length) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Athletics
                        {athletics.division && (
                          <Badge variant="outline">{athletics.division}</Badge>
                        )}
                        {athletics.conference && (
                          <Badge variant="secondary">{athletics.conference}</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {athletics.mens && athletics.mens.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Men's Sports ({athletics.mens.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {athletics.mens.map((sport, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {sport.sport}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {athletics.womens && athletics.womens.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Women's Sports ({athletics.womens.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {athletics.womens.map((sport, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {sport.sport}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {college.retentionRate && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatPercent(college.retentionRate)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Retention Rate</p>
                          <p className="text-xs text-slate-500">First-year students returning</p>
                        </div>
                      )}
                      {college.graduationRate4yr && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatPercent(college.graduationRate4yr)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">4-Year Grad Rate</p>
                          <p className="text-xs text-slate-500">Graduate within 4 years</p>
                        </div>
                      )}
                      {college.graduationRate6yr && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatPercent(college.graduationRate6yr)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">6-Year Grad Rate</p>
                          <p className="text-xs text-slate-500">Graduate within 6 years</p>
                        </div>
                      )}
                      {college.medianEarnings10yr && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                          <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(college.medianEarnings10yr)}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Median Earnings</p>
                          <p className="text-xs text-slate-500">10 years after enrollment</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {college.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Location</p>
                        <p className="font-medium">{college.location}</p>
                      </div>
                    </div>
                  )}

                  {college.setting && (
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Setting</p>
                        <p className="font-medium">{college.setting}</p>
                      </div>
                    </div>
                  )}

                  {college.institutionalSector && (
                    <div className="flex items-start gap-3">
                      <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Type</p>
                        <p className="font-medium">{college.institutionalSector}</p>
                      </div>
                    </div>
                  )}

                  {college.religiousAffiliation && college.religiousAffiliation !== "Not applicable" && (
                    <div className="flex items-start gap-3">
                      <Heart className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Affiliation</p>
                        <p className="font-medium">{college.religiousAffiliation}</p>
                      </div>
                    </div>
                  )}

                  {college.studentFacultyRatio && (
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Student-Faculty Ratio</p>
                        <p className="font-medium">{college.studentFacultyRatio}</p>
                      </div>
                    </div>
                  )}

                  {college.applicationFee && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Application Fee</p>
                        <p className="font-medium">${college.applicationFee}</p>
                      </div>
                    </div>
                  )}

                  {college.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="font-medium">{college.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {(college.edDeadline || college.eaDeadline || college.rdDeadline) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Key Deadlines
                    </h4>
                    <div className="space-y-2 text-sm">
                      {college.edDeadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Early Decision</span>
                          <span className="font-medium">{college.edDeadline}</span>
                        </div>
                      )}
                      {college.eaDeadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            {college.earlyActionType === "SCEA" ? "SCEA" :
                             college.earlyActionType === "REA" ? "REA" :
                             "Early Action"}
                          </span>
                          <span className="font-medium">{college.eaDeadline}</span>
                        </div>
                      )}
                      {college.rdDeadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Regular Decision</span>
                          <span className="font-medium">{college.rdDeadline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {college.website && (
                  <div className="pt-4 border-t">
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full" variant="outline">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <Info className="h-3 w-3 inline mr-1" />
                  Data sourced from the Common Data Set, IPEDS, and institutional reporting.
                  Last updated for the most recent academic year available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
