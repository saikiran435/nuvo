import { cn } from "@/lib/cn";

export type ChikuMood = "idle" | "happy" | "curious" | "thinking" | "celebrate" | "curled" | "sleepy";

function scaleFor(level: number): { scale: string; dark: string } {
  if (level >= 5) return { scale: "#8FCBD4", dark: "#2E7EAB" };
  if (level >= 3) return { scale: "#A8DCC8", dark: "#3F7A1E" };
  return { scale: "#C5E6B0", dark: "#6A9A52" };
}

function hatFor(level: number): "sprout" | "bloom" | "sun" {
  if (level >= 5) return "sun";
  if (level >= 3) return "bloom";
  return "sprout";
}

export function Chiku({
  mood = "idle",
  level = 1,
  size = 64,
  label,
}: {
  mood?: ChikuMood;
  level?: number;
  size?: number;
  label?: string;
}) {
  const colors = scaleFor(level);
  const face = mood === "curled" ? null : mood === "celebrate" ? "happy" : mood;
  const hat = hatFor(level);
  const style = {
    "--chiku-scale": colors.scale,
    "--chiku-scale-dark": colors.dark,
  } as React.CSSProperties;
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 110 110"
        width={size}
        height={size}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn(mood === "celebrate" && "chiku-bounce")}
        style={style}
      >
        {mood === "curled" ? <use href="#chiku-curled" /> : <use href="#chiku-body" />}
        {mood !== "curled" ? <use href={`#chiku-hat-${hat}`} /> : null}
        {face ? <use href={`#chiku-face-${face}`} /> : null}
      </svg>
      {mood === "celebrate" ? <Confetti /> : null}
    </span>
  );
}

function Confetti() {
  const bits = [
    { left: "0%", top: "18%", color: "#FFC800" },
    { left: "78%", top: "8%", color: "#1CB0F6" },
    { left: "88%", top: "46%", color: "#CE82FF" },
    { left: "8%", top: "70%", color: "#FF86D0" },
    { left: "70%", top: "78%", color: "#58CC02" },
  ];
  return (
    <span className="confetti pointer-events-none absolute inset-0" aria-hidden="true">
      {bits.map((bit) => (
        <i
          key={`${bit.left}-${bit.top}`}
          className="absolute block h-1.5 w-1.5 rounded-sm"
          style={{ left: bit.left, top: bit.top, background: bit.color }}
        />
      ))}
    </span>
  );
}
