type IconProps = React.SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => <Svg {...p}><path d="M4 12h16M14 6l6 6-6 6" /></Svg>
export const ArrowLeft = (p: IconProps) => <Svg {...p}><path d="M20 12H4M10 6l-6 6 6 6" /></Svg>
export const ArrowDown = (p: IconProps) => <Svg {...p}><path d="M12 4v16M6 14l6 6 6-6" /></Svg>
export const ArrowUp = (p: IconProps) => <Svg {...p}><path d="M12 20V4M6 10l6-6 6 6" /></Svg>
export const ArrowUpRight = (p: IconProps) => <Svg {...p}><path d="M7 17L17 7M8 7h9v9" /></Svg>
export const Close = (p: IconProps) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>
export const ChevronLeft = (p: IconProps) => <Svg {...p}><path d="M15 5l-7 7 7 7" /></Svg>
export const ChevronRight = (p: IconProps) => <Svg {...p}><path d="M9 5l7 7-7 7" /></Svg>
export const Search = (p: IconProps) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>
export const Lock = (p: IconProps) => <Svg {...p}><rect x="5" y="11" width="14" height="10" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>
export const Play = (p: IconProps) => <Svg {...p}><path d="M8 5.5v13l10.5-6.5z" /></Svg>
