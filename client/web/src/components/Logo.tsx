interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 48, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 21 C13 18, 17 18, 22 21 S31 24, 36 21 S41 19, 44 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M4 27 C9 24, 13 24, 18 27 S27 30, 32 27 S41 24, 44 26"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M6 33 C11 30, 15 30, 20 33 S29 36, 34 33 S41 31, 44 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  )
}
