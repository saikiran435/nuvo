import { LEVEL_THRESHOLDS, LEVEL_TITLES } from "./config";

export interface LevelInfo {
  level: number;
  title: string;
  floor: number;
  nextAt: number | null;
  intoLevel: number;
  span: number;
}

/** Level comes from lifetime Green Credits, so spending cannot lower it. */
export function levelFromLifetime(gcLifetime: number): LevelInfo {
  const safe = Math.max(0, Math.floor(gcLifetime));
  let index = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (safe >= LEVEL_THRESHOLDS[i]) index = i;
  }
  const floor = LEVEL_THRESHOLDS[index];
  const nextAt = index < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[index + 1] : null;
  return {
    level: index + 1,
    title: LEVEL_TITLES[index],
    floor,
    nextAt,
    intoLevel: safe - floor,
    span: nextAt === null ? 0 : nextAt - floor,
  };
}
