import { describe, expect, it } from "vitest";
import { dailyQuests, questInstanceId } from "./quests";

describe("dailyQuests", () => {
  it("returns the same three quests for a date", () => {
    const first = dailyQuests("2026-10-10");
    const second = dailyQuests("2026-10-10");
    expect(first).toHaveLength(3);
    expect(second).toEqual(first);
    expect(new Set(first.map((quest) => quest.id)).size).toBe(3);
    expect(questInstanceId("2026-10-10", first[0].id)).toBe(`2026-10-10:${first[0].id}`);
  });

  it("changes the set when the date changes", () => {
    expect(dailyQuests("2026-10-10").map((quest) => quest.id)).toEqual(["missions-2", "quiz-80", "streak-1"]);
    expect(dailyQuests("2026-01-02").map((quest) => quest.id)).toEqual(["quiz-80", "streak-1", "missions-1"]);
  });
});
