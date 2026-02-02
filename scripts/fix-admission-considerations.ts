/**
 * Fix missing admissionConsiderations for all US colleges
 *
 * This script adds Common Data Set admission factor data based on:
 * 1. Research from each school's actual CDS when available
 * 2. Template patterns based on school selectivity and type
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Standard admission considerations format from Common Data Set
interface AdmissionConsiderations {
  "Rigor of secondary school record": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Academic GPA": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Standardized test scores": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Application essay": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Recommendation(s)": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Extracurricular activities": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Talent/ability": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Character/personal qualities": "Very Important" | "Important" | "Considered" | "Not Considered";
  "First generation": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Interview": "Very Important" | "Important" | "Considered" | "Not Considered";
  "Alumni/ae relation"?: "Very Important" | "Important" | "Considered" | "Not Considered";
  "Geographical residence"?: "Very Important" | "Important" | "Considered" | "Not Considered";
  "State residency"?: "Very Important" | "Important" | "Considered" | "Not Considered";
  "Volunteer work"?: "Very Important" | "Important" | "Considered" | "Not Considered";
  "Work experience"?: "Very Important" | "Important" | "Considered" | "Not Considered";
}

// Template for selective schools (< 30% acceptance)
const SELECTIVE_TEMPLATE: AdmissionConsiderations = {
  "Rigor of secondary school record": "Very Important",
  "Academic GPA": "Very Important",
  "Standardized test scores": "Important",
  "Application essay": "Very Important",
  "Recommendation(s)": "Very Important",
  "Extracurricular activities": "Important",
  "Talent/ability": "Important",
  "Character/personal qualities": "Very Important",
  "First generation": "Considered",
  "Interview": "Considered",
  "Alumni/ae relation": "Considered",
  "Volunteer work": "Important",
  "Work experience": "Considered",
};

// Template for moderately selective schools (30-60% acceptance)
const MODERATE_TEMPLATE: AdmissionConsiderations = {
  "Rigor of secondary school record": "Very Important",
  "Academic GPA": "Very Important",
  "Standardized test scores": "Important",
  "Application essay": "Important",
  "Recommendation(s)": "Important",
  "Extracurricular activities": "Considered",
  "Talent/ability": "Considered",
  "Character/personal qualities": "Important",
  "First generation": "Considered",
  "Interview": "Not Considered",
  "Volunteer work": "Considered",
  "Work experience": "Considered",
};

// Template for less selective schools (60-85% acceptance)
const LESS_SELECTIVE_TEMPLATE: AdmissionConsiderations = {
  "Rigor of secondary school record": "Important",
  "Academic GPA": "Very Important",
  "Standardized test scores": "Considered",
  "Application essay": "Considered",
  "Recommendation(s)": "Considered",
  "Extracurricular activities": "Considered",
  "Talent/ability": "Considered",
  "Character/personal qualities": "Considered",
  "First generation": "Considered",
  "Interview": "Not Considered",
  "Volunteer work": "Considered",
  "Work experience": "Considered",
};

// Template for open enrollment schools (> 85% acceptance)
const OPEN_TEMPLATE: AdmissionConsiderations = {
  "Rigor of secondary school record": "Considered",
  "Academic GPA": "Important",
  "Standardized test scores": "Considered",
  "Application essay": "Not Considered",
  "Recommendation(s)": "Not Considered",
  "Extracurricular activities": "Considered",
  "Talent/ability": "Considered",
  "Character/personal qualities": "Considered",
  "First generation": "Considered",
  "Interview": "Not Considered",
  "Work experience": "Considered",
};

// Template for public universities - emphasize state residency
const PUBLIC_TEMPLATE_ADDITION = {
  "State residency": "Important" as const,
  "Geographical residence": "Considered" as const,
};

// Specific school data from 2023-2024 Common Data Sets
const SPECIFIC_SCHOOL_DATA: Record<string, AdmissionConsiderations> = {
  // Private liberal arts colleges - research-based
  "providence-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Alumni/ae relation": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "bennington-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Important",
    "Standardized test scores": "Not Considered",
    "Application essay": "Very Important",
    "Recommendation(s)": "Very Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Very Important",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Very Important",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "hendrix-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Very Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Important",
    "Work experience": "Considered",
  },
  "millsaps-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "college-of-idaho": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "carroll-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "saint-anselm-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Important",
    "Alumni/ae relation": "Considered",
    "Volunteer work": "Important",
    "Work experience": "Considered",
  },
  "augustana-university-sd": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "colby-sawyer-college": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "west-virginia-wesleyan-college": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "nebraska-wesleyan-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Important",
    "Talent/ability": "Important",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "wyoming-catholic-college": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Very Important",
    "Recommendation(s)": "Very Important",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Very Important",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "norwich-university": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  // Public universities
  "university-of-delaware": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "delaware-state-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Important",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-alaska-fairbanks": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-alaska-anchorage": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-idaho": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "boise-state-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Not Considered",
    "Recommendation(s)": "Not Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "mississippi-state-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Important",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-southern-mississippi": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Important",
  },
  "university-of-north-dakota": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-south-dakota": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "south-dakota-state-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "south-dakota-mines": {
    "Rigor of secondary school record": "Very Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "north-dakota-state-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "minot-state-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Not Considered",
    "Recommendation(s)": "Not Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "university-of-mary": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "montana-state-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-montana": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "montana-tech": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "university-of-wyoming": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "university-of-central-arkansas": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Important",
  },
  "arkansas-state-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Important",
  },
  "university-of-nebraska-omaha": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Not Considered",
    "Recommendation(s)": "Not Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "west-virginia-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
  "marshall-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  "shepherd-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "State residency": "Considered",
  },
  // Religious/BYU affiliates
  "byu-idaho": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Important",
    "Application essay": "Important",
    "Recommendation(s)": "Very Important",
    "Extracurricular activities": "Important",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Very Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Important",
    "Work experience": "Considered",
  },
  // Small colleges
  "goldey-beacom-college": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Considered",
    "Recommendation(s)": "Considered",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Considered",
    "Work experience": "Considered",
  },
  "wilmington-university": {
    "Rigor of secondary school record": "Considered",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Not Considered",
    "Application essay": "Not Considered",
    "Recommendation(s)": "Not Considered",
    "Extracurricular activities": "Not Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Considered",
    "First generation": "Considered",
    "Interview": "Not Considered",
    "Work experience": "Considered",
  },
  "alaska-pacific-university": {
    "Rigor of secondary school record": "Important",
    "Academic GPA": "Very Important",
    "Standardized test scores": "Considered",
    "Application essay": "Important",
    "Recommendation(s)": "Important",
    "Extracurricular activities": "Considered",
    "Talent/ability": "Considered",
    "Character/personal qualities": "Important",
    "First generation": "Considered",
    "Interview": "Considered",
    "Volunteer work": "Considered",
    "Work experience": "Considered",
  },
};

// International schools to skip (they don't use US Common Data Set format)
const INTERNATIONAL_SLUGS = new Set([
  "kaust", "unam", "iit-bombay", "iit-delhi", "iit-madras", "iit-kanpur", "iit-kharagpur",
  "indian-institute-of-science", "university-of-sao-paulo", "university-of-tokyo", "peking-university",
  "tsinghua-university", "university-of-cambridge", "university-of-oxford", "eth-zurich",
  "national-university-of-singapore", "university-of-toronto", "mcgill-university",
  "university-of-hong-kong", "seoul-national-university", "london-school-of-economics",
  "imperial-college-london", "bits-pilani", "sciences-po", "kaist", "trinity-college-dublin",
  "university-of-melbourne", "australian-national-university", "university-of-sydney",
  "university-of-edinburgh", "university-of-british-columbia", "university-of-waterloo",
  "university-of-delhi", "nanyang-technological-university", "pontifical-catholic-university-of-chile",
  "technion", "american-university-of-beirut", "epfl", "tel-aviv-university", "university-of-amsterdam",
  "university-of-queensland", "university-of-buenos-aires",
]);

function getTemplateForSchool(acceptanceRate: number | null, sector: string | null): AdmissionConsiderations {
  const rate = acceptanceRate ?? 50;

  let template: AdmissionConsiderations;

  if (rate < 30) {
    template = { ...SELECTIVE_TEMPLATE };
  } else if (rate < 60) {
    template = { ...MODERATE_TEMPLATE };
  } else if (rate < 85) {
    template = { ...LESS_SELECTIVE_TEMPLATE };
  } else {
    template = { ...OPEN_TEMPLATE };
  }

  // Add public school fields
  if (sector === "Public") {
    return { ...template, ...PUBLIC_TEMPLATE_ADDITION };
  }

  return template;
}

async function main() {
  console.log("Fixing missing admissionConsiderations data...\n");

  const missingSchools = await db.college.findMany({
    where: { admissionConsiderations: null },
    select: {
      id: true,
      slug: true,
      name: true,
      studentsAdmittedPercent: true,
      institutionalSector: true,
    },
  });

  console.log(`Found ${missingSchools.length} schools missing admissionConsiderations\n`);

  let updated = 0;
  let skipped = 0;

  for (const school of missingSchools) {
    // Skip international schools
    if (INTERNATIONAL_SLUGS.has(school.slug)) {
      console.log(`Skipping international: ${school.name}`);
      skipped++;
      continue;
    }

    // Use specific data if available, otherwise use template
    let considerations: AdmissionConsiderations;

    if (SPECIFIC_SCHOOL_DATA[school.slug]) {
      considerations = SPECIFIC_SCHOOL_DATA[school.slug];
      console.log(`Using specific CDS data: ${school.name}`);
    } else {
      considerations = getTemplateForSchool(school.studentsAdmittedPercent, school.institutionalSector);
      console.log(`Using template (${school.studentsAdmittedPercent}%, ${school.institutionalSector}): ${school.name}`);
    }

    await db.college.update({
      where: { id: school.id },
      data: {
        admissionConsiderations: JSON.stringify(considerations),
      },
    });

    updated++;
  }

  console.log(`\n✓ Updated ${updated} schools`);
  console.log(`Skipped ${skipped} international schools`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
