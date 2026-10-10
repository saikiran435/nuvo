import { describe, expect, it } from "vitest";
import { earnedBadgeIds, isStoryUnlocked, isWorldUnlocked, worldNodes, worldProgress } from "./unlocks";

const worlds = [
  { id: "water", missionIds: ["water-a", "water-b"] },
  { id: "waste", missionIds: ["waste-a"], unlockedBy: "water" },
];

describe("world unlocks and nodes", () => {
  it("opens the next world only when the previous one is complete", () => {
    expect(isWorldUnlocked(worlds[0], worlds, new Set())).toBe(true);
    expect(isWorldUnlocked(worlds[1], worlds, new Set(["water-a"]))).toBe(false);
    expect(isWorldUnlocked(worlds[1], worlds, new Set(["water-a", "water-b"]))).toBe(true);
  });

  it("marks done, current, pending, and locked nodes", () => {
    const nodes = worldNodes(["water-a", "water-b", "water-c"], new Set(["water-a"]), new Set(["water-b"]), true);
    expect(nodes.map((node) => node.state)).toEqual(["done", "current", "locked"]);
    expect(nodes[1].pending).toBe(true);
    expect(worldNodes(["waste-a"], new Set(), new Set(), false)[0].state).toBe("locked");
  });

  it("counts world progress", () => {
    expect(worldProgress(["a", "b", "c"], new Set(["a", "c"]))).toEqual({ done: 2, total: 3 });
  });
});

describe("story unlocks and badges", () => {
  const ctx = { completedMissionIds: ["water-a", "water-b", "water-c"], gcLifetime: 1240, level: 4 };

  it("unlocks stories by missions, GC, or level", () => {
    expect(isStoryUnlocked({ type: "missions", value: 3, worldId: "water" }, ctx)).toBe(true);
    expect(isStoryUnlocked({ type: "missions", value: 0 }, { ...ctx, completedMissionIds: [] })).toBe(true);
    expect(isStoryUnlocked({ type: "gc", value: 1500 }, ctx)).toBe(false);
    expect(isStoryUnlocked({ type: "gc", value: 1500 }, { ...ctx, gcLifetime: 1500 })).toBe(true);
    expect(isStoryUnlocked({ type: "level", value: 5 }, ctx)).toBe(false);
    expect(isStoryUnlocked({ type: "level", value: 5 }, { ...ctx, level: 5 })).toBe(true);
  });

  it("earns badges from missions, a world, and a streak", () => {
    const ids = earnedBadgeIds(
      [
        { id: "water-guardian", kind: "missions", missionIds: ["water-a", "water-b", "water-c"] },
        { id: "waste-warrior", kind: "world", missionIds: ["waste-a"] },
        { id: "streak-7", kind: "streak", count: 7 },
        { id: "first-quiz", kind: "quizzes", count: 1 },
      ],
      { completedMissionIds: ctx.completedMissionIds, streak: 7, quizzesPassed: 0, storiesCompleted: 0 },
    );
    expect(ids).toEqual(["water-guardian", "streak-7"]);
  });
});
