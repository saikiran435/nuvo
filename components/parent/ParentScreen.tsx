"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chiku } from "@/components/Chiku";
import { EvidenceThumb } from "@/components/EvidenceThumb";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { levelFromLifetime } from "@/lib/game";
import { useHasHydrated } from "@/lib/hydrate";
import { formatGc } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";

export function ParentScreen() {
  const hydrated = useHasHydrated();
  const onboarded = useNuvo((state) => state.onboarded);
  const child = useNuvo((state) => state.child);
  const submissions = useNuvo((state) => state.submissions);
  const approve = useNuvo((state) => state.approve);
  const redo = useNuvo((state) => state.redo);
  const [note, setNote] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !onboarded) router.replace("/welcome");
  }, [hydrated, onboarded, router]);

  if (hydrated && !onboarded) return null;
  const level = levelFromLifetime(child.gcLifetime);
  const pending = submissions.filter((item) => item.status === "pending");
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Chiku mood="idle" level={level.level} size={48} />
          <div>
            <h1 className="font-display text-3xl">{t("parent.title")}</h1>
            <p className="text-ink-soft">
              {child.nickname} · {t("parent.only")}
            </p>
          </div>
        </div>
        <ButtonLink href="/dev" variant="ghost">
          {t("parent.switch")}
        </ButtonLink>
      </header>
      <div className="grid gap-2 desktop:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-soft">{t("parent.level")}</p>
          <p className="font-display text-3xl">{level.level}</p>
          <p>{level.title}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-soft">{t("parent.streak")}</p>
          <p className="font-display text-3xl">{child.streak}</p>
          <p>{t("parent.days")}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-soft">{t("parent.credits")}</p>
          <p className="font-display text-3xl">{formatGc(child.gcBalance)}</p>
        </Card>
      </div>
      <h2 className="font-display text-2xl">{t("parent.pending")}</h2>
      {note ? <p role="status" className="font-display text-green-deep">{note}</p> : null}
      {pending.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 text-center">
          <Chiku mood="happy" level={level.level} size={72} />
          <p>{t("parent.empty")}</p>
          <Link href="/learn" className="font-display text-green-deep">
            {t("soon.back")}
          </Link>
        </Card>
      ) : null}
      {pending.map((item) => (
        <Card key={item.id} className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
          <div className="flex items-center gap-3">
            <EvidenceThumb evidenceKey={item.evidenceKey} />
            <div>
              <b className="font-display text-xl">{t(`missions.${item.missionId}.title`)}</b>
              <p className="text-ink-soft">{t("parent.device")}</p>
              {item.reflection ? <p>{item.reflection}</p> : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                approve(item.id);
                setNote(t("parent.approved"));
              }}
            >
              {t("parent.approve")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                redo(item.id, t("parent.redoNote"));
                setNote(t("parent.redoSent"));
              }}
            >
              {t("parent.redo")}
            </Button>
          </div>
        </Card>
      ))}
    </main>
  );
}
