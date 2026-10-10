/** Tunable game rules. UI and copy read these instead of hard-coding them. */

export const LEVEL_THRESHOLDS = [0, 250, 500, 1000, 1500, 2500, 4000] as const;

export const LEVEL_TITLES = [
  "Seedling",
  "Sprout",
  "Trail finder",
  "Nature explorer",
  "Guardian",
  "Champion",
  "Banyan keeper",
] as const;

export const LEAGUES = ["Sprout", "Sapling", "Banyan", "Canopy"] as const;

/** Demo children are in this band. The app does not ask for a birth date. */
export const AGE_BAND = { min: 10, max: 14 } as const;

export const NON_MISSION_CAP = 0.3;
export const REPEAT_MISSION_RATE = 0.25;
export const QUIZ_PASS_RATIO = 0.6;
export const MAX_PAID_QUIZZES_PER_DAY = 3;
export const PROMOTION_COUNT = 5;
export const LEAGUE_GROUP_SIZE = 30;
export const STORY_GC_BONUS = 15;
export const REFLECTION_MAX = 140;

export const REWARD_TIER_BOUNDS = {
  recognition: 250,
  small: 750,
  local: 1500,
  premium: 3000,
} as const;

/**
 * Outdoor and grown-up missions show the supervised label for children under 14.
 * The demo band starts at 10, which is under 14, and we never collect an exact age.
 */
export function needsAdultSupervisedLabel(age: number, missionSupervised: boolean): boolean {
  return missionSupervised && age < AGE_BAND.max;
}
