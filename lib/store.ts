"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { blankState, createDemoState } from "@/data/seed";
import { approveSubmission, completeLesson, onboardFromDemo, requestRedo, startMission, submitMission, type SubmitInput, type SubmitResult } from "@/lib/flow";
import type { NuvoData, Role } from "@/lib/model";

interface Store extends NuvoData {
  hasHydrated: boolean;
  completeOnboarding: (input: { nickname: string; avatarId: string; showOnLeague: boolean; parentEmail: string }) => void;
  resetDemo: () => void;
  replayWelcome: () => void;
  setRole: (role: Role) => void;
  submit: (input: SubmitInput) => SubmitResult;
  finishLesson: (missionId: string, reflection: string) => SubmitResult;
  approve: (id: string) => void;
  redo: (id: string, note: string) => void;
  beginMission: (id: string) => void;
  dismissCelebration: () => void;
  dismissStreak: () => void;
  dismissCap: () => void;
  logSession: () => void;
  setPace: (pace: "short" | "full") => void;
  markIntroSeen: () => void;
}

const initial = blankState();

export const useNuvo = create<Store>()(
  persist(
    (set, get) => ({
      ...initial,
      hasHydrated: false,
      completeOnboarding: (input) => {
        const now = new Date();
        set(onboardFromDemo(createDemoState(now), { ...input, now }));
      },
      resetDemo: () => set({ ...createDemoState(), hasHydrated: true }),
      replayWelcome: () => set({ ...blankState(), hasHydrated: true }),
      setRole: (role) => set({ role }),
      submit: (input) => {
        const result = submitMission(get(), input);
        if (result.ok) set(result.data);
        return result;
      },
      finishLesson: (missionId, reflection) => {
        const result = completeLesson(get(), missionId, reflection);
        if (result.ok) set(result.data);
        return result;
      },
      approve: (id) => set(approveSubmission(get(), id)),
      redo: (id, note) => set(requestRedo(get(), id, note)),
      beginMission: (id) => set(startMission(get(), id)),
      dismissCelebration: () => set({ celebration: null }),
      dismissStreak: () => set({ streakMessage: null }),
      dismissCap: () => set({ capNote: false }),
      markIntroSeen: () => set({ introSeen: true }),
      setPace: (pace) =>
        set((state) => ({
          child: { ...state.child, settings: { ...state.child.settings, pace } },
        })),
      logSession: () => {
        if (sessionStorage.getItem("nuvo-session")) return;
        sessionStorage.setItem("nuvo-session", "1");
        const now = new Date().toISOString();
        set((state) => ({
          events: [...state.events, { id: crypto.randomUUID(), name: "session_start", at: now, role: state.role }],
        }));
      },
    }),
    {
      name: "nuvo-v0",
      partialize: (state) => ({
        onboarded: state.onboarded,
        role: state.role,
        child: state.child,
        submissions: state.submissions,
        history: state.history,
        events: state.events,
        questProgress: state.questProgress,
        questAwarded: state.questAwarded,
        quizzesPassed: state.quizzesPassed,
        completedStoryIds: state.completedStoryIds,
        celebration: state.celebration,
        streakMessage: state.streakMessage,
        capNote: state.capNote,
        introSeen: state.introSeen,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as NuvoData),
        hasHydrated: false,
      }),
    },
  ),
);
