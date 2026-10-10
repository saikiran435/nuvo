export type QuestMetric = "missions" | "quiz" | "streak";

export interface QuestTemplate {
  id: string;
  metric: QuestMetric;
  target: number;
  gc: number;
}

export const QUEST_POOL: readonly QuestTemplate[] = [
  { id: "missions-2", metric: "missions", target: 2, gc: 20 },
  { id: "quiz-80", metric: "quiz", target: 1, gc: 15 },
  { id: "streak-1", metric: "streak", target: 1, gc: 10 },
  { id: "missions-1", metric: "missions", target: 1, gc: 15 },
  { id: "quiz-any", metric: "quiz", target: 1, gc: 10 },
];

function hashDate(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Three quests for a calendar day. The same date always returns the same three. */
export function dailyQuests(dateKey: string): QuestTemplate[] {
  const start = hashDate(dateKey) % QUEST_POOL.length;
  const picked: QuestTemplate[] = [];
  for (let i = 0; i < 3; i += 1) {
    picked.push(QUEST_POOL[(start + i) % QUEST_POOL.length]);
  }
  return picked;
}

export function questInstanceId(dateKey: string, questId: string): string {
  return `${dateKey}:${questId}`;
}
