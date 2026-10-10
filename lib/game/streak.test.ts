import { describe, expect, it } from "vitest";
import { applyStreak, dateKeyToUtcNoonIso, daysBetween, istDateKey, shiftDateKey } from "./streak";

const noon = (iso: string) => new Date(iso);

describe("IST dates", () => {
  it("rolls the calendar date at midnight IST", () => {
    expect(istDateKey(noon("2026-10-10T18:29:00.000Z"))).toBe("2026-10-10");
    expect(istDateKey(noon("2026-10-10T18:30:00.000Z"))).toBe("2026-10-11");
  });

  it("shifts date keys and round-trips noon IST", () => {
    expect(daysBetween("2026-10-08", "2026-10-10")).toBe(2);
    expect(shiftDateKey("2026-10-10", -1)).toBe("2026-10-09");
    expect(istDateKey(new Date(dateKeyToUtcNoonIso("2026-10-10")))).toBe("2026-10-10");
  });
});

describe("applyStreak", () => {
  const today = noon("2026-10-10T06:30:00.000Z");

  it("increments on the next IST day", () => {
    const result = applyStreak({ streak: 6, lastActiveDate: "2026-10-09" }, today);
    expect(result).toMatchObject({ streak: 7, lastActiveDate: "2026-10-10", message: null });
  });

  it("does not change the streak twice on the same day", () => {
    const result = applyStreak({ streak: 7, lastActiveDate: "2026-10-10" }, today);
    expect(result.streak).toBe(7);
    expect(result.message).toBeNull();
  });

  it("uses the shield once to cover a single missed day", () => {
    const saved = applyStreak({ streak: 6, lastActiveDate: "2026-10-08" }, today);
    expect(saved).toMatchObject({ streak: 7, shieldUsedAt: "2026-10-10", message: "shield" });
  });

  it("does not use the shield again inside 7 days", () => {
    const blocked = applyStreak(
      { streak: 6, lastActiveDate: "2026-10-08", shieldUsedAt: "2026-10-09" },
      today,
    );
    expect(blocked).toMatchObject({ streak: 1, message: "reset", shieldUsedAt: "2026-10-09" });
  });

  it("lets the shield return after 7 days", () => {
    const ready = applyStreak(
      { streak: 4, lastActiveDate: "2026-10-08", shieldUsedAt: "2026-10-03" },
      today,
    );
    expect(ready.message).toBe("shield");
    expect(ready.streak).toBe(5);
  });

  it("resets with a fresh day when more than one day was missed", () => {
    const reset = applyStreak({ streak: 9, lastActiveDate: "2026-10-07" }, today);
    expect(reset).toMatchObject({ streak: 1, message: "reset" });
  });
});
