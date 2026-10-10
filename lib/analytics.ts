import type { AnalyticsEvent } from "@/lib/model";

function cell(value: string | number | undefined): string {
  const text = value === undefined ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function eventsToCsv(events: AnalyticsEvent[]): string {
  const headers = ["name", "at", "role", "reviewSeconds", "missionId", "detail"] as const;
  const lines = events.map((event) => headers.map((header) => cell(event[header])).join(","));
  return [headers.join(","), ...lines].join("\n");
}
