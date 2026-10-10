import { cn } from "@/lib/cn";

export function Pill({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "green" | "grey" | "pink" }) {
  const tones = {
    gold: "border-gold bg-gold-pale",
    green: "border-green bg-green-pale",
    grey: "border-line bg-bg-soft text-ink-soft",
    pink: "border-pink bg-[#ffe6f6]",
  };
  return <span className={cn("inline-flex items-center rounded-full border-2 px-2 font-display text-sm text-ink", tones[tone])}>{children}</span>;
}
