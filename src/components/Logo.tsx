interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 48, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer film-reel ring */}
      <circle cx="32" cy="32" r="29" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1.5" opacity="0.08" />

      {/* Sprocket holes — film reel detail */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180
        const cx = 32 + 26.5 * Math.cos(rad)
        const cy = 32 + 26.5 * Math.sin(rad)
        return (
          <circle
            key={angle}
            cx={cx}
            cy={cy}
            r="2"
            fill="currentColor"
            opacity="0.2"
          />
        )
      })}

      {/* Heart — the core mark */}
      <path
        d="M32 46
           C28 42, 16 34, 16 26
           C16 21, 20 18, 24 18
           C27 18, 30 20.5, 32 24
           C34 20.5, 37 18, 40 18
           C44 18, 48 21, 48 26
           C48 34, 36 42, 32 46Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Film-strip cutout on heart — two small perforations */}
      <rect x="22" y="27" width="3" height="4" rx="0.8" fill="white" opacity="0.5" />
      <rect x="39" y="27" width="3" height="4" rx="0.8" fill="white" opacity="0.5" />

      {/* Subtle inner shine */}
      <path
        d="M28 25
           C29 23, 31 22, 32 24"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  )
}
