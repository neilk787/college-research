/**
 * Fix College Data - Batch 2
 * More top schools with comprehensive 2023-2024 data
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface CollegeUpdate {
  slug: string;
  data: Record<string, unknown>;
}

const COLLEGE_UPDATES: CollegeUpdate[] = [
  // More Top Private Universities
  {
    slug: "rice-university",
    data: {
      earlyDecisionApplied: 2634,
      earlyDecisionAdmitted: 509,
      earlyDecisionAdmitRate: 19.3,
      edDeadline: "November 1",
      totalApplicants: 31394,
      totalAdmitted: 2415,
      studentsAdmittedPercent: 7.7,
      rdDeadline: "January 4",
      undergraduateEnrollment: 4494,
      costOfAttendanceInState: 77364,
      costOfAttendanceOutOfState: 77364,
      retentionRate: 98,
      graduationRate4yr: 85,
      graduationRate6yr: 94,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 31,
        "Asian": 28,
        "Hispanic": 17,
        "Black": 8,
        "Two or More Races": 6,
        "International": 15
      }),
      primaryColor: "#00205B",
      secondaryColor: "#5E6A71",
    }
  },
  {
    slug: "vanderbilt-university",
    data: {
      earlyDecisionApplied: 5986,
      earlyDecisionAdmitted: 799,
      earlyDecisionAdmitRate: 13.3,
      edDeadline: "November 1",
      totalApplicants: 47174,
      totalAdmitted: 2632,
      studentsAdmittedPercent: 5.6,
      rdDeadline: "January 1",
      undergraduateEnrollment: 7151,
      costOfAttendanceInState: 83238,
      costOfAttendanceOutOfState: 83238,
      retentionRate: 97,
      graduationRate4yr: 88,
      graduationRate6yr: 94,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 50,
        "Asian": 14,
        "Hispanic": 11,
        "Black": 8,
        "Two or More Races": 6,
        "International": 9
      }),
      primaryColor: "#866D4B",
      secondaryColor: "#000000",
    }
  },
  {
    slug: "university-of-notre-dame",
    data: {
      earlyActionApplied: 11165,
      earlyActionAdmitted: 1669,
      earlyActionAdmitRate: 14.9,
      eaDeadline: "November 1",
      totalApplicants: 26506,
      totalAdmitted: 3163,
      studentsAdmittedPercent: 11.9,
      rdDeadline: "January 1",
      undergraduateEnrollment: 8917,
      costOfAttendanceInState: 82308,
      costOfAttendanceOutOfState: 82308,
      retentionRate: 98,
      graduationRate4yr: 91,
      graduationRate6yr: 97,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 48, men: 52 }),
      raceEthnicity: JSON.stringify({
        "White": 66,
        "Hispanic": 13,
        "Asian": 7,
        "Black": 4,
        "Two or More Races": 4,
        "International": 6
      }),
      primaryColor: "#0C2340",
      secondaryColor: "#C99700",
    }
  },
  {
    slug: "georgetown-university",
    data: {
      earlyActionApplied: 9135,
      earlyActionAdmitted: 908,
      earlyActionAdmitRate: 9.9,
      eaDeadline: "November 1",
      totalApplicants: 26187,
      totalAdmitted: 3143,
      studentsAdmittedPercent: 12.0,
      rdDeadline: "January 10",
      undergraduateEnrollment: 7900,
      costOfAttendanceInState: 83880,
      costOfAttendanceOutOfState: 83880,
      retentionRate: 97,
      graduationRate4yr: 90,
      graduationRate6yr: 95,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 48,
        "Asian": 11,
        "Hispanic": 10,
        "Black": 6,
        "Two or More Races": 5,
        "International": 14
      }),
      primaryColor: "#041E42",
      secondaryColor: "#63666A",
    }
  },
  {
    slug: "carnegie-mellon-university",
    data: {
      earlyDecisionApplied: 5825,
      earlyDecisionAdmitted: 1016,
      earlyDecisionAdmitRate: 17.4,
      edDeadline: "November 1",
      totalApplicants: 34261,
      totalAdmitted: 3770,
      studentsAdmittedPercent: 11.0,
      rdDeadline: "January 3",
      undergraduateEnrollment: 7365,
      costOfAttendanceInState: 83098,
      costOfAttendanceOutOfState: 83098,
      retentionRate: 97,
      graduationRate4yr: 79,
      graduationRate6yr: 93,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Important",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 42, men: 58 }),
      raceEthnicity: JSON.stringify({
        "White": 31,
        "Asian": 34,
        "Hispanic": 9,
        "Black": 4,
        "Two or More Races": 4,
        "International": 23
      }),
      primaryColor: "#BB0000",
      secondaryColor: "#6D6E71",
    }
  },
  {
    slug: "emory-university",
    data: {
      earlyDecisionApplied: 3032,
      earlyDecisionAdmitted: 733,
      earlyDecisionAdmitRate: 24.2,
      edDeadline: "November 1",
      totalApplicants: 33185,
      totalAdmitted: 3651,
      studentsAdmittedPercent: 11.0,
      rdDeadline: "January 1",
      undergraduateEnrollment: 7086,
      costOfAttendanceInState: 80610,
      costOfAttendanceOutOfState: 80610,
      retentionRate: 96,
      graduationRate4yr: 84,
      graduationRate6yr: 92,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 59, men: 41 }),
      raceEthnicity: JSON.stringify({
        "White": 38,
        "Asian": 24,
        "Hispanic": 12,
        "Black": 9,
        "Two or More Races": 5,
        "International": 16
      }),
      primaryColor: "#012169",
      secondaryColor: "#B58500",
    }
  },
  {
    slug: "washington-university-in-st-louis",
    data: {
      earlyDecisionApplied: 3004,
      earlyDecisionAdmitted: 654,
      earlyDecisionAdmitRate: 21.8,
      edDeadline: "November 1",
      totalApplicants: 33500,
      totalAdmitted: 3685,
      studentsAdmittedPercent: 11.0,
      rdDeadline: "January 2",
      undergraduateEnrollment: 8039,
      costOfAttendanceInState: 83760,
      costOfAttendanceOutOfState: 83760,
      retentionRate: 97,
      graduationRate4yr: 87,
      graduationRate6yr: 94,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 45,
        "Asian": 18,
        "Hispanic": 9,
        "Black": 6,
        "Two or More Races": 5,
        "International": 11
      }),
      primaryColor: "#A51417",
      secondaryColor: "#007360",
    }
  },
  {
    slug: "tufts-university",
    data: {
      earlyDecisionApplied: 3223,
      earlyDecisionAdmitted: 720,
      earlyDecisionAdmitRate: 22.3,
      edDeadline: "November 1",
      totalApplicants: 34880,
      totalAdmitted: 3314,
      studentsAdmittedPercent: 9.5,
      rdDeadline: "January 4",
      undergraduateEnrollment: 6676,
      costOfAttendanceInState: 84496,
      costOfAttendanceOutOfState: 84496,
      retentionRate: 97,
      graduationRate4yr: 87,
      graduationRate6yr: 94,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 46,
        "Asian": 15,
        "Hispanic": 10,
        "Black": 5,
        "Two or More Races": 6,
        "International": 15
      }),
      primaryColor: "#3E8EDE",
      secondaryColor: "#002776",
    }
  },
  {
    slug: "nyu",
    data: {
      earlyDecisionApplied: 18000,
      earlyDecisionAdmitted: 1440,
      earlyDecisionAdmitRate: 8.0,
      edDeadline: "November 1",
      totalApplicants: 120000,
      totalAdmitted: 9600,
      studentsAdmittedPercent: 8.0,
      rdDeadline: "January 5",
      undergraduateEnrollment: 29401,
      costOfAttendanceInState: 85108,
      costOfAttendanceOutOfState: 85108,
      retentionRate: 94,
      graduationRate4yr: 78,
      graduationRate6yr: 86,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 57, men: 43 }),
      raceEthnicity: JSON.stringify({
        "White": 31,
        "Asian": 19,
        "Hispanic": 14,
        "Black": 7,
        "Two or More Races": 5,
        "International": 25
      }),
      primaryColor: "#57068C",
      secondaryColor: "#FFFFFF",
    }
  },
  {
    slug: "usc",
    data: {
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyDecisionApplied: null,
      totalApplicants: 80000,
      totalAdmitted: 7600,
      studentsAdmittedPercent: 9.5,
      rdDeadline: "January 15",
      undergraduateEnrollment: 21000,
      costOfAttendanceInState: 85000,
      costOfAttendanceOutOfState: 85000,
      retentionRate: 96,
      graduationRate4yr: 78,
      graduationRate6yr: 92,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 31,
        "Asian": 23,
        "Hispanic": 17,
        "Black": 4,
        "Two or More Races": 6,
        "International": 17
      }),
      primaryColor: "#990000",
      secondaryColor: "#FFC72C",
    }
  },
  {
    slug: "boston-college",
    data: {
      earlyDecisionApplied: 4200,
      earlyDecisionAdmitted: 1050,
      earlyDecisionAdmitRate: 25.0,
      edDeadline: "November 1",
      earlyActionApplied: 13500,
      earlyActionAdmitted: 4000,
      earlyActionAdmitRate: 29.6,
      eaDeadline: "November 1",
      totalApplicants: 40000,
      totalAdmitted: 6200,
      studentsAdmittedPercent: 15.5,
      rdDeadline: "January 2",
      undergraduateEnrollment: 9532,
      costOfAttendanceInState: 83076,
      costOfAttendanceOutOfState: 83076,
      retentionRate: 96,
      graduationRate4yr: 88,
      graduationRate6yr: 93,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 60,
        "Asian": 12,
        "Hispanic": 12,
        "Black": 5,
        "Two or More Races": 4,
        "International": 7
      }),
      primaryColor: "#8C2633",
      secondaryColor: "#B3A369",
    }
  },
  {
    slug: "boston-university",
    data: {
      earlyDecisionApplied: 5700,
      earlyDecisionAdmitted: 1500,
      earlyDecisionAdmitRate: 26.3,
      edDeadline: "November 1",
      totalApplicants: 80797,
      totalAdmitted: 8888,
      studentsAdmittedPercent: 11.0,
      rdDeadline: "January 4",
      undergraduateEnrollment: 18515,
      costOfAttendanceInState: 83994,
      costOfAttendanceOutOfState: 83994,
      retentionRate: 95,
      graduationRate4yr: 82,
      graduationRate6yr: 89,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 60, men: 40 }),
      raceEthnicity: JSON.stringify({
        "White": 37,
        "Asian": 17,
        "Hispanic": 12,
        "Black": 4,
        "Two or More Races": 5,
        "International": 23
      }),
      primaryColor: "#CC0000",
      secondaryColor: "#FFFFFF",
    }
  },
  {
    slug: "northeastern-university",
    data: {
      earlyDecisionApplied: 5500,
      earlyDecisionAdmitted: 1500,
      earlyDecisionAdmitRate: 27.3,
      edDeadline: "November 1",
      earlyActionApplied: 42000,
      earlyActionAdmitted: 6500,
      earlyActionAdmitRate: 15.5,
      eaDeadline: "November 1",
      totalApplicants: 96000,
      totalAdmitted: 6720,
      studentsAdmittedPercent: 7.0,
      rdDeadline: "January 1",
      undergraduateEnrollment: 16302,
      costOfAttendanceInState: 80540,
      costOfAttendanceOutOfState: 80540,
      retentionRate: 97,
      graduationRate4yr: 86,
      graduationRate6yr: 91,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "Character/Personal Qualities": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 41,
        "Asian": 17,
        "Hispanic": 9,
        "Black": 5,
        "Two or More Races": 4,
        "International": 22
      }),
      primaryColor: "#D41B2C",
      secondaryColor: "#000000",
    }
  },
  // Top Public Universities
  {
    slug: "ucla",
    data: {
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      totalApplicants: 145904,
      totalAdmitted: 12779,
      studentsAdmittedPercent: 8.8,
      rdDeadline: "November 30",
      undergraduateEnrollment: 32423,
      costOfAttendanceInState: 37014,
      costOfAttendanceOutOfState: 68474,
      retentionRate: 97,
      graduationRate4yr: 79,
      graduationRate6yr: 92,
      testPolicy: "Test Blind",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Not Considered",
        "Application Essay": "Very Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 57, men: 43 }),
      raceEthnicity: JSON.stringify({
        "Asian": 33,
        "Hispanic": 22,
        "White": 26,
        "Black": 4,
        "Two or More Races": 5,
        "International": 13
      }),
      primaryColor: "#2774AE",
      secondaryColor: "#FFD100",
    }
  },
  {
    slug: "uc-berkeley",
    data: {
      totalApplicants: 128192,
      totalAdmitted: 14867,
      studentsAdmittedPercent: 11.6,
      rdDeadline: "November 30",
      undergraduateEnrollment: 32479,
      costOfAttendanceInState: 39784,
      costOfAttendanceOutOfState: 71576,
      retentionRate: 96,
      graduationRate4yr: 78,
      graduationRate6yr: 93,
      testPolicy: "Test Blind",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Not Considered",
        "Application Essay": "Very Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "Asian": 38,
        "White": 22,
        "Hispanic": 18,
        "Black": 3,
        "Two or More Races": 5,
        "International": 14
      }),
      primaryColor: "#003262",
      secondaryColor: "#FDB515",
    }
  },
  {
    slug: "university-of-michigan",
    data: {
      earlyActionApplied: 30000,
      earlyActionAdmitted: 9000,
      earlyActionAdmitRate: 30.0,
      eaDeadline: "November 1",
      totalApplicants: 87000,
      totalAdmitted: 13050,
      studentsAdmittedPercent: 15.0,
      rdDeadline: "February 1",
      undergraduateEnrollment: 33600,
      costOfAttendanceInState: 33926,
      costOfAttendanceOutOfState: 72914,
      retentionRate: 97,
      graduationRate4yr: 81,
      graduationRate6yr: 93,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 51, men: 49 }),
      raceEthnicity: JSON.stringify({
        "White": 56,
        "Asian": 17,
        "Hispanic": 7,
        "Black": 5,
        "Two or More Races": 5,
        "International": 9
      }),
      primaryColor: "#00274C",
      secondaryColor: "#FFCB05",
    }
  },
  {
    slug: "unc-chapel-hill",
    data: {
      earlyActionApplied: 27000,
      earlyActionAdmitted: 5670,
      earlyActionAdmitRate: 21.0,
      eaDeadline: "October 15",
      totalApplicants: 57000,
      totalAdmitted: 9576,
      studentsAdmittedPercent: 16.8,
      rdDeadline: "January 15",
      undergraduateEnrollment: 19897,
      costOfAttendanceInState: 26338,
      costOfAttendanceOutOfState: 56574,
      retentionRate: 97,
      graduationRate4yr: 83,
      graduationRate6yr: 92,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "State Residency": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 60, men: 40 }),
      raceEthnicity: JSON.stringify({
        "White": 60,
        "Asian": 13,
        "Hispanic": 10,
        "Black": 9,
        "Two or More Races": 5,
        "International": 4
      }),
      primaryColor: "#4B9CD3",
      secondaryColor: "#13294B",
    }
  },
  {
    slug: "georgia-tech",
    data: {
      earlyActionApplied: 32000,
      earlyActionAdmitted: 5760,
      earlyActionAdmitRate: 18.0,
      eaDeadline: "November 1",
      totalApplicants: 55000,
      totalAdmitted: 8800,
      studentsAdmittedPercent: 16.0,
      rdDeadline: "January 4",
      undergraduateEnrollment: 18500,
      costOfAttendanceInState: 28830,
      costOfAttendanceOutOfState: 49878,
      retentionRate: 97,
      graduationRate4yr: 54,
      graduationRate6yr: 92,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 40, men: 60 }),
      raceEthnicity: JSON.stringify({
        "White": 43,
        "Asian": 25,
        "Hispanic": 9,
        "Black": 7,
        "Two or More Races": 4,
        "International": 12
      }),
      primaryColor: "#B3A369",
      secondaryColor: "#003057",
    }
  },
  {
    slug: "university-of-florida",
    data: {
      totalApplicants: 60000,
      totalAdmitted: 13800,
      studentsAdmittedPercent: 23.0,
      rdDeadline: "November 1",
      undergraduateEnrollment: 35247,
      costOfAttendanceInState: 21700,
      costOfAttendanceOutOfState: 43800,
      retentionRate: 97,
      graduationRate4yr: 73,
      graduationRate6yr: 90,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Considered",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 57, men: 43 }),
      raceEthnicity: JSON.stringify({
        "White": 51,
        "Hispanic": 24,
        "Asian": 9,
        "Black": 6,
        "Two or More Races": 4,
        "International": 5
      }),
      primaryColor: "#0021A5",
      secondaryColor: "#FA4616",
    }
  },
  {
    slug: "university-of-texas-austin",
    data: {
      totalApplicants: 67000,
      totalAdmitted: 19300,
      studentsAdmittedPercent: 28.8,
      rdDeadline: "December 1",
      undergraduateEnrollment: 42000,
      costOfAttendanceInState: 28478,
      costOfAttendanceOutOfState: 56574,
      retentionRate: 96,
      graduationRate4yr: 72,
      graduationRate6yr: 88,
      testPolicy: "Test Required",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Important",
        "Application Essay": "Important",
        "Recommendations": "Considered",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 39,
        "Hispanic": 26,
        "Asian": 22,
        "Black": 5,
        "Two or More Races": 4,
        "International": 6
      }),
      primaryColor: "#BF5700",
      secondaryColor: "#333F48",
    }
  },
  {
    slug: "penn-state-university",
    data: {
      totalApplicants: 92000,
      totalAdmitted: 47000,
      studentsAdmittedPercent: 51.1,
      rdDeadline: "November 30",
      undergraduateEnrollment: 40000,
      costOfAttendanceInState: 38654,
      costOfAttendanceOutOfState: 58082,
      retentionRate: 93,
      graduationRate4yr: 68,
      graduationRate6yr: 86,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Considered",
        "Extracurricular Activities": "Considered",
        "Talent/Ability": "Considered",
        "State Residency": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 47, men: 53 }),
      raceEthnicity: JSON.stringify({
        "White": 68,
        "Asian": 8,
        "Hispanic": 8,
        "Black": 5,
        "Two or More Races": 4,
        "International": 6
      }),
      primaryColor: "#041E42",
      secondaryColor: "#FFFFFF",
    }
  },
];

async function main() {
  console.log("Starting college data fixes (Batch 2)...\n");

  let updated = 0;
  let notFound = 0;
  let errors = 0;

  for (const update of COLLEGE_UPDATES) {
    try {
      const existing = await db.college.findUnique({
        where: { slug: update.slug }
      });

      if (!existing) {
        console.log(`❌ Not found: ${update.slug}`);
        notFound++;
        continue;
      }

      await db.college.update({
        where: { slug: update.slug },
        data: update.data as any,
      });

      console.log(`✓ Updated: ${existing.name}`);
      updated++;
    } catch (e: any) {
      console.log(`❌ Error updating ${update.slug}: ${e.message}`);
      errors++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Updated: ${updated}`);
  console.log(`Not found: ${notFound}`);
  console.log(`Errors: ${errors}`);

  await db.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
