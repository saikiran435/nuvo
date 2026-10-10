"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chiku } from "@/components/Chiku";
import { Button } from "@/components/ui/Button";
import { avatars } from "@/data/avatars";
import { useHasHydrated } from "@/lib/hydrate";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { cn } from "@/lib/cn";

const namePattern = /^[\p{L}\s'-]{2,24}$/u;

export function WelcomeScreen() {
  const hydrated = useHasHydrated();
  const onboarded = useNuvo((state) => state.onboarded);
  const complete = useNuvo((state) => state.completeOnboarding);
  const router = useRouter();
  const [avatarId, setAvatarId] = useState<string>(avatars[0].id);
  const [consent, setConsent] = useState(true);
  const [showOnLeague, setShowOnLeague] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function start() {
    const nickname = nameRef.current?.value.trim() ?? "";
    if (!namePattern.test(nickname)) {
      setError(t("welcome.needName"));
      return;
    }
    if (!consent) {
      setError(t("welcome.needConsent"));
      return;
    }
    setError(null);
    // This mocks the UX of verifiable parental consent; it does not implement it.
    complete({ nickname, avatarId, showOnLeague, parentEmail: "grownup@example.com" });
    // Full load so a hydration mismatch cannot swallow the client-router click.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/learn");
  }

  useEffect(() => {
    formRef.current?.setAttribute("data-ready", "yes");
    if (hydrated && onboarded) router.replace("/learn");
  }, [hydrated, onboarded, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <Chiku mood="happy" level={1} size={96} label="Chiku" />
      <h1 className="font-display text-3xl">{t("welcome.title")}</h1>
      <p>{t("welcome.intro")}</p>
      <form
        ref={formRef}
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
      >
        <label className="flex flex-col gap-1 font-bold">
          {t("welcome.nickname")}
          <input
            ref={nameRef}
            name="nickname"
            className="rounded-xl border-2 border-line bg-white p-3 font-normal text-ink"
            maxLength={24}
            autoComplete="nickname"
            enterKeyHint="go"
            suppressHydrationWarning
          />
        </label>
        <p className="text-sm text-ink-soft">{t("welcome.nicknameHint")}</p>
        <div className="flex flex-wrap gap-2">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              aria-pressed={avatarId === avatar.id}
              aria-label={avatar.id}
              className={cn(
                "grid h-14 w-14 place-items-center rounded-full border-2 text-2xl",
                avatarId === avatar.id ? "border-green bg-green-pale" : "border-line bg-white",
              )}
              onClick={() => setAvatarId(avatar.id)}
            >
              {avatar.emoji}
            </button>
          ))}
        </div>
        <label className="flex items-start gap-2 font-bold">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} suppressHydrationWarning />
          {t("welcome.consent")}
        </label>
        <label className="flex items-start gap-2 font-bold">
          <input type="checkbox" checked={showOnLeague} onChange={(event) => setShowOnLeague(event.target.checked)} suppressHydrationWarning />
          {t("welcome.leagueToggle")}
        </label>
        <p className="text-sm text-ink-soft">{t("welcome.leagueOff")}</p>
        {error ? (
          <p role="alert" className="font-bold text-green-deep">
            {error}
          </p>
        ) : null}
        <Button type="button" full onClick={start}>
          {t("welcome.start")}
        </Button>
      </form>
    </main>
  );
}
