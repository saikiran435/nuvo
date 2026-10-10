export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="status" className="rounded-2xl border-2 border-green bg-green-pale px-3 py-2 font-display text-ink">
      {message}
    </p>
  );
}
