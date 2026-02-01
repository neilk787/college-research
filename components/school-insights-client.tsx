"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface College {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  setting: string | null;
  undergraduateEnrollment: number | null;
  studentsAdmittedPercent: number | null;
  costOfAttendanceInState: number | null;
  costOfAttendanceOutOfState: number | null;
  studentFacultyRatio: string | null;
  admissionsSelectivity: string | null;
  institutionalSector: string | null;
  testPolicy: string | null;
  retentionRate: number | null;
  graduationRate4yr: number | null;
  medianEarnings10yr: number | null;
  satScores: string | null;
  actScores: string | null;
  popularMajors: string | null;
}

interface SchoolInsightsClientProps {
  colleges: College[];
}

type SortOption = "name" | "acceptance" | "enrollment" | "cost" | "earnings" | "gradRate";
type SectorFilter = "all" | "Public" | "Private";
type SelectivityFilter = "all" | "Most Selective" | "Very Selective" | "Selective" | "Less Selective";
type TestPolicyFilter = "all" | "Test Required" | "Test Optional" | "Test Blind";
type SettingFilter = "all" | "Urban" | "Suburban" | "Rural";

function getState(location: string | null): string {
  if (!location) return "Unknown";
  const parts = location.split(", ");
  return parts[parts.length - 1] || "Unknown";
}

function getAcceptanceRateColor(rate: number | null): string {
  if (!rate) return "text-gray-500";
  if (rate < 15) return "text-slate-900 dark:text-slate-100";
  if (rate < 30) return "text-slate-700 dark:text-slate-300";
  return "text-slate-600 dark:text-slate-400";
}

