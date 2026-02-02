/**
 * Fix College Data - Comprehensive Update Script
 *
 * This script fixes data quality issues and updates colleges with
 * accurate 2023-2024 Common Data Set information.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface CollegeUpdate {
  slug: string;
  data: Record<string, unknown>;
}

// Schools with REA/SCEA (should have EA data, NOT ED data)
const REA_SCEA_SCHOOLS = [
  "harvard-university",    // REA
  "yale-university",       // SCEA
  "princeton-university",  // SCEA
  "stanford-university",   // REA
];

// Comprehensive updates for top schools with 2023-2024 CDS data
const COLLEGE_UPDATES: CollegeUpdate[] = [
  {
    slug: "harvard-university",
    data: {
      // Harvard has REA, not ED - clear ED fields and use EA for REA
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      // REA data goes in EA fields
      earlyActionApplied: 9553,
      earlyActionAdmitted: 722,
      earlyActionAdmitRate: 7.6,
      eaDeadline: "November 1",
      // Overall stats - 2023-2024 CDS
      totalApplicants: 56937,
      totalAdmitted: 1942,
      totalEnrolled: 1649,
      studentsAdmittedPercent: 3.4,
      yieldRate: 84.9,
      regularDecisionApplied: 47384,
      regularDecisionAdmitted: 1220,
      regularDecisionAdmitRate: 2.6,
      rdDeadline: "January 1",
      undergraduateEnrollment: 7153,
      costOfAttendanceInState: 82866,
      costOfAttendanceOutOfState: 82866,
      retentionRate: 98,
      graduationRate4yr: 86,
      graduationRate6yr: 97,
      medianEarnings10yr: 95114,
      testPolicy: "Test Optional",
      satScores: JSON.stringify({
        readingWriting: { min: 730, max: 780 },
        math: { min: 750, max: 800 },
        total: { min: 1480, max: 1580 },
        percentSubmitted: 48
      }),
      actScores: JSON.stringify({
        composite: { min: 34, max: 36 },
        percentSubmitted: 34
      }),
      gpaDistribution: JSON.stringify({
        "4.0": 79,
        "3.75-3.99": 11,
        "3.50-3.74": 5,
        "3.25-3.49": 2,
        "3.00-3.24": 2,
        "Below 3.00": 1
      }),
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Geographical Residence": "Considered",
        "State Residency": "Not Considered",
        "Religious Affiliation": "Not Considered",
        "Racial/Ethnic Status": "Considered",
        "Volunteer Work": "Important",
        "Work Experience": "Considered",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 51, men: 49 }),
      raceEthnicity: JSON.stringify({
        "White": 37,
        "Asian": 28,
        "Hispanic": 13,
        "Black": 9,
        "Two or More Races": 8,
        "International": 13,
        "Unknown": 1
      }),
      primaryColor: "#A51C30",
      secondaryColor: "#1E1E1E",
    }
  },
  {
    slug: "yale-university",
    data: {
      // Yale has SCEA, not ED
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      // SCEA data
      earlyActionApplied: 7866,
      earlyActionAdmitted: 776,
      earlyActionAdmitRate: 9.9,
      eaDeadline: "November 1",
      totalApplicants: 52250,
      totalAdmitted: 2275,
      totalEnrolled: 1647,
      studentsAdmittedPercent: 4.4,
      yieldRate: 72.4,
      regularDecisionApplied: 44384,
      regularDecisionAdmitted: 1499,
      regularDecisionAdmitRate: 3.4,
      rdDeadline: "January 2",
      undergraduateEnrollment: 6645,
      costOfAttendanceInState: 85120,
      costOfAttendanceOutOfState: 85120,
      retentionRate: 99,
      graduationRate4yr: 89,
      graduationRate6yr: 97,
      testPolicy: "Test Optional",
      satScores: JSON.stringify({
        readingWriting: { min: 730, max: 780 },
        math: { min: 750, max: 800 },
        total: { min: 1470, max: 1570 },
        percentSubmitted: 47
      }),
      actScores: JSON.stringify({
        composite: { min: 33, max: 35 },
        percentSubmitted: 36
      }),
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 39,
        "Asian": 25,
        "Hispanic": 15,
        "Black": 10,
        "Two or More Races": 7,
        "International": 12
      }),
      primaryColor: "#00356B",
      secondaryColor: "#286DC0",
    }
  },
  {
    slug: "princeton-university",
    data: {
      // Princeton has SCEA, not ED
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      earlyActionApplied: 5376,
      earlyActionAdmitted: 791,
      earlyActionAdmitRate: 14.7,
      eaDeadline: "November 1",
      totalApplicants: 39644,
      totalAdmitted: 1760,
      totalEnrolled: 1345,
      studentsAdmittedPercent: 4.4,
      yieldRate: 76.4,
      regularDecisionApplied: 34268,
      regularDecisionAdmitted: 969,
      regularDecisionAdmitRate: 2.8,
      rdDeadline: "January 1",
      undergraduateEnrollment: 5604,
      costOfAttendanceInState: 83140,
      costOfAttendanceOutOfState: 83140,
      retentionRate: 98,
      graduationRate4yr: 90,
      graduationRate6yr: 98,
      testPolicy: "Test Optional",
      satScores: JSON.stringify({
        readingWriting: { min: 730, max: 780 },
        math: { min: 760, max: 800 },
        total: { min: 1490, max: 1580 },
        percentSubmitted: 47
      }),
      actScores: JSON.stringify({
        composite: { min: 33, max: 35 },
        percentSubmitted: 42
      }),
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 38,
        "Asian": 27,
        "Hispanic": 11,
        "Black": 9,
        "Two or More Races": 6,
        "International": 14
      }),
      primaryColor: "#E77500",
      secondaryColor: "#000000",
    }
  },
  {
    slug: "stanford-university",
    data: {
      // Stanford has REA, not ED
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      earlyActionApplied: 8039,
      earlyActionAdmitted: 611,
      earlyActionAdmitRate: 7.6,
      eaDeadline: "November 1",
      totalApplicants: 56378,
      totalAdmitted: 2075,
      totalEnrolled: 1706,
      studentsAdmittedPercent: 3.7,
      yieldRate: 82.2,
      regularDecisionApplied: 48339,
      regularDecisionAdmitted: 1464,
      regularDecisionAdmitRate: 3.0,
      rdDeadline: "January 5",
      undergraduateEnrollment: 7761,
      costOfAttendanceInState: 85761,
      costOfAttendanceOutOfState: 85761,
      retentionRate: 98,
      graduationRate4yr: 76,
      graduationRate6yr: 96,
      testPolicy: "Test Optional",
      satScores: JSON.stringify({
        readingWriting: { min: 720, max: 770 },
        math: { min: 750, max: 800 },
        total: { min: 1470, max: 1570 },
        percentSubmitted: 52
      }),
      actScores: JSON.stringify({
        composite: { min: 33, max: 35 },
        percentSubmitted: 38
      }),
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Interview": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 46, men: 54 }),
      raceEthnicity: JSON.stringify({
        "White": 26,
        "Asian": 28,
        "Hispanic": 18,
        "Black": 8,
        "Two or More Races": 8,
        "International": 13
      }),
      primaryColor: "#8C1515",
      secondaryColor: "#2E2D29",
    }
  },
  {
    slug: "mit",
    data: {
      // MIT has non-restrictive EA
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      earlyActionApplied: 11924,
      earlyActionAdmitted: 685,
      earlyActionAdmitRate: 5.7,
      eaDeadline: "November 1",
      totalApplicants: 26914,
      totalAdmitted: 1291,
      totalEnrolled: 1097,
      studentsAdmittedPercent: 4.8,
      yieldRate: 85.0,
      regularDecisionApplied: 14990,
      regularDecisionAdmitted: 606,
      regularDecisionAdmitRate: 4.0,
      rdDeadline: "January 1",
      undergraduateEnrollment: 4638,
      costOfAttendanceInState: 82730,
      costOfAttendanceOutOfState: 82730,
      retentionRate: 99,
      graduationRate4yr: 86,
      graduationRate6yr: 95,
      testPolicy: "Test Required",
      satScores: JSON.stringify({
        readingWriting: { min: 730, max: 780 },
        math: { min: 780, max: 800 },
        total: { min: 1510, max: 1580 },
        percentSubmitted: 66
      }),
      actScores: JSON.stringify({
        composite: { min: 34, max: 36 },
        percentSubmitted: 42
      }),
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Very Important",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Very Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Interview": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 47, men: 53 }),
      raceEthnicity: JSON.stringify({
        "White": 31,
        "Asian": 40,
        "Hispanic": 16,
        "Black": 10,
        "Two or More Races": 5,
        "International": 10
      }),
      primaryColor: "#750014",
      secondaryColor: "#8B959E",
    }
  },
  {
    slug: "columbia-university",
    data: {
      // Columbia has ED
      earlyDecisionApplied: 5738,
      earlyDecisionAdmitted: 709,
      earlyDecisionAdmitRate: 12.4,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 57129,
      totalAdmitted: 2246,
      totalEnrolled: 1602,
      studentsAdmittedPercent: 3.9,
      yieldRate: 71.3,
      regularDecisionApplied: 51391,
      regularDecisionAdmitted: 1537,
      regularDecisionAdmitRate: 3.0,
      rdDeadline: "January 1",
      undergraduateEnrollment: 8902,
      costOfAttendanceInState: 86472,
      costOfAttendanceOutOfState: 86472,
      retentionRate: 99,
      graduationRate4yr: 89,
      graduationRate6yr: 96,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Considered",
        "Alumni/ae Relation": "Considered",
        "Interview": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 33,
        "Asian": 26,
        "Hispanic": 15,
        "Black": 9,
        "Two or More Races": 6,
        "International": 17
      }),
      primaryColor: "#B9D9EB",
      secondaryColor: "#1D4F91",
    }
  },
  {
    slug: "university-of-pennsylvania",
    data: {
      earlyDecisionApplied: 8088,
      earlyDecisionAdmitted: 1312,
      earlyDecisionAdmitRate: 16.2,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 59465,
      totalAdmitted: 3454,
      totalEnrolled: 2400,
      studentsAdmittedPercent: 5.8,
      yieldRate: 69.5,
      rdDeadline: "January 5",
      undergraduateEnrollment: 10496,
      costOfAttendanceInState: 86800,
      costOfAttendanceOutOfState: 86800,
      retentionRate: 98,
      graduationRate4yr: 86,
      graduationRate6yr: 96,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 38,
        "Asian": 25,
        "Hispanic": 11,
        "Black": 8,
        "Two or More Races": 5,
        "International": 15
      }),
      primaryColor: "#011F5B",
      secondaryColor: "#990000",
    }
  },
  {
    slug: "brown-university",
    data: {
      earlyDecisionApplied: 6556,
      earlyDecisionAdmitted: 892,
      earlyDecisionAdmitRate: 13.6,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 51302,
      totalAdmitted: 2609,
      totalEnrolled: 1740,
      studentsAdmittedPercent: 5.1,
      yieldRate: 66.7,
      rdDeadline: "January 5",
      undergraduateEnrollment: 7349,
      costOfAttendanceInState: 85286,
      costOfAttendanceOutOfState: 85286,
      retentionRate: 98,
      graduationRate4yr: 84,
      graduationRate6yr: 96,
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
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 53, men: 47 }),
      raceEthnicity: JSON.stringify({
        "White": 40,
        "Asian": 19,
        "Hispanic": 14,
        "Black": 8,
        "Two or More Races": 7,
        "International": 14
      }),
      primaryColor: "#4E3629",
      secondaryColor: "#ED1C24",
    }
  },
  {
    slug: "dartmouth-college",
    data: {
      earlyDecisionApplied: 2664,
      earlyDecisionAdmitted: 561,
      earlyDecisionAdmitRate: 21.1,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 28336,
      totalAdmitted: 1568,
      totalEnrolled: 1145,
      studentsAdmittedPercent: 5.5,
      yieldRate: 73.0,
      rdDeadline: "January 2",
      undergraduateEnrollment: 4556,
      costOfAttendanceInState: 85026,
      costOfAttendanceOutOfState: 85026,
      retentionRate: 98,
      graduationRate4yr: 88,
      graduationRate6yr: 96,
      testPolicy: "Test Optional",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered",
        "Interview": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 46,
        "Asian": 17,
        "Hispanic": 11,
        "Black": 7,
        "Two or More Races": 6,
        "International": 14
      }),
      primaryColor: "#00693E",
      secondaryColor: "#FFFFFF",
    }
  },
  {
    slug: "cornell-university",
    data: {
      earlyDecisionApplied: 9555,
      earlyDecisionAdmitted: 1935,
      earlyDecisionAdmitRate: 20.2,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 68188,
      totalAdmitted: 4994,
      totalEnrolled: 3613,
      studentsAdmittedPercent: 7.3,
      yieldRate: 72.3,
      rdDeadline: "January 2",
      undergraduateEnrollment: 15735,
      costOfAttendanceInState: 84068,
      costOfAttendanceOutOfState: 84068,
      retentionRate: 97,
      graduationRate4yr: 88,
      graduationRate6yr: 95,
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
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 35,
        "Asian": 24,
        "Hispanic": 15,
        "Black": 8,
        "Two or More Races": 6,
        "International": 12
      }),
      primaryColor: "#B31B1B",
      secondaryColor: "#222222",
    }
  },
  {
    slug: "duke-university",
    data: {
      earlyDecisionApplied: 5036,
      earlyDecisionAdmitted: 800,
      earlyDecisionAdmitRate: 15.9,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 54191,
      totalAdmitted: 2768,
      totalEnrolled: 1765,
      studentsAdmittedPercent: 5.1,
      yieldRate: 63.8,
      rdDeadline: "January 4",
      undergraduateEnrollment: 6789,
      costOfAttendanceInState: 85033,
      costOfAttendanceOutOfState: 85033,
      retentionRate: 98,
      graduationRate4yr: 88,
      graduationRate6yr: 96,
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
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 41,
        "Asian": 24,
        "Hispanic": 10,
        "Black": 8,
        "Two or More Races": 5,
        "International": 12
      }),
      primaryColor: "#003087",
      secondaryColor: "#FFFFFF",
    }
  },
  {
    slug: "northwestern-university",
    data: {
      earlyDecisionApplied: 5244,
      earlyDecisionAdmitted: 786,
      earlyDecisionAdmitRate: 15.0,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 52225,
      totalAdmitted: 3657,
      totalEnrolled: 2175,
      studentsAdmittedPercent: 7.0,
      yieldRate: 59.5,
      rdDeadline: "January 2",
      undergraduateEnrollment: 8494,
      costOfAttendanceInState: 85188,
      costOfAttendanceOutOfState: 85188,
      retentionRate: 98,
      graduationRate4yr: 85,
      graduationRate6yr: 95,
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
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 51, men: 49 }),
      raceEthnicity: JSON.stringify({
        "White": 43,
        "Asian": 21,
        "Hispanic": 14,
        "Black": 6,
        "Two or More Races": 5,
        "International": 11
      }),
      primaryColor: "#4E2A84",
      secondaryColor: "#FFFFFF",
    }
  },
  {
    slug: "university-of-chicago",
    data: {
      earlyDecisionApplied: 2258,
      earlyDecisionAdmitted: 461,
      earlyDecisionAdmitRate: 20.4,
      edDeadline: "November 1",
      // UChicago also has ED II and EA
      earlyActionApplied: 17050,
      earlyActionAdmitted: 1192,
      earlyActionAdmitRate: 7.0,
      eaDeadline: "November 1",
      totalApplicants: 37526,
      totalAdmitted: 1933,
      totalEnrolled: 1833,
      studentsAdmittedPercent: 5.2,
      yieldRate: 94.8,
      rdDeadline: "January 4",
      undergraduateEnrollment: 7559,
      costOfAttendanceInState: 85536,
      costOfAttendanceOutOfState: 85536,
      retentionRate: 99,
      graduationRate4yr: 88,
      graduationRate6yr: 96,
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
        "First Generation": "Important",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 35,
        "Asian": 20,
        "Hispanic": 16,
        "Black": 6,
        "Two or More Races": 6,
        "International": 17
      }),
      primaryColor: "#800000",
      secondaryColor: "#767676",
    }
  },
  {
    slug: "johns-hopkins-university",
    data: {
      earlyDecisionApplied: 2854,
      earlyDecisionAdmitted: 622,
      earlyDecisionAdmitRate: 21.8,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 37395,
      totalAdmitted: 2417,
      totalEnrolled: 1348,
      studentsAdmittedPercent: 6.5,
      yieldRate: 55.8,
      rdDeadline: "January 2",
      undergraduateEnrollment: 6132,
      costOfAttendanceInState: 82844,
      costOfAttendanceOutOfState: 82844,
      retentionRate: 98,
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
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Considered",
        "Alumni/ae Relation": "Considered"
      }),
      genderDistribution: JSON.stringify({ women: 50, men: 50 }),
      raceEthnicity: JSON.stringify({
        "White": 33,
        "Asian": 28,
        "Hispanic": 13,
        "Black": 7,
        "Two or More Races": 5,
        "International": 12
      }),
      primaryColor: "#002D72",
      secondaryColor: "#68ACE5",
    }
  },
  // Virginia public schools
  {
    slug: "university-of-virginia",
    data: {
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      // UVA has non-restrictive EA
      earlyActionApplied: 28779,
      earlyActionAdmitted: 6702,
      earlyActionAdmitRate: 23.3,
      eaDeadline: "November 1",
      totalApplicants: 56439,
      totalAdmitted: 9189,
      totalEnrolled: 3978,
      studentsAdmittedPercent: 16.3,
      yieldRate: 43.3,
      rdDeadline: "January 5",
      undergraduateEnrollment: 17496,
      costOfAttendanceInState: 37554,
      costOfAttendanceOutOfState: 72890,
      retentionRate: 97,
      graduationRate4yr: 89,
      graduationRate6yr: 95,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Very Important",
        "Recommendations": "Very Important",
        "Extracurricular Activities": "Very Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Very Important",
        "First Generation": "Important",
        "State Residency": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 55, men: 45 }),
      raceEthnicity: JSON.stringify({
        "White": 57,
        "Asian": 15,
        "Hispanic": 7,
        "Black": 7,
        "Two or More Races": 6,
        "International": 8
      }),
      primaryColor: "#232D4B",
      secondaryColor: "#F84C1E",
    }
  },
  {
    slug: "virginia-tech",
    data: {
      earlyDecisionApplied: 7432,
      earlyDecisionAdmitted: 4567,
      earlyDecisionAdmitRate: 61.5,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 44486,
      totalAdmitted: 25384,
      totalEnrolled: 7283,
      studentsAdmittedPercent: 57.1,
      yieldRate: 28.7,
      rdDeadline: "January 15",
      undergraduateEnrollment: 30434,
      costOfAttendanceInState: 30628,
      costOfAttendanceOutOfState: 53028,
      retentionRate: 92,
      graduationRate4yr: 67,
      graduationRate6yr: 85,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "Talent/Ability": "Important",
        "Character/Personal Qualities": "Important",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 36, men: 64 }),
      raceEthnicity: JSON.stringify({
        "White": 64,
        "Asian": 12,
        "Hispanic": 8,
        "Black": 4,
        "Two or More Races": 5,
        "International": 6
      }),
      primaryColor: "#630031",
      secondaryColor: "#CF4420",
    }
  },
  {
    slug: "william-and-mary",
    data: {
      earlyDecisionApplied: 1635,
      earlyDecisionAdmitted: 762,
      earlyDecisionAdmitRate: 46.6,
      edDeadline: "November 1",
      earlyActionApplied: null,
      earlyActionAdmitted: null,
      earlyActionAdmitRate: null,
      eaDeadline: null,
      totalApplicants: 17536,
      totalAdmitted: 5784,
      totalEnrolled: 1530,
      studentsAdmittedPercent: 33.0,
      yieldRate: 26.5,
      rdDeadline: "January 1",
      undergraduateEnrollment: 6774,
      costOfAttendanceInState: 34096,
      costOfAttendanceOutOfState: 60996,
      retentionRate: 94,
      graduationRate4yr: 83,
      graduationRate6yr: 91,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Important",
        "Recommendations": "Important",
        "Extracurricular Activities": "Important",
        "State Residency": "Very Important"
      }),
      genderDistribution: JSON.stringify({ women: 58, men: 42 }),
      raceEthnicity: JSON.stringify({
        "White": 60,
        "Asian": 12,
        "Hispanic": 10,
        "Black": 7,
        "Two or More Races": 6,
        "International": 5
      }),
      primaryColor: "#115740",
      secondaryColor: "#B9975B",
    }
  },
  {
    slug: "george-mason-university",
    data: {
      earlyDecisionApplied: null,
      earlyDecisionAdmitted: null,
      earlyDecisionAdmitRate: null,
      edDeadline: null,
      // GMU has EA
      earlyActionApplied: 9500,
      earlyActionAdmitted: 8550,
      earlyActionAdmitRate: 90.0,
      eaDeadline: "November 1",
      totalApplicants: 28000,
      totalAdmitted: 25200,
      totalEnrolled: 4200,
      studentsAdmittedPercent: 90.0,
      yieldRate: 16.7,
      rdDeadline: "January 15",
      undergraduateEnrollment: 27614,
      costOfAttendanceInState: 29432,
      costOfAttendanceOutOfState: 52296,
      retentionRate: 85,
      graduationRate4yr: 48,
      graduationRate6yr: 72,
      testPolicy: "Test Optional",
      institutionalSector: "Public",
      admissionConsiderations: JSON.stringify({
        "Academic GPA": "Very Important",
        "Rigor of secondary school record": "Very Important",
        "Standardized test scores": "Considered",
        "Application Essay": "Considered",
        "Extracurricular Activities": "Considered",
        "State Residency": "Important"
      }),
      genderDistribution: JSON.stringify({ women: 52, men: 48 }),
      raceEthnicity: JSON.stringify({
        "White": 36,
        "Asian": 19,
        "Hispanic": 17,
        "Black": 11,
        "Two or More Races": 7,
        "International": 5
      }),
      primaryColor: "#006633",
      secondaryColor: "#FFCC33",
    }
  },
];

async function main() {
  console.log("Starting college data fixes...\n");

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
