// A stylised top-down padel court rendered as thin lines.
// Inherits color via `currentColor` so it can be tinted and faded.
export default function CourtBackdrop({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      {/* Glass-wall outline */}
      <rect x="8" y="8" width="184" height="384" rx="14" />
      {/* Inner court boundary */}
      <rect x="20" y="20" width="160" height="360" rx="6" opacity="0.7" />
      {/* Net across the middle */}
      <line x1="20" y1="200" x2="180" y2="200" strokeWidth="2" />
      <circle cx="14" cy="200" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="186" cy="200" r="2.5" fill="currentColor" stroke="none" />
      {/* Service lines */}
      <line x1="20" y1="120" x2="180" y2="120" opacity="0.7" />
      <line x1="20" y1="280" x2="180" y2="280" opacity="0.7" />
      {/* Centre service line */}
      <line x1="100" y1="120" x2="100" y2="280" opacity="0.7" />
    </svg>
  )
}
