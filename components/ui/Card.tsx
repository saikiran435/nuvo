import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-2xl border-2 border-line bg-white p-4", className)}>{children}</section>;
}
