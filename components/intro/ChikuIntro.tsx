"use client";

import { useEffect, useState } from "react";
import { Chiku, type ChikuMood } from "@/components/Chiku";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

type Beat = { mood: ChikuMood; key: string; choice?: boolean };

const beats: Beat[] = [
  { mood: "happy", key: "intro.hi" },
  { mood: "curious", key: "intro.ask", choice: true },
  { mood: "thinking", key: "intro.points" },
  { mood: "idle", key: "intro.grownup" },
  { mood: "celebrate", key: "intro.end" },
];

export function ChikuIntro({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reply, setReply] = useState<string | null>(null);
  const beat = beats[index] ?? beats[0];
  const progress = Math.round(((index + 1) / beats.length) * 100);

  useEffect(() => {
    if (!playing || beat.choice || index >= beats.length - 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, beats.length - 1));
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [playing, index, beat.choice]);

  function choose(key: string) {
    setReply(key);
    setIndex((current) => Math.min(current + 1, beats.length - 1));
    setPlaying(true);
  }

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-line bg-ink text-white">
      <div className="flex items-end justify-between gap-3 bg-[#163a1a] px-4 py-3">
        <p className="font-display text-lg">{t("intro.title")}</p>
        <button type="button" className="font-display text-sm text-white" onClick={onDone}>
          {t("intro.skip")}
        </button>
      </div>
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#245c18] to-[#14301c] px-5 py-6 text-center">
        <Chiku mood={beat.mood} level={1} size={120} label="Chiku" />
        <p className="max-w-sm rounded-2xl bg-white/15 px-4 py-3 text-lg leading-snug">{t(beat.key)}</p>
        {reply && index > 1 ? <p className="max-w-sm text-sm text-[#d7f0c8]">{t(reply)}</p> : null}
      </div>
      <div className="h-2 bg-[#0e2414]">
        <div className="h-full bg-green" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex flex-wrap gap-2 bg-[#102616] p-3">
        {beat.choice ? (
          <>
            <Button type="button" variant="gold" onClick={() => choose("intro.afterYes")}>
              {t("intro.yes")}
            </Button>
            <Button type="button" variant="blue" onClick={() => choose("intro.afterWhat")}>
              {t("intro.what")}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="gold"
              onClick={() => {
                if (index >= beats.length - 1) {
                  setReply(null);
                  setIndex(0);
                  setPlaying(true);
                  return;
                }
                setPlaying((value) => !value);
              }}
            >
              {playing && index < beats.length - 1 ? t("lesson.pause") : index >= beats.length - 1 ? t("intro.replay") : t("lesson.play")}
            </Button>
            <Button
              type="button"
              variant="blue"
              onClick={() => {
                setPlaying(false);
                setIndex((current) => Math.min(current + 1, beats.length - 1));
              }}
            >
              {t("lesson.nextScene")}
            </Button>
          </>
        )}
        {index === beats.length - 1 ? (
          <Button type="button" onClick={onDone}>
            {t("intro.go")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
