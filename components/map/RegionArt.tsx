export function RegionArt({ id }: { id: string }) {
  const sky = skyFor(id);
  return (
    <svg viewBox="0 0 160 88" className="h-20 w-full" aria-hidden="true">
      <rect width="160" height="88" fill={sky} />
      {id === "water" ? <Water /> : null}
      {id === "waste" ? <Waste /> : null}
      {id === "nature" ? <Garden /> : null}
      {id === "mobility" ? <Energy /> : null}
      {id === "community" ? <Trail /> : null}
    </svg>
  );
}

function skyFor(id: string): string {
  if (id === "water") return "#D7F0FA";
  if (id === "waste") return "#F3ECFA";
  if (id === "mobility") return "#FFF4D4";
  if (id === "community") return "#FDE8E0";
  return "#E7F6D8";
}

function Water() {
  return (
    <>
      <ellipse cx="80" cy="70" rx="70" ry="16" fill="#4AA8D8" />
      <ellipse cx="80" cy="66" rx="48" ry="8" fill="#7EC4E8" />
      <path d="M28 58c8-16 18-16 18 0" fill="#6BBF3A" />
      <circle cx="122" cy="28" r="10" fill="#F5C542" />
    </>
  );
}

function Waste() {
  return (
    <>
      <rect x="28" y="40" width="28" height="28" rx="4" fill="#8B6BB8" />
      <rect x="66" y="32" width="24" height="36" rx="4" fill="#6BBF3A" />
      <rect x="100" y="46" width="32" height="22" rx="4" fill="#E07A4C" />
      <path d="M20 72h120" stroke="#C99612" strokeWidth="4" />
    </>
  );
}

function Garden() {
  return (
    <>
      <circle cx="46" cy="48" r="16" fill="#3F7A1E" />
      <circle cx="80" cy="40" r="20" fill="#6BBF3A" />
      <circle cx="112" cy="50" r="14" fill="#245C18" />
      <rect x="76" y="56" width="8" height="20" fill="#8A6420" />
      <circle cx="130" cy="22" r="8" fill="#F5C542" />
    </>
  );
}

function Energy() {
  return (
    <>
      <path d="M70 18l-16 28h14l-8 24 24-32H72z" fill="#F5C542" />
      <rect x="24" y="58" width="112" height="10" rx="3" fill="#C99612" />
      <circle cx="36" cy="40" r="8" fill="#E07A4C" />
    </>
  );
}

function Trail() {
  return (
    <>
      <path d="M10 70c30-20 50-8 70-8s40-16 70 4" fill="none" stroke="#E07A5F" strokeWidth="8" strokeLinecap="round" />
      <circle cx="40" cy="36" r="12" fill="#6BBF3A" />
      <rect x="108" y="34" width="22" height="28" rx="3" fill="#C99612" />
      <path d="M108 34l11-10 11 10" fill="#E07A4C" />
    </>
  );
}
