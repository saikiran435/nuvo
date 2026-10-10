"use client";

import Link from "next/link";
import { Chiku } from "@/components/Chiku";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { badgeRules, rewards } from "@/data/rewards";
import { completedMissionIds } from "@/lib/flow";
import { formatGc } from "@/lib/format";
import { earnedBadgeIds, levelFromLifetime } from "@/lib/game";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { cn } from "@/lib/cn";

export function RewardsScreen() {
  const data = useNuvo();
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
  const catalogue = rewards.filter((reward) => reward.kind !== "badge");
  const balance = data.child.gcBalance;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center gap-3 bg-cream">
        <Chiku mood="happy" level={level.level} size={84} label="Chiku" />
        <div>
          <h1 className="font-display text-3xl">{t("rewardScreen.title")}</h1>
          <p>{t("rewardScreen.intro")}</p>
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-sm text-ink-soft">{t("rewardScreen.balance")}</p>
          <p className="font-display text-3xl">{formatGc(balance)}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-soft">{t("rewardScreen.xp")}</p>
          <p className="font-display text-3xl">{formatGc(data.child.gcLifetime)}</p>
        </Card>
      </div>
      <p className="text-sm text-ink-soft">{t("rewardScreen.cannotBuy")}</p>

      <h2 className="font-display text-2xl">{t("rewardScreen.badges")}</h2>
      {badgeRules.length === 0 ? <p>{t("rewardScreen.empty")}</p> : null}
      <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3">
        {badgeRules.map((rule) => {
          const owned = earned.has(rule.id);
          return (
            <div
              key={rule.id}
              className={cn(
                "rounded-2xl border-2 p-3 font-display",
                owned ? "border-green bg-green-pale" : "border-line bg-white text-ink-mute",
              )}
            >
              <p>{owned ? t(`badges.${rule.id}`) : t(`badges.${rule.id}`)}</p>
              <p className="text-sm">{owned ? t("quests.done") : t("me.locked")}</p>
            </div>
          );
        })}
      </div>

      <h2 className="font-display text-2xl">{t("rewardScreen.experiences")}</h2>
      {catalogue.length === 0 ? <p>{t("rewardScreen.empty")}</p> : null}
      <div className="flex flex-col gap-3">
        {catalogue.map((reward) => {
          const levelOk = level.level >= (reward.minLevel ?? 1);
          const pointsOk = balance >= reward.gcCost;
          const ready = levelOk && pointsOk;
          return (
            <Card key={reward.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl">{t(`rewards.${reward.id}.title`)}</h3>
                <Pill tone={ready ? "green" : "grey"}>{formatGc(reward.gcCost)}</Pill>
              </div>
              <p>{t(`rewards.${reward.id}.description`)}</p>
              <p className="text-sm text-ink-soft">
                {t(reward.kind === "workshop" ? "rewardScreen.kindWorkshop" : reward.id === "nature-day" ? "rewardScreen.kindDay" : "rewardScreen.kindWalk")}
              </p>
              {!levelOk ? <p className="font-bold">{t("rewardScreen.needLevel", { level: reward.minLevel ?? 1 })}</p> : null}
              {levelOk && !pointsOk ? (
                <p className="font-bold">{t("rewardScreen.need", { gc: formatGc(reward.gcCost - balance) })}</p>
              ) : null}
              <ButtonLink href={`/rewards/${reward.id}`} variant={ready ? "primary" : "ghost"} full>
                {t("rewardScreen.open")}
              </ButtonLink>
            </Card>
          );
        })}
      </div>
      <Link href="/me" className="font-display text-green-deep">
        {t("rewardScreen.history")}
      </Link>
    </div>
  );
}
