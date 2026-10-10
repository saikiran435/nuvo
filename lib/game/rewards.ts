import { REWARD_TIER_BOUNDS } from "./config";

export type RewardTier = "recognition" | "small" | "local" | "premium" | "special";
export type RewardGate = "ok" | "level" | "gc";

export function rewardTier(gcCost: number): RewardTier {
  if (gcCost <= REWARD_TIER_BOUNDS.recognition) return "recognition";
  if (gcCost <= REWARD_TIER_BOUNDS.small) return "small";
  if (gcCost <= REWARD_TIER_BOUNDS.local) return "local";
  if (gcCost <= REWARD_TIER_BOUNDS.premium) return "premium";
  return "special";
}

/**
 * Level is checked first. A short balance tells the child how many more GC they need.
 */
export function rewardGate(input: {
  gcCost: number;
  minLevel?: number;
  gcBalance: number;
  level: number;
}): { gate: RewardGate; shortfall: number } {
  if (input.minLevel !== undefined && input.level < input.minLevel) {
    return { gate: "level", shortfall: 0 };
  }
  if (input.gcBalance < input.gcCost) {
    return { gate: "gc", shortfall: input.gcCost - input.gcBalance };
  }
  return { gate: "ok", shortfall: 0 };
}
