"use client";

import Link from "next/link";
import { useState } from "react";
import { Chiku } from "@/components/Chiku";
import { RegionArt } from "@/components/map/RegionArt";
import { ChikuIntro } from "@/components/intro/ChikuIntro";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { missionDifficulty, missionMinutes } from "@/data/missionFacts";
import { missionById } from "@/data/missions";
import { rewards } from "@/data/rewards";
import { worlds } from "@/data/worlds";
import { completedMissionIds } from "@/lib/flow";
import { useHasHydrated } from "@/lib/hydrate";
import { formatGc } from "@/lib/format";
import { isWorldUnlocked, levelFromLifetime, worldProgress } from "@/lib/game";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { cn } from "@/lib/cn";

export function HomeScreen() {
  const data = useNuvo();
  const done = completedMissionIds(data);
  const level = levelFromLifetime(data.child.gcLifetime);
  const openWorlds = worlds.filter((world) => isWorldUnlocked(world, worlds, done));
  const currentWorld = openWorlds.find((world) => world.missionIds.some((id) => !done.has(id))) ?? openWorlds[0];
  const currentId = currentWorld?.missionIds.find((id) => !done.has(id));
  const mission = currentId ? missionById(currentId) : undefined;
  const nextReward = rewards.find(
    (reward) => reward.kind !== "badge" && (reward.gcCost > data.child.gcBalance || (reward.minLevel ?? 1) > level.level),
  );
  const nickname = data.child.nickname || t("app.name");
  const hydrated = useHasHydrated();
  const markIntroSeen = useNuvo((state) => state.markIntroSeen);
  const [replay, setReplay] = useState(false);
  const showIntro = hydrated && (!data.introSeen || replay);

  return (
    <div className="flex flex-col gap-4">
      {showIntro ? (
        <ChikuIntro
          onDone={() => {
            markIntroSeen();
            setReplay(false);
          }}
        />
      ) : null}
      <Card className="flex items-center gap-3 bg-cream">
        <Chiku mood="curious" level={level.level} size={88} label="Chiku" />
        <div>
          <h1 className="font-display text-3xl leading-none">{t("home.hello", { name: nickname })}</h1>
          <p className="mt-1 text-ink-soft">{t("home.today")}</p>
          {data.introSeen && !replay ? (
            <Button className="mt-2" variant="ghost" onClick={() => setReplay(true)}>
              {t("home.watchIntro")}
            </Button>
          ) : null}
        </div>
      </Card>

      {mission && currentWorld ? (
        <Card className="flex flex-col gap-3">
          <p className="font-display text-green-deep">{t("home.continue")}</p>
          <RegionArt id={currentWorld.id} />
          <h2 className="font-display text-2xl">{t(`worlds.${currentWorld.id}`)}</h2>
          <p>{t(`worldBlurbs.${currentWorld.id}`)}</p>
          <ButtonLink href={`/mission/${mission.id}`} full>
            {t(`missions.${mission.id}.title`)}
          </ButtonLink>
        </Card>
      ) : (
        <Card>
          <p>{t("celebrate.world")}</p>
          <ButtonLink href="/explore" full className="mt-3">
            {t("home.openMap")}
          </ButtonLink>
        </Card>
      )}

      {mission ? (
        <Card className="flex flex-col gap-2">
          <p className="font-display text-blue-dark">{t("home.featured")}</p>
          <h2 className="font-display text-2xl">{t(`missions.${mission.id}.title`)}</h2>
          <div className="flex flex-wrap gap-2">
            <Pill tone="grey">{t("mission.minutes", { count: missionMinutes(mission.id) })}</Pill>
            <Pill tone="green">{t(missionDifficulty(mission.id) === "steady" ? "mission.difficultySteady" : "mission.difficultyEasy")}</Pill>
            <Pill>{t("path.reward", { gc: mission.gc })}</Pill>
          </div>
          <p>{t(`missions.${mission.id}.learn`)}</p>
        </Card>
      ) : null}

      <section>
        <div className="mb-2 flex items-end justify-between gap-2">
          <h2 className="font-display text-2xl">{t("home.map")}</h2>
          <Link href="/explore" className="font-display text-green-deep">
            {t("home.openMap")}
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {worlds.filter((world) => !world.pack).map((world) => {
            const unlocked = isWorldUnlocked(world, worlds, done);
            const counts = worldProgress(world.missionIds, done);
            return (
              <Link
                key={world.id}
                href="/explore"
                className={cn(
                  "w-44 shrink-0 overflow-hidden rounded-2xl border-2 border-line bg-white",
                  !unlocked && "opacity-70",
                )}
              >
                <RegionArt id={world.id} />
                <div className="p-3">
                  <p className="font-display leading-tight">{t(`worlds.${world.id}`)}</p>
                  <p className="text-sm text-ink-soft">
                    {unlocked ? t("path.progress", { done: counts.done, total: counts.total }) : t("me.locked")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Card className="flex flex-col gap-2">
        <p className="font-display text-green-deep">{t("home.progress")}</p>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl">{t("me.level", { level: level.level })}</h2>
          <span className="font-display">{formatGc(data.child.gcLifetime)} {t("shell.xp")}</span>
        </div>
        <ProgressBar value={level.intoLevel} max={level.span || 1} label={level.title} />
        <p className="text-sm text-ink-soft">{t("home.pointsHint")}</p>
        {nextReward ? (
          <p>
            <span className="font-display">{t("home.nextUnlock")}: </span>
            {t(`rewards.${nextReward.id}.title`)}
          </p>
        ) : null}
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">{t("home.packs")}</h2>
        <p className="text-sm text-ink-soft">{t("home.packsNote")}</p>
        {worlds
          .filter((world) => world.pack)
          .map((world) => (
            <Card key={world.id} className="flex flex-col gap-2">
              <h3 className="font-display text-xl">{t(`worlds.${world.id}`)}</h3>
              <p>{t(`worldBlurbs.${world.id}`)}</p>
              <div className="flex flex-col gap-2">
                {world.missionIds.map((id) => (
                  <ButtonLink key={id} href={`/mission/${id}`} variant="ghost" full>
                    {t(`missions.${id}.title`)}
                  </ButtonLink>
                ))}
              </div>
            </Card>
          ))}
      </section>

      <section className="grid gap-3 desktop:grid-cols-2">
        <h2 className="font-display text-2xl desktop:col-span-2">{t("home.discover")}</h2>
        <Link href="/stories" className="rounded-2xl border-2 border-line bg-white p-4">
          <p className="font-display text-xl">{t("home.stories")}</p>
          <p className="text-ink-soft">{t("home.storiesBody")}</p>
        </Link>
        <Link href="/quizzes" className="rounded-2xl border-2 border-line bg-white p-4">
          <p className="font-display text-xl">{t("home.quizzes")}</p>
          <p className="text-ink-soft">{t("home.quizzesBody")}</p>
        </Link>
      </section>
      <p className="text-center text-sm text-ink-soft">{t("home.saved")}</p>
    </div>
  );
}
