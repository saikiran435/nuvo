import { MAX_PAID_QUIZZES_PER_DAY, QUIZ_PASS_RATIO, REPEAT_MISSION_RATE } from "./config";
import { daysBetween, istDateKey } from "./streak";

export type GcSource = "mission" | "quiz" | "story" | "quest";

export interface LedgerEntry {
  source: GcSource;
  amount: number;
  at: string;
}

export interface Balances {
  gcBalance: number;
  gcLifetime: number;
  weeklyGc: number;
}

export interface Payout {
  allowed: boolean;
  amount: number;
  reduced: boolean;
}

export type NonMissionReason = "ok" | "cap" | "replay" | "low-score" | "daily-limit" | "already";

export interface NonMissionPayout {
  amount: number;
  reason: NonMissionReason;
}

export function addGc(balances: Balances, amount: number): Balances {
  const paid = Math.max(0, Math.round(amount));
  return {
    gcBalance: balances.gcBalance + paid,
    gcLifetime: balances.gcLifetime + paid,
    weeklyGc: balances.weeklyGc + paid,
  };
}

/** Spending reduces the balance only. Lifetime, and therefore level, stays put. */
export function spendBalance(gcBalance: number, cost: number): { ok: boolean; gcBalance: number } {
  if (cost < 0 || gcBalance < cost) return { ok: false, gcBalance };
  return { ok: true, gcBalance: gcBalance - cost };
}

/**
 * First completion pays the full mission GC.
 * The same mission again within 7 days pays 25%, and only once per day.
 */
export function missionPayout(base: number, priorApprovalsAt: string[], now: Date): Payout {
  const today = istDateKey(now);
  const gaps = priorApprovalsAt.map((at) => daysBetween(istDateKey(new Date(at)), today));
  if (gaps.some((gap) => gap === 0)) return { allowed: false, amount: 0, reduced: false };
  const withinWeek = gaps.some((gap) => gap >= 1 && gap <= 7);
  if (withinWeek) {
    return { allowed: true, amount: Math.round(base * REPEAT_MISSION_RATE), reduced: true };
  }
  return { allowed: true, amount: base, reduced: false };
}

function inRollingWeek(at: string, now: Date): boolean {
  const gap = daysBetween(istDateKey(new Date(at)), istDateKey(now));
  return gap >= 0 && gap <= 6;
}

/** Non-mission GC may be at most 30% of GC earned in the rolling 7 days. */
export function nonMissionRoom(entries: LedgerEntry[], now: Date): { mission: number; nonMission: number; maxNonMission: number; remaining: number } {
  let mission = 0;
  let nonMission = 0;
  for (const entry of entries) {
    if (!inRollingWeek(entry.at, now) || entry.amount <= 0) continue;
    if (entry.source === "mission") mission += entry.amount;
    else nonMission += entry.amount;
  }
  const maxNonMission = Math.floor((mission * 3) / 7);
  return { mission, nonMission, maxNonMission, remaining: Math.max(0, maxNonMission - nonMission) };
}

/** Once the cap is passed, the whole award pays 0. */
export function nonMissionPayout(requested: number, entries: LedgerEntry[], now: Date): NonMissionPayout {
  if (requested <= 0) return { amount: 0, reason: "cap" };
  const { remaining } = nonMissionRoom(entries, now);
  if (requested > remaining) return { amount: 0, reason: "cap" };
  return { amount: requested, reason: "ok" };
}

export function quizPayout(input: {
  gcReward: number;
  scoreRatio: number;
  alreadyPaid: boolean;
  paidQuizzesToday: number;
  entries: LedgerEntry[];
  now: Date;
}): NonMissionPayout {
  if (input.scoreRatio < QUIZ_PASS_RATIO) return { amount: 0, reason: "low-score" };
  if (input.alreadyPaid) return { amount: 0, reason: "replay" };
  if (input.paidQuizzesToday >= MAX_PAID_QUIZZES_PER_DAY) return { amount: 0, reason: "daily-limit" };
  return nonMissionPayout(input.gcReward, input.entries, input.now);
}

export function storyPayout(bonus: number, alreadyCompleted: boolean, entries: LedgerEntry[], now: Date): NonMissionPayout {
  if (alreadyCompleted) return { amount: 0, reason: "already" };
  return nonMissionPayout(bonus, entries, now);
}
