const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface StreakState {
  streak: number;
  lastActiveDate: string;
  shieldUsedAt?: string;
}

export interface StreakResult extends StreakState {
  /** shield: one missed day was covered. reset: the streak started again at 1. */
  message: "shield" | "reset" | null;
}

/** Calendar date in India Standard Time (UTC+5:30, no daylight saving). */
export function istDateKey(date: Date): string {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const day = String(shifted.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function daysBetween(earlierKey: string, laterKey: string): number {
  const [y1, m1, d1] = earlierKey.split("-").map(Number);
  const [y2, m2, d2] = laterKey.split("-").map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / DAY_MS);
}

export function shiftDateKey(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  const y = next.getUTCFullYear();
  const m = String(next.getUTCMonth() + 1).padStart(2, "0");
  const d = String(next.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Noon IST, stored as UTC, so the calendar key round-trips. */
export function dateKeyToUtcNoonIso(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 6, 30, 0)).toISOString();
}

export function shieldAvailable(shieldUsedAt: string | undefined, todayKey: string): boolean {
  if (!shieldUsedAt) return true;
  return daysBetween(shieldUsedAt, todayKey) >= 7;
}

/**
 * A day counts when the child finishes a mission submission, quiz, or story.
 * One missed day can be covered by the streak shield, once per rolling 7 days.
 */
export function applyStreak(prev: StreakState, activityAt: Date): StreakResult {
  const today = istDateKey(activityAt);
  if (!prev.lastActiveDate) {
    return { streak: 1, lastActiveDate: today, shieldUsedAt: prev.shieldUsedAt, message: null };
  }
  const gap = daysBetween(prev.lastActiveDate, today);
  if (gap <= 0) {
    return { streak: prev.streak, lastActiveDate: today, shieldUsedAt: prev.shieldUsedAt, message: null };
  }
  if (gap === 1) {
    return { streak: prev.streak + 1, lastActiveDate: today, shieldUsedAt: prev.shieldUsedAt, message: null };
  }
  if (gap === 2 && shieldAvailable(prev.shieldUsedAt, today)) {
    return { streak: prev.streak + 1, lastActiveDate: today, shieldUsedAt: today, message: "shield" };
  }
  return { streak: 1, lastActiveDate: today, shieldUsedAt: prev.shieldUsedAt, message: "reset" };
}
