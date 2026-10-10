"use client";

import { Compass, Flame, Gift, Home, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Chiku } from "@/components/Chiku";
import { avatarEmoji } from "@/data/avatars";
import { RightRail } from "@/components/shell/RightRail";
import { levelFromLifetime } from "@/lib/game";
import { useHasHydrated } from "@/lib/hydrate";
import { formatGc } from "@/lib/format";
import { t } from "@/lib/i18n";
import { useNuvo } from "@/lib/store";
import { cn } from "@/lib/cn";

const links = [
  { href: "/learn", key: "shell.homeNav", icon: Home },
  { href: "/explore", key: "shell.explore", icon: Compass },
  { href: "/rewards", key: "shell.rewards", icon: Gift },
  { href: "/me", key: "shell.profileNav", icon: UserRound },
];

function navHref(pathname: string): string {
  if (pathname.startsWith("/mission") || pathname.startsWith("/quizzes") || pathname.startsWith("/stories")) return "/learn";
  if (pathname.startsWith("/rewards") || pathname.startsWith("/shop")) return "/rewards";
  return pathname;
}

function ShellNav({ place }: { place: "side" | "bottom" }) {
  const pathname = usePathname();
  const current = navHref(pathname);
  const side = place === "side";
  return (
    <nav
      className={side ? "hidden border-r-2 border-line p-3 desktop:block" : "fixed inset-x-0 bottom-0 z-20 flex border-t-2 border-line bg-white desktop:hidden"}
      aria-label={t("shell.main")}
    >
      {links.map((link) => {
        const Icon = link.icon;
        const active = current === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              side
                ? "mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 font-display text-ink-soft"
                : "flex flex-1 flex-col items-center gap-0.5 px-1 py-2 font-display text-xs text-ink-soft",
              active && "bg-green-pale text-green-deep",
            )}
          >
            <Icon aria-hidden="true" size={18} />
            {t(link.key)}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const hydrated = useHasHydrated();
  const onboarded = useNuvo((state) => state.onboarded);
  const child = useNuvo((state) => state.child);
  const logSession = useNuvo((state) => state.logSession);
  const router = useRouter();
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (hydrated && !onboarded) router.replace("/welcome");
  }, [hydrated, onboarded, router]);

  useEffect(() => {
    if (hydrated && onboarded) logSession();
  }, [hydrated, onboarded, logSession]);

  const level = levelFromLifetime(child?.gcLifetime ?? 0);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col bg-bg desktop:my-4 desktop:min-h-[calc(100vh-2rem)] desktop:rounded-[18px] desktop:border-2 desktop:border-line">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b-2 border-line bg-white px-3 py-2">
        <Link href="/learn" className="flex items-center gap-2" aria-label={t("shell.home")}>
          <Chiku mood="idle" level={level.level} size={36} />
          <b className="font-display text-[22px]">{t("app.name")}</b>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-1 rounded-full border-2 border-line px-2 py-1 font-display text-orange-dark" title={t("shell.streak")}>
          <Flame aria-hidden="true" size={18} />
          <span>{child?.streak ?? 0}</span>
          <span className="sr-only">{t("shell.streak")}</span>
        </div>
        <div className="rounded-full border-2 border-gold bg-gold-pale px-2 py-1 font-display" title={t("shell.credits")}>
          <span aria-hidden="true">● </span>
          {formatGc(child?.gcBalance ?? 0)}
          <span className="sr-only">{t("shell.credits")}</span>
        </div>
        <div
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-green bg-green-pale font-display text-green-deep"
          aria-label={t("shell.levelLabel", { level: level.level, title: level.title })}
        >
          {level.level}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-line bg-blue-pale text-xl"
          aria-label={t("shell.profile")}
          aria-expanded={menu}
          onClick={() => setMenu((open) => !open)}
        >
          {avatarEmoji(child?.avatarId ?? "drop")}
        </button>
        {menu ? (
          <div className="absolute top-16 right-3 z-40 w-48 rounded-2xl border-2 border-line bg-white p-2">
            <Link href="/me" className="block rounded-xl px-2 py-2 font-display" onClick={() => setMenu(false)}>
              {t("shell.passport")}
            </Link>
            <Link href="/dev" className="block rounded-xl px-2 py-2 font-display" onClick={() => setMenu(false)}>
              {t("shell.switchRole")}
            </Link>
          </div>
        ) : null}
      </header>
      <div className="grid flex-1 desktop:grid-cols-[196px_minmax(0,1fr)_296px]">
        <Suspense fallback={<nav className="hidden desktop:block" aria-hidden="true" />}>
          <ShellNav place="side" />
        </Suspense>
        <main className="px-4 py-4 pb-24 desktop:pb-6">{children}</main>
        <Suspense fallback={<aside className="hidden desktop:block" aria-hidden="true" />}>
          <RightRail />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <ShellNav place="bottom" />
      </Suspense>
    </div>
  );
}
