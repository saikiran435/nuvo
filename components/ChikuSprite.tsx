export function ChikuSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <g id="chiku-body">
          <ellipse cx="38" cy="104" rx="10" ry="6" fill="#F4C7B8" stroke="#2B2B2B" strokeWidth="2.4" />
          <ellipse cx="78" cy="104" rx="10" ry="6" fill="#F4C7B8" stroke="#2B2B2B" strokeWidth="2.4" />
          <path
            d="M58 30c18 0 34 16 36 40 2 28-12 46-36 46S18 98 20 70C22 46 40 30 58 30z"
            fill="var(--chiku-scale,#B7E3A8)"
            stroke="#2B2B2B"
            strokeWidth="3"
          />
          <ellipse cx="40" cy="78" rx="7" ry="4" fill="#F7D0C4" opacity="0.9" />
          <ellipse cx="78" cy="78" rx="7" ry="4" fill="#F7D0C4" opacity="0.9" />
          <path d="M28 72c-8 2-10 10-4 12" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M88 72c8 2 10 10 4 12" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g id="chiku-hat-sprout">
          <path d="M58 30c0-10 1-16 1-16" stroke="#3F7A1E" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="50" cy="18" rx="8" ry="4.5" fill="#7BC84A" stroke="#2B2B2B" strokeWidth="2" transform="rotate(-30 50 18)" />
          <ellipse cx="66" cy="16" rx="8" ry="4.5" fill="#A8D48A" stroke="#2B2B2B" strokeWidth="2" transform="rotate(28 66 16)" />
        </g>
        <g id="chiku-hat-bloom">
          <circle cx="58" cy="16" r="4" fill="#F5C542" stroke="#2B2B2B" strokeWidth="2" />
          <ellipse cx="58" cy="8" rx="4" ry="6" fill="#F7F4EA" stroke="#2B2B2B" strokeWidth="2" />
          <ellipse cx="66" cy="12" rx="4" ry="6" fill="#F7F4EA" stroke="#2B2B2B" strokeWidth="2" transform="rotate(50 66 12)" />
          <ellipse cx="50" cy="12" rx="4" ry="6" fill="#F7F4EA" stroke="#2B2B2B" strokeWidth="2" transform="rotate(-50 50 12)" />
          <ellipse cx="64" cy="22" rx="4" ry="6" fill="#F7F4EA" stroke="#2B2B2B" strokeWidth="2" transform="rotate(20 64 22)" />
          <ellipse cx="52" cy="22" rx="4" ry="6" fill="#F7F4EA" stroke="#2B2B2B" strokeWidth="2" transform="rotate(-20 52 22)" />
        </g>
        <g id="chiku-hat-sun">
          <circle cx="58" cy="18" r="7" fill="#F5C542" stroke="#2B2B2B" strokeWidth="2.2" />
          <circle cx="58" cy="18" r="3" fill="#C99612" />
          <path d="M58 6v4M58 26v4M46 18h-4M74 18h4M49 9l3 3M67 27l3 3M67 9l-3 3M49 27l-3 3" stroke="#E07A4C" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g id="chiku-face-idle">
          <circle cx="46" cy="64" r="3.2" fill="#2B2B2B" />
          <circle cx="70" cy="64" r="3.2" fill="#2B2B2B" />
          <path d="M50 80q8 8 16 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g id="chiku-face-happy">
          <path d="M40 64q6-8 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M64 64q6-8 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M46 78q12 14 24 0" fill="#E07A5F" stroke="#2B2B2B" strokeWidth="2.2" strokeLinejoin="round" />
        </g>
        <g id="chiku-face-curious">
          <circle cx="46" cy="64" r="3.6" fill="#2B2B2B" />
          <circle cx="72" cy="62" r="3.6" fill="#2B2B2B" />
          <path d="M64 54q8 2 12 6" fill="none" stroke="#2B2B2B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M50 82q8 6 14 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g id="chiku-face-thinking">
          <circle cx="48" cy="62" r="3.2" fill="#2B2B2B" />
          <circle cx="72" cy="62" r="3.2" fill="#2B2B2B" />
          <path d="M52 82h14" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g id="chiku-face-sleepy">
          <path d="M40 64q6 6 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M64 64q6 6 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M50 82q8 4 14 0" fill="none" stroke="#2B2B2B" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g id="chiku-curled">
          <ellipse cx="58" cy="70" rx="34" ry="32" fill="var(--chiku-scale,#B7E3A8)" stroke="#2B2B2B" strokeWidth="3" />
          <ellipse cx="46" cy="74" rx="6" ry="3.5" fill="#F7D0C4" />
          <ellipse cx="70" cy="74" rx="6" ry="3.5" fill="#F7D0C4" />
          <path d="M46 66q6 5 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M64 66q6 5 12 0" fill="none" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M52 82q8 5 14 0" fill="none" stroke="#2B2B2B" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M58 42c0-8 1-12 1-12" stroke="#3F7A1E" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="52" cy="32" rx="7" ry="4" fill="#7BC84A" stroke="#2B2B2B" strokeWidth="2" transform="rotate(-24 52 32)" />
        </g>
      </defs>
    </svg>
  );
}
