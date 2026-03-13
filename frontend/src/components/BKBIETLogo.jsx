/**
 * BKBIETLogo - A reliable SVG-based logo for the BKBIET Placement Portal.
 * Uses the college's blue color palette. No external image dependency.
 */
export default function BKBIETLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="#1a56c4" stroke="#fff" strokeWidth="2" />

      {/* Inner emblem - book base */}
      <rect x="22" y="55" width="56" height="6" rx="3" fill="#fff" opacity="0.9" />

      {/* Left page */}
      <path d="M26 32 Q50 28 50 55 L26 55 Z" fill="#fff" opacity="0.85" />

      {/* Right page */}
      <path d="M74 32 Q50 28 50 55 L74 55 Z" fill="#fff" opacity="0.65" />

      {/* Center spine */}
      <rect x="48" y="30" width="4" height="25" rx="2" fill="#1a56c4" />

      {/* Torch flame */}
      <ellipse cx="50" cy="24" rx="5" ry="8" fill="#FFB300" />
      <ellipse cx="50" cy="28" rx="3" ry="5" fill="#FF8F00" />

      {/* BK text at bottom */}
      <text
        x="50"
        y="75"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill="#fff"
        letterSpacing="1"
      >
        BKBIET
      </text>
    </svg>
  );
}
