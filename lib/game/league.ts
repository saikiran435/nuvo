import { LEAGUES, LEAGUE_GROUP_SIZE, PROMOTION_COUNT } from "./config";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface Competitor {
  id: string;
  weeklyGc: number;
  reachedAt: string;
}

export interface RankedCompetitor {
  id: string;
  rank: number;
  promoted: boolean;
  group: number;
}

/**
 * Week id is the Monday (IST) of the league week.
 * The week rolls at Sunday 23:59 IST, which is one minute before Monday 00:00.
 */
export function leagueWeekId(date: Date): string {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS + 60 * 1000);
  const day = shifted.getUTCDay();
  const daysFromMonday = (day + 6) % 7;
  const monday = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysFromMonday),
  );
  const year = monday.getUTCFullYear();
  const month = String(monday.getUTCMonth() + 1).padStart(2, "0");
  const dateNum = String(monday.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${dateNum}`;
}

export function rankLeague(people: Competitor[], groupSize = LEAGUE_GROUP_SIZE): RankedCompetitor[] {
  const sorted = [...people].sort((a, b) => {
    if (b.weeklyGc !== a.weeklyGc) return b.weeklyGc - a.weeklyGc;
    if (a.reachedAt < b.reachedAt) return -1;
    if (a.reachedAt > b.reachedAt) return 1;
    return a.id < b.id ? -1 : 1;
  });
  const ranked: RankedCompetitor[] = [];
  for (let start = 0; start < sorted.length; start += groupSize) {
    const group = start / groupSize;
    const slice = sorted.slice(start, start + groupSize);
    slice.forEach((person, index) => {
      ranked.push({
        id: person.id,
        rank: index + 1,
        promoted: index < PROMOTION_COUNT,
        group,
      });
    });
  }
  return ranked;
}

export function nextLeagueIndex(index: number, promoted: boolean): number {
  if (!promoted) return index;
  return Math.min(LEAGUES.length - 1, index + 1);
}

export function leagueTitle(index: number): string {
  return LEAGUES[Math.min(LEAGUES.length - 1, Math.max(0, index))];
}

/** True when two instants fall in different league weeks. */
export function weekChanged(previousWeekId: string, now: Date): boolean {
  return previousWeekId !== leagueWeekId(now);
}
