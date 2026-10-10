import type { GcSource } from "@/lib/game/gc";

export type Role = "child" | "parent" | "teacher";
export type SubmissionStatus = "draft" | "pending" | "approved" | "redo";

export interface Child {
  id: string;
  nickname: string;
  avatarId: string;
  gcBalance: number;
  gcLifetime: number;
  streak: number;
  /** IST calendar date YYYY-MM-DD. Empty before the first activity. */
  lastActiveDate: string;
  shieldUsedAt?: string;
  weeklyGc: number;
  weeklyGcReachedAt: string;
  leagueWeekId: string;
  leagueIndex: number;
  settings: { showOnLeague: boolean; pace?: "short" | "full" };
  consent: { given: boolean; givenAt?: string; parentEmail?: string };
}

export interface Submission {
  id: string;
  missionId: string;
  childId: string;
  status: SubmissionStatus;
  evidenceKey?: string;
  note?: string;
  reflection?: string;
  reviewNote?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: "parent" | "teacher";
  reviewSeconds?: number;
}

export interface HistoryEntry {
  id: string;
  source: GcSource;
  amount: number;
  at: string;
  labelKey: string;
  missionId?: string;
}

export interface AnalyticsEvent {
  id: string;
  name:
    | "session_start"
    | "mission_started"
    | "mission_submitted"
    | "mission_approved"
    | "quiz_completed"
    | "story_completed"
    | "reward_unlocked";
  at: string;
  role: Role;
  reviewSeconds?: number;
  missionId?: string;
  detail?: string;
}

export interface Celebration {
  missionId: string;
  gc: number;
  leveledUp: boolean;
  level: number;
}

export interface NuvoData {
  onboarded: boolean;
  role: Role;
  child: Child;
  submissions: Submission[];
  history: HistoryEntry[];
  events: AnalyticsEvent[];
  questProgress: Record<string, number>;
  questAwarded: string[];
  quizzesPassed: number;
  completedStoryIds: string[];
  celebration: Celebration | null;
  streakMessage: "shield" | "reset" | null;
  capNote: boolean;
  introSeen: boolean;
}
