"use client";

import { useEffect, useState } from "react";
import { evidenceUrl } from "@/lib/evidence";
import { t } from "@/lib/i18n";

export function EvidenceThumb({ evidenceKey }: { evidenceKey?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!evidenceKey) return;
    let active = true;
    let created = "";
    void evidenceUrl(evidenceKey).then((next) => {
      if (!active || !next) return;
      created = next;
      setUrl(next);
    });
    return () => {
      active = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [evidenceKey]);
  if (!url) {
    return <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-line bg-bg-soft text-sm">{t("parent.noPhoto")}</div>;
  }
  return (
    // Local blob from IndexedDB. It never has a remote URL for next/image to optimize.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={t("parent.photo")} className="h-16 w-16 rounded-2xl border-2 border-line object-cover" />
  );
}
