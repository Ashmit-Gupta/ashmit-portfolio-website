import { cn } from "@/lib/utils/cn";

export function Logomark({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span className={cn("relative flex shrink-0 items-center justify-center", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={cn("h-full w-full text-accent", animated && "logomark-svg")}
      >
        {animated ? (
          <style>{`
            .logomark-orbit {
              transform-origin: 16px 16px;
              animation: logomark-spin 10s linear infinite;
            }
            .logomark-dot {
              transform-origin: center;
              transform-box: fill-box;
              animation: logomark-pulse 3.2s ease-in-out infinite;
            }
            .group:hover .logomark-orbit,
            .group:focus-visible .logomark-orbit {
              animation-duration: 2.4s;
            }
            @keyframes logomark-spin {
              to { transform: rotate(360deg); }
            }
            @keyframes logomark-pulse {
              0%, 100% { opacity: 0.65; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
            @media (prefers-reduced-motion: reduce) {
              .logomark-orbit, .logomark-dot { animation: none; }
            }
          `}</style>
        ) : null}
        {/* dashed orbit ring — a full circle, so its silhouette stays clean at every rotation frame; the dash phase and satellite dot carry the motion */}
        <g className={animated ? "logomark-orbit" : undefined}>
          <circle
            cx="16"
            cy="16"
            r="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="2.2 5.6"
          />
          <circle
            cx="16"
            cy="5"
            r="1.6"
            fill="currentColor"
            className={animated ? "logomark-dot" : undefined}
          />
        </g>
        {/* apex mark — fixed, never rotates */}
        <path
          d="M16 10 L11 23 M16 10 L21 23 M13.31 17 L18.69 17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
