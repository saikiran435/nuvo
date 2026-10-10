import { missionById } from "@/data/missions";
import { addGc, applyStreak, dailyQuests, istDateKey, levelFromLifetime, missionPayout, nonMissionPayout, questInstanceId } from "@/lib/game";
import type { GcSource, LedgerEntry } from "@/lib/game/gc";
import type { QuestMetric } from "@/lib/game/quests";
import type { AnalyticsEvent, HistoryEntry, NuvoData, Submission } from "@/lib/model";

export type SubmitInput = {
  missionId: string;
  evidenceKey?: string;
  note?: string;
  reflection: string;
};

export type SubmitResult = { ok: true; data: NuvoData } | { ok: false; reason: "missing" | "pending" | "done" | "once-a-day" };

function uid(): string {
  return crypto.randomUUID();
}

function ledger(history: HistoryEntry[]): LedgerEntry[] {
  return history.map((entry) => ({ source: entry.source, amount: entry.amount, at: entry.at }));
}

function pushEvent(data: NuvoData, name: AnalyticsEvent["name"], now: Date, extra: Partial<AnalyticsEvent> = {}): AnalyticsEvent[] {
  return [
    ...data.events,
    {
      id: uid(),
      name,
      at: now.toISOString(),
      role: data.role,
      ...extra,
    },
  ];
}

function latest(data: NuvoData, missionId: string): Submission | undefined {
  const related = data.submissions.filter((item) => item.missionId === missionId);
  return related[related.length - 1];
}

export function completedMissionIds(data: NuvoData): Set<string> {
  return new Set(data.submissions.filter((item) => item.status === "approved").map((item) => item.missionId));
}

export function pendingMissionIds(data: NuvoData): Set<string> {
  const done = completedMissionIds(data);
  const pending = new Set<string>();
  for (const item of data.submissions) {
    if (item.status === "pending" && !done.has(item.missionId)) pending.add(item.missionId);
  }
  return pending;
}

function withQuests(data: NuvoData, metric: QuestMetric, amount: number, now: Date): NuvoData {
  const dateKey = istDateKey(now);
  let progress = { ...data.questProgress };
  let awarded = [...data.questAwarded];
  let child = data.child;
  let history = data.history;
  let capNote = data.capNote;
  for (const quest of dailyQuests(dateKey)) {
    if (quest.metric !== metric) continue;
    const instanceId = questInstanceId(dateKey, quest.id);
    const next = Math.min(quest.target, (progress[instanceId] ?? 0) + amount);
    progress = { ...progress, [instanceId]: next };
    if (next < quest.target || awarded.includes(instanceId)) continue;
    const payout = nonMissionPayout(quest.gc, ledger(history), now);
    if (payout.amount > 0 && payout.reason === "ok") {
      const balances = addGc(child, payout.amount);
      child = { ...child, ...balances, weeklyGcReachedAt: now.toISOString() };
      history = [
        {
          id: uid(),
          source: "quest" satisfies GcSource,
          amount: payout.amount,
          at: now.toISOString(),
          labelKey: `quests.${quest.id}.title`,
        },
        ...history,
      ];
      awarded = [...awarded, instanceId];
    } else if (payout.reason === "cap") {
      capNote = true;
    }
  }
  return { ...data, questProgress: progress, questAwarded: awarded, child, history, capNote };
}

function awardMission(data: NuvoData, missionId: string, amount: number, now: Date): NuvoData {
  const before = levelFromLifetime(data.child.gcLifetime).level;
  const balances = addGc(data.child, amount);
  const child = { ...data.child, ...balances, weeklyGcReachedAt: now.toISOString() };
  const after = levelFromLifetime(child.gcLifetime);
  const history =
    amount > 0
      ? [
          {
            id: uid(),
            source: "mission" as const,
            amount,
            at: now.toISOString(),
            labelKey: `missions.${missionId}.title`,
            missionId,
          },
          ...data.history,
        ]
      : data.history;
  const next: NuvoData = {
    ...data,
    child,
    history,
    celebration: { missionId, gc: amount, leveledUp: after.level > before, level: after.level },
  };
  return amount > 0 ? withQuests(next, "missions", 1, now) : next;
}

export function startMission(data: NuvoData, missionId: string, now = new Date()): NuvoData {
  const last = [...data.events].reverse().find((event) => event.name === "mission_started" && event.missionId === missionId);
  if (last && now.getTime() - new Date(last.at).getTime() < 5000) return data;
  return { ...data, events: pushEvent(data, "mission_started", now, { missionId }) };
}