export function SchoolInsightsClient({ colleges: initialColleges }: SchoolInsightsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [selectivityFilter, setSelectivityFilter] = useState<SelectivityFilter>("all");
  const [testPolicyFilter, setTestPolicyFilter] = useState<TestPolicyFilter>("all");
  const [settingFilter, setSettingFilter] = useState<SettingFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const uniqueStates = useMemo(() => {
    const states = new Set(initialColleges.map(c => getState(c.location)));
    return states.size;
  }, [initialColleges]);

  const filteredAndSortedColleges = useMemo(() => {
    let filtered = initialColleges;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((college) => {
        let majors: string[] = [];
        if (college.popularMajors) {
          try {
            const parsed = JSON.parse(college.popularMajors);
            majors = Array.isArray(parsed) ? parsed : [];
          } catch {
            majors = [];
          }
        }
        const majorsMatch = majors.some((m: string) => m.toLowerCase().includes(query));
        return (
          college.name.toLowerCase().includes(query) ||
          college.location?.toLowerCase().includes(query) ||
          majorsMatch
        );
      });
    }

    if (sectorFilter !== "all") {
      filtered = filtered.filter((college) => college.institutionalSector === sectorFilter);
    }

    if (selectivityFilter !== "all") {
      filtered = filtered.filter((college) => college.admissionsSelectivity === selectivityFilter);
    }

    if (testPolicyFilter !== "all") {
      filtered = filtered.filter((college) => college.testPolicy === testPolicyFilter);
    }

    if (settingFilter !== "all") {
      filtered = filtered.filter((college) => college.setting === settingFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "acceptance":
          return (a.studentsAdmittedPercent || 100) - (b.studentsAdmittedPercent || 100);
        case "enrollment":
          return (b.undergraduateEnrollment || 0) - (a.undergraduateEnrollment || 0);
        case "cost":
          return (a.costOfAttendanceInState || 0) - (b.costOfAttendanceInState || 0);
        case "earnings":
          return (b.medianEarnings10yr || 0) - (a.medianEarnings10yr || 0);
        case "gradRate":
          return (b.graduationRate4yr || 0) - (a.graduationRate4yr || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [searchQuery, sortBy, sectorFilter, selectivityFilter, testPolicyFilter, settingFilter, initialColleges]);

  const handleCardClick = (slug: string) => {
    router.push(`/colleges/${slug}`);
  };

  const clearFilters = () => {
    setSectorFilter("all");
    setSelectivityFilter("all");
    setTestPolicyFilter("all");
    setSettingFilter("all");
    setSortBy("name");
    setSearchQuery("");
  };

  const activeFilterCount = [
    sectorFilter !== "all",
    selectivityFilter !== "all",
    testPolicyFilter !== "all",
    settingFilter !== "all",
    searchQuery.trim()
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80')] bg-cover bg-center opacity-20" />

        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">College Research Tool</h1>
              <p className="text-slate-300 max-w-2xl text-base leading-relaxed">
                Explore {initialColleges.length} universities with admissions data, costs, and outcomes from the Common Data Set.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-slate-400 text-sm">Public</div>
              <div className="text-xl font-semibold text-white mt-0.5">
                {initialColleges.filter(c => c.institutionalSector === "Public").length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-slate-400 text-sm">Private</div>
              <div className="text-xl font-semibold text-white mt-0.5">
                {initialColleges.filter(c => c.institutionalSector === "Private").length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-slate-400 text-sm">Most Selective</div>
              <div className="text-xl font-semibold text-white mt-0.5">
                {initialColleges.filter(c => c.admissionsSelectivity === "Most Selective").length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
              <div className="text-slate-400 text-sm">States</div>
              <div className="text-xl font-semibold text-white mt-0.5">{uniqueStates}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-2">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by school name, location, or major..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-cta/10 border-cta text-cta" : ""}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-cta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    School Type
                  </label>
                  <Select value={sectorFilter} onValueChange={(v) => setSectorFilter(v as SectorFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Selectivity
                  </label>
                  <Select value={selectivityFilter} onValueChange={(v) => setSelectivityFilter(v as SelectivityFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Most Selective">Most Selective (&lt;15%)</SelectItem>
                      <SelectItem value="Very Selective">Very Selective (15-35%)</SelectItem>
                      <SelectItem value="Selective">Selective (35-60%)</SelectItem>
                      <SelectItem value="Less Selective">Less Selective (&gt;60%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Test Policy
                  </label>
                  <Select value={testPolicyFilter} onValueChange={(v) => setTestPolicyFilter(v as TestPolicyFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Policies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Policies</SelectItem>
                      <SelectItem value="Test Optional">Test Optional</SelectItem>
                      <SelectItem value="Test Blind">Test Blind</SelectItem>
                      <SelectItem value="Test Required">Test Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Setting
                  </label>
                  <Select value={settingFilter} onValueChange={(v) => setSettingFilter(v as SettingFilter)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Settings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Settings</SelectItem>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Suburban">Suburban</SelectItem>
                      <SelectItem value="Rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="acceptance">Acceptance Rate (Low to High)</SelectItem>
                      <SelectItem value="enrollment">Enrollment (Largest First)</SelectItem>
                      <SelectItem value="cost">Cost (Low to High)</SelectItem>
                      <SelectItem value="gradRate">Graduation Rate (High to Low)</SelectItem>
                      <SelectItem value="earnings">Median Earnings (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredAndSortedColleges.length} of {initialColleges.length} schools
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                    <X className="h-4 w-4 mr-1" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {!showFilters && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {filteredAndSortedColleges.length} {filteredAndSortedColleges.length === 1 ? "school" : "schools"}
            {hasActiveFilters && ` (filtered from ${initialColleges.length})`}
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Colleges Grid */}
      {filteredAndSortedColleges.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No schools found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filters to find more schools.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedColleges.map((college) => (
            <div
              key={college.id}
              onClick={() => handleCardClick(college.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(college.slug);
                }
              }}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 rounded-xl group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 h-full border hover:border-slate-300 dark:hover:border-slate-600 overflow-hidden">
                <div className={`h-1 ${college.institutionalSector === "Public" ? "bg-slate-400" : "bg-slate-600"}`} />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1.5 leading-tight line-clamp-2 group-hover:text-cta transition-colors">
                        {college.name}
                      </CardTitle>
                      {college.location && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{college.location}</span>
                        </div>
                      )}
                    </div>
                    {college.studentsAdmittedPercent && (
                      <div className="flex-shrink-0 text-center">
                        <div className={`text-2xl font-bold ${getAcceptanceRateColor(college.studentsAdmittedPercent)}`}>
                          {college.studentsAdmittedPercent}%
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Accept</div>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {college.undergraduateEnrollment && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                          <Users className="h-3.5 w-3.5" />
                          <span>Enrollment</span>
                        </div>
                        <div className="font-bold text-navy dark:text-white">
                          {college.undergraduateEnrollment.toLocaleString()}
                        </div>
                      </div>
                    )}

                    {college.studentFacultyRatio && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs mb-0.5">
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>Ratio</span>
                        </div>
                        <div className="font-bold text-navy dark:text-white">
                          {college.studentFacultyRatio}
                        </div>
                      </div>
                    )}
                  </div>

                  {college.costOfAttendanceInState && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4">
                      <div className="text-slate-500 dark:text-slate-400 text-xs mb-1">Annual Cost</div>
                      {college.institutionalSector === "Public" && college.costOfAttendanceOutOfState ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            ${(college.costOfAttendanceInState / 1000).toFixed(0)}K
                          </span>
                          <span className="text-xs text-slate-500">in-state</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            ${(college.costOfAttendanceOutOfState / 1000).toFixed(0)}K
                          </span>
                          <span className="text-xs text-slate-500">out</span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          ${(college.costOfAttendanceInState / 1000).toFixed(0)}K
                        </span>
                      )}
                    </div>
                  )}

                  {(college.graduationRate4yr || college.testPolicy) && (
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      {college.graduationRate4yr && (
                        <span>{college.graduationRate4yr}% graduation rate</span>
                      )}
                      {college.testPolicy && (
                        <span className="text-slate-600 dark:text-slate-400">
                          {college.testPolicy}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    {college.institutionalSector && (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                        {college.institutionalSector}
                      </span>
                    )}
                    {college.admissionsSelectivity && (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                        {college.admissionsSelectivity}
                      </span>
                    )}
                    {college.setting && (
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                        {college.setting}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        <p>Data sourced from Common Data Set and IPEDS. Click on any school to view detailed information.</p>
      </div>
    </div>
  );
}
