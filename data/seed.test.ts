import { describe, expect, it } from "vitest";
import { createDemoState } from "@/data/seed";
import { peers } from "@/data/peers";
import { approveSubmission, completeLesson, completedMissionIds, pendingMissionIds, submitMission } from "@/lib/flow";
import { levelFromLifetime, rankLeague } from "@/lib/game";
import { isWorldUnlocked, worldNodes } from "@/lib/game/unlocks";
import { worlds } from "@/data/worlds";

describe("demo seed", () => {
  const now = new Date("2026-06-15T06:30:00.000Z");
  const seed = createDemoState(now);

  it("matches the illustrative passport and sits at rank 7", () => {
    expect(peers).toHaveLength(29);
    expect(seed.history.reduce((sum, entry) => sum + entry.amount, 0)).toBe(1240);
    expect(seed.child.gcBalance).toBe(1240);
    expect(levelFromLifetime(seed.child.gcLifetime).level).toBe(4);
    const ranked = rankLeague([
      ...peers.map((peer) => ({ id: peer.id, weeklyGc: peer.weeklyGc, reachedAt: peer.reachedAt })),
      { id: seed.child.id, weeklyGc: seed.child.weeklyGc, reachedAt: seed.child.weeklyGcReachedAt },
    ]);
    expect(ranked.find((row) => row.id === seed.child.id)?.rank).toBe(7);
    expect(completedMissionIds(seed)).toEqual(new Set(["water-tap-off", "water-leak", "water-rain"]));
  });

  it("follows the Water detective approval path", () => {
    const submitted = submitMission(
      seed,
      { missionId: "water-detective", evidenceKey: "nuvo-evidence-test", reflection: "The hose was easiest to fix." },
      now,
    );
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) return;
    expect(submitted.data.history.some((entry) => entry.missionId === "water-detective")).toBe(false);
    expect(submitted.data.child.gcLifetime).toBeGreaterThanOrEqual(1240);
    expect(submitted.data.child.streak).toBe(7);
    expect(pendingMissionIds(submitted.data).has("water-detective")).toBe(true);
    const pending = submitted.data.submissions.find((item) => item.missionId === "water-detective");
    expect(pending?.status).toBe("pending");
    const beforeApprove = submitted.data.child.gcLifetime;
    const approved = approveSubmission(submitted.data, pending?.id ?? "", now);
    expect(approved.history.some((entry) => entry.missionId === "water-detective" && entry.amount === 80)).toBe(true);
    expect(approved.child.gcLifetime - beforeApprove).toBeGreaterThanOrEqual(80);
    expect(approved.child.gcBalance).toBe(approved.child.gcLifetime);
    expect(levelFromLifetime(approved.child.gcLifetime).level).toBe(4);
    expect(approved.celebration).toMatchObject({ missionId: "water-detective", gc: 80, leveledUp: false });
    const done = completedMissionIds(approved);
    const water = worlds[0];
    const nodes = worldNodes(water.missionIds, done, pendingMissionIds(approved), true);
    expect(nodes.find((node) => node.missionId === "water-detective")?.state).toBe("done");
    expect(nodes.find((node) => node.missionId === "water-map")?.state).toBe("current");
    expect(isWorldUnlocked(worlds[1], worlds, done)).toBe(false);
  });

  it("finishes a climate lesson without waiting on a photo", () => {
    const finished = completeLesson(seed, "water-detective", "I will look for three drips at home.", now);
    expect(finished.ok).toBe(true);
    if (!finished.ok) return;
    const done = completedMissionIds(finished.data);
    expect(done.has("water-detective")).toBe(true);
    expect(pendingMissionIds(finished.data).has("water-detective")).toBe(false);
    expect(finished.data.celebration?.missionId).toBe("water-detective");
  });
});
