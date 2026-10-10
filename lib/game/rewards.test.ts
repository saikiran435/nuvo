import { describe, expect, it } from "vitest";
import { AGE_BAND } from "./config";
import { needsAdultSupervisedLabel } from "./config";
import { rewardGate, rewardTier } from "./rewards";

describe("rewardGate", () => {
  it("allows an affordable reward at the required level", () => {
    expect(rewardGate({ gcCost: 900, gcBalance: 1240, level: 4 })).toEqual({ gate: "ok", shortfall: 0 });
  });

  it("says how many more GC are needed", () => {
    expect(rewardGate({ gcCost: 2000, minLevel: 4, gcBalance: 1240, level: 4 })).toEqual({
      gate: "gc",
      shortfall: 760,
    });
  });

  it("asks for the level before the balance", () => {
    expect(rewardGate({ gcCost: 2000, minLevel: 4, gcBalance: 100, level: 3 })).toEqual({
      gate: "level",
      shortfall: 0,
    });
  });
});

describe("reward tiers and supervised age", () => {
  it("groups costs into the configured tiers", () => {
    expect(rewardTier(0)).toBe("recognition");
    expect(rewardTier(250)).toBe("recognition");
    expect(rewardTier(450)).toBe("small");
    expect(rewardTier(700)).toBe("small");
    expect(rewardTier(900)).toBe("local");
    expect(rewardTier(2000)).toBe("premium");
    expect(rewardTier(3001)).toBe("special");
  });

  it("shows the adult-supervised label for children under 14", () => {
    expect(needsAdultSupervisedLabel(AGE_BAND.min, true)).toBe(true);
    expect(needsAdultSupervisedLabel(13, true)).toBe(true);
    expect(needsAdultSupervisedLabel(14, true)).toBe(false);
    expect(needsAdultSupervisedLabel(10, false)).toBe(false);
  });
});
