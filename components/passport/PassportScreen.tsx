"use client";

import { Chiku } from "@/components/Chiku";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { badgeRules } from "@/data/rewards";
import { worlds } from "@/data/worlds";
import { completedMissionIds } from "@/lib/flow";
import { earnedBadgeIds, levelFromLifetime, worldProgress } from "@/lib/game";
import { formatGc } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ring: Record<string, string> = {
  water: "#1CB0F6",
  waste: "#CE82FF",
  nature: "#58CC02",
  mobility: "#FF9600",
  community: "#FF86D0",
};

export function PassportScreen() {
  const data = useNuvo();
  const setPace = useNuvo((state) => state.setPace);
  const pace = data.child.settings.pace ?? "short";
  const level = levelFromLifetime(data.child.gcLifetime);
  const done = completedMissionIds(data);
  const earned = new Set(
    earnedBadgeIds(badgeRules, {
      completedMissionIds: [...done],
      streak: data.child.streak,
      quizzesPassed: data.quizzesPassed,
      storiesCompleted: data.completedStoryIds.length,
    }),
  );
  const pct = level.span === 0 ? 100 : Math.round((level.intoLevel / level.span) * 100);
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center gap-2 text-center">
        <Chiku mood={data.celebration ? "celebrate" : "happy"} level={level.level} size={140} label="Chiku" />
        <p className="font-display text-xl">{data.child.nickname}</p>
        <p className="font-display text-green-deep">{t("me.level", { level: level.level })}</p>
        <p>
          {formatGc(data.child.gcLifetime)} {t("me.xp")} · {formatGc(data.child.gcBalance)} {t("me.points")}
        </p>
        <p className="text-sm text-ink-soft">{t("me.pointsNote")}</p>
        <h1 className="font-display text-3xl">{level.title}</h1>
        {level.nextAt === null ? (
          <p>{t("me.max")}</p>
        ) : (
          <p className="text-ink-soft">{t("me.toNext", { gc: formatGc(level.nextAt - data.child.gcLifetime), title: levelFromLifetime(level.nextAt).title })}</p>
        )}
        <div className="w-full">
          <ProgressBar value={level.intoLevel} max={level.span || 1} label={level.title} />
        </div>
        <span className="sr-only">{pct}%</span>
      </Card>
      <h2 className="font-display text-2xl">{t("me.pace")}</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant={pace === "short" ? "primary" : "ghost"} onClick={() => setPace("short")}>
          {t("me.paceShort")}
        </Button>
        <Button variant={pace === "full" ? "primary" : "ghost"} onClick={() => setPace("full")}>
          {t("me.paceFull")}
        </Button>
      </div>
      <h2 className="font-display text-2xl">{t("me.badges")}</h2>
      <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3">
        {badgeRules.map((rule) => {
          const owned = earned.has(rule.id);
          return (
            <div
              key={rule.id}
              className={cn(
                "grid aspect-square place-items-center rounded-2xl border-2 p-2 text-center font-display",
                owned ? "border-green bg-green-pale" : "border-line text-ink-mute",
              )}
            >
              {owned ? t(`badges.${rule.id}`) : `🔒 ${t(`badges.${rule.id}`)}`}
            </div>
          );
        })}
      </div>
      <h2 className="font-display text-2xl">{t("me.worlds")}</h2>
      <div className="flex flex-wrap gap-3">
        {worlds.map((world) => {
          const counts = worldProgress(world.missionIds, done);
          const percent = counts.total === 0 ? 0 : (counts.done / counts.total) * 100;
          return (
            <div
              key={world.id}
              className="grid h-[72px] w-[72px] place-items-center rounded-full font-display"
              style={{ background: `conic-gradient(${ring[world.category]} ${percent}%, #E5E5E5 ${percent}%)` }}
              aria-label={`${t(`worlds.${world.id}`)} ${counts.done} / ${counts.total}`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm">
                {counts.done}/{counts.total}
              </span>
            </div>
          );
        })}
      </div>
      <h2 className="font-display text-2xl">{t("me.history")}</h2>
      <Card className="flex flex-col gap-2">
        {data.history.length === 0 ? <p>{t("me.emptyHistory")}</p> : null}
        {data.history.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3">
            <span>{t(entry.labelKey)}</span>
            <b className="font-display">+{formatGc(entry.amount)}</b>
          </div>
        ))}
      </Card>
    </div>
  );
}
