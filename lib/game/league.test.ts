import { describe, expect, it } from "vitest";
import { leagueTitle, leagueWeekId, nextLeagueIndex, rankLeague, weekChanged } from "./league";

describe("leagueWeekId", () => {
  it("resets at Sunday 23:59 IST", () => {
    expect(leagueWeekId(new Date("2026-10-10T06:30:00.000Z"))).toBe("2026-10-05");
    expect(leagueWeekId(new Date("2026-10-11T18:28:00.000Z"))).toBe("2026-10-05");
    expect(leagueWeekId(new Date("2026-10-11T18:29:00.000Z"))).toBe("2026-10-12");
    expect(weekChanged("2026-10-05", new Date("2026-10-11T18:29:00.000Z"))).toBe(true);
  });
});

describe("rankLeague", () => {
  it("ranks by weekly GC and breaks ties by who got there first", () => {
    const ranked = rankLeague([
      { id: "late", weeklyGc: 100, reachedAt: "2026-10-02T00:00:00.000Z" },
      { id: "early", weeklyGc: 100, reachedAt: "2026-10-01T00:00:00.000Z" },
      { id: "top", weeklyGc: 200, reachedAt: "2026-10-03T00:00:00.000Z" },
    ]);
    expect(ranked.map((row) => row.id)).toEqual(["top", "early", "late"]);
    expect(ranked.map((row) => row.rank)).toEqual([1, 2, 3]);
  });

  it("promotes the top 5 of each group of 30", () => {
    const people = Array.from({ length: 31 }, (_, index) => ({
      id: `p${index}`,
      weeklyGc: 1000 - index,
      reachedAt: `2026-10-01T00:${String(index).padStart(2, "0")}:00.000Z`,
    }));
    const ranked = rankLeague(people);
    const promoted = ranked.filter((row) => row.promoted).map((row) => row.id);
    expect(promoted).toEqual(["p0", "p1", "p2", "p3", "p4", "p30"]);
    expect(ranked.find((row) => row.id === "p5")?.promoted).toBe(false);
    expect(ranked.find((row) => row.id === "p30")).toMatchObject({ rank: 1, group: 1, promoted: true });
  });

  it("moves a promoted child up one league and stops at Canopy", () => {
    expect(nextLeagueIndex(2, true)).toBe(3);
    expect(nextLeagueIndex(2, false)).toBe(2);
    expect(nextLeagueIndex(3, true)).toBe(3);
    expect(leagueTitle(2)).toBe("Banyan");
  });
});
