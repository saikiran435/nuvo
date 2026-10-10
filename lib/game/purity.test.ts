import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!path.endsWith(".ts") || path.endsWith(".test.ts")) return [];
    return [path];
  });
}

describe("lib/game purity", () => {
  it("stays free of React, Next, and the DOM", () => {
    const offenders = sourceFiles(join(process.cwd(), "lib/game")).filter((path) => {
      const text = readFileSync(path, "utf8");
      return /from ["'](react|react-dom|next|lucide-react|zustand|framer-motion)/.test(text);
    });
    expect(offenders).toEqual([]);
  });
});
