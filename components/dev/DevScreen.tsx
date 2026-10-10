"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chiku, type ChikuMood } from "@/components/Chiku";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { eventsToCsv } from "@/lib/analytics";
import { clearAllEvidence } from "@/lib/evidence";
import { t } from "@/lib/i18n";
import type { Role } from "@/lib/model";
import { useNuvo } from "@/lib/store";

const moods: ChikuMood[] = ["idle", "happy", "thinking", "celebrate", "curled", "sleepy"];

export function DevScreen() {
  const role = useNuvo((state) => state.role);
  const events = useNuvo((state) => state.events);
  const setRole = useNuvo((state) => state.setRole);
  const resetDemo = useNuvo((state) => state.resetDemo);
  const replayWelcome = useNuvo((state) => state.replayWelcome);
  const router = useRouter();
  const [tab, setTab] = useState("tools");
  const [confirm, setConfirm] = useState(false);

  function go(next: Role, href: string) {
    setRole(next);
    router.push(href);
  }

  function download() {
    const blob = new Blob([eventsToCsv(events)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nuvo-events.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-3xl">{t("dev.title")}</h1>
      <p className="text-ink-soft">{t("dev.body")}</p>
      <p>{t("dev.current", { role })}</p>
      <Tabs
        label={t("dev.title")}
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "tools", label: t("dev.tools") },
          { id: "chiku", label: t("dev.chiku") },
        ]}
      />
      {tab === "tools" ? (
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => go("child", "/learn")}>{t("dev.child")}</Button>
            <Button variant="blue" onClick={() => go("parent", "/parent")}>
              {t("dev.parent")}
            </Button>
            <Button variant="gold" onClick={() => go("teacher", "/teacher")}>
              {t("dev.teacher")}
            </Button>
          </div>
          <Button variant="ghost" onClick={() => setConfirm(true)}>
            {t("dev.reset")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              void clearAllEvidence().then(() => {
                replayWelcome();
                router.push("/welcome");
              });
            }}
          >
            {t("dev.replay")}
          </Button>
          <Button variant="ghost" onClick={download}>
            {t("dev.export")}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-ink-soft">{t("dev.moods")}</p>
          <div className="grid grid-cols-2 gap-2 desktop:grid-cols-3">
            {moods.map((mood) => (
              <Card key={mood} className="flex flex-col items-center gap-2">
                <Chiku mood={mood} level={4} size={64} />
                <p className="font-display">{mood}</p>
              </Card>
            ))}
          </div>
          <p className="text-ink-soft">{t("dev.sizes")}</p>
          <div className="flex flex-wrap items-end gap-4">
            <Chiku mood="idle" level={4} size={24} />
            <Chiku mood="idle" level={4} size={64} />
            <Chiku mood="idle" level={5} size={160} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Card className="flex flex-col items-center">
              <Chiku mood="idle" level={1} size={80} />
              <p>{t("dev.themeLow")}</p>
            </Card>
            <Card className="flex flex-col items-center">
              <Chiku mood="idle" level={4} size={80} />
              <p>{t("dev.themeMid")}</p>
            </Card>
            <Card className="flex flex-col items-center">
              <Chiku mood="idle" level={6} size={80} />
              <p>{t("dev.themeHigh")}</p>
            </Card>
          </div>
        </div>
      )}
      <Modal open={confirm} title={t("dev.resetTitle")} onClose={() => setConfirm(false)}>
        <p>{t("dev.resetBody")}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              void clearAllEvidence().then(() => {
                resetDemo();
                setConfirm(false);
                router.push("/learn");
              });
            }}
          >
            {t("dev.confirm")}
          </Button>
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            {t("dev.cancel")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