export function submitMission(data: NuvoData, input: SubmitInput, now = new Date()): SubmitResult {
  const mission = missionById(input.missionId);
  if (!mission) return { ok: false, reason: "missing" };
  const current = latest(data, mission.id);
  if (current?.status === "pending") return { ok: false, reason: "pending" };
  if (current?.status === "approved" && !mission.repeatable) return { ok: false, reason: "done" };
  const priorTimes = data.submissions
    .filter((item) => item.missionId === mission.id && item.status === "approved" && item.reviewedAt)
    .map((item) => item.reviewedAt as string);
  const payout = missionPayout(mission.gc, priorTimes, now);
  if (!payout.allowed) return { ok: false, reason: "once-a-day" };

  const streak = applyStreak(
    {
      streak: data.child.streak,
      lastActiveDate: data.child.lastActiveDate,
      shieldUsedAt: data.child.shieldUsedAt,
    },
    now,
  );
  let next: NuvoData = {
    ...data,
    child: { ...data.child, streak: streak.streak, lastActiveDate: streak.lastActiveDate, shieldUsedAt: streak.shieldUsedAt },
    streakMessage: streak.message ?? data.streakMessage,
  };
  if (streak.message !== "reset") next = withQuests(next, "streak", 1, now);

  const record: Submission = {
    id: current?.status === "redo" ? current.id : uid(),
    missionId: mission.id,
    childId: data.child.id,
    status: mission.needsApproval ? "pending" : "approved",
    evidenceKey: input.evidenceKey,
    note: input.note,
    reflection: input.reflection,
    submittedAt: now.toISOString(),
    reviewedAt: mission.needsApproval ? undefined : now.toISOString(),
    reviewedBy: mission.needsApproval ? undefined : "parent",
    reviewNote: undefined,
    reviewSeconds: mission.needsApproval ? undefined : 0,
  };
  const submissions = current?.status === "redo"
    ? data.submissions.map((item) => (item.id === current.id ? record : item))
    : [...data.submissions, record];
  next = {
    ...next,
    submissions,
    events: pushEvent(next, "mission_submitted", now, { missionId: mission.id, detail: record.status }),
  };
  if (!mission.needsApproval) {
    next = awardMission(next, mission.id, payout.amount, now);
    next = {
      ...next,
      events: pushEvent(next, "mission_approved", now, { missionId: mission.id, detail: "approved", reviewSeconds: 0 }),
    };
  }
  return { ok: true, data: next };
}

/** A climate lesson finishes on this device, so a waiting photo is not required. */
export function completeLesson(data: NuvoData, missionId: string, reflection: string, now = new Date()): SubmitResult {
  const current = latest(data, missionId);
  if (current?.status === "pending") return { ok: true, data: approveSubmission(data, current.id, now) };
  const submitted = submitMission(data, { missionId, reflection, note: "lesson" }, now);
  if (!submitted.ok) return submitted;
  const pending = [...submitted.data.submissions].reverse().find((item) => item.missionId === missionId && item.status === "pending");
  if (!pending) return submitted;
  return { ok: true, data: approveSubmission(submitted.data, pending.id, now) };
}

export function approveSubmission(data: NuvoData, submissionId: string, now = new Date()): NuvoData {
  const submission = data.submissions.find((item) => item.id === submissionId);
  const mission = submission ? missionById(submission.missionId) : undefined;
  if (!submission || !mission || submission.status === "approved") return data;
  const priorTimes = data.submissions
    .filter((item) => item.missionId === mission.id && item.status === "approved" && item.reviewedAt)
    .map((item) => item.reviewedAt as string);
  const payout = missionPayout(mission.gc, priorTimes, now);
  const submissions = data.submissions.map((item) =>
    item.id === submissionId
      ? { ...item, status: "approved" as const, reviewedAt: now.toISOString(), reviewedBy: "parent" as const, reviewNote: undefined }
      : item,
  );
  let next = awardMission({ ...data, submissions }, mission.id, payout.allowed ? payout.amount : 0, now);
  next = {
    ...next,
    events: pushEvent(next, "mission_approved", now, {
      missionId: mission.id,
      detail: "approved",
      role: "parent",
    }),
  };
  return next;
}

export function requestRedo(data: NuvoData, submissionId: string, reviewNote: string, now = new Date()): NuvoData {
  return {
    ...data,
    submissions: data.submissions.map((item) =>
      item.id === submissionId
        ? { ...item, status: "redo" as const, reviewNote, reviewedAt: now.toISOString(), reviewedBy: "parent" as const }
        : item,
    ),
  };
}

export interface OnboardingInput {
  nickname: string;
  avatarId: string;
  showOnLeague: boolean;
  parentEmail: string;
  now?: Date;
}

export function onboardFromDemo(base: NuvoData, input: OnboardingInput): NuvoData {
  const now = input.now ?? new Date();
  return {
    ...base,
    onboarded: true,
    role: "child",
    child: {
      ...base.child,
      nickname: input.nickname.trim(),
      avatarId: input.avatarId,
      settings: { showOnLeague: input.showOnLeague },
      consent: { given: true, givenAt: now.toISOString(), parentEmail: input.parentEmail.trim() },
    },
  };
}
