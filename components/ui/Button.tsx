import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "border-green-dark bg-green",
  blue: "border-blue-dark bg-blue",
  gold: "border-gold-dark bg-gold",
  ghost: "border-2 border-b-4 border-line bg-white",
} as const;

export function buttonClass(variant: keyof typeof variants = "primary", full = false, className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[13px] border-b-4 px-4 py-2.5 text-center font-display text-base text-ink",
    "active:translate-y-[2px] active:border-b-2",
    "disabled:translate-y-0 disabled:border-b-4 disabled:border-line disabled:bg-bg-soft disabled:text-ink-mute",
    variants[variant],
    full && "w-full",
    className,
  );
}

export function Button({
  variant = "primary",
  full = false,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; full?: boolean }) {
  return <button type={type} className={buttonClass(variant, full, className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  full = false,
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, full, className)}>
      {children}
    </Link>
  );
}
