"use client";

import { useEffect, useState } from "react";
import { istDateKey } from "@/lib/game";

/** Current time, read after paint so prerender does not call the clock. */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setNow(new Date());
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return now;
}

export function useIstDateKey(): string | null {
  const now = useNow();
  return now ? istDateKey(now) : null;
}
