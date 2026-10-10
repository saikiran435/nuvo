import type { Competitor } from "@/lib/game/league";

export interface Peer extends Competitor {
  nickname: string;
  avatarId: string;
}

const high: Array<[string, number, string]> = [
  ["Aanya", 2400, "sprout"],
  ["Kabir", 2180, "bird"],
  ["Meera", 1960, "sun"],
  ["Arjun", 1740, "fish"],
  ["Diya", 1510, "star"],
  ["Rohan", 1360, "drop"],
];

const rest: Array<[string, string]> = [
  ["Sara", "sprout"],
  ["Vivaan", "bird"],
  ["Anika", "sun"],
  ["Dev", "fish"],
  ["Myra", "star"],
  ["Aarav", "drop"],
  ["Kiara", "sprout"],
  ["Ishita", "bird"],
  ["Reyansh", "sun"],
  ["Navya", "fish"],
  ["Aditya", "star"],
  ["Pia", "drop"],
  ["Vihaan", "sprout"],
  ["Anaya", "bird"],
  ["Neel", "sun"],
  ["Tara", "fish"],
  ["Om", "star"],
  ["Zara", "drop"],
  ["Laksh", "sprout"],
  ["Ina", "bird"],
  ["Yash", "sun"],
  ["Ruhi", "fish"],
  ["Ved", "star"],
];

function reachedAt(index: number): string {
  const hour = String(index % 18).padStart(2, "0");
  return `2026-10-07T${hour}:15:00.000Z`;
}

export const peers: Peer[] = [
  ...high.map(([nickname, weeklyGc, avatarId], index) => ({
    id: `peer-${index + 1}`,
    nickname,
    weeklyGc,
    avatarId,
    reachedAt: reachedAt(index),
  })),
  ...rest.map(([nickname, avatarId], index) => ({
    id: `peer-${index + 7}`,
    nickname,
    weeklyGc: 1200 - index * 18,
    avatarId,
    reachedAt: reachedAt(index + 6),
  })),
];
