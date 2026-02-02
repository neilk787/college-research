/**
 * Comprehensive College Data Validation Tests
 *
 * This test suite validates that all college data is:
 * 1. Complete - all required fields are present
 * 2. Accurate - values are within valid ranges
 * 3. Well-formatted - JSON fields are properly structured
 * 4. Up-to-date - using latest available data (2023-2024 academic year)
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  setting: string | null;
  institutionalSector: string | null;
  undergraduateEnrollment: number | null;
  studentsAdmittedPercent: number | null;
  costOfAttendanceInState: number | null;
  costOfAttendanceOutOfState: number | null;
  studentFacultyRatio: string | null;
  admissionsSelectivity: string | null;
  testPolicy: string | null;
  retentionRate: number | null;
  graduationRate4yr: number | null;
  graduationRate6yr: number | null;
  medianEarnings10yr: number | null;
  totalApplicants: number | null;
  totalAdmitted: number | null;
  totalEnrolled: number | null;
  yieldRate: number | null;
  earlyDecisionApplied: number | null;
  earlyDecisionAdmitted: number | null;
  earlyDecisionAdmitRate: number | null;
  earlyActionApplied: number | null;
  earlyActionAdmitted: number | null;
  earlyActionAdmitRate: number | null;
  regularDecisionApplied: number | null;
  regularDecisionAdmitted: number | null;
  regularDecisionAdmitRate: number | null;
  satScores: string | null;
  actScores: string | null;
  gpaDistribution: string | null;
  popularMajors: string | null;
  admissionConsiderations: string | null;
  description: string | null;
  website: string | null;
  applicationFee: number | null;
  rdDeadline: string | null;
  edDeadline: string | null;
  eaDeadline: string | null;
  fafsaRequired: boolean | null;
  cssProfileRequired: boolean | null;
  averageNetPrice: number | null;
  financialAidDeadline: string | null;
  raceEthnicity: string | null;
  genderDistribution: string | null;
  outOfStatePercent: number | null;
  athletics: string | null;
  primaryColor: string | null;
}

interface ValidationResult {
  collegeName: string;
  slug: string;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

interface TestResults {
  totalColleges: number;
  passedColleges: number;
  failedColleges: number;
  averageScore: number;
  results: ValidationResult[];
}

// Known accurate data for validation (2023-2024 Common Data Set)
const KNOWN_DATA: Record<string, Partial<College>> = {
  "harvard-university": {
    studentsAdmittedPercent: 3.2,
    undergraduateEnrollment: 7153,
    costOfAttendanceInState: 82866,
    retentionRate: 98,
    graduationRate4yr: 86,
    institutionalSector: "Private",
    testPolicy: "Test Optional",
  },
  "stanford-university": {
    studentsAdmittedPercent: 3.7,
    undergraduateEnrollment: 7761,
    costOfAttendanceInState: 85761,
    retentionRate: 98,
    institutionalSector: "Private",
  },
  "mit": {
    studentsAdmittedPercent: 3.5,
    undergraduateEnrollment: 4638,
    institutionalSector: "Private",
    testPolicy: "Test Required",
  },
  "yale-university": {
    studentsAdmittedPercent: 4.4,
    undergraduateEnrollment: 6645,
    institutionalSector: "Private",
  },
  "princeton-university": {
    studentsAdmittedPercent: 4.4,
    undergraduateEnrollment: 5604,
    institutionalSector: "Private",
  },
  "columbia-university": {
    studentsAdmittedPercent: 3.9,
    institutionalSector: "Private",
  },
  "university-of-pennsylvania": {
    studentsAdmittedPercent: 5.8,
    institutionalSector: "Private",
  },
  "brown-university": {
    studentsAdmittedPercent: 5.1,
    institutionalSector: "Private",
  },
  "dartmouth-college": {
    studentsAdmittedPercent: 5.5,
    institutionalSector: "Private",
  },
  "cornell-university": {
    studentsAdmittedPercent: 7.3,
    institutionalSector: "Private",
  },
  "duke-university": {
    studentsAdmittedPercent: 5.1,
    institutionalSector: "Private",
  },
  "northwestern-university": {
    studentsAdmittedPercent: 7.0,
    institutionalSector: "Private",
  },
  "university-of-chicago": {
    studentsAdmittedPercent: 5.1,
    institutionalSector: "Private",
  },
  "johns-hopkins-university": {
    studentsAdmittedPercent: 6.5,
    institutionalSector: "Private",
  },
  "rice-university": {
    studentsAdmittedPercent: 7.7,
    institutionalSector: "Private",
  },
  "vanderbilt-university": {
    studentsAdmittedPercent: 5.6,
    institutionalSector: "Private",
  },
  "university-of-notre-dame": {
    studentsAdmittedPercent: 11.9,
    institutionalSector: "Private",
  },
  "georgetown-university": {
    studentsAdmittedPercent: 12.0,
    institutionalSector: "Private",
  },
  "carnegie-mellon-university": {
    studentsAdmittedPercent: 11.0,
    institutionalSector: "Private",
  },
  "ucla": {
    studentsAdmittedPercent: 8.8,
    institutionalSector: "Public",
    testPolicy: "Test Blind",
  },
  "uc-berkeley": {
    studentsAdmittedPercent: 11.6,
    institutionalSector: "Public",
    testPolicy: "Test Blind",
  },
  "university-of-virginia": {
    studentsAdmittedPercent: 16.3,
    institutionalSector: "Public",
  },
  "university-of-michigan": {
    studentsAdmittedPercent: 15.0,
    institutionalSector: "Public",
  },
  "unc-chapel-hill": {
    studentsAdmittedPercent: 16.8,
    institutionalSector: "Public",
  },
  "georgia-tech": {
    studentsAdmittedPercent: 16.0,
    institutionalSector: "Public",
  },
  "university-of-florida": {
    studentsAdmittedPercent: 23.0,
    institutionalSector: "Public",
  },
  "usc": {
    studentsAdmittedPercent: 9.5,
    institutionalSector: "Private",
  },
  "nyu": {
    studentsAdmittedPercent: 8.0,
    institutionalSector: "Private",
  },
  "boston-college": {
    studentsAdmittedPercent: 15.5,
    institutionalSector: "Private",
  },
  "boston-university": {
    studentsAdmittedPercent: 11.0,
    institutionalSector: "Private",
  },
  "tufts-university": {
    studentsAdmittedPercent: 9.5,
    institutionalSector: "Private",
  },
  "wake-forest-university": {
    studentsAdmittedPercent: 22.0, // Updated to 2023-2024 data
    institutionalSector: "Private",
  },
  "emory-university": {
    studentsAdmittedPercent: 11.0,
    institutionalSector: "Private",
  },
  "william-and-mary": {
    studentsAdmittedPercent: 33.0,
    institutionalSector: "Public",
  },
  "virginia-tech": {
    studentsAdmittedPercent: 57.0,
    institutionalSector: "Public",
  },
  "george-mason-university": {
    studentsAdmittedPercent: 90.0,
    institutionalSector: "Public",
  },
};

// Schools with free tuition (service academies, work colleges, etc.)
const FREE_TUITION_SCHOOLS = [
  "west-point",
  "naval-academy",
  "air-force-academy",
  "coast-guard-academy",
  "merchant-marine-academy",
  "berea-college",
  "deep-springs-college",
  "alice-lloyd-college",
  "college-of-the-ozarks",
  "curtis-institute-of-music",
  "webb-institute",
];

// Valid ranges for data validation
const VALID_RANGES = {
  studentsAdmittedPercent: { min: 1, max: 100 },
  undergraduateEnrollment: { min: 100, max: 70000 },
  costOfAttendanceInState: { min: 0, max: 100000 }, // 0 allowed for free tuition schools
  costOfAttendanceOutOfState: { min: 0, max: 100000 }, // 0 allowed for free tuition schools
  retentionRate: { min: 50, max: 100 },
  graduationRate4yr: { min: 10, max: 100 },
  graduationRate6yr: { min: 20, max: 100 },
  medianEarnings10yr: { min: 25000, max: 200000 },
  totalApplicants: { min: 500, max: 150000 },
  yieldRate: { min: 5, max: 90 },
  applicationFee: { min: 0, max: 100 },
  averageNetPrice: { min: 0, max: 80000 },
  outOfStatePercent: { min: 0, max: 100 },
  satMath: { min: 400, max: 800 },
  satReadingWriting: { min: 400, max: 800 },
  actComposite: { min: 15, max: 36 },
};

// International schools - don't apply US-specific validation rules
const INTERNATIONAL_SCHOOL_SLUGS = [
  // Middle East
  "kaust",
  "technion",
  "tel-aviv-university",
  "american-university-of-beirut",
  // Latin America
  "unam",
  "university-of-sao-paulo",
  "pontifical-catholic-university-of-chile",
  "university-of-buenos-aires",
  // India
  "iit-bombay",
  "iit-delhi",
  "iit-madras",
  "iit-kanpur",
  "iit-kharagpur",
  "indian-institute-of-science",
  "bits-pilani",
  "university-of-delhi",
  // Asia-Pacific
  "university-of-tokyo",
  "peking-university",
  "tsinghua-university",
  "national-university-of-singapore",
  "nanyang-technological-university",
  "university-of-hong-kong",
  "seoul-national-university",
  "kaist",
  // Europe
  "university-of-cambridge",
  "university-of-oxford",
  "imperial-college-london",
  "london-school-of-economics",
  "eth-zurich",
  "epfl",
  "sciences-po",
  "university-of-amsterdam",
  "university-of-edinburgh",
  "trinity-college-dublin",
  // Canada
  "university-of-toronto",
  "mcgill-university",
  "university-of-british-columbia",
  "university-of-waterloo",
  // Australia
  "university-of-melbourne",
  "university-of-sydney",
  "australian-national-university",
  "university-of-queensland",
];

// Required fields for a complete college profile
const REQUIRED_FIELDS = [
  "name",
  "slug",
  "location",
  "institutionalSector",
  "undergraduateEnrollment",
  "studentsAdmittedPercent",
  "costOfAttendanceInState",
  "studentFacultyRatio",
  "description",
  "website",
];

// Important fields that should be present for a high-quality profile
const IMPORTANT_FIELDS = [
  "setting",
  "admissionsSelectivity",
  "testPolicy",
  "retentionRate",
  "graduationRate4yr",
  "medianEarnings10yr",
  "totalApplicants",
  "totalAdmitted",
  "satScores",
  "actScores",
  "popularMajors",
  "admissionConsiderations",
  "rdDeadline",
  "fafsaRequired",
  "cssProfileRequired",
  "averageNetPrice",
  "genderDistribution",
  "raceEthnicity",
];

// Fields for elite schools (acceptance < 20%)
const ELITE_SCHOOL_FIELDS = [
  "earlyDecisionApplied",
  "earlyDecisionAdmitted",
  "earlyDecisionAdmitRate",
  "earlyActionApplied",
  "earlyActionAdmitted",
  "earlyActionAdmitRate",
  "gpaDistribution",
  "primaryColor",
];

function parseJSON<T>(jsonString: string | null | undefined): T | null {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

function validateSATScores(satScores: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<{
    readingWriting?: { min: number; max: number };
    math?: { min: number; max: number };
    total?: { min: number; max: number };
    percentSubmitted?: number;
  }>(satScores);

  if (!parsed) {
    return { valid: false, errors: ["SAT scores not parseable or missing"] };
  }

  if (!parsed.readingWriting && !parsed.math && !parsed.total) {
    errors.push("SAT scores missing all score ranges");
  }

  if (parsed.readingWriting) {
    if (parsed.readingWriting.min < VALID_RANGES.satReadingWriting.min ||
        parsed.readingWriting.max > VALID_RANGES.satReadingWriting.max) {
      errors.push(`SAT R&W out of range: ${parsed.readingWriting.min}-${parsed.readingWriting.max}`);
    }
    if (parsed.readingWriting.min > parsed.readingWriting.max) {
      errors.push("SAT R&W min > max");
    }
  }

  if (parsed.math) {
    if (parsed.math.min < VALID_RANGES.satMath.min ||
        parsed.math.max > VALID_RANGES.satMath.max) {
      errors.push(`SAT Math out of range: ${parsed.math.min}-${parsed.math.max}`);
    }
    if (parsed.math.min > parsed.math.max) {
      errors.push("SAT Math min > max");
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateACTScores(actScores: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<{
    composite?: { min: number; max: number };
    english?: { min: number; max: number };
    math?: { min: number; max: number };
    percentSubmitted?: number;
  }>(actScores);

  if (!parsed) {
    return { valid: false, errors: ["ACT scores not parseable or missing"] };
  }

  if (!parsed.composite) {
    errors.push("ACT composite scores missing");
  }

  if (parsed.composite) {
    if (parsed.composite.min < VALID_RANGES.actComposite.min ||
        parsed.composite.max > VALID_RANGES.actComposite.max) {
      errors.push(`ACT composite out of range: ${parsed.composite.min}-${parsed.composite.max}`);
    }
    if (parsed.composite.min > parsed.composite.max) {
      errors.push("ACT composite min > max");
    }
  }

  return { valid: errors.length === 0, errors };
}

function validatePopularMajors(popularMajors: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<string[]>(popularMajors);

  if (!parsed) {
    return { valid: false, errors: ["Popular majors not parseable or missing"] };
  }

  if (!Array.isArray(parsed)) {
    errors.push("Popular majors is not an array");
  } else if (parsed.length < 3) {
    errors.push(`Only ${parsed.length} popular majors listed (should have at least 3)`);
  } else if (parsed.length > 15) {
    errors.push(`Too many popular majors listed (${parsed.length})`);
  }

  return { valid: errors.length === 0, errors };
}

function validateAdmissionConsiderations(considerations: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<Record<string, string>>(considerations);

  if (!parsed) {
    return { valid: false, errors: ["Admission considerations not parseable or missing"] };
  }

  // Create a lowercase key map for case-insensitive matching
  const parsedLower: Record<string, string> = {};
  for (const key of Object.keys(parsed)) {
    parsedLower[key.toLowerCase()] = parsed[key];
  }

  // Expected factors with variations
  const factorChecks = [
    { name: "Academic GPA", keys: ["academic gpa"] },
    { name: "Rigor of secondary school record", keys: ["rigor of secondary school record"] },
    { name: "Standardized test scores", keys: ["standardized test scores"] },
    { name: "Application essay", keys: ["application essay"] },
    { name: "Recommendation(s)", keys: ["recommendation(s)", "recommendations"] },
    { name: "Extracurricular activities", keys: ["extracurricular activities"] },
  ];

  const missingFactors = factorChecks.filter(f =>
    !f.keys.some(key => parsedLower[key] !== undefined)
  ).map(f => f.name);

  if (missingFactors.length > 0) {
    errors.push(`Missing admission factors: ${missingFactors.join(", ")}`);
  }

  const validLevels = ["Very Important", "Important", "Considered", "Not Considered"];
  for (const [factor, level] of Object.entries(parsed)) {
    if (!validLevels.includes(level)) {
      errors.push(`Invalid level "${level}" for factor "${factor}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateGenderDistribution(genderDist: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<{ women?: number; men?: number }>(genderDist);

  if (!parsed) {
    return { valid: false, errors: ["Gender distribution not parseable or missing"] };
  }

  if (parsed.women === undefined || parsed.men === undefined) {
    errors.push("Missing women or men percentage");
  }

  if (parsed.women !== undefined && parsed.men !== undefined) {
    const total = parsed.women + parsed.men;
    if (total < 98 || total > 102) {
      errors.push(`Gender percentages don't add up (${total}%)`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateRaceEthnicity(raceEth: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const parsed = parseJSON<Record<string, number>>(raceEth);

  if (!parsed) {
    return { valid: false, errors: ["Race/ethnicity not parseable or missing"] };
  }

  // Accept variations in naming conventions
  const hasWhite = parsed["White"] !== undefined;
  const hasAsian = parsed["Asian"] !== undefined;
  const hasHispanic = parsed["Hispanic"] !== undefined || parsed["Hispanic/Latino"] !== undefined;
  const hasBlack = parsed["Black"] !== undefined || parsed["Black/African American"] !== undefined;

  const missingGroups: string[] = [];
  if (!hasWhite) missingGroups.push("White");
  if (!hasAsian) missingGroups.push("Asian");
  if (!hasHispanic) missingGroups.push("Hispanic");
  if (!hasBlack) missingGroups.push("Black");

  if (missingGroups.length > 0) {
    errors.push(`Missing race/ethnicity groups: ${missingGroups.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

function validateCollege(college: College): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Check if this is an international school
  const isInternational = INTERNATIONAL_SCHOOL_SLUGS.includes(college.slug);

  // For international schools, use relaxed validation
  if (isInternational) {
    // Only check basic fields for international schools
    const basicFields = ["name", "slug", "location", "description"];
    for (const field of basicFields) {
      const value = college[field as keyof College];
      if (value === null || value === undefined || value === "") {
        errors.push(`Missing required field: ${field}`);
        score -= 5;
      }
    }
    // Return early with high score for international schools
    return {
      collegeName: college.name,
      slug: college.slug,
      errors,
      warnings: ["International school - relaxed validation applied"],
      score: Math.max(0, Math.min(100, score)),
    };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    const value = college[field as keyof College];
    if (value === null || value === undefined || value === "") {
      errors.push(`Missing required field: ${field}`);
      score -= 5;
    }
  }

  // Check important fields
  for (const field of IMPORTANT_FIELDS) {
    const value = college[field as keyof College];
    if (value === null || value === undefined || value === "") {
      warnings.push(`Missing important field: ${field}`);
      score -= 2;
    }
  }

  // Check elite school fields if applicable
  const isElite = college.studentsAdmittedPercent && college.studentsAdmittedPercent < 20;

  // Schools with non-standard admissions (don't check ED/EA stats)
  const SPECIAL_ADMISSION_SCHOOLS = [
    // Service academies
    "west-point", "naval-academy", "air-force-academy", "coast-guard-academy", "merchant-marine-academy",
    // Conservatories and specialized arts schools
    "the-juilliard-school", "curtis-institute-of-music", "colburn-school",
    // Unique admission process
    "olin-college-of-engineering", "deep-springs-college", "the-cooper-union",
  ];

  if (isElite && !isInternational) {
    const isSpecialAdmission = SPECIAL_ADMISSION_SCHOOLS.includes(college.slug);

    // Only check ED fields if school offers ED (has ED deadline)
    if (!isSpecialAdmission && college.edDeadline) {
      const edFields = ["earlyDecisionApplied", "earlyDecisionAdmitted", "earlyDecisionAdmitRate"];
      for (const field of edFields) {
        const value = college[field as keyof College];
        if (value === null || value === undefined) {
          warnings.push(`Elite school missing field: ${field}`);
          score -= 1;
        }
      }
    }

    // Only check EA fields if school offers EA (has EA deadline)
    if (!isSpecialAdmission && college.eaDeadline) {
      const eaFields = ["earlyActionApplied", "earlyActionAdmitted", "earlyActionAdmitRate"];
      for (const field of eaFields) {
        const value = college[field as keyof College];
        if (value === null || value === undefined) {
          warnings.push(`Elite school missing field: ${field}`);
          score -= 1;
        }
      }
    }

    // Always check gpaDistribution and primaryColor for elite schools
    if (!college.gpaDistribution) {
      warnings.push("Elite school missing field: gpaDistribution");
      score -= 1;
    }
    if (!college.primaryColor) {
      warnings.push("Elite school missing field: primaryColor");
      score -= 1;
    }
  }

  // Validate numeric ranges
  if (college.studentsAdmittedPercent !== null) {
    if (college.studentsAdmittedPercent < VALID_RANGES.studentsAdmittedPercent.min ||
        college.studentsAdmittedPercent > VALID_RANGES.studentsAdmittedPercent.max) {
      errors.push(`Acceptance rate out of range: ${college.studentsAdmittedPercent}%`);
      score -= 10;
    }
  }

  if (college.undergraduateEnrollment !== null) {
    if (college.undergraduateEnrollment < VALID_RANGES.undergraduateEnrollment.min ||
        college.undergraduateEnrollment > VALID_RANGES.undergraduateEnrollment.max) {
      errors.push(`Enrollment out of range: ${college.undergraduateEnrollment}`);
      score -= 5;
    }
  }

  if (college.costOfAttendanceInState !== null) {
    if (college.costOfAttendanceInState < VALID_RANGES.costOfAttendanceInState.min ||
        college.costOfAttendanceInState > VALID_RANGES.costOfAttendanceInState.max) {
      errors.push(`In-state cost out of range: $${college.costOfAttendanceInState}`);
      score -= 5;
    }
  }

  if (college.retentionRate !== null) {
    if (college.retentionRate < VALID_RANGES.retentionRate.min ||
        college.retentionRate > VALID_RANGES.retentionRate.max) {
      errors.push(`Retention rate out of range: ${college.retentionRate}%`);
      score -= 5;
    }
  }

  if (college.graduationRate4yr !== null) {
    if (college.graduationRate4yr < VALID_RANGES.graduationRate4yr.min ||
        college.graduationRate4yr > VALID_RANGES.graduationRate4yr.max) {
      errors.push(`4-year grad rate out of range: ${college.graduationRate4yr}%`);
      score -= 5;
    }
  }

  // Validate JSON fields
  if (college.satScores) {
    const satValidation = validateSATScores(college.satScores);
    if (!satValidation.valid) {
      warnings.push(...satValidation.errors);
      score -= 2;
    }
  }

  if (college.actScores) {
    const actValidation = validateACTScores(college.actScores);
    if (!actValidation.valid) {
      warnings.push(...actValidation.errors);
      score -= 2;
    }
  }

  if (college.popularMajors) {
    const majorsValidation = validatePopularMajors(college.popularMajors);
    if (!majorsValidation.valid) {
      warnings.push(...majorsValidation.errors);
      score -= 1;
    }
  }

  if (college.admissionConsiderations) {
    const considerationsValidation = validateAdmissionConsiderations(college.admissionConsiderations);
    if (!considerationsValidation.valid) {
      warnings.push(...considerationsValidation.errors);
      score -= 2;
    }
  }

  if (college.genderDistribution) {
    const genderValidation = validateGenderDistribution(college.genderDistribution);
    if (!genderValidation.valid) {
      warnings.push(...genderValidation.errors);
      score -= 1;
    }
  }

  // Only validate race/ethnicity for US schools (international schools have different demographics)
  if (college.raceEthnicity && !isInternational) {
    const raceValidation = validateRaceEthnicity(college.raceEthnicity);
    if (!raceValidation.valid) {
      warnings.push(...raceValidation.errors);
      score -= 1;
    }
  }

  // Validate against known data
  const knownData = KNOWN_DATA[college.slug];
  if (knownData) {
    if (knownData.studentsAdmittedPercent !== undefined && college.studentsAdmittedPercent !== null) {
      const diff = Math.abs(knownData.studentsAdmittedPercent - college.studentsAdmittedPercent);
      if (diff > 2) {
        errors.push(`Acceptance rate mismatch: expected ~${knownData.studentsAdmittedPercent}%, got ${college.studentsAdmittedPercent}%`);
        score -= 10;
      }
    }

    if (knownData.institutionalSector && college.institutionalSector !== knownData.institutionalSector) {
      errors.push(`Sector mismatch: expected ${knownData.institutionalSector}, got ${college.institutionalSector}`);
      score -= 5;
    }

    if (knownData.testPolicy && college.testPolicy !== knownData.testPolicy) {
      warnings.push(`Test policy may be outdated: expected ${knownData.testPolicy}, got ${college.testPolicy}`);
      score -= 3;
    }
  }

  // Consistency checks
  if (college.totalApplicants && college.totalAdmitted) {
    const calculatedRate = (college.totalAdmitted / college.totalApplicants) * 100;
    if (college.studentsAdmittedPercent) {
      const diff = Math.abs(calculatedRate - college.studentsAdmittedPercent);
      if (diff > 2) {
        warnings.push(`Acceptance rate inconsistent: stated ${college.studentsAdmittedPercent}%, calculated ${calculatedRate.toFixed(1)}%`);
        score -= 3;
      }
    }
  }

  if (college.earlyDecisionApplied && college.earlyDecisionAdmitted) {
    const calculatedEDRate = (college.earlyDecisionAdmitted / college.earlyDecisionApplied) * 100;
    if (college.earlyDecisionAdmitRate) {
      const diff = Math.abs(calculatedEDRate - college.earlyDecisionAdmitRate);
      if (diff > 2) {
        warnings.push(`ED admit rate inconsistent: stated ${college.earlyDecisionAdmitRate}%, calculated ${calculatedEDRate.toFixed(1)}%`);
        score -= 2;
      }
    }
  }

  // Public school should have different in-state vs out-of-state costs
  // Skip for free tuition schools (service academies, etc.)
  const isFreeTuition = FREE_TUITION_SCHOOLS.includes(college.slug);
  if (college.institutionalSector === "Public" && !isFreeTuition) {
    if (college.costOfAttendanceInState && college.costOfAttendanceOutOfState) {
      if (college.costOfAttendanceInState >= college.costOfAttendanceOutOfState) {
        warnings.push("Public school: in-state cost should be less than out-of-state");
        score -= 3;
      }
    } else if (!college.costOfAttendanceOutOfState) {
      warnings.push("Public school missing out-of-state cost");
      score -= 2;
    }
  }

  // Description quality check
  if (college.description) {
    if (college.description.length < 100) {
      warnings.push("Description too short (< 100 chars)");
      score -= 2;
    }
    if (college.description.length < 50) {
      errors.push("Description critically short (< 50 chars)");
      score -= 5;
    }
  }

  // Website validation
  if (college.website) {
    if (!college.website.startsWith("http://") && !college.website.startsWith("https://")) {
      warnings.push("Website URL missing protocol");
      score -= 1;
    }
  }

  // Selectivity consistency
  if (college.studentsAdmittedPercent && college.admissionsSelectivity) {
    const rate = college.studentsAdmittedPercent;
    const selectivity = college.admissionsSelectivity;

    if (rate < 15 && selectivity !== "Most Selective") {
      warnings.push(`Selectivity mismatch: ${rate}% should be "Most Selective", not "${selectivity}"`);
      score -= 2;
    } else if (rate >= 15 && rate < 35 && selectivity !== "Very Selective" && selectivity !== "Most Selective") {
      warnings.push(`Selectivity mismatch: ${rate}% should be "Very Selective", not "${selectivity}"`);
      score -= 2;
    }
  }

  return {
    collegeName: college.name,
    slug: college.slug,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

async function runValidation(): Promise<TestResults> {
  const colleges = await db.college.findMany() as College[];

  const results: ValidationResult[] = [];
  let totalScore = 0;

  for (const college of colleges) {
    const result = validateCollege(college);
    results.push(result);
    totalScore += result.score;
  }

  const passedColleges = results.filter(r => r.score >= 80).length;
  const failedColleges = results.filter(r => r.score < 80).length;

  return {
    totalColleges: colleges.length,
    passedColleges,
    failedColleges,
    averageScore: totalScore / colleges.length,
    results: results.sort((a, b) => a.score - b.score), // Sort by score ascending (worst first)
  };
}

// Main execution
async function main() {
  console.log("=".repeat(80));
  console.log("COLLEGE DATA VALIDATION REPORT");
  console.log("=".repeat(80));
  console.log("");

  const results = await runValidation();

  console.log(`Total Colleges: ${results.totalColleges}`);
  console.log(`Passed (≥80%): ${results.passedColleges} (${((results.passedColleges / results.totalColleges) * 100).toFixed(1)}%)`);
  console.log(`Failed (<80%): ${results.failedColleges} (${((results.failedColleges / results.totalColleges) * 100).toFixed(1)}%)`);
  console.log(`Average Score: ${results.averageScore.toFixed(1)}%`);
  console.log("");

  // Show worst performers
  console.log("=".repeat(80));
  console.log("COLLEGES NEEDING ATTENTION (Score < 80%)");
  console.log("=".repeat(80));

  const failing = results.results.filter(r => r.score < 80);
  for (const result of failing.slice(0, 50)) {
    console.log("");
    console.log(`${result.collegeName} (${result.slug})`);
    console.log(`  Score: ${result.score}%`);
    if (result.errors.length > 0) {
      console.log(`  ERRORS:`);
      result.errors.forEach(e => console.log(`    - ${e}`));
    }
    if (result.warnings.length > 0) {
      console.log(`  WARNINGS:`);
      result.warnings.slice(0, 5).forEach(w => console.log(`    - ${w}`));
      if (result.warnings.length > 5) {
        console.log(`    ... and ${result.warnings.length - 5} more warnings`);
      }
    }
  }

  // Summary by issue type
  console.log("");
  console.log("=".repeat(80));
  console.log("ISSUE SUMMARY");
  console.log("=".repeat(80));

  const issueCounts: Record<string, number> = {};
  for (const result of results.results) {
    for (const error of result.errors) {
      const issueType = error.split(":")[0];
      issueCounts[issueType] = (issueCounts[issueType] || 0) + 1;
    }
    for (const warning of result.warnings) {
      const issueType = warning.split(":")[0];
      issueCounts[issueType] = (issueCounts[issueType] || 0) + 1;
    }
  }

  const sortedIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);
  for (const [issue, count] of sortedIssues.slice(0, 20)) {
    console.log(`  ${count.toString().padStart(3)} - ${issue}`);
  }

  // Output JSON for further processing
  const outputPath = "/tmp/college-validation-results.json";
  const fs = await import("fs");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log("");
  console.log(`Full results saved to: ${outputPath}`);

  await db.$disconnect();

  // Exit with error if too many failures
  if (results.averageScore < 80) {
    console.log("");
    console.log("❌ VALIDATION FAILED: Average score below 80%");
    process.exit(1);
  } else {
    console.log("");
    console.log("✓ VALIDATION PASSED");
    process.exit(0);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
