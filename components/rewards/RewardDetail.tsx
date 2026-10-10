"use client";

import { Chiku } from "@/components/Chiku";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { rewardById } from "@/data/rewards";
import { formatGc } from "@/lib/format";
import { levelFromLifetime } from "@/lib/game";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";

function kindKey(kind: string): string {
  if (kind === "workshop") return "rewardScreen.kindWorkshop";
  if (kind === "experience") return "rewardScreen.kindWalk";
  return "rewardScreen.kindDay";
}

export function RewardDetail({ id }: { id: string }) {
  const reward = rewardById(id);
  const child = useNuvo((state) => state.child);
  const level = levelFromLifetime(child.gcLifetime);

  if (!reward || reward.kind === "badge") {
    return (
      <Card className="flex flex-col gap-3">
        <Chiku mood="thinking" level={1} size={72} />
        <h1 className="font-display text-3xl">{t("rewardScreen.empty")}</h1>
        <ButtonLink href="/rewards" variant="ghost">
          {t("rewardScreen.back")}
        </ButtonLink>
      </Card>
    );
  }

  const levelOk = level.level >= (reward.minLevel ?? 1);
  const pointsOk = child.gcBalance >= reward.gcCost;
  const kind = reward.id === "nature-day" ? "rewardScreen.kindDay" : kindKey(reward.kind);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <Chiku mood="happy" level={level.level} size={96} label="Chiku" />
        <div className="self-start">
          <Pill tone="green">{t(kind)}</Pill>
        </div>
        <h1 className="font-display text-3xl">{t(`rewards.${reward.id}.title`)}</h1>
        <p>{t(`rewards.${reward.id}.description`)}</p>
        <p className="font-display">{formatGc(reward.gcCost)} {t("shell.credits")}</p>
        {!levelOk ? <p className="font-bold">{t("rewardScreen.needLevel", { level: reward.minLevel ?? 1 })}</p> : null}
        {levelOk && !pointsOk ? (
          <p className="font-bold">{t("rewardScreen.need", { gc: formatGc(reward.gcCost - child.gcBalance) })}</p>
        ) : null}
        {levelOk && pointsOk ? <p className="font-bold text-green-deep">{t("rewardScreen.ready")}</p> : null}
      </Card>
      <Card className="flex flex-col gap-2">
        <h2 className="font-display text-2xl">{t("rewardScreen.youDo")}</h2>
        <p>{t(`rewards.${reward.id}.youDo`)}</p>
        <h2 className="font-display text-2xl">{t("rewardScreen.bring")}</h2>
        <p>{t(`rewards.${reward.id}.bring`)}</p>
        <p className="text-sm text-ink-soft">{t("rewardScreen.withYou")}</p>
      </Card>
      <ButtonLink href="/rewards" variant="ghost" full>
        {t("rewardScreen.back")}
      </ButtonLink>
    </div>
  );
}
