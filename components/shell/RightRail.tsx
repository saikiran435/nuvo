"use client";

import Link from "next/link";
import { peers } from "@/data/peers";
import { rewardById } from "@/data/rewards";
import { avatarEmoji } from "@/data/avatars";
import { Chiku } from "@/components/Chiku";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { dailyQuests, leagueTitle, levelFromLifetime, questInstanceId, rankLeague } from "@/lib/game";
import { useIstDateKey } from "@/lib/clock";
import { formatGc } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";

export function RightRail() {
  const child = useNuvo((state) => state.child);
  const progress = useNuvo((state) => state.questProgress);
  const awarded = useNuvo((state) => state.questAwarded);
  const dateKey = useIstDateKey();
  const quests = dateKey ? dailyQuests(dateKey) : [];
  const level = levelFromLifetime(child.gcLifetime);
  const ranked = rankLeague([
    ...peers.map((peer) => ({ id: peer.id, weeklyGc: peer.weeklyGc, reachedAt: peer.reachedAt })),
    { id: child.id, weeklyGc: child.weeklyGc, reachedAt: child.weeklyGcReachedAt },
  ]);
  const top = ranked.slice(0, 2);
  const you = ranked.find((row) => row.id === child.id);
  const featured = rewardById("neighbourhood-walk");

  return (
    <aside className="hidden flex-col gap-3 border-l-2 border-line bg-bg-soft p-3 desktop:flex" aria-label={t("shell.today")}>
      <Card className="flex flex-col gap-3">
        <h2 className="font-display text-xl">{t("quests.title")}</h2>
        {quests.map((quest) => {
          const id = dateKey ? questInstanceId(dateKey, quest.id) : quest.id;
          const value = progress[id] ?? 0;
          const done = awarded.includes(id) || value >= quest.target;
          return (
            <div key={quest.id} className="grid grid-cols-[1fr_auto] items-center gap-2">
              <span>{t(`quests.${quest.id}.title`)}</span>
              {done ? <Pill tone="green">{t("quests.done")}</Pill> : <Pill>+{quest.gc}</Pill>}
              <div className="col-span-2">
                <ProgressBar value={Math.min(value, quest.target)} max={quest.target} label={t(`quests.${quest.id}.title`)} />
              </div>
            </div>
          );
        })}
      </Card>
      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{leagueTitle(child.leagueIndex)} {t("shell.league").toLowerCase()}</h2>
        </div>
        {child.settings.showOnLeague && you ? (
          <>
            {top.map((row) => {
              const peer = peers.find((item) => item.id === row.id);
              return (
                <div key={row.id} className="grid grid-cols-[28px_28px_1fr_auto] items-center gap-2">
                  <b>{row.rank}</b>
                  <span>{peer ? avatarEmoji(peer.avatarId) : avatarEmoji(child.avatarId)}</span>
                  <span>{peer?.nickname ?? child.nickname}</span>
                  <b>{formatGc(peer?.weeklyGc ?? child.weeklyGc)}</b>
                </div>
              );
            })}
            {you.rank > 2 ? (
              <div className="grid grid-cols-[28px_28px_1fr_auto] items-center gap-2 rounded-xl border-2 border-gold bg-gold-pale px-1 py-1">
                <b>{you.rank}</b>
                <span>{avatarEmoji(child.avatarId)}</span>
                <span>{child.nickname}</span>
                <b>{formatGc(child.weeklyGc)}</b>
              </div>
            ) : null}
            <ButtonLink href="/league" variant="ghost" full>
              {t("rail.seeLeague")}
            </ButtonLink>
          </>
        ) : (
          <p>{t("rail.leagueOff")}</p>
        )}
      </Card>
      {featured ? (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Chiku mood="idle" level={level.level} size={48} />
            <div>
              <p className="font-display text-green-deep">{t("rail.shop")}</p>
              <h2 className="font-display text-xl">{t(`rewards.${featured.id}.title`)}</h2>
              <p className="text-ink-soft">{formatGc(featured.gcCost)} {t("shell.credits")}</p>
            </div>
          </div>
          <ButtonLink href="/rewards" full>
            {t("rail.visit")}
          </ButtonLink>
        </Card>
      ) : null}
    </aside>
  );
}

export function TodayCard() {
  const child = useNuvo((state) => state.child);
  const progress = useNuvo((state) => state.questProgress);
  const dateKey = useIstDateKey();
  const quests = dateKey ? dailyQuests(dateKey) : [];
  const first = quests[0];
  const value = first && dateKey ? (progress[questInstanceId(dateKey, first.id)] ?? 0) : 0;
  const ranked = rankLeague([
    ...peers.map((peer) => ({ id: peer.id, weeklyGc: peer.weeklyGc, reachedAt: peer.reachedAt })),
    { id: child.id, weeklyGc: child.weeklyGc, reachedAt: child.weeklyGcReachedAt },
  ]);
  const you = ranked.find((row) => row.id === child.id);
  return (
    <Card className="mb-4 flex flex-col gap-2 desktop:hidden">
      <h2 className="font-display text-xl">{t("rail.today")}</h2>
      {first ? (
        <p>
          {value} / {first.target} · {t(`quests.${first.id}.title`)}
        </p>
      ) : null}
      {child.settings.showOnLeague && you ? (
        <Link href="/league" className="font-display text-green-deep">
          {t("rail.you", { rank: you.rank })}
        </Link>
      ) : (
        <p>{t("rail.leagueOff")}</p>
      )}
    </Card>
  );
}
