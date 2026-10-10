import { describe, expect, it } from "vitest";
import { addGc, missionPayout, nonMissionPayout, nonMissionRoom, quizPayout, spendBalance, storyPayout } from "./gc";
import { levelFromLifetime } from "./levels";
import { dateKeyToUtcNoonIso } from "./streak";

const now = new Date("2026-10-10T06:30:00.000Z");
const at = (key: string) => dateKeyToUtcNoonIso(key);

describe("missionPayout", () => {
  it("pays the full amount the first time", () => {
    expect(missionPayout(80, [], now)).toEqual({ allowed: true, amount: 80, reduced: false });
  });

  it("pays 25% for a repeat inside 7 days", () => {
    expect(missionPayout(80, [at("2026-10-07")], now)).toEqual({ allowed: true, amount: 20, reduced: true });
    expect(missionPayout(70, [at("2026-10-03")], now).amount).toBe(18);
  });

  it("blocks a second completion on the same day", () => {
    expect(missionPayout(80, [at("2026-10-10")], now)).toEqual({ allowed: false, amount: 0, reduced: false });
  });

  it("pays in full again after 7 days", () => {
    expect(missionPayout(90, [at("2026-10-02")], now)).toEqual({ allowed: true, amount: 90, reduced: false });
  });
});

describe("non-mission cap", () => {
  it("keeps quizzes, stories, and quests to 30% of the rolling week", () => {
    const entries = [{ source: "mission" as const, amount: 70, at: at("2026-10-09") }];
    expect(nonMissionRoom(entries, now).maxNonMission).toBe(30);
    expect(nonMissionPayout(20, entries, now)).toEqual({ amount: 20, reason: "ok" });
    expect(nonMissionPayout(40, entries, now)).toEqual({ amount: 0, reason: "cap" });
  });

  it("pays 0 when there is no mission GC in the window", () => {
    const old = [{ source: "mission" as const, amount: 500, at: at("2026-10-01") }];
    expect(nonMissionPayout(15, old, now)).toEqual({ amount: 0, reason: "cap" });
  });

  it("ignores non-mission GC from before the rolling week", () => {
    const entries = [
      { source: "mission" as const, amount: 210, at: at("2026-10-10") },
      { source: "quiz" as const, amount: 100, at: at("2026-10-01") },
    ];
    expect(nonMissionRoom(entries, now).nonMission).toBe(0);
    expect(nonMissionPayout(15, entries, now).amount).toBe(15);
  });
});

describe("quiz and story payouts", () => {
  const entries = [{ source: "mission" as const, amount: 700, at: at("2026-10-10") }];

  it("pays a quiz once at 60% or more, then 0 on replay", () => {
    const first = quizPayout({
      gcReward: 20,
      scoreRatio: 0.6,
      alreadyPaid: false,
      paidQuizzesToday: 0,
      entries,
      now,
    });
    expect(first).toEqual({ amount: 20, reason: "ok" });
    const replay = quizPayout({
      gcReward: 20,
      scoreRatio: 1,
      alreadyPaid: true,
      paidQuizzesToday: 1,
      entries,
      now,
    });
    expect(replay).toEqual({ amount: 0, reason: "replay" });
  });

  it("withholds quiz GC below 60% and after 3 paid quizzes", () => {
    expect(
      quizPayout({ gcReward: 20, scoreRatio: 0.59, alreadyPaid: false, paidQuizzesToday: 0, entries, now }).reason,
    ).toBe("low-score");
    expect(
      quizPayout({ gcReward: 20, scoreRatio: 1, alreadyPaid: false, paidQuizzesToday: 3, entries, now }).reason,
    ).toBe("daily-limit");
  });

  it("pays a story bonus once", () => {
    expect(storyPayout(15, false, entries, now)).toEqual({ amount: 15, reason: "ok" });
    expect(storyPayout(15, true, entries, now)).toEqual({ amount: 0, reason: "already" });
  });
});

describe("balances", () => {
  it("adds GC to balance, lifetime, and the weekly score", () => {
    expect(addGc({ gcBalance: 1240, gcLifetime: 1240, weeklyGc: 1240 }, 80)).toEqual({
      gcBalance: 1320,
      gcLifetime: 1320,
      weeklyGc: 1320,
    });
  });

  it("spends balance without lowering the level", () => {
    const spent = spendBalance(1240, 450);
    expect(spent).toEqual({ ok: true, gcBalance: 790 });
    expect(levelFromLifetime(1240).level).toBe(4);
    expect(spendBalance(100, 450).ok).toBe(false);
  });
});
