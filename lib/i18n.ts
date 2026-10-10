import { strings } from "@/data/strings.en";

/** Looks up an English string. Hindi and Kannada can be added beside this catalog later. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const parts = key.split(".");
  let current: unknown = strings;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) return key;
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current !== "string") return key;
  if (!vars) return current;
  return current.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}
