export interface WorldRef {
  id: string;
  missionIds: string[];
  unlockedBy?: string;
}

export interface NodeView {
  missionId: string;
  state: "done" | "current" | "locked";
  pending: boolean;
}

export interface StoryUnlockRule {
  type: "missions" | "gc" | "level";
  value: number;
  worldId?: string;
}

export interface BadgeRule {
  id: string;
  kind: "missions" | "world" | "streak" | "quizzes" | "stories";
  missionIds?: string[];
  count?: number;
}

export function isWorldUnlocked(world: WorldRef, worlds: WorldRef[], completed: ReadonlySet<string>): boolean {
  if (!world.unlockedBy) return true;
  const previous = worlds.find((item) => item.id === world.unlockedBy);
  if (!previous) return false;
  return previous.missionIds.every((id) => completed.has(id));
}

export function worldNodes(
  missionIds: string[],
  completed: ReadonlySet<string>,
  pending: ReadonlySet<string>,
  unlocked: boolean,
): NodeView[] {
  if (!unlocked) {
    return missionIds.map((missionId) => ({ missionId, state: "locked", pending: false }));
  }
  let foundCurrent = false;
  return missionIds.map((missionId) => {
    if (completed.has(missionId)) return { missionId, state: "done", pending: false };
    if (!foundCurrent) {
      foundCurrent = true;
      return { missionId, state: "current", pending: pending.has(missionId) };
    }
    return { missionId, state: "locked", pending: false };
  });
}

export function worldProgress(missionIds: string[], completed: ReadonlySet<string>): { done: number; total: number } {
  return {
    done: missionIds.filter((id) => completed.has(id)).length,
    total: missionIds.length,
  };
}

export function isStoryUnlocked(
  rule: StoryUnlockRule,
  ctx: { completedMissionIds: readonly string[]; gcLifetime: number; level: number },
): boolean {
  if (rule.type === "gc") return ctx.gcLifetime >= rule.value;
  if (rule.type === "level") return ctx.level >= rule.value;
  const worldId = rule.worldId;
  const done = worldId
    ? ctx.completedMissionIds.filter((id) => ruleMissionInWorld(id, worldId)).length
    : ctx.completedMissionIds.length;
  return done >= rule.value;
}

function ruleMissionInWorld(missionId: string, worldId: string): boolean {
  return missionId.startsWith(`${worldId}-`);
}

export function earnedBadgeIds(
  rules: BadgeRule[],
  ctx: { completedMissionIds: readonly string[]; streak: number; quizzesPassed: number; storiesCompleted: number },
): string[] {
  const completed = new Set(ctx.completedMissionIds);
  return rules
    .filter((rule) => {
      if (rule.kind === "streak") return ctx.streak >= (rule.count ?? 7);
      if (rule.kind === "quizzes") return ctx.quizzesPassed >= (rule.count ?? 1);
      if (rule.kind === "stories") return ctx.storiesCompleted >= (rule.count ?? 1);
      if (rule.kind === "world") return (rule.missionIds ?? []).every((id) => completed.has(id));
      return (rule.missionIds ?? []).every((id) => completed.has(id));
    })
    .map((rule) => rule.id);
}
