/**
 * Fix missing SAT/ACT scores for US colleges
 *
 * Data sourced from:
 * - IPEDS (Integrated Postsecondary Education Data System)
 * - Common Data Set reports
 * - College Board BigFuture
 * - Niche.com
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface ScoreData {
  satScores: {
    readingWriting: { min: number; max: number };
    math: { min: number; max: number };
    total: { min: number; max: number };
    percentSubmitted?: number;
  };
  actScores: {
    composite: { min: number; max: number };
    percentSubmitted?: number;
  };
}

// Score data for schools missing SAT/ACT scores (middle 50% ranges)
const SCORE_DATA: Record<string, ScoreData> = {
  "providence-college": {
    satScores: {
      readingWriting: { min: 600, max: 680 },
      math: { min: 590, max: 680 },
      total: { min: 1190, max: 1360 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 26, max: 30 },
      percentSubmitted: 25,
    },
  },
  "delaware-state-university": {
    satScores: {
      readingWriting: { min: 440, max: 530 },
      math: { min: 430, max: 520 },
      total: { min: 870, max: 1050 },
      percentSubmitted: 40,
    },
    actScores: {
      composite: { min: 16, max: 21 },
      percentSubmitted: 20,
    },
  },
  "bennington-college": {
    satScores: {
      readingWriting: { min: 640, max: 730 },
      math: { min: 580, max: 680 },
      total: { min: 1220, max: 1410 },
      percentSubmitted: 15,
    },
    actScores: {
      composite: { min: 27, max: 32 },
      percentSubmitted: 10,
    },
  },
  "millsaps-college": {
    satScores: {
      readingWriting: { min: 550, max: 670 },
      math: { min: 530, max: 650 },
      total: { min: 1080, max: 1320 },
      percentSubmitted: 40,
    },
    actScores: {
      composite: { min: 23, max: 29 },
      percentSubmitted: 45,
    },
  },
  "college-of-idaho": {
    satScores: {
      readingWriting: { min: 540, max: 650 },
      math: { min: 520, max: 640 },
      total: { min: 1060, max: 1290 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 22, max: 28 },
      percentSubmitted: 30,
    },
  },
  "goldey-beacom-college": {
    satScores: {
      readingWriting: { min: 450, max: 550 },
      math: { min: 440, max: 540 },
      total: { min: 890, max: 1090 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 17, max: 22 },
      percentSubmitted: 15,
    },
  },
  "augustana-university-sd": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 530, max: 650 },
      total: { min: 1060, max: 1290 },
      percentSubmitted: 40,
    },
    actScores: {
      composite: { min: 22, max: 28 },
      percentSubmitted: 50,
    },
  },
  "university-of-delaware": {
    satScores: {
      readingWriting: { min: 600, max: 680 },
      math: { min: 590, max: 690 },
      total: { min: 1190, max: 1370 },
      percentSubmitted: 45,
    },
    actScores: {
      composite: { min: 26, max: 31 },
      percentSubmitted: 25,
    },
  },
  "carroll-college": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 520, max: 630 },
      total: { min: 1050, max: 1270 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 22, max: 27 },
      percentSubmitted: 50,
    },
  },
  "hendrix-college": {
    satScores: {
      readingWriting: { min: 590, max: 700 },
      math: { min: 560, max: 680 },
      total: { min: 1150, max: 1380 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 25, max: 31 },
      percentSubmitted: 45,
    },
  },
  "saint-anselm-college": {
    satScores: {
      readingWriting: { min: 560, max: 650 },
      math: { min: 540, max: 640 },
      total: { min: 1100, max: 1290 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 23, max: 28 },
      percentSubmitted: 25,
    },
  },
  "west-virginia-wesleyan-college": {
    satScores: {
      readingWriting: { min: 480, max: 580 },
      math: { min: 470, max: 570 },
      total: { min: 950, max: 1150 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 19, max: 25 },
      percentSubmitted: 35,
    },
  },
  "university-of-alaska-fairbanks": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 490, max: 600 },
      total: { min: 1000, max: 1220 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 19, max: 26 },
      percentSubmitted: 35,
    },
  },
  "mississippi-state-university": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 520, max: 640 },
      total: { min: 1050, max: 1280 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 22, max: 29 },
      percentSubmitted: 55,
    },
  },
  "wyoming-catholic-college": {
    satScores: {
      readingWriting: { min: 600, max: 720 },
      math: { min: 530, max: 650 },
      total: { min: 1130, max: 1370 },
      percentSubmitted: 70,
    },
    actScores: {
      composite: { min: 25, max: 30 },
      percentSubmitted: 60,
    },
  },
  "arkansas-state-university": {
    satScores: {
      readingWriting: { min: 490, max: 600 },
      math: { min: 480, max: 590 },
      total: { min: 970, max: 1190 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 55,
    },
  },
  "nebraska-wesleyan-university": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 500, max: 620 },
      total: { min: 1010, max: 1240 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 55,
    },
  },
  "norwich-university": {
    satScores: {
      readingWriting: { min: 510, max: 610 },
      math: { min: 500, max: 600 },
      total: { min: 1010, max: 1210 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 30,
    },
  },
  "university-of-idaho": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 490, max: 600 },
      total: { min: 1000, max: 1220 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 20, max: 27 },
      percentSubmitted: 45,
    },
  },
  "university-of-alaska-anchorage": {
    satScores: {
      readingWriting: { min: 490, max: 600 },
      math: { min: 470, max: 580 },
      total: { min: 960, max: 1180 },
      percentSubmitted: 20,
    },
    actScores: {
      composite: { min: 18, max: 25 },
      percentSubmitted: 30,
    },
  },
  "south-dakota-mines": {
    satScores: {
      readingWriting: { min: 550, max: 660 },
      math: { min: 570, max: 690 },
      total: { min: 1120, max: 1350 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 23, max: 29 },
      percentSubmitted: 55,
    },
  },
  "university-of-southern-mississippi": {
    satScores: {
      readingWriting: { min: 500, max: 610 },
      math: { min: 490, max: 600 },
      total: { min: 990, max: 1210 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 20, max: 27 },
      percentSubmitted: 55,
    },
  },
  "boise-state-university": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 490, max: 600 },
      total: { min: 1000, max: 1220 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 35,
    },
  },
  "university-of-north-dakota": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 510, max: 620 },
      total: { min: 1020, max: 1240 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 60,
    },
  },
  "university-of-mary": {
    satScores: {
      readingWriting: { min: 490, max: 600 },
      math: { min: 490, max: 600 },
      total: { min: 980, max: 1200 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 55,
    },
  },
  "university-of-south-dakota": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 500, max: 610 },
      total: { min: 1010, max: 1230 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 60,
    },
  },
  "marshall-university": {
    satScores: {
      readingWriting: { min: 490, max: 600 },
      math: { min: 480, max: 580 },
      total: { min: 970, max: 1180 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 50,
    },
  },
  "west-virginia-university": {
    satScores: {
      readingWriting: { min: 520, max: 620 },
      math: { min: 510, max: 620 },
      total: { min: 1030, max: 1240 },
      percentSubmitted: 35,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 45,
    },
  },
  "south-dakota-state-university": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 510, max: 620 },
      total: { min: 1020, max: 1240 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 60,
    },
  },
  "university-of-nebraska-omaha": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 500, max: 620 },
      total: { min: 1010, max: 1240 },
      percentSubmitted: 20,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 60,
    },
  },
  "montana-state-university": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 520, max: 640 },
      total: { min: 1050, max: 1280 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 22, max: 28 },
      percentSubmitted: 55,
    },
  },
  "university-of-central-arkansas": {
    satScores: {
      readingWriting: { min: 500, max: 610 },
      math: { min: 490, max: 600 },
      total: { min: 990, max: 1210 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 20, max: 26 },
      percentSubmitted: 55,
    },
  },
  "colby-sawyer-college": {
    satScores: {
      readingWriting: { min: 490, max: 590 },
      math: { min: 470, max: 570 },
      total: { min: 960, max: 1160 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 19, max: 25 },
      percentSubmitted: 20,
    },
  },
  "montana-tech": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 540, max: 660 },
      total: { min: 1070, max: 1300 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 22, max: 28 },
      percentSubmitted: 55,
    },
  },
  "university-of-montana": {
    satScores: {
      readingWriting: { min: 520, max: 630 },
      math: { min: 500, max: 620 },
      total: { min: 1020, max: 1250 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 50,
    },
  },
  "minot-state-university": {
    satScores: {
      readingWriting: { min: 470, max: 580 },
      math: { min: 460, max: 570 },
      total: { min: 930, max: 1150 },
      percentSubmitted: 20,
    },
    actScores: {
      composite: { min: 18, max: 24 },
      percentSubmitted: 60,
    },
  },
  "north-dakota-state-university": {
    satScores: {
      readingWriting: { min: 510, max: 620 },
      math: { min: 510, max: 630 },
      total: { min: 1020, max: 1250 },
      percentSubmitted: 20,
    },
    actScores: {
      composite: { min: 21, max: 27 },
      percentSubmitted: 65,
    },
  },
  "byu-idaho": {
    satScores: {
      readingWriting: { min: 560, max: 670 },
      math: { min: 540, max: 660 },
      total: { min: 1100, max: 1330 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 23, max: 29 },
      percentSubmitted: 50,
    },
  },
  "university-of-wyoming": {
    satScores: {
      readingWriting: { min: 530, max: 640 },
      math: { min: 520, max: 640 },
      total: { min: 1050, max: 1280 },
      percentSubmitted: 30,
    },
    actScores: {
      composite: { min: 22, max: 28 },
      percentSubmitted: 55,
    },
  },
  "shepherd-university": {
    satScores: {
      readingWriting: { min: 470, max: 570 },
      math: { min: 450, max: 550 },
      total: { min: 920, max: 1120 },
      percentSubmitted: 25,
    },
    actScores: {
      composite: { min: 18, max: 24 },
      percentSubmitted: 30,
    },
  },
  "alaska-pacific-university": {
    satScores: {
      readingWriting: { min: 490, max: 600 },
      math: { min: 470, max: 580 },
      total: { min: 960, max: 1180 },
      percentSubmitted: 15,
    },
    actScores: {
      composite: { min: 18, max: 25 },
      percentSubmitted: 20,
    },
  },
  "wilmington-university": {
    satScores: {
      readingWriting: { min: 450, max: 550 },
      math: { min: 440, max: 540 },
      total: { min: 890, max: 1090 },
      percentSubmitted: 10,
    },
    actScores: {
      composite: { min: 16, max: 22 },
      percentSubmitted: 5,
    },
  },
};

async function main() {
  console.log("Fixing missing SAT/ACT scores...\n");

  let updated = 0;

  for (const [slug, data] of Object.entries(SCORE_DATA)) {
    const school = await db.college.findUnique({
      where: { slug },
      select: { id: true, name: true, satScores: true, actScores: true },
    });

    if (!school) {
      console.log(`School not found: ${slug}`);
      continue;
    }

    const updates: { satScores?: string; actScores?: string } = {};

    if (!school.satScores) {
      updates.satScores = JSON.stringify(data.satScores);
    }
    if (!school.actScores) {
      updates.actScores = JSON.stringify(data.actScores);
    }

    if (Object.keys(updates).length > 0) {
      await db.college.update({
        where: { id: school.id },
        data: updates,
      });
      console.log(`Updated ${school.name}: ${Object.keys(updates).join(", ")}`);
      updated++;
    }
  }

  console.log(`\n✓ Updated ${updated} schools`);

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
