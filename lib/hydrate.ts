"use client";

import { useEffect } from "react";
import { leagueWeekId } from "@/lib/game";
import { useNuvo } from "@/lib/store";

export function useHasHydrated(): boolean {
  const hydrated = useNuvo((state) => state.hasHydrated);
  useEffect(() => {
    const mark = () => {
      try {
        const current = useNuvo.getState();
        const week = leagueWeekId(new Date());
        if (current.child && current.child.leagueWeekId !== week) {
          useNuvo.setState({
            child: { ...current.child, weeklyGc: 0, leagueWeekId: week, weeklyGcReachedAt: new Date().toISOString() },
            hasHydrated: true,
          });
          return;
        }
      } catch {
        // A saved passport that cannot be read should still open.
      }
      useNuvo.setState({ hasHydrated: true });
    };
    const unsub = useNuvo.persist.onFinishHydration(mark);
    if (useNuvo.persist.hasHydrated()) {
      mark();
    } else {
      const pending = useNuvo.persist.rehydrate();
      if (pending) void pending.then(mark, mark);
    }
    const timer = window.setTimeout(mark, 400);
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, []);
  return hydrated;
}
