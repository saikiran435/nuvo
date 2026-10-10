import { dateKeyToUtcNoonIso, istDateKey, leagueWeekId, shiftDateKey } from "@/lib/game";
import type { NuvoData, Submission } from "@/lib/model";

const CHILD_ID = "child-demo";

function submission(id: string, missionId: string, reflection: string, at: string): Submission {
  return {
    id,
    missionId,
    childId: CHILD_ID,
    status: "approved",
    reflection,
    note: reflection,
    submittedAt: at,
    reviewedAt: at,
    reviewedBy: "parent",
    reviewSeconds: 0,
  };
}

/** Illustrative passport: three Water missions done, Water detective still current, rank about 7. */
export function createDemoState(now = new Date()): NuvoData {
  const today = istDateKey(now);
  const yesterday = shiftDateKey(today, -1);
  const older = shiftDateKey(today, -10);
  const yesterdayIso = dateKeyToUtcNoonIso(yesterday);
  const olderIso = dateKeyToUtcNoonIso(older);
  return {
    onboarded: true,
    role: "child",
    child: {
      id: CHILD_ID,
      nickname: "Ishaan",
      avatarId: "drop",
      gcBalance: 1240,
      gcLifetime: 1240,
      streak: 6,
      lastActiveDate: yesterday,
      weeklyGc: 1240,
      weeklyGcReachedAt: now.toISOString(),
      leagueWeekId: leagueWeekId(now),
      leagueIndex: 2,
      settings: { showOnLeague: true },
      consent: { given: true, givenAt: olderIso, parentEmail: "grownup@example.com" },
    },
    submissions: [
      submission("seed-water-tap-off", "water-tap-off", "Three days with the tap off.", yesterdayIso),
      submission("seed-water-leak", "water-leak", "The kitchen tap was quiet.", yesterdayIso),
      submission("seed-water-rain", "water-rain", "The balcony pipe is a good spot.", yesterdayIso),
    ],
    history: [
      { id: "hist-rain", source: "mission", amount: 70, at: yesterdayIso, labelKey: "missions.water-rain.title", missionId: "water-rain" },
      { id: "hist-leak", source: "mission", amount: 70, at: yesterdayIso, labelKey: "missions.water-leak.title", missionId: "water-leak" },
      { id: "hist-tap", source: "mission", amount: 60, at: yesterdayIso, labelKey: "missions.water-tap-off.title", missionId: "water-tap-off" },
      { id: "hist-open", source: "mission", amount: 1040, at: olderIso, labelKey: "history.opening" },
    ],
    events: [],
    questProgress: {},
    questAwarded: [],
    quizzesPassed: 0,
    completedStoryIds: [],
    celebration: null,
    streakMessage: null,
    capNote: false,
    introSeen: false,
  };
}

export function blankState(now = new Date()): NuvoData {
  const demo = createDemoState(now);
  return {
    ...demo,
    onboarded: false,
    role: "child",
    child: {
      ...demo.child,
      nickname: "",
      gcBalance: 0,
      gcLifetime: 0,
      streak: 0,
      lastActiveDate: "",
      shieldUsedAt: undefined,
      weeklyGc: 0,
      settings: { showOnLeague: false },
      consent: { given: false },
    },
    submissions: [],
    history: [],
    events: [],
    celebration: null,
    streakMessage: null,
    capNote: false,
  };
}
