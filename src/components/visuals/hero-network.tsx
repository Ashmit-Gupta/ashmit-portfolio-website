import Image from "next/image";

const CX = 320;
const CY = 320;
const HUB_R = 156;
const NODE_R = 212;
const PORTRAIT_INSET = 0.16;

type Node = {
  id: string;
  label: string;
  sub: string;
  deg: number;
  anchor: "start" | "middle" | "end";
};

const NODES: Node[] = [
  { id: "architecture", label: "ARCHITECTURE", sub: "system design", deg: 0, anchor: "middle" },
  { id: "ai-systems", label: "AI SYSTEMS", sub: "ML · RAG · inference", deg: 58, anchor: "start" },
  { id: "deployment", label: "DEPLOYMENT", sub: "cloud · Kubernetes", deg: 122, anchor: "start" },
  { id: "reliability", label: "RELIABILITY", sub: "scale · observability", deg: 180, anchor: "middle" },
  { id: "automation", label: "AUTOMATION", sub: "CI/CD · IaC", deg: 238, anchor: "end" },
  { id: "applications", label: "APPLICATIONS", sub: "mobile & full-stack", deg: 302, anchor: "end" },
];

function polar(deg: number, radius: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: Number((CX + radius * Math.cos(rad)).toFixed(1)),
    y: Number((CY + radius * Math.sin(rad)).toFixed(1)),
  };
}

function labelPoint(node: Node) {
  const extra =
    node.anchor === "middle" ? (node.deg === 0 ? 36 : 42) : node.label.length > 10 ? 42 : 36;
  return polar(node.deg, NODE_R + extra);
}

export function HeroNetwork() {
  const portraitRadius = 320 * (1 - PORTRAIT_INSET * 2);
  const frameRadius = portraitRadius + 12;

  const spokes = NODES.map((node) => ({
    id: node.id,
    from: polar(node.deg, HUB_R),
    to: polar(node.deg, NODE_R),
  }));

  const ring = NODES.map((node, index) => ({
    id: `${node.id}-${NODES[(index + 1) % NODES.length].id}`,
    from: polar(node.deg, NODE_R),
    to: polar(NODES[(index + 1) % NODES.length].deg, NODE_R),
  }));

  return (
    <figure className="relative w-full max-w-lg">
      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 640 640"
          className="absolute inset-0 z-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hero-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c9a36a" stopOpacity="0.38" />
              <stop offset="55%" stopColor="#c9a36a" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#c9a36a" stopOpacity="0" />
            </radialGradient>
            <filter id="hero-node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="hero-hub-breathe">
            <circle cx={CX} cy={CY} r="268" fill="url(#hero-hub-glow)" />
          </g>

          <g className="hero-orbit">
            <circle
              cx={CX}
              cy={CY}
              r={frameRadius}
              fill="none"
              stroke="#c9a36a"
              strokeOpacity="0.38"
              strokeWidth="1"
              strokeDasharray="4 9"
            />
          </g>

          <g stroke="#c9a36a" strokeLinecap="round">
            {ring.map((line, index) => (
              <line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                strokeOpacity="0.24"
                strokeWidth="0.9"
                className={index % 2 === 0 ? "hero-flow-line" : "hero-flow-line-slow"}
              />
            ))}
            {spokes.map((line, index) => (
              <line
                key={line.id}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                strokeOpacity="0.36"
                strokeWidth="1.1"
                className={index % 2 === 0 ? "hero-flow-line-out" : "hero-flow-line"}
              />
            ))}
          </g>

          {spokes.map((line, index) => (
            <circle
              key={`packet-${line.id}`}
              r="3.2"
              fill="#c9a36a"
              className="hero-packet"
              filter="url(#hero-node-glow)"
            >
              <animateMotion
                dur={`${2.4 + index * 0.35}s`}
                repeatCount="indefinite"
                begin={`${index * 0.4}s`}
                path={`M ${line.from.x} ${line.from.y} L ${line.to.x} ${line.to.y}`}
              />
            </circle>
          ))}

          {NODES.map((node) => {
            const point = polar(node.deg, NODE_R);
            const label = labelPoint(node);
            return (
              <g key={node.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill="#141416"
                  stroke="#c9a36a"
                  strokeWidth="1.4"
                  className="hero-node-pulse"
                  filter="url(#hero-node-glow)"
                />
                <circle cx={point.x} cy={point.y} r="2.2" fill="#f3eee4" />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={node.anchor}
                  fill="#f3eee4"
                  fontSize="13"
                  fontWeight="500"
                  fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                  letterSpacing="0.09em"
                >
                  {node.label}
                </text>
                <text
                  x={label.x}
                  y={label.y + 17}
                  textAnchor={node.anchor}
                  fill="#b6ada0"
                  fontSize="11.5"
                  fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                  letterSpacing="0.1em"
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>

        <div
          className="hero-portrait-ring absolute z-10 rounded-full bg-[linear-gradient(180deg,rgba(201,163,106,0.88),rgba(201,163,106,0.22))] p-px shadow-[0_0_52px_rgba(201,163,106,0.32)]"
          style={{ inset: `${PORTRAIT_INSET * 100}%` }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-surface ring-1 ring-foreground/15">
            <Image
              src="/images/ashmit-portrait.webp"
              alt="Ashmit Gupta, arms folded, looking slightly to the side"
              fill
              className="scale-[1.08] object-cover object-[50%_18%]"
              sizes="(max-width: 1024px) 280px, 360px"
              preload
            />
          </div>
        </div>
      </div>
    </figure>
  );
}
