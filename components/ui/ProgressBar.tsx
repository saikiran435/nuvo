export function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const safeMax = Math.max(1, max);
  const width = Math.max(0, Math.min(100, (value / safeMax) * 100));
  return (
    <div
      className="h-3 overflow-hidden rounded-full border-2 border-line bg-bg-soft"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <span className="block h-full bg-green" style={{ width: `${width}%` }} />
    </div>
  );
}
