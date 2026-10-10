"use client";

import { useEffect, useState } from "react";
import { Chiku } from "@/components/Chiku";
import { ClimateVideo } from "@/components/lesson/ClimateVideo";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { RegionArt } from "@/components/map/RegionArt";
import { missionDifficulty, missionMinutes } from "@/data/missionFacts";
import { missionById } from "@/data/missions";
import { quizzes } from "@/data/quizzes";
import { stories, storyById } from "@/data/stories";
import type { ChikuMood } from "@/components/Chiku";
import { levelFromLifetime } from "@/lib/game";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { cn } from "@/lib/cn";

const beats = ["video", "check", "task"] as const;

function scenesFor(missionId: string, storyId: string | undefined, category: string): { text: string; mood?: ChikuMood }[] {
  const linked = storyId ? storyById(storyId) : undefined;
  const story = linked ?? stories.find((item) => item.category === category && item.cards);
  if (story?.cards && story.cards.length > 0) return story.cards;
  return [{ text: t(`missions.${missionId}.learn`), mood: "thinking" }];
}

export function MissionScreen({ id }: { id: string }) {
  const mission = missionById(id);
  const data = useNuvo();
  const beginMission = useNuvo((state) => state.beginMission);
  const finishLesson = useNuvo((state) => state.finishLesson);
  const [beat, setBeat] = useState<(typeof beats)[number]>("video");
  const [choice, setChoice] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [willTry, setWillTry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneGc, setDoneGc] = useState<number | null>(null);
  const [begun, setBegun] = useState(false);

  useEffect(() => {
    beginMission(id);
  }, [beginMission, id]);

  if (!mission) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <Chiku mood="thinking" level={1} size={72} />
        <h1 className="font-display text-3xl">{t("mission.missing")}</h1>
        <ButtonLink href="/learn" variant="ghost">
          {t("mission.back")}
        </ButtonLink>
      </Card>
    );
  }

  const level = levelFromLifetime(data.child.gcLifetime);
  const title = t(`missions.${mission.id}.title`);
  const quiz = quizzes.find((item) => item.category === mission.category) ?? quizzes.find((item) => item.id === "climate-basics");
  const question = quiz?.questions[0];
  const already = data.submissions.some((item) => item.missionId === mission.id && item.status === "approved");

  if (already && doneGc === null) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <Chiku mood="happy" level={level.level} size={96} label="Chiku" />
        <h1 className="font-display text-3xl">{title}</h1>
        <p>{t("mission.already")}</p>
        <ButtonLink href="/learn" full>
          {t("mission.back")}
        </ButtonLink>
      </Card>
    );
  }

  if (doneGc !== null) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <Chiku mood="celebrate" level={level.level} size={120} label="Chiku" />
        <p className="font-display text-green-deep">{t("lesson.done")}</p>
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="font-display text-2xl">{t("mission.earned", { gc: doneGc })}</p>
        <ButtonLink href="/learn" full>
          {t("path.start")}
        </ButtonLink>
      </Card>
    );
  }

  function finish() {
    if (!willTry) {
      setError(t("lesson.needTry"));
      return;
    }
    const result = finishLesson(mission?.id ?? id, t(`missions.${id}.do`));
    if (!result.ok) {
      setError(result.reason === "done" ? t("mission.already") : t("mission.once"));
      return;
    }
    const award = result.data.celebration?.gc ?? mission?.gc ?? 0;
    setDoneGc(award);
  }

  const pace = data.child.settings.pace ?? "short";
  const steps =
    pace === "full"
      ? [t(`missions.${mission.id}.learn`), t(`missions.${mission.id}.do`), t(`missions.${mission.id}.reflect`)]
      : [t(`missions.${mission.id}.do`)];

  return (
    <div className="flex flex-col gap-3">
      <Card className="overflow-hidden !p-0">
        <RegionArt id={mission.worldId} />
        <div className="flex flex-col gap-3 p-4">
          <p className="font-display text-green-deep">{t(`worlds.${mission.worldId}`)}</p>
          <h1 className="font-display text-3xl">{title}</h1>
          <div className="flex flex-wrap gap-2">
            <Pill tone="grey">{t("mission.minutes", { count: missionMinutes(mission.id) })}</Pill>
            <Pill>{t("mission.ages")}</Pill>
            <Pill tone="green">{t(missionDifficulty(mission.id) === "steady" ? "mission.difficultySteady" : "mission.difficultyEasy")}</Pill>
            {mission.do.supervised ? <Pill tone="pink">{t("mission.supervised")}</Pill> : null}
          </div>
          <h2 className="font-display text-xl">{t("mission.discover")}</h2>
          <p>{t(`missions.${mission.id}.learn`)}</p>
          <h2 className="font-display text-xl">{t("mission.steps")}</h2>
          <ol className="flex list-decimal flex-col gap-2 pl-5">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="font-display">
            {t("mission.rewardLabel")}: {t("path.reward", { gc: mission.gc })}
          </p>
        </div>
      </Card>
      {!begun ? (
        <Button full onClick={() => setBegun(true)}>
          {t("mission.begin")}
        </Button>
      ) : null}
      {begun ? (
        <>
      <p className="font-display text-green-deep">{t(`worlds.${mission.worldId}`)}</p>
      <h1 className="sr-only">{title}</h1>
      <div className="grid grid-cols-3 gap-2">
        {beats.map((name, index) => (
          <div key={name} className={cn("h-2 rounded-full", beats.indexOf(beat) >= index ? "bg-green" : "bg-line")} />
        ))}
      </div>
      {beat === "video" ? (
        <Card className="flex flex-col gap-3">
          <ClimateVideo title={title} scenes={scenesFor(mission.id, mission.learn.storyId, mission.category)} />
          <Button
            full
            onClick={() => {
              setError(null);
              setBeat("check");
            }}
          >
            {t("mission.continue")}
          </Button>
        </Card>
      ) : null}
      {beat === "check" && question ? (
        <Card className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t("lesson.question")}</h2>
          <p className="font-bold">{question.prompt}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                aria-pressed={choice === index}
                className={cn(
                  "rounded-2xl border-2 border-b-4 px-3 py-3 text-left font-bold",
                  choice === index ? "border-blue-dark bg-blue-pale" : "border-line bg-white",
                )}
                onClick={() => {
                  setChoice(index);
                  setCorrect(null);
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {correct === true ? <p className="font-bold text-green-deep">{t("lesson.right")} {question.explanation}</p> : null}
          {correct === false ? <p role="alert">{t("lesson.wrong")}</p> : null}
          <Button
            full
            disabled={choice === null}
            onClick={() => {
              if (choice === null || !question) return;
              const ok = choice === question.correctIndex;
              setCorrect(ok);
              if (ok) setBeat("task");
            }}
          >
            {t("lesson.check")}
          </Button>
        </Card>
      ) : null}
      {beat === "task" ? (
        <Card className="flex flex-col gap-3">
          <h2 className="font-display text-2xl">{t("lesson.task")}</h2>
          <p>{t(`missions.${mission.id}.do`)}</p>
          <label className="flex items-start gap-2 font-bold">
            <input type="checkbox" checked={willTry} onChange={(event) => setWillTry(event.target.checked)} />
            {t("lesson.willTry")}
          </label>
          {error ? <p role="alert">{error}</p> : null}
          <Button full disabled={!willTry} onClick={finish}>
            {t("lesson.finish")}
          </Button>
        </Card>
      ) : null}
        </>
      ) : null}
    </div>
  );
}
