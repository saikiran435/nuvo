"use client";

import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Chiku, type ChikuMood } from "@/components/Chiku";
import { TodayCard } from "@/components/shell/RightRail";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { missionById } from "@/data/missions";
import { worldById, worlds } from "@/data/worlds";
import { completedMissionIds, pendingMissionIds } from "@/lib/flow";
import { isWorldUnlocked, levelFromLifetime, worldNodes, worldProgress } from "@/lib/game";
import type { NodeView } from "@/lib/game/unlocks";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";

const banner: Record<string, string> = {
  water: "bg-blue",
  waste: "bg-purple",
  nature: "bg-green",
  mobility: "bg-orange",
  community: "bg-pink",
};

const trailTint: Record<string, string> = {
  water: "#B3E5FC",
  waste: "#EBD4FF",
  nature: "#C8F5A0",
  mobility: "#FFD7A8",
  community: "#FFD0EC",
};

function trail(count: number): { d: string; height: number; points: { x: number; y: number }[] } {
  const points = Array.from({ length: count }, (_, index) => ({
    x: index % 2 === 0 ? 75 : 225,
    y: 48 + index * 108,
  }));
  const height = (points[points.length - 1]?.y ?? 48) + 64;
  let d = points[0] ? `M ${points[0].x} ${points[0].y}` : "";
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const mid = (from.y + to.y) / 2;
    d += ` C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}`;
  }
  return { d, height, points };
}

export function PathScreen() {
  const data = useNuvo();
  const dismissCelebration = useNuvo((state) => state.dismissCelebration);
  const dismissStreak = useNuvo((state) => state.dismissStreak);
  const dismissCap = useNuvo((state) => state.dismissCap);
  const level = levelFromLifetime(data.child.gcLifetime);
  const done = completedMissionIds(data);
  const pending = pendingMissionIds(data);
  const trail = worlds.filter((world) => !world.pack);
  const unlockedWorlds = trail.filter((world) => isWorldUnlocked(world, trail, done));
  const nextLocked = trail.find((world) => !isWorldUnlocked(world, trail, done));
  const visible = nextLocked ? [...unlockedWorlds, nextLocked] : unlockedWorlds;
  const [selected, setSelected] = useState<string | null>(null);

  let mood: ChikuMood = "idle";
  let message = "";
  if (data.celebration) {
    mood = "celebrate";
    const title = t(`missions.${data.celebration.missionId}.title`);
    const mission = missionById(data.celebration.missionId);
    const world = mission ? worldById(mission.worldId) : undefined;
    const index = world?.missionIds.indexOf(data.celebration.missionId) ?? -1;
    const nextId = world && index >= 0 ? world.missionIds[index + 1] : undefined;
    message = t("celebrate.mission", { title, gc: data.celebration.gc });
    message += nextId ? ` ${t("celebrate.next", { title: t(`missions.${nextId}.title`) })}` : ` ${t("celebrate.world")}`;
    if (data.celebration.leveledUp) {
      message += ` ${t("celebrate.level", { level: data.celebration.level, levelTitle: level.title })}`;
    }
  } else if (data.capNote) {
    mood = "thinking";
    message = t("cap.explain");
  } else if (data.streakMessage === "shield") {
    mood = "curled";
    message = t("streak.shield");
  } else if (data.streakMessage === "reset") {
    message = t("streak.reset");
  } else if (pending.size > 0) {
    const pendingId = [...pending][0];
    mood = "thinking";
    message = t("mission.pending", { gc: missionById(pendingId)?.gc ?? 0 });
  } else {
    const currentWorld = unlockedWorlds.find((world) => world.missionIds.some((id) => !done.has(id)));
    const currentId = currentWorld?.missionIds.find((id) => !done.has(id));
    const callout = currentId ? t(`missions.${currentId}.callout`) : "";
    message = callout.startsWith("missions.") ? t("path.generic", { title: currentId ? t(`missions.${currentId}.title`) : "" }) : callout;
  }

  return (
    <div>
      <h1 className="mb-3 font-display text-3xl">{t("path.mapTitle")}</h1>
      <TodayCard />
      <Card className="mb-4 flex items-center gap-3">
        <Chiku mood={mood} level={level.level} size={72} label="Chiku" />
        <div className="flex-1">
          <p className="font-display text-green-deep">{t("path.says")}</p>
          <p>{message}</p>
          {data.celebration ? (
            <Button className="mt-2" onClick={dismissCelebration}>
              {t("celebrate.nice")}
            </Button>
          ) : null}
          {!data.celebration && data.capNote ? (
            <Button className="mt-2" variant="ghost" onClick={dismissCap}>
              {t("celebrate.nice")}
            </Button>
          ) : null}
          {!data.celebration && !data.capNote && data.streakMessage ? (
            <Button className="mt-2" variant="ghost" onClick={dismissStreak}>
              {t("celebrate.nice")}
            </Button>
          ) : null}
        </div>
      </Card>
      {(() => {
        const currentWorld = unlockedWorlds.find((world) => world.missionIds.some((missionId) => !done.has(missionId)));
        const currentId = currentWorld?.missionIds.find((missionId) => !done.has(missionId));
        if (!currentId) return null;
        return (
          <ButtonLink href={`/mission/${currentId}`} full className="mb-4">
            {t("path.upNext")}: {t(`missions.${currentId}.title`)}
          </ButtonLink>
        );
      })()}
      {visible.map((world) => {
        const unlocked = isWorldUnlocked(world, worlds, done);
        const nodes = worldNodes(world.missionIds, done, pending, unlocked);
        const counts = worldProgress(world.missionIds, done);
        const previous = worlds.find((item) => item.id === world.unlockedBy);
        return (
          <WorldPath
            key={world.id}
            title={t(`worlds.${world.id}`)}
            unlocked={unlocked}
            category={world.category}
            counts={counts}
            lockedLabel={previous ? t("path.worldLocked", { world: t(`worlds.${previous.id}`) }) : ""}
            nodes={nodes}
            selected={selected}
            onSelect={setSelected}
          />
        );
      })}
      {nextLocked ? <p className="my-4 text-center font-bold text-ink-soft">{t("path.more")}</p> : null}
    </div>
  );
}

