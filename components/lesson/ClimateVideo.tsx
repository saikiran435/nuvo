"use client";

import { useEffect, useState } from "react";
import { Chiku, type ChikuMood } from "@/components/Chiku";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export function ClimateVideo({
  title,
  scenes,
}: {
  title: string;
  scenes: { text: string; mood?: ChikuMood }[];
}) {
  const frames = scenes.length > 0 ? scenes : [{ text: title, mood: "thinking" as const }];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scene = frames[index] ?? frames[0];
  const progress = Math.round(((index + 1) / frames.length) * 100);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % frames.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [playing, frames.length]);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-line bg-ink text-white">
      <div className="flex items-end justify-between gap-3 bg-[#163a1a] px-4 py-3">
        <p className="font-display text-lg">{title}</p>
        <p className="text-sm">{t("lesson.watch")}</p>
      </div>
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#1f6b2a] to-[#14301c] px-5 py-6 text-center">
        <Chiku mood={scene.mood ?? "thinking"} level={4} size={96} label="Chiku" />
        <p className="max-w-sm text-lg leading-snug">{scene.text}</p>
      </div>
      <div className="h-2 bg-[#0e2414]">
        <div className="h-full bg-green" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex gap-2 bg-[#102616] p-3">
        <Button
          type="button"
          variant="gold"
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? t("lesson.pause") : t("lesson.play")}
        </Button>
        <Button
          type="button"
          variant="blue"
          onClick={() => {
            setPlaying(false);
            setIndex((current) => (current + 1) % frames.length);
          }}
        >
          {t("lesson.nextScene")}
        </Button>
      </div>
    </div>
  );
}
