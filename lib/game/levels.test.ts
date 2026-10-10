import { describe, expect, it } from "vitest";
import { levelFromLifetime } from "./levels";

describe("levelFromLifetime", () => {
  it("maps the threshold table onto levels 1 to 7", () => {
    expect(levelFromLifetime(0)).toMatchObject({ level: 1, title: "Seedling" });
    expect(levelFromLifetime(249)).toMatchObject({ level: 1, title: "Seedling" });
    expect(levelFromLifetime(250)).toMatchObject({ level: 2, title: "Sprout" });
    expect(levelFromLifetime(500)).toMatchObject({ level: 3, title: "Trail finder" });
    expect(levelFromLifetime(1240)).toMatchObject({
      level: 4,
      title: "Nature explorer",
      floor: 1000,
      nextAt: 1500,
      intoLevel: 240,
      span: 500,
    });
    expect(levelFromLifetime(1500)).toMatchObject({ level: 5, title: "Guardian" });
    expect(levelFromLifetime(2500)).toMatchObject({ level: 6, title: "Champion" });
    expect(levelFromLifetime(4000)).toMatchObject({ level: 7, title: "Banyan keeper", nextAt: null });
    expect(levelFromLifetime(9000)).toMatchObject({ level: 7, title: "Banyan keeper" });
  });
});