function WorldPath({
  title,
  unlocked,
  category,
  counts,
  lockedLabel,
  nodes,
  selected,
  onSelect,
}: {
  title: string;
  unlocked: boolean;
  category: string;
  counts: { done: number; total: number };
  lockedLabel: string;
  nodes: NodeView[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const drawn = trail(nodes.length);
  const selectedNode = nodes.find((node) => node.missionId === selected);
  return (
    <article className="relative mb-2">
      <div className={cn("flex items-center justify-between rounded-2xl px-4 py-3 text-ink", unlocked ? banner[category] : "bg-[#dedede] text-ink-soft")}>
        <div>
          <h2 className="font-display text-[26px] leading-none">{title}</h2>
          <p className="text-lg font-bold">{unlocked ? t("path.progress", { done: counts.done, total: counts.total }) : lockedLabel}</p>
        </div>
        <span aria-hidden="true">{unlocked ? "●" : "🔒"}</span>
      </div>
      <div className="relative" style={{ height: drawn.height }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 300 ${drawn.height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={drawn.d} fill="none" stroke={unlocked ? trailTint[category] : "#E5E5E5"} strokeWidth="10" strokeDasharray="2 14" strokeLinecap="round" />
        </svg>
        {nodes.map((node, index) => {
          const point = drawn.points[index];
          const missionTitle = t(`missions.${node.missionId}.title`);
          const className = cn(
            "absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-xl text-ink",
            node.state === "done" && "size-[68px] border-b-[6px] border-green-dark bg-green",
            node.state === "current" && "node-current size-[82px] border-b-[6px] border-gold-dark bg-gold",
            node.state === "locked" && "size-[68px] border-2 border-b-[6px] border-line border-b-[#cfcfcf] bg-white text-ink-mute",
          );
          const style = { left: `${(point.x / 300) * 100}%`, top: point.y };
          if (node.state === "current" || node.state === "done") {
            return (
              <Link
                key={node.missionId}
                href={`/mission/${node.missionId}`}
                className={className}
                style={style}
                aria-label={`${missionTitle}, ${node.state}`}
              >
                {node.state === "done" ? <Check aria-hidden="true" /> : index + 1}
              </Link>
            );
          }
          return (
            <button
              key={node.missionId}
              type="button"
              className={className}
              style={style}
              aria-label={`${missionTitle}, ${node.state}`}
              onClick={() => onSelect(selected === node.missionId ? null : node.missionId)}
            >
              <Lock aria-hidden="true" size={22} />
            </button>
          );
        })}
      </div>
      {selectedNode ? <NodeSheet node={selectedNode} onClose={() => onSelect(null)} /> : null}
    </article>
  );
}

function NodeSheet({ node, onClose }: { node: NodeView; onClose: () => void }) {
  const mission = missionById(node.missionId);
  if (!mission) return null;
  const title = t(`missions.${mission.id}.title`);
  const world = worldById(mission.worldId);
  const previousMissionId = world?.missionIds[world.missionIds.indexOf(mission.id) - 1];
  const previousWorld = worlds.find((item) => item.id === world?.unlockedBy);
  let body = t(`missions.${mission.id}.do`);
  if (node.state === "locked" && previousMissionId) body = t("path.lockedMission", { title: t(`missions.${previousMissionId}.title`) });
  if (node.state === "locked" && !previousMissionId && previousWorld) body = t("path.lockedWorld", { world: t(`worlds.${previousWorld.id}`) });
  if (node.state === "done") body = t("path.doneBody");
  if (node.pending) body = t("path.waiting");
  return (
    <Card className="relative z-10 -mt-6 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-2xl">{title}</h3>
        <button type="button" className="font-display text-ink-soft" onClick={onClose}>
          {t("path.close")}
        </button>
      </div>
      <p>{body}</p>
      <Pill>{t("path.reward", { gc: mission.gc })}</Pill>
      {node.state === "current" ? (
        <ButtonLink href={`/mission/${mission.id}`} full>
          {node.pending ? t("path.see") : t("path.start")}
        </ButtonLink>
      ) : null}
      {node.state === "done" && mission.repeatable ? (
        <ButtonLink href={`/mission/${mission.id}`} variant="ghost" full>
          {t("path.look")}
        </ButtonLink>
      ) : null}
      {node.state === "done" && !mission.repeatable ? (
        <ButtonLink href={`/mission/${mission.id}`} variant="ghost" full>
          {t("path.look")}
        </ButtonLink>
      ) : null}
    </Card>
  );
}
