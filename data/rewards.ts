import type { BadgeRule } from "@/lib/game/unlocks";

export type RewardKind = "experience" | "workshop" | "product" | "badge";

export interface Reward {
  id: string;
  kind: RewardKind;
  gcCost: number;
  minLevel?: number;
  hostedBy?: string;
}

export const rewards: Reward[] = [
  { id: "neighbourhood-walk", kind: "experience", gcCost: 900, hostedBy: "a local nature group" },
  { id: "climate-lab", kind: "workshop", gcCost: 700, hostedBy: "a neighbourhood lab" },
  { id: "pottery-studio", kind: "workshop", gcCost: 800, hostedBy: "a local studio" },
  { id: "repair-hour", kind: "workshop", gcCost: 650, hostedBy: "a repair table" },
  { id: "garden-circle", kind: "workshop", gcCost: 600, hostedBy: "a garden teacher" },
  { id: "nature-day", kind: "experience", gcCost: 2000, minLevel: 4, hostedBy: "a local guide" },
  { id: "water-guardian", kind: "badge", gcCost: 0 },
  { id: "waste-warrior", kind: "badge", gcCost: 0 },
  { id: "streak-7", kind: "badge", gcCost: 0 },
  { id: "first-quiz", kind: "badge", gcCost: 0 },
  { id: "story-starter", kind: "badge", gcCost: 0 },
  { id: "leak-spotter", kind: "badge", gcCost: 0 },
  { id: "nature-friend", kind: "badge", gcCost: 0 },
  { id: "kind-teacher", kind: "badge", gcCost: 0 },
];

export const badgeRules: BadgeRule[] = [
  { id: "water-guardian", kind: "missions", missionIds: ["water-tap-off", "water-leak", "water-rain"] },
  {
    id: "waste-warrior",
    kind: "world",
    missionIds: ["waste-sort", "waste-remix", "waste-bag", "waste-compost", "waste-swap"],
  },
  { id: "streak-7", kind: "streak", count: 7 },
  { id: "first-quiz", kind: "quizzes", count: 1 },
  { id: "story-starter", kind: "stories", count: 1 },
  { id: "leak-spotter", kind: "missions", missionIds: ["water-leak"] },
  { id: "nature-friend", kind: "missions", missionIds: ["nature-spot"] },
  { id: "kind-teacher", kind: "missions", missionIds: ["community-teach"] },
];

export function rewardById(id: string): Reward | undefined {
  return rewards.find((reward) => reward.id === id);
}
