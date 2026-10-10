import { describe, expect, it } from "vitest";
import { eventsToCsv } from "./analytics";

describe("eventsToCsv", () => {
  it("includes mission, status detail, and review seconds", () => {
    const csv = eventsToCsv([
      {
        id: "e1",
        name: "mission_approved",
        at: "2026-10-10T06:30:00.000Z",
        role: "parent",
        reviewSeconds: 12,
        missionId: "water-detective",
        detail: "approved",
      },
    ]);
    expect(csv.split("\n")[0]).toBe("name,at,role,reviewSeconds,missionId,detail");
    expect(csv).toContain("mission_approved,2026-10-10T06:30:00.000Z,parent,12,water-detective,approved");
  });
});
